import Container from '@/app/components/container'
import PostHeader from '@/app/components/post-header'
import Posts from '@/app/components/posts'
import { getAllCategories, getAllPostsByCategory } from '@/app/lib/api'
import { eyecatchLocal } from '@/app/lib/constants'
import { getImageBuffer } from '@/app/lib/getImageBuffer'
import { getPlaiceholder } from 'plaiceholder'
import { siteMeta } from '@/app/lib/constants'
import { openGraphMetadata, twitterMetadata } from '@/app/lib/baseMetadata'

const { siteTitle, siteUrl } = siteMeta

interface CategoryProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Category({ params }: CategoryProps) {
  const catSlug = (await params).slug
  const allCats = await getAllCategories()
  const cat = allCats.find(({ slug }: { slug: string }) => slug === catSlug)
  const posts = await getAllPostsByCategory(cat.id)

  if (!cat) {
    return <div>カテゴリが見つかりません。</div>
  }

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

export const dynamicParams = false
export async function generateStaticParams() {
  const allCats = await getAllCategories()

  return allCats.map(({ slug }: { slug: string }) => {
    return { slug: slug }
  })
}

// メタデータ
export async function generateMetadata({ params }: CategoryProps) {
  const catSlug = (await params).slug

  const allcats = await getAllCategories()
  const cat = allcats.find(({ slug }: { slug: string }) => slug === catSlug)
  const pageTitle = cat.name
  const pageDesc = `${pageTitle}に関する記事`
  const ogpTitle = `${pageTitle} | ${siteTitle}`
  const ogpUrl = new URL('/blog/category/${catSlug}', siteUrl).toString()

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