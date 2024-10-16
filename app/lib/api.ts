import { createClient } from 'microcms-js-sdk'

if (!process.env.MICROCMS_SERVICE_DOMAIN || !process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_SERVICE_DOMAINとMICROCMS_API_KEYは必須です。')
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
})

export async function getPostBySlug(slug: string) {
  try {
    const post = await client.get({
      endpoint: 'blogs',
      queries: { filters: `slug[equals]${slug}` },
    })
    return post.contents[0]
  } catch (error) {
    console.log('~~ getPostBuSlug ~~')
    console.log(error)
  }
}

export async function getAllSlugs(limit = 100) {
  try {
    const slugs = await client.get({
      customRequestInit: {
        next: { revalidate: 0 },
      },
      endpoint: 'blogs',
      queries: { fields: 'title,slug', orders: '-publishDate', limit: limit },
    })
    return slugs.contents
  } catch (error) {
    console.log('~~ getAllSlugs ~~')
    console.log(error)
  }
}

export async function getAllPosts(limit = 100) {
  try {
    const posts = await client.get({
      customRequestInit: {
        next: { revalidate: 0 },
      },
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

export async function getAllCategories(limit = 100) {
  try {
    const categories = await client.get({
      customRequestInit: {
        next: { revalidate: 0 },
      },
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

export async function getAllPostsByCategory(catID: string, limit = 100) {
  try {
    const posts = await client.get({
      customRequestInit: {
        next: { revalidate: 0 },
      },
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
