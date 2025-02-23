import { z } from "zod";

export const editSchema = z.object({
  title: z.string({
    required_error: "Name is required"
  }).min(8).max(50),
  description: z.string().max(200),
  type: z.enum(["volunteer", "full-time", "part-time", "internship"], {
    required_error: "Type is required",
    message: "Required"
  })
});

export type FormSchema = typeof editSchema;