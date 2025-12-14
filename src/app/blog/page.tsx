import type { PostType } from '@/src/types/types'
import { getPlaiceholder } from 'plaiceholder'
import Container from '../../components/container'
import Hero from '../../components/hero'
import Posts from '../../components/posts'
import { getAllPosts } from '../../lib/api'
import { openGraphMetadata, twitterMetadata } from '../../lib/base-metadata'
import { eyecatchLocal, siteMeta } from '../../lib/constants'
import { getImageBuffer } from '../../lib/get-image-buffer'

const { siteTitle, siteUrl } = siteMeta

export default async function Blog() {
  let posts: PostType[] = []
  let fetchError = false

  try {
    // データ取得に成功した場合
    posts = (await getAllPosts()) || []
  } catch (error) {
    console.error('Error fetching posts:', error)
    fetchError = true
  }

  // 各ポストに対して画像処理
  for (const post of posts) {
    try {
      if (!post.eyecatch) {
        post.eyecatch = { ...eyecatchLocal }
      }
      const imageBuffer = await getImageBuffer(post.eyecatch.url)
      const { base64 } = await getPlaiceholder(imageBuffer)
      post.eyecatch.blurDataURL = base64
    } catch (error) {
      console.error('Error processing eyecatch for post:', post.slug, error)
      if (post.eyecatch) {
        post.eyecatch.blurDataURL = '' // 画像処理に失敗した場合の代替値
      }
    }
  }

  return (
    <Container large={false}>
      {/* <Meta pageTitle='ブログ' pageDesc='ブログの記事一覧' /> */}
      <Hero title="Blog" subtitle="Recent Posts" imageOn={false} />
      {/* データが存在しない場合、エラーメッセージや空の状態を表示 */}
      {fetchError ? (
        <p>投稿の取得に失敗しました。後でもう一度お試しください。</p>
      ) : posts.length > 0 ? (
        <Posts posts={posts} />
      ) : (
        <p>まだ投稿がありません。</p>
      )}
    </Container>
  )
}

// メタデータ
const pageTitle = 'ブログ'
const pageDesc = 'ブログの記事一覧'
const ogpTitle = `${pageTitle} | ${siteTitle}`
const ogpUrl = new URL('/blog', siteUrl).toString()

export const metadata = {
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
