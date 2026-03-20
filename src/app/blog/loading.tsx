import { Skeleton } from '@/components/ui/skeleton'
import Container from '@/src/components/container'

export default function Loading() {
  return (
    <Container large={false}>
      <div className="py-16 pt-16 space-y-10">
        {/* Hero */}
        <div className="space-y-3">
          <Skeleton className="h-14 w-1/3" />
          <Skeleton className="h-5 w-1/4" />
        </div>

        {/* Posts（カード一覧） */}
        <div className="grid gap-14 md:grid-cols-2 pt-14">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`post-skeleton-${i}`} className="space-y-3">
              {/* 画像 */}
              <Skeleton className="h-78 w-full rounded-lg" />

              {/* タイトル */}
              <Skeleton className="h-8 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
