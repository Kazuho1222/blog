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

    const id = post.id
    // 1. IDの形式を正規表現でバリデーション
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      throw new Error('Invalid ID format')
    }

    const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
    const url = new URL(
      `https://${serviceDomain}.microcms.io/api/v1/blogs/${id}`,
    )

    // 2. ドメインの厳格な検証
    if (
      !url.hostname.endsWith('.microcms.io') ||
      url.hostname !== `${serviceDomain}.microcms.io`
    ) {
      throw new Error('Invalid host origin')
    }

    const response = await fetch(url, {
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
