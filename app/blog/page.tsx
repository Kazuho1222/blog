import { getPlaiceholder } from 'plaiceholder';
import Container from '../components/container';
import Hero from '../components/hero';
import Meta from '../components/meta';
import Posts from '../components/posts';
import { getAllPosts } from '../lib/api';
import { eyecatchLocal } from '../lib/constants';
import { getImageBuffer } from '../lib/getImageBuffer';
import type { PostType } from '@/types/types';

export default async function Blog() {
  let posts: PostType[] = [];

  try {
    // データ取得に成功した場合
    posts = await getAllPosts();
  } catch (error) {
    console.error('Error fetching posts:', error);
    // データが取得できなかった場合の代替処理
    posts = []; // もしくは、fallback用のダミーデータをここで定義
  }

  // 各ポストに対して画像処理
  for (const post of posts) {
    try {
      if (!post.eyecatch) {
        post.eyecatch = { ...eyecatchLocal };
      }
      const imageBuffer = await getImageBuffer(post.eyecatch.url);
      const { base64 } = await getPlaiceholder(imageBuffer);
      post.eyecatch.blurDataURL = base64;
    } catch (error) {
      console.error('Error processing eyecatch for post:', post.slug, error);
      post.eyecatch!.blurDataURL = ''; // 画像処理に失敗した場合の代替値
    }
  }

  return (
    (<Container large={false}>
      <Meta pageTitle='ブログ' pageDesc='ブログの記事一覧' />
      <Hero title='Blog' subtitle='Recent Posts' imageOn={false} />
      {/* データが存在しない場合、エラーメッセージや空の状態を表示 */}
      {posts.length > 0 ? (
        <Posts posts={posts} />
      ) : (
        (<p>No posts available. Please check back later.</p>) // fallback コンテンツ
      )}
    </Container>)
  );
}
