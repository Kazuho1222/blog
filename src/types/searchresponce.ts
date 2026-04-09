import type { PostType } from './post'

export type SearchResponse = {
  contents: PostType[]
  totalCount: number
  offset: number
  limit: number
}
