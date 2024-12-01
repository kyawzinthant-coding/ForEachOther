"use server";

import { actionClient } from "@/lib/safe-action";
import { formSchema } from "@/validation/Login";
import { InputParseError } from "@/entities/errors/common";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc } from "firebase/firestore";

export const RegisterAccount = actionClient
  .schema(formSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      // Parse and validate input
      const parseResult = formSchema.safeParse({ email, password });

      if (!parseResult.success) {
        throw new InputParseError("Invalid input", {
          cause: parseResult.error,
        });
      }

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        parseResult.data.email,
        parseResult.data.password
      );

      const user = userCredential.user;

      // Make sure the user is authenticated
      if (!user) {
        throw new Error("User authentication failed.");
      }

      console.log("user", user.uid);

      // Add user data to Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
      });

      // Ensure 'signupRequests' operation is done only for unauthenticated users
      const signupRequestDocRef = await addDoc(
        collection(db, "signupRequests"),
        { email: user.email }
      );

      // Optionally delete the signup request
      await deleteDoc(signupRequestDocRef);

      // Return success response
      return {
        data: {
          uid: user.uid,
        },
        status: "success",
        error: null,
        message: "Account created successfully.",
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Log error for debugging
      console.error("Error in RegisterAccount:", error);

      // Return standardized error response
      return {
        data: null,
        status: "failed",
        error: {
          message: error.message || "An unknown error occurred.",
          code: error.code || "UNKNOWN_ERROR",
        },
      };
    }
  });
