'use server'

import type { FormDataType } from '@/src/types/form'
import type { PostType } from '../../types/post'

export const uploadImage = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(
    'https://kazuho-blog.microcms-management.io/api/v1/media',
    {
      method: 'POST',
      headers: {
        'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY || '',
      },
      body: formData,
    },
  )

  if (!response.ok) {
    throw new Error('画像のアップロードに失敗しました')
  }

  const data = await response.json()
  return data.url
}

export const editBlog = async (
  post: PostType,
  formData: FormDataType,
  imageUrl: string,
) => {
  const response = await fetch(
    `https://kazuho-blog.microcms.io/api/v1/blogs/${post.id}`,
    {
      method: 'PATCH',
      headers: {
        'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        eyecatch: imageUrl,
      }),
    },
  )
  if (!response.ok) {
    throw new Error('ブログの投稿に失敗しました')
  }

  const data = await response.json()
  return data
}
