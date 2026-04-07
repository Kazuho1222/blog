'use server'

import type { FormDataType } from '@/src/types/form'
import type { PostType } from '../../types/post'

export const editBlogAction = async (
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
