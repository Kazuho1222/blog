export type PostListItem = {
  title: string
  slug: string
  eyecatch?: {
    url: string
    width?: number
    height?: number
    blurDataURL?: string
  }
}
