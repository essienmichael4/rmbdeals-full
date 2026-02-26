import { z } from "zod";

const optionalString = (schema: z.ZodString) =>
  z.preprocess(
    (val) => (val === null ? "" : val), // turn null into ""
    schema.or(z.literal("")).optional()
);

export const UserUpdateSchema = z.object({
    name: z.string().min(2, {
        message: "Firstname must be a valid firstname"
    }),
    email: z.string().email({
        message: "Email must be a valid email."
    }),
    phone: optionalString(
        z.string().min(10, {
            message: "Must be a valid phone number.",
        }).max(14, {
            message: "Must be a valid phone number.",
        })
    ),
})

export const UserPhoneSchema = z.object({
    phone: z.string().min(2, {
        message: "Must be a valid phone number"
    })
})

export const UserPasswordUpdateSchema = z.object({
    currentPassword: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30).optional(),
    newPassword: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30).optional(),
    confirmPassword: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30).optional(),
}).superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ['confirmPassword']
      });
    }
  });

export type UserUpdateSchemaType = z.infer<typeof UserUpdateSchema>
export type UserPhoneSchemaType = z.infer<typeof UserPhoneSchema>
export type UserPasswordUpdateSchemaType = z.infer<typeof UserPasswordUpdateSchema>
