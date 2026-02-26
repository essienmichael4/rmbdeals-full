import { z } from "zod";

export const RegisterAdminSchema = z.object({
  name: z.string().min(2, {
      message: "Firstname must be a valid firstname"
  }),
  email: z.string().email({
      message: "Email must be a valid email."
  }),
})

export type RegisterAdminSchemaType = z.infer<typeof RegisterAdminSchema>
