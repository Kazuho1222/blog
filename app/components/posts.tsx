import React from 'react'
import styles from '../../styles/posts.module.css'
import Link from 'next/link';

interface Post {
  title: string;
  slug: string;
}

export default function Posts({ posts }: { posts: Post[] | undefined }) {
  if (!posts) {
    return <div>投稿がありません。</div>;
  }

  return (
    <div className={styles.gridContainer}>
      {posts.map(({ title, slug }) => (
        <article className={styles.post} key={slug}>
          <Link href={`/blog/${slug}`}>
            <h2>{title}</h2>
          </Link>
        </article>
      ))}
    </div>
  )
}
