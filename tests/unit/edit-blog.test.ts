import { beforeEach, describe, expect, it, vi } from 'vitest'
import { editBlogAction } from '@/src/app/actions/edit-blog'
import type { FormDataType } from '@/src/types/form'
import type { PostType } from '@/src/types/post'
import { isSlugAvailable, revalidateBlogCache } from '@/src/lib/api'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  updateTag: vi.fn(),
}))

vi.mock('@/src/lib/api', async () => {
  const actual = await vi.importActual('@/src/lib/api')
  return {
    ...actual as any,
    isSlugAvailable: vi.fn(),
    revalidateBlogCache: vi.fn(),
  }
})

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
    vi.mocked(isSlugAvailable).mockResolvedValue(true)
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
    expect(isSlugAvailable).toHaveBeenCalledWith(mockFormData.slug, mockPostData.id)
    expect(revalidateBlogCache).toHaveBeenCalled()
  })

  it('スラッグが別の記事で既に使用されている場合：エラーを返す', async () => {
    vi.mocked(isSlugAvailable).mockResolvedValue(false)

    process.env.MICROCMS_API_KEY = 'test-key'

    const result = await editBlogAction(mockPostData, mockFormData, imageUrl)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('このスラッグは既に使用されています。別のスラッグを入力してください。')
    }
    expect(fetch).not.toHaveBeenCalled()
  })

  it('スラッグが自分自身の記事のものである場合：成功する', async () => {
    // isSlugAvailableがtrueを返せば、内部でIDチェックが行われていようがいまいが成功するはず
    vi.mocked(isSlugAvailable).mockResolvedValue(true)
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: '1' }),
    })

    process.env.MICROCMS_API_KEY = 'test-key'

    const result = await editBlogAction(mockPostData, mockFormData, imageUrl)

    expect(result.success).toBe(true)
    expect(fetch).toHaveBeenCalled()
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

    const call = vi.mocked(fetch).mock.calls[0][0]
    const urlString = call instanceof URL ? call.toString() : (call as string)
    expect(urlString).toContain(`/blogs/${mockPostData.id}`)
  })

  it('methodがPATCHか', async () => {
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: '1' }),
    })

    process.env.MICROCMS_API_KEY = 'test-key'

    await editBlogAction(mockPostData, mockFormData, imageUrl)

    expect(fetch).toHaveBeenCalledWith(
      expect.anything(),
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
