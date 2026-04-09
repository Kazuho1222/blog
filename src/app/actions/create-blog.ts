'use server'

import { revalidateTag } from 'next/cache'

type CreateBlogFormData = {
  title: string
  slug: string
  _content: string
  eyecatch: string
  categories: string[]
  publishDate: string
}

type CreateBlogRequest = {
  title: string
  slug: string
  _content: string
  eyecatch?: string
  categories: string[]
  publishDate: string
}

export type CreateBlogActionResult =
  | { success: true; id: string }
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

    const { _content: content, eyecatch, ...rest } = formData
    const newBody: CreateBlogRequest = {
      ...rest,
      _content: content,
    }

    // eyecatchが空でない場合のみ追加
    if (eyecatch && eyecatch.trim() !== '') {
      newBody.eyecatch = eyecatch
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
      const raw = await res.text()
      let detail = res.statusText || 'Unknown error'
      try {
        const parsed = JSON.parse(raw) as {
          message?: string
          errors?: { message?: string }[]
        }
        detail =
          parsed.message ||
          parsed.errors?.[0]?.message ||
          raw.slice(0, 400) ||
          detail
      } catch {
        if (raw) {
          detail = raw.slice(0, 400)
        }
      }
      // Log full detail for debugging
      console.error(`MicroCMS API error (${res.status}):`, detail)
      return {
        success: false,
        error: `MicroCMS Error (${res.status}): ブログの作成に失敗しました`,
      }
    }

    const data: { id: string } = await res.json()

    // タグベースでキャッシュ再検証
    revalidateTag('posts', 'max')
    revalidateTag('slugs', 'max')
    revalidateTag('categories', 'max')

    // シリアライズ可能な形式で返す（IDのみ、文字列に変換）
    const blogId = data?.id ? String(data.id) : null
    if (!blogId) {
      return {
        success: false,
        error: 'ブログの作成に成功しましたが、IDを取得できませんでした',
      }
    }
    return { success: true, id: blogId }
  } catch (error: unknown) {
    // エラーメッセージを短く制限し、特殊文字を除去
    let errorMessage = '予期しないエラーが発生しました'
    if (error instanceof Error) {
      errorMessage = error.message
        .replace(/\n/g, ' ')
        .replace(/\r/g, '')
        .substring(0, 200)
    }
    return {
      success: false,
      error: errorMessage,
    }
  }
}
