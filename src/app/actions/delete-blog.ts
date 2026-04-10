'use server'

import { updateTag } from 'next/cache'
import z from 'zod'
import { BASE_URL } from '@/src/lib/api'

const DeleteSchema = z.object({
  id: z.string().min(1, 'IDが指定されていません'),
})

export async function deleteBlogAction(id: string) {
  try {
    const parsed = DeleteSchema.parse({ id })
    const apiKey = process.env.MICROCMS_API_KEY

    if (!apiKey) {
      return {
        success: false,
        error: 'APIキーが設定されていません',
      }
    }

    const validatedId = parsed.id
    if (!/^[a-zA-Z0-9_-]+$/.test(validatedId)) {
      throw new Error('Invalid ID format')
    }

    // BASE_URLをベースにエンドポイントを構築
    const blogsUrl = new URL('blogs/', BASE_URL)
    const url = new URL(validatedId, blogsUrl)

    // セキュリティ対策: 期待されるベースURLで始まっているか確認
    if (!url.href.startsWith(blogsUrl.href)) {
      throw new Error('Invalid URL construction')
    }

    const res = await fetch(url.href, {
      method: 'DELETE',
      headers: {
        'X-MICROCMS-API-KEY': apiKey,
      },
    })

    if (!res.ok) {
      return {
        success: false,
        error: '削除に失敗しました',
      }
    }

    // タグベースでキャッシュ再検証
    updateTag('posts')
    updateTag('slugs')
    updateTag('categories')

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
