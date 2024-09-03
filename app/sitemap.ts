import { PostType } from '@/types/types'
import { getAllCategories, getAllSlugs } from './lib/api'
import { siteMeta } from './lib/constants'
const { siteUrl } = siteMeta

type Category = {
  name: string
  slug: string
}

export default async function sitemap() {
  const posts = await getAllSlugs()
  const postFields = posts.map((post: PostType) => {
    return {
      url: new URL(`/blog/${post.slug}`, siteUrl).toString(),
      lastModifield: new Date(),
    }
  })

  const cats = await getAllCategories()
  const catFields = cats.map((cat: Category) => {
    return {
      url: new URL(`/blog/category/${cat.slug}`, siteUrl).toString(),
      lastModified: new Date(),
    }
  })

  return [
    {
      url: new URL(siteUrl).toString(),
      lastModifield: new Date(),
    },
    {
      url: new URL('/about', siteUrl).toString(),
      lastModifield: new Date(),
    },
    ...postFields,
    ...catFields,
  ]
}
