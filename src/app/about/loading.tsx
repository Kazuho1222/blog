import Container from '@/src/components/container'
import { Skeleton } from '@/src/components/ui/skeleton'

export default function Loading() {
  return (
    <Container large={false}>
      <div className="py-8 space-y-10">
        {/* Hero（テキストのみ） */}
        <div className="space-y-3 text-center md:text-left">
          <Skeleton className="h-10 w-1/3 mx-auto md:mx-0" />
          <Skeleton className="h-5 w-1/4 mx-auto md:mx-0" />
        </div>

        {/* 画像 */}
        <Skeleton className="w-full h-[300px] rounded-lg" />

        {/* 2カラム */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* メイン */}
          <div className="flex-1 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />

            <Skeleton className="h-6 w-1/3 mt-4" />

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>

          {/* サイドバー */}
          <div className="w-full md:w-1/3 space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </Container>
  )
}
