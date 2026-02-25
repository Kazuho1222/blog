import type { CategoryType, PostType } from '@/src/types/types'
import { createClient, MicroCMSListResponse } from 'microcms-js-sdk'

if (!process.env.MICROCMS_SERVICE_DOMAIN || !process.env.MICROCMS_API_KEY) {
	throw new Error('MICROCMS_SERVICE_DOMAINとMICROCMS_API_KEYは必須です。')
}

export const client = createClient({
	serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
	apiKey: process.env.MICROCMS_API_KEY,
})

export async function getPostBySlug(slug: string): Promise<PostType | null> {
	try {
		const post = await client.get({
			endpoint: 'blogs',
			queries: { filters: `slug[equals]${slug}` },
		})
		if (!post.contents.length) {
			return null
		}
		return post.contents[0]
	} catch (error) {
		console.error('Error fetching post:', error)
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

export async function getAllSlugs(limit = 100): Promise<PostType[]> {
	try {
		const slugs = await client.get({
			endpoint: 'blogs',
			queries: { fields: 'title,slug', orders: '-publishDate', limit: limit },
		})
		if (!slugs) {
			throw new Error('AllSlugs not found')
		}
		return slugs.contents
	} catch (error) {
		console.error('Error fetching AllSlugs:', error)
		throw error
	}
}

export async function getAllPosts(limit = 100): Promise<PostType[]> {
	try {
		const posts = await client.get({
			endpoint: 'blogs',
			queries: {
				fields: 'title,slug,eyecatch,publishedAt',
				orders: '-publishDate',
				limit: limit,
			},
		})
		if (!posts) {
			throw new Error('AllPosts not found')
		}
		return posts.contents
	} catch (error) {
		console.error('Error fetching AllPosts:', error)
		throw error
	}
}

export async function getAllCategories(limit = 100): Promise<CategoryType[]> {
	try {
		const categories = await client.get({
			endpoint: 'categories',
			queries: {
				fields: 'name,id,slug',
				limit: limit,
			},
		})
		if (!categories) {
			throw new Error('AllCategories not found')
		}
		return categories.contents
	} catch (error) {
		console.error('Error fetching AllCategories:', error)
		throw error
	}
}

export async function getAllPostsByCategory(
	catID: string,
	limit = 100,
): Promise<PostType[]> {
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
		if (!posts) {
			throw new Error('AllPostsByCategory not found')
		}
		return posts.contents
	} catch (error) {
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
	} catch (error) {
		console.error('Error searching posts:', error)
		throw error
	}
}
