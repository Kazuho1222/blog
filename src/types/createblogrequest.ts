import type { BaseBlog } from './baseblog'

export type CreateBlogRequest = BaseBlog & {
  eyecatch?: string
}
