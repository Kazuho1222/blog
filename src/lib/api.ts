import type { CategoryType } from '../types/category'
import type { PostType } from '../types/post'

if (!process.env.MICROCMS_SERVICE_DOMAIN || !process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_SERVICE_DOMAINとMICROCMS_API_KEYは必須です。')
}

const API_KEY = process.env.MICROCMS_API_KEY as string
const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN

// サービスドメインのバリデーションを1箇所で実施
if (!SERVICE_DOMAIN || !/^[a-zA-Z0-9-]+$/.test(SERVICE_DOMAIN)) {
  throw new Error('Invalid MICROCMS_SERVICE_DOMAIN')
}

// 信頼できるベースURLをエクスポート
export const BASE_URL = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/`

async function fetcher<T>(
  path: 'blogs' | 'categories',
  params?: Record<string, string>,
  options?: { tags?: string[] },
) {
  const url = new URL(path, BASE_URL)

  // ホワイトリスト・チェック: 構築されたURLが期待されるベースURLで始まっているか確認
  if (!url.href.startsWith(BASE_URL)) {
    throw new Error('Invalid URL construction')
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  // URLオブジェクトを直接渡すことで安全性を担保
  const res = await fetch(url, {
    headers: {
      'X-MICROCMS-API-KEY': API_KEY,
    },
    next: { tags: options?.tags ?? ['posts'] },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json() as Promise<T>
}

// 共通のレスポンス型
type MicroCMSResponse<T> = {
  contents: T[]
  totalCount: number
  offset: number
  limit: number
}

// 全件取得用の共通関数
async function fetchAll<T>(
  path: 'blogs' | 'categories',
  params: Record<string, string> = {},
  options?: { tags?: string[] },
): Promise<T[]> {
  const limit = 100
  let offset = 0
  let allContents: T[] = []

  while (true) {
    const data = await fetcher<MicroCMSResponse<T>>(
      path,
      {
        ...params,
        limit: String(limit),
        offset: String(offset),
      },
      options,
    )

    allContents = [...allContents, ...data.contents]
    offset += limit

    if (offset >= data.totalCount) {
      break
    }
  }

  return allContents
}

// 一覧用
type PostSummary = Pick<PostType, 'title' | 'slug' | 'eyecatch' | 'publishDate'>

// slug用
type PostSlug = Pick<PostType, 'title' | 'slug'>

import type { PostCardProps } from '../components/post-card'
import type { SearchResponse } from '../types/searchresponce'

export async function getPostBySlug(slug: string): Promise<PostType | null> {
  try {
    const data = await fetcher<{ contents: PostType[] }>('blogs', {
      filters: `slug[equals]${slug}`,
    })

    if (!data.contents.length) return null
    return data.contents[0]
  } catch (error) {
    console.error('Error fetching post:', error)
    throw error
  }
}

export async function getAllSlugs(limit?: number): Promise<PostSlug[]> {
  try {
    const params: Record<string, string> = {
      fields: 'title,slug',
      orders: '-publishDate',
    }
    if (limit !== undefined) {
      const data = await fetcher<MicroCMSResponse<PostSlug>>(
        'blogs',
        {
          ...params,
          limit: String(limit),
        },
        { tags: ['slugs'] },
      )
      return data.contents
    }
    return await fetchAll<PostSlug>('blogs', params, { tags: ['slugs'] })
  } catch (error) {
    console.error('Error fetching AllSlugs:', error)
    throw error
  }
}

export async function getAllPosts(limit?: number): Promise<PostSummary[]> {
  try {
    const params: Record<string, string> = {
      fields: 'title,slug,eyecatch,publishDate',
      orders: '-publishDate,-createdAt',
    }
    if (limit !== undefined) {
      const data = await fetcher<MicroCMSResponse<PostSummary>>('blogs', {
        ...params,
        limit: String(limit),
      })
      return data.contents
    }
    return await fetchAll<PostSummary>('blogs', params)
  } catch (error) {
    console.error('Error fetching AllPosts:', error)
    throw error
  }
}

export async function getAllCategories(
  limit?: number,
): Promise<CategoryType[]> {
  try {
    const params: Record<string, string> = {
      fields: 'name,id,slug',
    }
    if (limit !== undefined) {
      const data = await fetcher<MicroCMSResponse<CategoryType>>(
        'categories',
        {
          ...params,
          limit: String(limit),
        },
        { tags: ['categories'] },
      )
      return data.contents
    }
    return await fetchAll<CategoryType>('categories', params, {
      tags: ['categories'],
    })
  } catch (error) {
    console.error('Error fetching AllCategories:', error)
    throw error
  }
}

export async function getAllPostsByCategory(
  catID: string,
  limit?: number,
): Promise<PostCardProps[]> {
  try {
    const params: Record<string, string> = {
      filters: `categories[contains]${catID}`,
      fields: 'title,slug,eyecatch',
      orders: '-publishDate,-createdAt',
    }
    if (limit !== undefined) {
      const data = await fetcher<MicroCMSResponse<PostCardProps>>('blogs', {
        ...params,
        limit: String(limit),
      })
      return data.contents
    }
    return await fetchAll<PostCardProps>('blogs', params)
  } catch (error) {
    console.error('Error fetching AllPostsbyCategory:', error)
    throw error
  }
}

export async function searchPosts(keyword: string, limit = 10, offset = 0) {
  if (!keyword) {
    return {
      totalCount: 0,
      offset: 0,
      limit,
      contents: [],
    }
  }

  try {
    const data = await fetcher<SearchResponse>('blogs', {
      q: keyword,
      limit: String(limit),
      offset: String(offset),
      fields: 'id,title,slug,eyecatch,_content,categories',
      orders: '-publishDate,-createdAt',
    })

    return data
  } catch (error) {
    console.error('Error searching posts:', error)
    throw error
  }
}
