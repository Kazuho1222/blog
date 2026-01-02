'use server'

import { revalidatePath } from 'next/cache'

export type CreateBlogFormData = {
  title: string
  slug: string
  _content: string
  eyecatch: string
  categories: string[]
  publishDate: string
}

export type CreateBlogActionResult =
  | { success: true; data: unknown }
  | { success: false; error: string }

export async function createBlogAction(
  formData: CreateBlogFormData,
): Promise<CreateBlogActionResult> {
  try {
    const apiKey = process.env.MICROCMS_API_KEY
    if (!apiKey) {
      return {
        success: false,
        error: 'APIキーが設定されていません',
      }
    }

    const endpoint = 'https://kazuho-blog.microcms.io/api/v1/blogs'

    const { _content: content, ...rest } = formData
    const newBody = {
      ...rest,
      _content: content,
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MICROCMS-API-KEY': apiKey,
      },
      body: JSON.stringify(newBody),
    })

    if (!res.ok) {
      const errorText = await res.text()
      return {
        success: false,
        error: `MicroCMS Error: ${res.statusText} - ${errorText}`,
      }
    }

    const data = await res.json()

    // キャッシュを再検証
    revalidatePath('/')
    revalidatePath('/blog')

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}

export async function uploadImageAction(
  file: File,
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  try {
    const apiKey = process.env.MICROCMS_API_KEY
    if (!apiKey) {
      return {
        success: false,
        error: 'APIキーが設定されていません',
      }
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(
      'https://kazuho-blog.microcms-management.io/api/v1/media',
      {
        method: 'POST',
        headers: {
          'X-MICROCMS-API-KEY': apiKey,
        },
        body: formData,
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `画像のアップロードに失敗しました: ${response.statusText} - ${errorText}`,
      }
    }

    const data = await response.json()
    return { success: true, url: data.url }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}

