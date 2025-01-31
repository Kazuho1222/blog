import type { PostType } from '@/types/types'
import { getAllCategories, getAllSlugs } from './lib/api'
import { siteMeta } from './lib/constants'
const { siteUrl } = siteMeta

type Category = {
  name: string
  slug: string
}

export default async function sitemap() {
  // 各記事のURL
  const posts = await getAllSlugs()
  if (!posts) return []
  const postFields = posts.map((post: PostType) => {
    return {
      url: new URL(`/blog/${post.slug}`, siteUrl).toString(),
      lastModified: new Date(),
    }
  })

  // 各カテゴリーインデックスのURL
  const cats = await getAllCategories()
  if (!cats) return []
  const catFields = cats.map((cat: Category) => {
    return {
      url: new URL(`/blog/category/${cat.slug}`, siteUrl).toString(),
      lastModified: new Date(),
    }
  })

  return [
    {
      url: new URL(siteUrl).toString(),
      lastModified: new Date(),
    },
    {
      url: new URL('/about', siteUrl).toString(),
      lastModified: new Date(),
    },
    ...postFields,
    ...catFields,
  ]
}
