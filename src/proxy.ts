import { clerkMiddleware } from '@clerk/nextjs/server'

// 管理画面に関連するルートを保護対象にする
// const isProtectedRoute = createRouteMatcher([
//   '/create-blog(.*)',
//   '/edit-blog(.*)',
// ])

export const proxy = clerkMiddleware()
// if (isProtectedRoute(req)) {
//   await auth.protect()
// }
// })

export const config = {
  matcher: [
    // Next.jsの内部ファイルや静的ファイルを除外
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // APIルートは常に実行
    '/(api|trpc)(.*)',
  ],
}
