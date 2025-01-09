import React from 'react'
import styles from '../../styles/posts.module.css'
import Link from 'next/link';
import Image from 'next/image'
import { PostType } from '@/types/types';

export default function Posts({ posts }: { posts: PostType[] | undefined }) {
  if (!posts) {
    return <div>投稿がありません。</div>;
  }

  return (
    <div className={styles.gridContainer}>
      {posts.map(({ title, slug, eyecatch }) => (
        <article className={styles.post} key={slug}>
          <Link href={`/blog/${slug}`}>
            <figure>
              <Image
                src={eyecatch!.url}
                alt=''
                // layout='fill'
                // objectFit='cover'
                sizes='(min-width:1152px) 576px,50vw'
                fill
                placeholder='blur'
                blurDataURL={eyecatch!.blurDataURL}
              />
            </figure>
            <h2>{title}</h2>
          </Link>
        </article>
      ))}
    </div>
  )
}
