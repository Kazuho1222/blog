import { Skeleton } from '@/components/ui/skeleton'
import Container from '@/src/components/container'
import {
  TwoColumn,
  TwoColumnMain,
  TwoColumnSidebar,
} from '@/src/components/two-column'

export default function Loading() {
  return (
    <Container large={false}>
      <article className="space-y-6 py-8 md:py-12">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div className="space-y-2 w-full">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* 画像 */}
        <Skeleton className="w-full h-[300px] rounded-lg" />

        {/* 本文 + サイドバー */}
        <TwoColumn>
          <TwoColumnMain>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </TwoColumnMain>

          <TwoColumnSidebar>
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </TwoColumnSidebar>
        </TwoColumn>

        {/* ページネーション */}
        <div className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </article>
    </Container>
  )
}
