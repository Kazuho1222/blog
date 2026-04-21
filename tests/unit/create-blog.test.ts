import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBlogAction } from '@/src/app/actions/create-blog'
import { isSlugAvailable, revalidateBlogCache } from '@/src/lib/api'
import type { CreateBlogFormData } from '@/src/types/createblogformdata'

vi.mock('@/src/lib/auth-check', () => ({
  checkAdmin: vi.fn().mockResolvedValue('admin_123'),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  updateTag: vi.fn(),
}))

vi.mock('@/src/lib/api', async () => {
  const actual = await vi.importActual<typeof import('@/src/lib/api')>(
    '@/src/lib/api',
  )
  return {
    ...actual,
    isSlugAvailable: vi.fn(),
    revalidateBlogCache: vi.fn(),
  }
})

global.fetch = vi.fn()

describe('createBlogAction', () => {
  const mockFormData: CreateBlogFormData = {
    title: 'テスト記事',
    slug: 'test-post',
    _content: '本文',
    eyecatch: '',
    categories: ['test'],
    publishDate: '2026-01-01',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(isSlugAvailable).mockResolvedValue(true)
  })

  it('成功時：IDが返る', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ id: '123' }),
    } as Response)

    process.env.MICROCMS_API_KEY = 'test-key'

    const result = await createBlogAction(mockFormData)

    expect(result).toEqual({
      success: true,
      id: '123',
    })
    expect(isSlugAvailable).toHaveBeenCalledWith(mockFormData.slug)
    expect(revalidateBlogCache).toHaveBeenCalled()
  })

  it('スラッグが既に使用されている場合：エラーを返す', async () => {
    vi.mocked(isSlugAvailable).mockResolvedValue(false)

    process.env.MICROCMS_API_KEY = 'test-key'

    const result = await createBlogAction(mockFormData)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe(
        'このスラッグは既に使用されています。別のスラッグを入力してください。',
      )
    }
    expect(fetch).not.toHaveBeenCalled()
  })

  it('APIエラー時：success false', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () =>
        JSON.stringify({
          message: 'エラーです',
        }),
    } as Response)

    process.env.MICROCMS_API_KEY = 'test-key'

    const result = await createBlogAction(mockFormData)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('MicroCMS Error')
    }
  })

  it('IDがない場合：エラー', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response)

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
    vi.mocked(fetch).mockRejectedValue(new Error('network error'))

    process.env.MICROCMS_API_KEY = 'test-key'

    const result = await createBlogAction(mockFormData)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('network error')
    }
  })
})
