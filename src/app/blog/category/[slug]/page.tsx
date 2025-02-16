import Container from '@/src/components/container'
import PostHeader from '@/src/components/post-header'
import Posts from '@/src/components/posts'
import { getAllCategories, getAllPostsByCategory } from '@/src/lib/api'
import { openGraphMetadata, twitterMetadata } from '@/src/lib/base-metadata'
import { eyecatchLocal, siteMeta } from '@/src/lib/constants'
import { getImageBuffer } from '@/src/lib/get-image-buffer'
import type { CategoryType, PostType } from '@/src/types/types'
import { getPlaiceholder } from 'plaiceholder'

const { siteTitle, siteUrl } = siteMeta

interface CategoryProps {
	params: Promise<{
		slug: string
	}>
}

export default async function Category({ params }: CategoryProps) {
	const catSlug = (await params).slug
	const allCats: CategoryType[] | undefined = await getAllCategories()
	const cat = allCats?.find(({ slug }: { slug: string }) => slug === catSlug)
	const posts: PostType[] | undefined = cat
		? await getAllPostsByCategory(cat.id)
		: undefined

	if (!cat) {
		return <div>カテゴリが見つかりません。</div>
	}

	if (!posts) {
		return <div>このカテゴリには投稿がありません。</div>
	}

	if (posts) {
		for (const post of posts) {
			if (!post.eyecatch) {
				post.eyecatch = { ...eyecatchLocal }
			}
			const imageBuffer = await getImageBuffer(post.eyecatch.url)
			const { base64 } = await getPlaiceholder(imageBuffer)
			post.eyecatch.blurDataURL = base64
		}

		return (
			<Container large={false}>
				<PostHeader title={cat.name} subtitle="Blog Category" publish={''} />
				<Posts posts={posts} />
			</Container>
		)
	}

	// export const dynamicParams = false
	// export async function generateStaticParams() {
	//   const allCats = await getAllCategories()

	//   if (!allCats) {
	//     return [];
	//   }

	//   return allCats.map(({ slug }: { slug: string }) => {
	//     return { slug: slug }
	//   })
	// }
}

// メタデータ
export async function generateMetadata({ params }: CategoryProps) {
	const catSlug = (await params).slug
	const allcats = await getAllCategories()
	const cat = allcats?.find(({ slug }: { slug: string }) => slug === catSlug)
	if (!cat) {
		return null // or throw an error, depending on the desired behavior
	}
	const pageTitle = cat.name
	const pageDesc = `${pageTitle}に関する記事`
	const ogpTitle = `${pageTitle} | ${siteTitle}`
	const ogpUrl = new URL(`/blog/category/${catSlug}`, siteUrl).toString()

	const metadata = {
		title: pageTitle,
		description: pageDesc,

		openGraph: {
			...openGraphMetadata,
			title: ogpTitle,
			description: pageDesc,
			url: ogpUrl,
		},
		twitter: {
			...twitterMetadata,
			title: ogpTitle,
			description: pageDesc,
		},
	}

	return metadata
}
