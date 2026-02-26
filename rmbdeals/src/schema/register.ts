import { z } from "zod";

export const RegisterSchema = z.object({
    name: z.string().min(2, {
        message: "Firstname must be a valid firstname"
    }),
    email: z.string().email({
        message: "Email must be a valid email."
    }),
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
        message: "The passwords did not match",
        path: ['confirmPassword']
      });
    }
  });

export const RegisterAdminSchema = z.object({
  name: z.string().min(2, {
      message: "Firstname must be a valid firstname"
  }),
  email: z.string().email({
      message: "Email must be a valid email."
  }),
})

export type RegisterSchemaType = z.infer<typeof RegisterSchema>
export type RegisterAdminSchemaType = z.infer<typeof RegisterAdminSchema>
