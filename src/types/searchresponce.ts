import type { SearchPostSummary } from './searchpostsummary'

export type SearchResponse = {
  contents: SearchPostSummary[]
  totalCount: number
  offset: number
  limit: number
}
