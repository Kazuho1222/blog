import BlogDeleteButton from "@/app/components/blog-delete-button";
import Container from "@/app/components/container";
import ConvertBody from "@/app/components/convert-body";
import Pagination from "@/app/components/pagination";
import PostBody from "@/app/components/post-body";
import PostCategories from "@/app/components/post-categories";
import PostHeader from "@/app/components/post-header";
import { TwoColumn, TwoColumnMain, TwoColumnSidebar } from "@/app/components/two-column";
import { getAllSlugs, getPostBySlug } from "@/app/lib/api";
import { eyecatchLocal, siteMeta } from "@/app/lib/constants";
import extractText from "@/app/lib/extract-text";
import { getImageBuffer } from "@/app/lib/getImageBuffer";
import { prevNextPost } from "@/app/lib/prev-next-post";
import { Button } from "@/components/ui/button";
import Image from "next/legacy/image";
import Link from "next/link";
import { getPlaiceholder } from "plaiceholder";
const { siteTitle, siteUrl } = siteMeta

export default async function Post(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug
  const post = await getPostBySlug(slug)

  if (!post) {
    return { notFound: true }
  } else {
    const { id, title, publishData: publish, content, categories } = post
    const eyecatch = post.eyecatch ?? eyecatchLocal
    const imageBuffer = await getImageBuffer(eyecatch.url)
    const { base64 } = await getPlaiceholder(imageBuffer)
    eyecatch.blurDataURL = base64

    const allSlugs = await getAllSlugs()
    const [prevPost, nextPost] = prevNextPost(allSlugs, slug)

    return (
      <Container large={false}>
        <article>
          <div className="flex justify-between items-center">
            <PostHeader title={title} subtitle='Blog Article' publish={publish} />
            <div className="flex justify-end space-x-4">
              <Link href={`/edit-blog/${post.slug}`} className="ml-40"><Button>Edit</Button></Link>
              <BlogDeleteButton blogId={id} />
            </div>
          </div>

          <figure>
            <Image
              key={eyecatch.url}
              src={eyecatch.url}
              alt=""
              layout="responsive"
              width={eyecatch.width}
              height={eyecatch.height}
              sizes="(min-width:1152px)1152px,100vw"
              priority
              placeholder="blur"
              blurDataURL={eyecatch.blurDataURL}
            />
          </figure>

          <TwoColumn>
            <TwoColumnMain>
              <PostBody>
                <ConvertBody contentHTML={content} />
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
}

export const dynamicParams = false
export async function generateStaticParams() {
  const allSlugs = await getAllSlugs()

  if (!allSlugs) {
    return { notFound: true }
  } else {
    return allSlugs.map(({ slug }: { slug: string }) => {
      return { slug: slug }
    })
  }
}

export const revalidate = 0
