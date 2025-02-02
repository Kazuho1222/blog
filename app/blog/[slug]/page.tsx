import BlogDeleteButton from "@/app/components/blog-delete-button";
import Container from "@/app/components/container";
import ConvertBody from "@/app/components/convert-body";
import Pagination from "@/app/components/pagination";
import PostBody from "@/app/components/post-body";
import PostCategories from "@/app/components/post-categories";
import PostHeader from "@/app/components/post-header";
import { TwoColumn, TwoColumnMain, TwoColumnSidebar } from "@/app/components/two-column";
import { getAllSlugs, getPostBySlug } from "@/app/lib/api";
import { openGraphMetadata, twitterMetadata } from "@/app/lib/baseMetadata";
import { eyecatchLocal, siteMeta } from "@/app/lib/constants";
import extractText from "@/app/lib/extract-text";
import { getImageBuffer } from "@/app/lib/getImageBuffer";
import { prevNextPost } from "@/app/lib/prev-next-post";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getPlaiceholder } from "plaiceholder";
const { siteTitle, siteUrl } = siteMeta

export default async function Post(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug
  const post = await getPostBySlug(slug)

  if (!post) {
    return { notFound: true }
  } const { id, title, publishDate: publish, _content, categories } = post
  const eyecatch = post.eyecatch ?? eyecatchLocal
  if (!eyecatch) {
    return { notFound: true }
  }
  const imageBuffer = await getImageBuffer(eyecatch.url)
  const { base64 } = await getPlaiceholder(imageBuffer)
  if (!post.eyecatch) {
    return { notFound: true }
  }
  post.eyecatch.blurDataURL = base64
  const allSlugs = await getAllSlugs();
  if (!allSlugs) return { notFound: true };
  const [prevPost, nextPost] = prevNextPost(allSlugs, slug);

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
  } return allSlugs.map(({ slug }: { slug: string }) => {
    return { slug: slug }
  })
}

export const revalidate = 0

// メタデータ
export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug
  const post = await getPostBySlug(slug);
  if (!post) {
    return { notFound: true };
  }
  const { title: pageTitle, publishDate: publish, _content, categories } = post;

  const pageDesc = extractText(_content);
  const eyecatch = post.eyecatch ?? eyecatchLocal;

  const ogpTitle = `${pageTitle} | ${siteTitle}`;
  const ogpUrl = new URL(`/blog/${slug}`, siteUrl).toString();

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
  };
  return metadata;
}
