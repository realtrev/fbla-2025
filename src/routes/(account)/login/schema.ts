import { z } from "zod";

export const schema = z.object({
  email: z.string({
    required_error: "Name is required"
  }).email("Please enter a valid email"),
  password: z.string({
    required_error: "Password is required"
  }).min(8, {
      message: "Must be at least 8 characters"
    }).max(50)
});

export type FormSchema = typeof schema;