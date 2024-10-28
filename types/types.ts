export interface MetaType {
  pageTitle: string
  pageDesc: string
  pageImg?: string
  pageImgW?: number
  pageImgH?: number
}

export interface PostType {
  title: string
  slug: string
  content: string
  eyecatch: {
    url: string
    width: number
    height: number
    blurDataURL?: string
  }
  categories: {
    category: string[]
  }
  publishDate: Date
}
export interface FormDataType {
  title: string
  slug: string
  eyecatch: {
    url?: string
    width?: number
    height?: number
    blurDataURL?: string
  }
  content: string
  categories: string[]
  publishDate: string
}
