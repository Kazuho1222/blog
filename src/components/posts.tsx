import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/posts.module.css'
import type { PostListItem } from '../types/ui'

export default function Posts({
  posts,
}: {
  posts: PostListItem[] | undefined
}) {
  if (!posts) {
    return <div>投稿がありません。</div>
  }

  return (
    <div className={styles.gridContainer}>
      {posts.map(({ title, slug, eyecatch }) => (
        <article className={styles.post} key={slug}>
          <Link href={`/blog/${slug}`}>
            <figure className={styles.imageWrapper}>
              {eyecatch ? (
                <Image
                  src={eyecatch.url}
                  alt={title}
                  // layout='fill'
                  // objectFit='cover'
                  sizes="(min-width:1152px) 576px,50vw"
                  className={styles.image}
                  fill
                  placeholder={eyecatch.blurDataURL ? 'blur' : 'empty'}
                  blurDataURL={eyecatch.blurDataURL}
                />
              ) : (
                <div className={styles.noImage}>No image available</div>
              )}
            </figure>
            <h2>{title}</h2>
          </Link>
        </article>
      ))}
    </div>
  )
}
