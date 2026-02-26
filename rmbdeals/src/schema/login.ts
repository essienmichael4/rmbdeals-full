import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email must be a valid email."
    }),
    password: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30)
})

export type LoginSchemaType = z.infer<typeof LoginSchema>
