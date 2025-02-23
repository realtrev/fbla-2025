import { z } from "zod";

export const basicInfo = z.object({
  email: z.string({
      required_error: "Email is required"
    })
    .email("Please enter a valid email"),
  firstName: z.string({
      required_error: "First name is required"
    })
    .transform(value => value.replace(/\s+/g, ''))
    .pipe(z.string().min(3)),
  lastName: z.string({
      required_error: "Last name is required"
    })
    .transform(value => value.replace(/\s+/g, ''))
    .pipe(z.string().min(3)),
});

export const password = z.object({
  email: z.string({
      required_error: "Email is required"
    })
    .email("Please enter a valid email"),
  firstName: z.string()
    .transform(value => value.replace(/\s+/g, ''))
    .pipe(z.string({
      required_error: "First name is required"
    })),
  lastName: z.string()
    .transform(value => value.replace(/\s+/g, ''))
    .pipe(z.string({
      required_error: "Last name is required"
    })),
  password: z.string()
    .min(8,{
      message: "Must be at least 8 characters"
    })
    .max(100, {
      message: "Must be at most 100 characters"
    }),
  passwordConfirm: z.string()
})
.refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords do not match",
  path: ["passwordConfirm"],
})

export type BasicInfoForm = typeof basicInfo;
export type PasswordForm = typeof password;