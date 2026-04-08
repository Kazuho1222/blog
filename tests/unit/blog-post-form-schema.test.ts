import { describe, expect, it } from 'vitest'
import { blogPostFormSchema } from '@/src/components/blog-form/blog-post-form-schema'

describe('blogPostFormSchema', () => {
  const validData = {
    title: 'テスト記事のタイトル',
    slug: 'test-post-123',
    publishDate: '2026-04-08T10:00:00Z',
    _content: '<p>テスト本文です</p>',
    eyecatch: 'https://example.com/image.jpg',
    categories: ['category1'],
  }

  it('正常系：すべての項目が正しい場合、バリデーションを通過する', () => {
    const result = blogPostFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('タイトルが空の場合、エラーを返す', () => {
    const data = { ...validData, title: '' }
    const result = blogPostFormSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('必須項目です')
    }
  })

  it('スラッグが空の場合、エラーを返す', () => {
    const data = { ...validData, slug: '' }
    const result = blogPostFormSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('必須項目です')
    }
  })

  it('スラッグに日本語が含まれる場合、エラーを返す', () => {
    const data = { ...validData, slug: 'テスト' }
    const result = blogPostFormSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        '半角英数字で入力してください',
      )
    }
  })

  it('スラッグに記号（ハイフン以外）が含まれる場合、エラーを返す', () => {
    const data = { ...validData, slug: 'test_post' } // アンダースコアは許可されていない
    const result = blogPostFormSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        '半角英数字で入力してください',
      )
    }
  })

  it('公開日が空の場合、エラーを返す', () => {
    const data = { ...validData, publishDate: '' }
    const result = blogPostFormSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('必須項目です')
    }
  })

  it('本文が空の場合、エラーを返す', () => {
    const data = { ...validData, _content: '' }
    const result = blogPostFormSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('必須項目です')
    }
  })

  it('カテゴリが空配列の場合、エラーを返す', () => {
    const data = { ...validData, categories: [] }
    const result = blogPostFormSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'カテゴリを1つ以上選択してください',
      )
    }
  })

  it('アイキャッチは空文字でもバリデーションを通過する', () => {
    const data = { ...validData, eyecatch: '' }
    const result = blogPostFormSchema.safeParse(data)
    expect(result.success).toBe(true)
  })
})
