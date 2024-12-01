import { z } from "zod";

export const formSchema = z.object({
  email: z.string().nonempty({ message: "email is required." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

export type TypeFormSchema = z.infer<typeof formSchema>;
