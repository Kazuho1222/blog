import z from 'zod'

export const UploadResponseSchema = z.object({
  url: z.string().optional(),
  id: z.string().optional(),
})

export type UploadResponse = z.infer<typeof UploadResponseSchema>
