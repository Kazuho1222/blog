'use server'

import { revalidateTag } from 'next/cache'
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

    const response = await fetch(
      `https://kazuho-blog.microcms.io/api/v1/blogs/${post.id}`,
      {
        method: 'PATCH',
        headers: {
          'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          eyecatch: imageUrl,
        }),
      },
    )

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
    revalidateTag('posts', 'max')
    revalidateTag('slugs', 'max')
    revalidateTag('categories', 'max')

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
