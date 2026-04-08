import { describe, expect, it } from 'vitest'
import { cn } from '@/src/lib/utils'
import extractText from '@/src/lib/extract-text'
import { prevNextPost } from '@/src/lib/prev-next-post'

describe('cn (Utility)', () => {
  it('クラス名を正しく結合する', () => {
    expect(cn('base', 'extra')).toBe('base extra')
  })

  it('条件付きクラスを正しく処理する', () => {
    expect(cn('base', true && 'is-active', false && 'hidden')).toBe('base is-active')
  })

  it('Tailwind CSS の競合を解消する (twMerge)', () => {
    // p-4 と p-8 がある場合、後の p-8 が優先される
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })
})

describe('extractText', () => {
  it('HTMLタグを除去してテキストを抽出する', () => {
    const html = '<p>こんにちは、<strong>世界</strong>！</p>'
    // デフォルト length=80 なので、三点リーダーがつく
    expect(extractText(html)).toContain('こんにちは、世界！')
    expect(extractText(html)).toMatch(/…$/)
  })

  it('imgタグを無視する', () => {
    const html = '<p>テキスト<img src="test.jpg" alt="画像" />あり</p>'
    expect(extractText(html)).toBe('テキストあり…')
  })

  it('指定した長さでテキストをカットする', () => {
    const html = '<p>1234567890</p>'
    expect(extractText(html, 5, '...')).toBe('12345...')
  })

  it('リンクのテキストを抽出し、URLは無視する', () => {
    const html = '<p><a href="https://example.com">リンクテキスト</a></p>'
    expect(extractText(html)).toContain('リンクテキスト')
    expect(extractText(html)).not.toContain('https://example.com')
  })
})

describe('prevNextPost', () => {
  const posts = [
    { slug: 'post-1', title: '記事1' },
    { slug: 'post-2', title: '記事2' },
    { slug: 'post-3', title: '記事3' },
  ]

  it('最初（最新）の投稿の場合、次の記事はなく、前の記事を取得する', () => {
    const [prev, next] = prevNextPost(posts, 'post-1')
    expect(next).toEqual({ title: '', slug: '' })
    expect(prev).toEqual(posts[1]) // index 1 (post-2)
  })

  it('中間の投稿の場合、前後の記事を取得する', () => {
    const [prev, next] = prevNextPost(posts, 'post-2')
    expect(next).toEqual(posts[0]) // index 0 (post-1)
    expect(prev).toEqual(posts[2]) // index 2 (post-3)
  })

  it('最後（最古）の投稿の場合、前の記事はなく、次の記事を取得する', () => {
    const [prev, next] = prevNextPost(posts, 'post-3')
    expect(next).toEqual(posts[1]) // index 1 (post-2)
    expect(prev).toEqual({ title: '', slug: '' })
  })
})
