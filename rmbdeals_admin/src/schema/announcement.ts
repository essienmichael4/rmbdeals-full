import { z } from "zod";

export const AddAnnouncementSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be a proper title."
    }).max(30).optional(),
    subject: z.string().min(2, {
        message: "This must be a proper subject."
    })
})

export const AddMarqueAnnouncementSchema = z.object({
    announcement: z.string().min(2, {
        message: "This must be a proper subject."
    })
})

export const EditMarqueAnnouncementSchema = z.object({
    announcement: z.string().min(2, {
        message: "This must be a proper subject."
    }).optional(),
})

export const EditAnnouncementSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be a proper title."
    }).max(30).optional(),
    subject: z.string().min(2, {
        message: "This must be a proper subject."
    })
})

export type AddMarqueAnnouncementSchemaType = z.infer<typeof AddMarqueAnnouncementSchema>
export type EditMarqueAnnouncementSchemaType = z.infer<typeof EditMarqueAnnouncementSchema>
export type AddAnnouncementSchemaType = z.infer<typeof AddAnnouncementSchema>
export type EditAnnouncementSchemaType = z.infer<typeof EditAnnouncementSchema>

