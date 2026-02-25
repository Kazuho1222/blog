// src/app/search/page.tsx

import Container from '@/src/components/container'
import Pagination from '@/src/components/pagination'
import { PostCard } from '@/src/components/post-card'
import { searchPosts } from '@/src/lib/api'
import { eyecatchLocal } from '@/src/lib/constants'
import { getImageBuffer } from '@/src/lib/get-image-buffer'
import { getPlaiceholder } from 'plaiceholder'

type SearchPageProps = {
  searchParams: Promise<{
    q?: string
    page?: string
  }>
}

const toPlainText = (html: string) => {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page: pageParam } = await searchParams
  const keyword = q?.trim() ?? ''

  const currentPage = (() => {
    const n = Number(pageParam ?? '1')
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1
  })()

  const perPage = 9
  const searchResult = keyword
    ? await searchPosts(keyword, perPage, (currentPage - 1) * perPage)
    : { contents: [], totalCount: 0, limit: perPage, offset: 0 }

  const posts = searchResult.contents

  // 各ポストに対して画像処理（デフォルト画像の設定とブラー画像の生成）
  for (const post of posts) {
    try {
      if (!post.eyecatch) {
        post.eyecatch = { ...eyecatchLocal }
      }
      const imageBuffer = await getImageBuffer(post.eyecatch.url)
      const { base64 } = await getPlaiceholder(imageBuffer)
      post.eyecatch.blurDataURL = base64
    } catch (error) {
      console.error('Error processing eyecatch for post:', post.slug, error)
      if (post.eyecatch) {
        post.eyecatch.blurDataURL = '' // 画像処理に失敗した場合の代替値
      }
    }
  }

  const lowerKeyword = keyword.toLowerCase()
  const filteredPosts = posts.filter((post) => {
    const title = post.title.toLowerCase()
    const body = toPlainText(post._content).toLowerCase()
    // 入力された文字列そのもの（例: "aiueo"）をタイトルか本文テキストに含むものだけを残す
    return lowerKeyword === '' || title.includes(lowerKeyword) || body.includes(lowerKeyword)
  })

  const totalCount = searchResult.totalCount ?? filteredPosts.length
  const totalPages = keyword ? Math.max(1, Math.ceil(totalCount / perPage)) : 1

  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    if (keyword) params.set('q', keyword)
    if (page > 1) params.set('page', String(page))
    const query = params.toString()
    return query ? `/search?${query}` : '/search'
  }

  const prevUrl = currentPage > 1 ? buildUrl(currentPage - 1) : ''
  const nextUrl = currentPage < totalPages ? buildUrl(currentPage + 1) : ''

  return (
    <Container large={false}>
      <h1 className="text-center">検索結果</h1>
      {keyword === '' && <p className="mt-4">検索文字を入力してください</p>}

      {keyword !== '' && filteredPosts.length === 0 && (
        <p className="mt-4">「{keyword}」に一致する記事はありません</p>
      )}

      {filteredPosts.length > 0 && (
        <>
          <div className="mt-8 mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard
                id={post.id}
                title={post.title}
                slug={post.slug}
                _content={post._content}
                eyecatch={post.eyecatch}
                categories={post.categories}
                publishDate={''}
                highlightKeyword={keyword}
                key={post.slug}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mb-12">
              <Pagination
                prevText={prevUrl ? '前のページ' : ''}
                prevUrl={prevUrl}
                nextText={nextUrl ? '次のページ' : ''}
                nextUrl={nextUrl}
              />
            </div>
          )}
        </>
      )}
    </Container>
  )
}
