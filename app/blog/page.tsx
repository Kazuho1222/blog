import { getPlaiceholder } from 'plaiceholder'
import Container from '../components/container'
import Hero from '../components/hero'
import Meta from '../components/meta'
import Posts from '../components/posts'
import { getAllPosts } from '../lib/api'
import { eyecatchLocal } from '../lib/constants'
import { getImageBuffer } from '../lib/getImageBuffer'
import { PostType } from '@/types/types'

export default async function Blog() {
  const posts: PostType[] = await getAllPosts();

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
      <Meta pageTitle='ブログ' pageDesc='ブログの記事一覧' pageImg={undefined} pageImgW={undefined} pageImgH={undefined} />
      <Hero
        title='Blog'
        subtitle='Recent Posts'
        imageOn={false} />
      <Posts posts={posts} />
    </Container>
  )
}