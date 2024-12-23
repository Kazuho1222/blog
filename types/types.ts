export interface MetaType {
  pageTitle: string
  pageDesc: string
  pageImg?: string
  pageImgW?: number
  pageImgH?: number
}

export interface PostType {
  id: string
  title: string
  slug: string
  _content: string
  eyecatch?: {
    url: string
    width: number
    height: number
    blurDataURL?: string
  }
  categories: {
    id: string
  }[]
  publishDate: string
}
export interface FormDataType {
  title: string
  slug: string
  eyecatch:
    | string
    | {
        url?: string
        width?: number
        height?: number
        blurDataURL?: string
      }
  _content: string
  categories: string[]
  publishDate: string
}

export interface CategoryType {
  slug: string
  id: string
}
