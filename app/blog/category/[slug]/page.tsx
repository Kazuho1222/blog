import Container from '@/app/components/container'
import PostHeader from '@/app/components/post-header'
import { getAllCategories } from '@/app/lib/api'
import React from 'react'

export default async function Category({ params }: { params: { slug: string } }) {
  const catSlug = params.slug
  const allCats = await getAllCategories()
  const cat = allCats.find(({ slug }: { slug: string }) => slug === catSlug)

  if (!cat) {
    return <div>カテゴリが見つかりません。</div>
  }

  return (
    <Container large={false}>
      <PostHeader title={cat.name} subtitle="Blog Category" publish={''} />
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