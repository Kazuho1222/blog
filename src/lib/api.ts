import type { CategoryType } from '../types/category'
import type { PostType } from '../types/post'

if (!process.env.MICROCMS_SERVICE_DOMAIN || !process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_SERVICE_DOMAINとMICROCMS_API_KEYは必須です。')
}

const API_KEY = process.env.MICROCMS_API_KEY as string

export const BASE_URL = `https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1`

async function fetcher<T>(
  path: 'blogs' | 'categories',
  params?: Record<string, string>,
  options?: { tags?: string[] },
) {
  const url = new URL(`${BASE_URL}/${path}`)
  const expectedBase = new URL(BASE_URL)

  // セキュリティ対策: オリジンとパスのプレフィックスを厳格にチェック
  if (
    url.origin !== expectedBase.origin ||
    !url.pathname.startsWith(expectedBase.pathname)
  ) {
    throw new Error('Invalid URL')
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

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

export async function getAllSlugs(limit = 100): Promise<PostSlug[]> {
  try {
    const data = await fetcher<{ contents: PostSlug[] }>(
      'blogs',
      {
        fields: 'title,slug',
        orders: '-publishDate',
        limit: String(limit),
      },
      { tags: ['slugs'] },
    )

    return data.contents
  } catch (error) {
    console.error('Error fetching AllSlugs:', error)
    throw error
  }
}

export async function getAllPosts(limit = 100): Promise<PostSummary[]> {
  try {
    const data = await fetcher<{ contents: PostSummary[] }>('blogs', {
      fields: 'title,slug,eyecatch,publishDate',
      orders: '-publishDate,-createdAt',
      limit: String(limit),
    })

    return data.contents
  } catch (error) {
    console.error('Error fetching AllPosts:', error)
    throw error
  }
}

export async function getAllCategories(limit = 100): Promise<CategoryType[]> {
  try {
    const data = await fetcher<{ contents: CategoryType[] }>(
      'categories',
      {
        fields: 'name,id,slug',
        limit: String(limit),
      },
      { tags: ['categories'] },
    )

    return data.contents
  } catch (error) {
    console.error('Error fetching AllCategories:', error)
    throw error
  }
}

export async function getAllPostsByCategory(
  catID: string,
  limit = 100,
): Promise<PostCardProps[]> {
  try {
    const data = await fetcher<{ contents: PostCardProps[] }>('blogs', {
      filters: `categories[contains]${catID}`,
      fields: 'title,slug,eyecatch',
      orders: '-publishDate,-createdAt',
      limit: String(limit),
    })

    return data.contents
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
