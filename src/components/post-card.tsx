import type { PostType } from '@/src/types/types'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from './ui/button'

const getPlainExcerpt = (html: string, maxLength = 90) => {
  if (!html) return ''
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}…`
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** テキスト内のキーワードに一致する部分を <mark> でラップした React ノードを返す */
function highlightMatch(text: string, keyword: string) {
  if (!keyword.trim()) return text
  const escaped = escapeRegex(keyword)
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  let hitCount = 0
  let segCount = 0
  return parts.map((part) => {
    if (part.toLowerCase() === keyword.toLowerCase()) {
      hitCount += 1
      return (
        <mark
          key={`hit-${hitCount}`}
          className="rounded bg-yellow-200 px-0.5 font-medium"
        >
          {part}
        </mark>
      )
    }
    segCount += 1
    return <span key={`seg-${segCount}`}>{part}</span>
  })
}

export type PostCardProps = PostType & { highlightKeyword?: string }

export function PostCard(post: PostCardProps) {
  const excerpt = getPlainExcerpt(post._content)
  const primaryCategory = post.categories?.[0]?.name
  const keyword = post.highlightKeyword ?? ''

  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <Card className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden">
        <figure className="relative aspect-video w-full">
          {post.eyecatch?.url ? (
            <Image
              src={post.eyecatch.url}
              alt={post.title}
              fill
              sizes="(min-width: 1152px) 576px, 50vw"
              className="object-cover"
              placeholder={post.eyecatch.blurDataURL ? 'blur' : undefined}
              blurDataURL={post.eyecatch.blurDataURL}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              No image available
            </div>
          )}
        </figure>
        <CardHeader className="space-y-2">
          {primaryCategory && (
            <Badge variant="secondary" className="w-fit">
              {primaryCategory}
            </Badge>
          )}
          <CardTitle className="line-clamp-2">
            {highlightMatch(post.title, keyword)}
          </CardTitle>
          {excerpt && (
            <CardDescription className="line-clamp-3">
              {highlightMatch(excerpt, keyword)}
            </CardDescription>
          )}
        </CardHeader>
        <CardFooter className="mt-auto">
          <Button className="w-full" variant="outline">
            記事を読む
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
