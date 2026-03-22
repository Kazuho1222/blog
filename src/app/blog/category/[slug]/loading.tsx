import { nanoid } from 'nanoid'
import { Skeleton } from '@/components/ui/skeleton'
import Container from '@/src/components/container'

export default function Loading() {
  return (
    <Container large={false}>
      <div className="space-y-6 py-16 pt-8">
        {/* タイトル */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-14 w-1/2" />
        </div>

        {/* カード一覧 */}
        <div className="grid gap-14 md:grid-cols-2 pt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={nanoid()} className="space-y-3">
              <Skeleton className="h-80 w-full rounded-lg" />
              <Skeleton className="h-8 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
