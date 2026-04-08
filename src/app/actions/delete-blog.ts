'use server'

import z from 'zod'

const DeleteSchema = z.object({
  id: z.string().min(1, 'IDが指定されていません'),
})

export async function deleteBlogAction(id: string) {
  try {
    const parsed = DeleteSchema.parse({ id })
    const apiKey = process.env.MICROCMS_API_KEY
    const endpoint = `https://kazuho-blog.microcms.io/api/v1/blogs/${parsed.id}`

    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'X-MICROCMS-API-KEY': apiKey as string,
      },
    })

    if (!res.ok) {
      return {
        success: false,
        error: '削除に失敗しました',
      }
    }

    return {
      success: true,
    }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message,
      }
    }

    return {
      success: false,
      error: 'サーバーエラーが発生しました',
    }
  }
}
