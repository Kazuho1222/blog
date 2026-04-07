import { nanoid } from 'nanoid'
import Container from '@/src/components/container'
import { Skeleton } from '@/src/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="m-4">
      <Container large={false}>
        <div className="py-4 space-y-8">
          <Skeleton className="mx-auto h-12 w-96" />
          {/* タイトル */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* スラッグ */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* 投稿日 */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-48" />
          </div>

          {/* 内容（エディタ） */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>

          {/* アイキャッチ */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>

          {/* カテゴリ */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, _i) => (
                <Skeleton key={nanoid()} className="h-5 w-40" />
              ))}
            </div>
          </div>

          {/* ボタン */}
          <Skeleton className="h-10 w-32" />
        </div>
      </Container>
    </div>
  )
}
