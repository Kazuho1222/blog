import { nanoid } from 'nanoid'
import { Skeleton } from '@/components/ui/skeleton'
import Container from '@/src/components/container'

export default function Loading() {
  return (
    <Container large={false}>
      <div className="flex flex-col py-8 space-y-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
          {/* テキスト側 */}
          <div className="flex-1 pt-8 pb-10 text-center md:pt-12 md:pb-14 md:text-left space-y-4 w-full">
            <Skeleton className="h-14 w-3/4 mx-auto md:mx-0" />
            <Skeleton className="h-6 w-2/3 mx-auto md:mx-0" />
          </div>

          {/* 画像側 */}
          <div className="w-full max-w-sm shrink-0 md:w-2/5 md:max-w-md">
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>

        {/* Posts */}
        <div className="grid gap-14 md:grid-cols-2 pt-10">
          {Array.from({ length: 4 }).map((_, i) => (
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
