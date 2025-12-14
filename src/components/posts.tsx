import type { PostType } from '@/src/types/types'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/posts.module.css'

export default function Posts({ posts }: { posts: PostType[] | undefined }) {
  if (!posts) {
    return <div>投稿がありません。</div>
  }

  return (
    <div className={styles.gridContainer}>
      {posts.map(({ title, slug, eyecatch }) => (
        <article className={styles.post} key={slug}>
          <Link href={`/blog/${slug}`}>
            <figure>
              {eyecatch ? (
                <Image
                  src={eyecatch.url}
                  alt=""
                  // layout='fill'
                  // objectFit='cover'
                  sizes="(min-width:1152px) 576px,50vw"
                  fill
                  placeholder="blur"
                  blurDataURL={eyecatch.blurDataURL}
                />
              ) : (
                <div>No image available</div>
              )}
            </figure>
            <h2>{title}</h2>
          </Link>
        </article>
      ))}
    </div>
  )
}
