import Container from '@/app/components/container'
import PostHeader from '@/app/components/post-header'
import Posts from '@/app/components/posts'
import { getAllCategories, getAllPostsByCategory } from '@/app/lib/api'
import { eyecatchLocal } from '@/app/lib/constants'
import { getImageBuffer } from '@/app/lib/getImageBuffer'
import { getPlaiceholder } from 'plaiceholder'
import React from 'react'

export default async function Category({ params }: { params: { slug: string } }) {
  const catSlug = params.slug
  const allCats = await getAllCategories()
  const cat = allCats.find(({ slug }: { slug: string }) => slug === catSlug)
  const posts = await getAllPostsByCategory(cat.id)

  if (!cat) {
    return <div>カテゴリが見つかりません。</div>
  }

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
      <PostHeader title={cat.name} subtitle="Blog Category" publish={''} />
      <Posts posts={posts} />
    </Container>
  )
}

export async function getStaticPaths() {
  const allCats = await getAllCategories()

  const paths = allCats.map((cat: { slug: string }) => ({
    params: { slug: cat.slug },

  }))
  return {
    paths,
    fallback: false,
  }
}