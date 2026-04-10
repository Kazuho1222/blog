'use server'

import { updateTag } from 'next/cache'
import type { FormDataType } from '@/src/types/form'
import type { PostType } from '../../types/post'

type EditBlogResponse =
  | { success: true; id: string }
  | { success: false; error: string }

export const editBlogAction = async (
  post: PostType,
  formData: FormDataType,
  imageUrl: string,
): Promise<EditBlogResponse> => {
  try {
    if (!process.env.MICROCMS_API_KEY) {
      return { success: false, error: 'APIキーが設定されていません' }
    }

    const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
    if (!serviceDomain || !/^[a-zA-Z0-9-]+$/.test(serviceDomain)) {
      throw new Error('Invalid service domain')
    }

    const validatedId = post.id
    if (!/^[a-zA-Z0-9_-]+$/.test(validatedId)) {
      throw new Error('Invalid ID format')
    }

    const baseUrl = `https://${serviceDomain}.microcms.io/api/v1/blogs/`
    const url = new URL(validatedId, baseUrl)

    // プレフィックス・チェック: 構築されたURLが期待されるブログエンドポイントで始まっているか確認
    if (!url.href.startsWith(baseUrl)) {
      throw new Error('Invalid URL construction')
    }

    const response = await fetch(url.href, {
      method: 'PATCH',
      headers: {
        'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        eyecatch: imageUrl,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `MicroCMS Error: ${errorText}`,
      }
    }

    const data: { id?: string } = await response.json()

    if (!data.id) {
      return {
        success: false,
        error: 'IDを取得できませんでした',
      }
    }

    // タグベースでキャッシュ再検証
    updateTag('posts')
    updateTag('slugs')
    updateTag('categories')

    return {
      success: true,
      id: data.id,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: '予期しないエラー',
    }
  }
}
