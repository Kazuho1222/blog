import { z } from 'zod'

export const UploadResponseSchema = z
  .object({
    url: z.string().optional(),
    id: z.string().optional(),
  })
  .refine((data) => data.url || data.id, {
    message: "Either 'url' or 'id' must be provided",
  })

export type UploadResponse = z.infer<typeof UploadResponseSchema>
