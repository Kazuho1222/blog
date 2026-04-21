import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteBlogAction } from '@/src/app/actions/delete-blog'
import type { PostType } from '@/src/types/post'

vi.mock('@/src/lib/auth-check', () => ({
  checkAdmin: vi.fn().mockResolvedValue('admin_123'),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  updateTag: vi.fn(),
}))

global.fetch = vi.fn()

describe('deleteBlogAction', () => {
  const mockPostData: PostType = {
    id: '1',
    title: 'テスト記事',
    slug: 'test-post',
    _content: 'あいうえお',
    eyecatch: {
      url: 'https://example.com/image.png',
      width: 123,
      height: 123,
    },
    categories: [
      {
        id: '1',
        name: 'test',
        slug: 'test',
      },
    ],
    publishDate: '2026-01-01',
  }

  const originalApiKey = process.env.MICROCMS_API_KEY

  beforeEach(() => {
    vi.clearAllMocks()
    if (originalApiKey === undefined) {
      delete process.env.MICROCMS_API_KEY
    } else {
      process.env.MICROCMS_API_KEY = originalApiKey
    }
  })

  it('成功時：success true', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response)

    process.env.MICROCMS_API_KEY = 'test-key'

    const result = await deleteBlogAction(mockPostData.id)

    expect(result).toEqual({
      success: true,
    })
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

    const result = await deleteBlogAction(mockPostData.id)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('削除に失敗しました')
    }
  })

  it('IDがない場合：エラー', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response)

    process.env.MICROCMS_API_KEY = 'test-key'

    const result = await deleteBlogAction('')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('IDが指定されていません')
    }
  })

  it('APIキーがない場合：エラー', async () => {
    delete process.env.MICROCMS_API_KEY

    const result = await deleteBlogAction(mockPostData.id)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('APIキーが設定されていません')
    }
  })

  it('fetchが例外を投げた場合', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('サーバーエラーが発生しました'))

    process.env.MICROCMS_API_KEY = 'test-key'

    const result = await deleteBlogAction(mockPostData.id)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('サーバーエラーが発生しました')
    }
  })

  it('URLが正しいか', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response)

    process.env.MICROCMS_API_KEY = 'test-key'

    await deleteBlogAction(mockPostData.id)

    const call = vi.mocked(fetch).mock.calls[0][0]
    const urlString = call instanceof URL ? call.toString() : (call as string)
    expect(urlString).toContain(`/blogs/${mockPostData.id}`)
  })

  it('methodがDELETEか', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response)

    process.env.MICROCMS_API_KEY = 'test-key'

    await deleteBlogAction(mockPostData.id)

    expect(fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        method: 'DELETE',
      }),
    )
  })

  it('IDがない場合はfetchが呼ばれない', async () => {
    process.env.MICROCMS_API_KEY = 'test-key'

    await deleteBlogAction('')

    expect(fetch).not.toHaveBeenCalled()
  })

  it('APIキーがない場合はfetchが呼ばれない', async () => {
    delete process.env.MICROCMS_API_KEY

    await deleteBlogAction(mockPostData.id)

    expect(fetch).not.toHaveBeenCalled()
  })
})
