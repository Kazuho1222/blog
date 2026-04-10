'use server'

import { updateTag } from 'next/cache'
import z from 'zod'

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
    // 1. IDの形式を正規表現でバリデーション
    if (!/^[a-zA-Z0-9_-]+$/.test(validatedId)) {
      throw new Error('Invalid ID format')
    }

    const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
    const url = new URL(
      `https://${serviceDomain}.microcms.io/api/v1/blogs/${validatedId}`,
    )

    // 2. ドメインの厳格な検証
    if (
      !url.hostname.endsWith('.microcms.io') ||
      url.hostname !== `${serviceDomain}.microcms.io`
    ) {
      throw new Error('Invalid host origin')
    }

    const res = await fetch(url, {
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
