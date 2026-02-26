import { z } from "zod";

export const RegisterUserCheckoutSchema = z.object({
    name: z.string().min(2, {
        message: "Firstname must be a valid firstname"
    }),
    email: z.string().email({
        message: "Email must be a valid email."
    }),
    password: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30).optional().or(z.literal('')),
    whatsapp: z.string().min(9, {
        message: "Whatsapp number must be a valid phone number."
    }),
    momoName: z.string().min(2, {
        message: "Name must be a valid name."
    }),
    notes: z.string().optional()
})

export type RegisterUserCheckoutSchemaType = z.infer<typeof RegisterUserCheckoutSchema>
