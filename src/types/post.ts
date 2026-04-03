import type { CategoryType } from './category'
import type { EyecatchType } from './eyecatch'

export interface PostType {
  id: string
  title: string
  slug: string
  _content: string
  eyecatch: EyecatchType
  categories: CategoryType[]
  publishDate: string
}
