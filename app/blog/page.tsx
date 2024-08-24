import Container from '../components/container'
import Hero from '../components/hero'
import Meta from '../components/meta'
import Posts from '../components/posts'
import { getAllPosts } from '../lib/api'

interface Post {
  title: string,
  slug: string,
  eyecatch: string
}

export default async function Blog() {
  const posts: Post[] = await getAllPosts();

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