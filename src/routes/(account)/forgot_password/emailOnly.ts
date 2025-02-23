import { z } from "zod";

export const emailOnly = z.object({
  email: z.string({
      required_error: "Email is required"
    })
    .email("Please enter a valid email"),
});

export type EmailOnlyForm = typeof emailOnly;