import { z } from "zod";

export const ForgotPasswordSchema = z.object({
    email: z.string().email({
        message: "Email must be a valid email."
    })
})

export const ResetPasswordSchema = z.object({
    password: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30),
    confirmPassword: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30)
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords do not match",
        path: ['confirmPassword']
      });
    }
  });

export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>
