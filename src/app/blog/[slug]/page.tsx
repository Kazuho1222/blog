import BlogDeleteButton from '@/src/components/blog-delete-button'
import Container from '@/src/components/container'
import ConvertBody from '@/src/components/convert-body'
import Pagination from '@/src/components/pagination'
import PostBody from '@/src/components/post-body'
import PostCategories from '@/src/components/post-categories'
import PostHeader from '@/src/components/post-header'
import {
  TwoColumn,
  TwoColumnMain,
  TwoColumnSidebar,
} from '@/src/components/two-column'
import { Button } from '@/src/components/ui/button'
import { getAllSlugs, getPostBySlug } from '@/src/lib/api'
import { openGraphMetadata, twitterMetadata } from '@/src/lib/base-metadata'
import { eyecatchLocal, siteMeta } from '@/src/lib/constants'
import extractText from '@/src/lib/extract-text'
import { getImageBuffer } from '@/src/lib/get-image-buffer'
import { prevNextPost } from '@/src/lib/prev-next-post'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPlaiceholder } from 'plaiceholder'
const { siteTitle, siteUrl } = siteMeta

export default async function Post(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const slug = params.slug
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }
  const { id, title, publishDate: publish, _content, categories } = post
  const eyecatch = post.eyecatch ?? eyecatchLocal
  if (!post.eyecatch) {
    post.eyecatch = { ...eyecatchLocal }
  }
  const imageBuffer = await getImageBuffer(eyecatch.url)
  const { base64 } = await getPlaiceholder(imageBuffer)
  post.eyecatch.blurDataURL = base64
  const allSlugs = await getAllSlugs()
  if (!allSlugs) notFound()
  const [prevPost, nextPost] = prevNextPost(allSlugs, slug)

  return (
    <Container large={false}>
      <article>
        <div className="flex items-center justify-between">
          <PostHeader title={title} subtitle="Blog Article" publish={publish} />
          <div className="flex justify-end space-x-4">
            <Link href={`/edit-blog/${post.slug}`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <BlogDeleteButton blogId={id} />
          </div>
        </div>

        <figure>
          <Image
            key={eyecatch.url}
            src={eyecatch.url}
            alt=""
            // layout="responsive"
            width={eyecatch.width}
            height={eyecatch.height}
            sizes="(min-width:1152px)1152px,100vw"
            priority
            placeholder="blur"
            blurDataURL={post.eyecatch.blurDataURL}
          />
        </figure>

        <TwoColumn>
          <TwoColumnMain>
            <PostBody>
              <ConvertBody contentHTML={_content} />
            </PostBody>
          </TwoColumnMain>
          <TwoColumnSidebar>
            <PostCategories categories={categories} />
          </TwoColumnSidebar>
        </TwoColumn>
        <Pagination
          prevText={prevPost.title}
          prevUrl={`/blog/${prevPost.slug}`}
          nextText={nextPost.title}
          nextUrl={`/blog/${nextPost.slug}`}
        />
      </article>
    </Container>
  )
}

export const dynamicParams = false
export async function generateStaticParams() {
  const allSlugs = await getAllSlugs()

  if (!allSlugs || allSlugs.length === 0) {
    return []
  }
  return allSlugs.map(({ slug }: { slug: string }) => {
    return { slug: slug }
  })
}

export const revalidate = 0

// メタデータ
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const slug = params.slug
  const post = await getPostBySlug(slug)
  if (!post) {
    notFound()
  }
  const { title: pageTitle, _content } = post

  const pageDesc = extractText(_content)
  const eyecatch = post.eyecatch ?? eyecatchLocal

  const ogpTitle = `${pageTitle} | ${siteTitle}`
  const ogpUrl = new URL(`/blog/${slug}`, siteUrl).toString()

  const metadata = {
    title: pageTitle,
    description: pageDesc,
    openGraph: {
      ...openGraphMetadata,
      title: ogpTitle,
      description: pageDesc,
      url: ogpUrl,
      images: [
        {
          url: eyecatch.url,
          width: eyecatch.width,
          height: eyecatch.height,
        },
      ],
    },
    twitter: {
      ...twitterMetadata,
      title: ogpTitle,
      description: pageDesc,
      images: [eyecatch.url],
    },
  }
  return metadata
}
