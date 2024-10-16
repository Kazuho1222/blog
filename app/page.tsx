import { getPlaiceholder } from "plaiceholder"
import Container from "./components/container"
import Hero from "./components/hero"
import Meta from "./components/meta"
import Pagination from "./components/pagination"
import Posts from "./components/posts"
import { getAllPosts } from "./lib/api"
import { eyecatchLocal } from "./lib/constants"
import { getImageBuffer } from "./lib/getImageBuffer"

export default async function Home() {
  const posts = await getAllPosts(4)

  for (const post of posts) {
    if (!post.eyecatch) {
      post.eyecatch = { ...eyecatchLocal }
    }
    const imageBuffer = await getImageBuffer(post.eyecatch.url)
    const { base64 } = await getPlaiceholder(imageBuffer)
    post.eyecatch.blurDataURL = base64
  }

  return (
    <>
      <main>
        <Container large={false}>
          <Meta pageTitle={""} pageDesc={""} />
          <Hero
            title="CUBE"
            subtitle="アウトプットしていくサイト"
            imageOn
          />

          <Posts posts={posts} />
          <Pagination nextUrl="/blog" nextText="More Posts" />
        </Container>
      </main>
    </>
  )
}
