import Container from "@/app/components/container";
import ConvertBody from "@/app/components/convert-body";
import PostBody from "@/app/components/post-body";
import PostCategories from "@/app/components/post-categories";
import PostHeader from "@/app/components/post-header";
import { TwoColumn, TwoColumnMain, TwoColumnSidebar } from "@/app/components/two-column";
import { getAllSlugs, getPostBySlug } from "@/app/lib/api";
import { eyecatchLocal, siteMeta } from "@/app/lib/constants";
import extractText from "@/app/lib/extract-text";
import { getImageBuffer } from "@/app/lib/getImageBuffer";
import Image from "next/legacy/image";
import { getPlaiceholder } from "plaiceholder";
const { siteTitle, siteUrl } = siteMeta

export default async function Post({ params }: { params: { slug: any } }) {
  const slug = params.slug
  const post = await getPostBySlug(slug)
  const { title, publishData: publish, content, categories } = post
  const description = extractText(content)
  const eyecatch = post.eyecatch ?? eyecatchLocal
  const imageBuffer = await getImageBuffer(eyecatch.url)
  const { base64 } = await getPlaiceholder(imageBuffer)
  eyecatch.blurDataURL = base64

  return (
    <Container large={false}>
      <article>
        <PostHeader title={title} subtitle='Blog Article' publish={publish} />

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

      </article>
    </Container>
  )
}

export const dynamicParams = false
export async function generateStaticParams() {
  const allSlugs = await getAllSlugs()

  return allSlugs.map(({ slug }: { slug: string }) => {
    return { slug: slug }
  })
}
