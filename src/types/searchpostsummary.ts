import type { PostType } from './post'

export type SearchPostSummary = Pick<
  PostType,
  'id' | 'title' | 'slug' | 'eyecatch' | '_content' | 'categories'
>
