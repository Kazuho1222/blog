import EditBlogForm from '@/src/components/edit-blog-form'
import type { JSX } from 'react'
import { getAllCategories, getPostBySlug } from '../../../lib/api'

export default async function EditBlogPage(props: {
	params: Promise<{ id: string }>
}): Promise<JSX.Element> {
	const params = await props.params
	const post = await getPostBySlug(params.id)
	const categories = await getAllCategories()

	if (!post) {
		return <div>ブログ記事が見つかりません。</div>
	}

	if (!categories) {
		return <div>カテゴリが見つかりません。</div>
	}

	return <EditBlogForm post={post} categories={categories} />
}

export const revalidate = 0
