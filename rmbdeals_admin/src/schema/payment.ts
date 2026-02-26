import { z } from "zod";

export const AddPaymentAccountSchema = z.object({
    number: z.string().min(2, {
        message: "Title must be a proper title."
    }).max(30).optional(),
    name: z.string().min(2, {
        message: "This must be a proper subject."
    })
})

export const EditPaymentAccountSchema = z.object({
    number: z.string().min(2, {
        message: "Title must be a proper title."
    }).max(30).optional(),
    name: z.string().min(2, {
        message: "This must be a proper subject."
    })
})

export type AddPaymentAccountSchemaType = z.infer<typeof AddPaymentAccountSchema>
export type EditPaymentAccountSchemaType = z.infer<typeof EditPaymentAccountSchema>

