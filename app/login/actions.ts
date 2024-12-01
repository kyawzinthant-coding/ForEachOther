"use server";

import { actionClient } from "@/lib/safe-action";
import { formSchema } from "@/validation/Login";
import { InputParseError } from "@/entities/errors/common";
import { signInWithEmailAndPassword } from "firebase/auth";

import { setSessionTokenCookie } from "@/lib/session";
import { auth } from "@/lib/firebase";
const SESSION_REFRESH_PERIOD = 1000 * 60 * 60 * 24 * 15;
const SESSION_EXTEND_TIME = SESSION_REFRESH_PERIOD * 2;

export const LoginAction = actionClient
  .schema(formSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const { data, error: inputParserError } = formSchema.safeParse({
        email,
        password,
      });

      if (inputParserError) {
        throw new InputParseError("Invalid Error", {
          cause: inputParserError,
        });
      }

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

        const user = userCredential.user;
        const token = await user.getIdToken();

        setSessionTokenCookie(
          token,
          new Date(Date.now() + SESSION_EXTEND_TIME)
        );

        return {
          data: {
            token,
            uid: user.uid,
            name: user.email,
          },
          status: "success",
          error: null,
          message: "Login Successful",
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        return {
          status: 401,
          mesage: error.message,
        };
      }
    } catch (error) {
      return {
        data: null,
        stauts: "failed",
        error: error,
      };
    }
  });
