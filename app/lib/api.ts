import type { CategoryType, PostType } from '@/types/types'
import { createClient } from 'microcms-js-sdk'

if (!process.env.MICROCMS_SERVICE_DOMAIN || !process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_SERVICE_DOMAINとMICROCMS_API_KEYは必須です。')
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
})

export async function getPostBySlug(slug: string): Promise<PostType> {
  try {
    const post = await client.get({
      endpoint: 'blogs',
      queries: { filters: `slug[equals]${slug}` },
    })
    if (!post.contents.length) {
      throw new Error('Post not found')
    }
    return post.contents[0]
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error
  }
}

export async function migrateContentToNewField(): Promise<void> {
  try {
    const posts = await client.get({ endpoint: 'blogs' })

    for (const post of posts.contents) {
      const contentHTML = post.content

      await client.update({
        endpoint: 'blogs',
        contentId: post.id,
        content: { _content: contentHTML },
      })

      console.log(`Post ${post.id} has been migrated to _content field.`)
    }
  } catch (error) {
    console.error('Error migration content:', error)
  }
}

export async function getAllSlugs(limit = 100): Promise<PostType[] | undefined> {
  try {
    const slugs = await client.get({
      endpoint: 'blogs',
      queries: { fields: 'title,slug', orders: '-publishDate', limit: limit },
    })
    return slugs.contents
  } catch (error) {
    console.log('~~ getAllSlugs ~~')
    console.log(error)
  }
}

export async function getAllPosts(limit = 100): Promise<PostType[] | undefined> {
  try {
    const posts = await client.get({
      endpoint: 'blogs',
      queries: {
        fields: 'title,slug,eyecatch,publishedAt',
        orders: '-publishDate',
        limit: limit,
      },
    })
    return posts.contents
  } catch (error) {
    console.log('~~ getAllPosts ~~')
    console.log(error)
  }
}

export async function getAllCategories(limit = 100): Promise<CategoryType[] | undefined> {
  try {
    const categories = await client.get({
      endpoint: 'categories',
      queries: {
        fields: 'name,id,slug',
        limit: limit,
      },
    })
    return categories.contents
  } catch (error) {
    console.log('~~ getAllCategories ~~')
    console.log(error)
  }
}

export async function getAllPostsByCategory(catID: string, limit = 100): Promise<PostType[] | undefined> {
  try {
    const posts = await client.get({
      endpoint: 'blogs',
      queries: {
        filters: `categories[contains]${catID}`,
        fields: 'title,slug,eyecatch',
        orders: '-publishDate',
        limit: limit,
      },
    })
    return posts.contents
  } catch (error) {
    console.log('~~ getAllPostsByCategory ~~')
    console.log(error)
  }
}
