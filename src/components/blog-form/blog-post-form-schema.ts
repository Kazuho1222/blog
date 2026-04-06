import { z } from 'zod'

export const SLUG_PATTERN = /^[a-zA-Z0-9-]+$/

export const MAX_BLOG_IMAGE_BYTES = 5 * 1024 * 1024

export const blogPostFormSchema = z.object({
  title: z.string().min(1, {
    message: '必須項目です',
  }),
  slug: z
    .string()
    .min(1, {
      message: '必須項目です',
    })
    .regex(SLUG_PATTERN, '半角英数字で入力してください'),
  publishDate: z.string().min(1, {
    message: '必須項目です',
  }),
  _content: z.string().min(1, {
    message: '必須項目です',
  }),
  eyecatch: z.string(),
  categories: z.array(z.string()).min(1, {
    message: 'カテゴリを1つ以上選択してください',
  }),
})

export type BlogPostFormValues = z.infer<typeof blogPostFormSchema>
