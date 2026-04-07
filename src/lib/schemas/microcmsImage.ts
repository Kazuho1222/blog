import { z } from 'zod'

export const MicroCMSImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
})

export type MicroCMSImage = z.infer<typeof MicroCMSImageSchema>
