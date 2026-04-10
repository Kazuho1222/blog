import { beforeEach, describe, expect, it, vi } from 'vitest'
import { searchPosts } from '@/src/lib/api'

// 環境変数をモック化（vi.mock よりも早く、あるいは同等のタイミングで実行）
vi.stubEnv('MICROCMS_SERVICE_DOMAIN', 'test-domain')
vi.stubEnv('MICROCMS_API_KEY', 'test-key')

describe('searchPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('キーワードが空の場合、APIを叩かない', async () => {
    const result = await searchPosts('')

    expect(result).toEqual({
      totalCount: 0,
      offset: 0,
      limit: 10,
      contents: [],
    })

    expect(fetch).not.toHaveBeenCalled()
  })

  it('キーワードが指定された場合、正しいクエリでAPIを呼び出す', async () => {
    const mockResponse = {
      contents: [{ title: 'テスト記事', slug: 'test' }],
      totalCount: 1,
      offset: 0,
      limit: 10,
    }

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const result = await searchPosts('テスト')

    expect(fetch).toHaveBeenCalled()
    expect(result).toEqual(mockResponse)
  })

  it('リミットとオフセットが正しく渡される', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ contents: [], totalCount: 0 }),
    } as Response)

    await searchPosts('検索', 20, 40)

    const call = vi.mocked(fetch).mock.calls[0][0] as string
    expect(call).toContain('limit=20')
    expect(call).toContain('offset=40')
  })

  it('APIエラー時にエラーをスローする', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
    } as Response)

    // エラーがスローされることを確認
    await expect(searchPosts('エラー')).rejects.toThrow()
  })
})
