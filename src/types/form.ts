import type { EyecatchType } from './eyecatch'

export interface FormDataType {
  title: string
  slug: string
  eyecatch: EyecatchType | string
  _content: string
  categories: string[]
  publishDate: string
}
