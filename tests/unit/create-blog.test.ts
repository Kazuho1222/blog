import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBlogAction } from '@/src/app/actions/create-blog'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

global.fetch = vi.fn() as unknown as typeof fetch

describe('createBlogAction', () => {
  const mockFormData = {
    title: 'テスト記事',
    slug: 'test-post',
    _content: '本文',
    eyecatch: '',
    categories: ['test'],
    publishDate: '2026-01-01',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('成功時：IDが返る', async () => {
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: '123' }),
    })

    process.env.MICROCMS_API_KEY = 'test-key'

    const result = await createBlogAction(mockFormData)

    expect(result).toEqual({
      success: true,
      id: '123',
    })
  })

  it('APIエラー時：success false', async () => {
    ;(fetch as any).mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () =>
        JSON.stringify({
          message: 'エラーです',
        }),
    })

    process.env.MICROCMS_API_KEY = 'test-key'

    const result = await createBlogAction(mockFormData)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('MicroCMS Error')
    }
  })

  it('IDがない場合：エラー', async () => {
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    })

    process.env.MICROCMS_API_KEY = 'test-key'

    const result = await createBlogAction(mockFormData)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('IDを取得できませんでした')
    }
  })

  it('APIキーがない場合：エラー', async () => {
    delete process.env.MICROCMS_API_KEY

    const result = await createBlogAction(mockFormData)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('APIキーが設定されていません')
    }
  })

  it('fetchが例外を投げた場合', async () => {
    ;(fetch as any).mockRejectedValue(new Error('network error'))

    process.env.MICROCMS_API_KEY = 'test-key'

    const result = await createBlogAction(mockFormData)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('network error')
    }
  })
})
