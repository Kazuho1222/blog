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

    const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
    if (!serviceDomain || !/^[a-zA-Z0-9-]+$/.test(serviceDomain)) {
      throw new Error('Invalid service domain')
    }

    const validatedId = parsed.id
    if (!/^[a-zA-Z0-9_-]+$/.test(validatedId)) {
      throw new Error('Invalid ID format')
    }

    const baseUrl = `https://${serviceDomain}.microcms.io/api/v1/blogs/`
    const url = new URL(validatedId, baseUrl)

    // プレフィックス・チェック: 構築されたURLが期待されるブログエンドポイントで始まっているか確認
    if (!url.href.startsWith(baseUrl)) {
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
