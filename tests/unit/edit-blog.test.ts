import { beforeEach, describe, expect, it, vi } from 'vitest'
import { editBlogAction } from '@/src/app/actions/edit-blog'
import type { FormDataType } from '@/src/types/form'
import type { PostType } from '@/src/types/post'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

global.fetch = vi.fn() as unknown as typeof fetch

describe('editBlogAction', () => {
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

  const mockFormData: FormDataType = {
    title: 'テスト記事',
    slug: 'test-post',
    _content: '本文',
    eyecatch: '',
    categories: ['test'],
    publishDate: '2026-01-01',
  }

  const imageUrl = 'aiueo'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('成功時：IDが返る', async () => {
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: '123' }),
    })

    process.env.MICROCMS_API_KEY = 'test-key'

    const result = await editBlogAction(mockPostData, mockFormData, imageUrl)

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

    const result = await editBlogAction(mockPostData, mockFormData, imageUrl)

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

    const result = await editBlogAction(mockPostData, mockFormData, imageUrl)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('IDを取得できませんでした')
    }
  })

  it('APIキーがない場合：エラー', async () => {
    delete process.env.MICROCMS_API_KEY

    const result = await editBlogAction(mockPostData, mockFormData, imageUrl)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('APIキーが設定されていません')
    }
  })

  it('fetchが例外を投げた場合', async () => {
    ;(fetch as any).mockRejectedValue(new Error('network error'))

    process.env.MICROCMS_API_KEY = 'test-key'

    const result = await editBlogAction(mockPostData, mockFormData, imageUrl)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('network error')
    }
  })

  it('URLが正しいか', async () => {
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: '1' }),
    })

    process.env.MICROCMS_API_KEY = 'test-key'

    await editBlogAction(mockPostData, mockFormData, imageUrl)

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/blogs/${mockPostData.id}`),
      expect.any(Object),
    )
  })

  it('methodがPATCHか', async () => {
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: '1' }),
    })

    process.env.MICROCMS_API_KEY = 'test-key'

    await editBlogAction(mockPostData, mockFormData, imageUrl)

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'PATCH',
      }),
    )
  })

  it('eyecatchが上書きされているか', async () => {
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: '1' }),
    })

    process.env.MICROCMS_API_KEY = 'test-key'

    await editBlogAction(mockPostData, mockFormData, imageUrl)

    const body = JSON.parse((fetch as any).mock.calls[0][1].body)

    expect(body.eyecatch).toBe(imageUrl)
  })
})
