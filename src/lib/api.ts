import { createClient, type MicroCMSListResponse } from 'microcms-js-sdk'
import type { CategoryType } from '../types/category'
import type { PostType } from '../types/post'

if (!process.env.MICROCMS_SERVICE_DOMAIN || !process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_SERVICE_DOMAINとMICROCMS_API_KEYは必須です。')
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
})

// 一覧用
type PostSummary = Pick<PostType, 'title' | 'slug' | 'eyecatch' | 'publishDate'>

// slug用
type PostSlug = Pick<PostType, 'title' | 'slug'>

// カテゴリ一覧用
type PostCard = Pick<PostType, 'title' | 'slug' | 'eyecatch'>

export async function getPostBySlug(slug: string): Promise<PostType | null> {
  try {
    const post = await client.get<MicroCMSListResponse<PostType>>({
      endpoint: 'blogs',
      queries: { filters: `slug[equals]${slug}` },
    })
    if (!post.contents.length) {
      return null
    }
    return post.contents[0]
  } catch (error: unknown) {
    console.error('Error fetching post:', error)
    throw error
  }
}

export async function getAllSlugs(limit = 100): Promise<PostSlug[]> {
  try {
    const slugs = await client.get<MicroCMSListResponse<PostType>>({
      endpoint: 'blogs',
      queries: { fields: 'title,slug', orders: '-publishDate', limit: limit },
    })
    return slugs.contents
  } catch (error: unknown) {
    console.error('Error fetching AllSlugs:', error)
    throw error
  }
}

export async function getAllPosts(limit = 100): Promise<PostSummary[]> {
  try {
    const posts = await client.get<MicroCMSListResponse<PostType>>({
      endpoint: 'blogs',
      queries: {
        fields: 'title,slug,eyecatch,publishDate',
        orders: '-publishDate',
        limit: limit,
      },
    })
    return posts.contents
  } catch (error: unknown) {
    console.error('Error fetching AllPosts:', error)
    throw error
  }
}

export async function getAllCategories(limit = 100): Promise<CategoryType[]> {
  try {
    const categories = await client.get<MicroCMSListResponse<CategoryType>>({
      endpoint: 'categories',
      queries: {
        fields: 'name,id,slug',
        limit: limit,
      },
    })
    return categories.contents
  } catch (error: unknown) {
    console.error('Error fetching AllCategories:', error)
    throw error
  }
}

export async function getAllPostsByCategory(
  catID: string,
  limit = 100,
): Promise<PostCard[]> {
  try {
    const posts = await client.get<MicroCMSListResponse<PostType>>({
      endpoint: 'blogs',
      queries: {
        filters: `categories[contains]${catID}`,
        fields: 'title,slug,eyecatch',
        orders: '-publishDate',
        limit: limit,
      },
    })
    return posts.contents
  } catch (error: unknown) {
    console.error('Error fetching AllPostsbyCategory:', error)
    throw error
  }
}

export async function searchPosts(
  keyword: string,
  limit = 10,
  offset = 0,
): Promise<MicroCMSListResponse<PostType>> {
  if (!keyword) {
    return {
      totalCount: 0,
      offset: 0,
      limit,
      contents: [],
    }
  }

  try {
    const res = await client.get<MicroCMSListResponse<PostType>>({
      endpoint: 'blogs',
      queries: {
        q: keyword,
        limit,
        offset,
        fields: 'title,slug,eyecatch,_content',
        orders: '-publishDate',
      },
    })

    return res
  } catch (error: unknown) {
    console.error('Error searching posts:', error)
    throw error
  }
}
