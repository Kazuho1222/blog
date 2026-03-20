import { Skeleton } from '@/components/ui/skeleton'
import Container from '@/src/components/container'

export default function Loading() {
  return (
    <Container large={false}>
      <div className="py-4 space-y-6">
        {/* タイトル */}
        <Skeleton className="h-15 w-60 mx-auto" />

        {/* カード一覧 */}
        <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={`search-skeleton-${i}`} className="space-y-3">
              {/* 画像 */}
              <Skeleton className="h-40 w-full rounded-lg" />

              {/* タイトル */}
              <Skeleton className="h-5 w-3/4" />

              {/* 抜粋 */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
