import { describe, expect, it, vi, beforeEach } from 'vitest'

// 環境変数をモック化（vi.mock よりも早く、あるいは同等のタイミングで実行）
vi.stubEnv('MICROCMS_SERVICE_DOMAIN', 'test-domain')
vi.stubEnv('MICROCMS_API_KEY', 'test-key')

// client.get をモック化
vi.mock('microcms-js-sdk', async () => {
  const actual = await vi.importActual('microcms-js-sdk')
  return {
    ...actual,
    createClient: vi.fn(() => ({
      get: vi.fn(),
    })),
  }
})

// searchPosts をテストする
import { searchPosts, client } from '@/src/lib/api'

describe('searchPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('キーワードが空の場合、APIを叩かずに空のレスポンスを返す', async () => {
    const result = await searchPosts('')

    expect(result).toEqual({
      totalCount: 0,
      offset: 0,
      limit: 10,
      contents: [],
    })
    // client.get が呼ばれていないことを確認
    expect(client.get).not.toHaveBeenCalled()
  })

  it('キーワードが指定された場合、正しいクエリでAPIを呼び出す', async () => {
    const mockResponse = {
      contents: [{ title: 'テスト記事', slug: 'test' }],
      totalCount: 1,
      offset: 0,
      limit: 10,
    }
    ;(client.get as any).mockResolvedValue(mockResponse)

    const result = await searchPosts('テスト')

    expect(client.get).toHaveBeenCalledWith({
      endpoint: 'blogs',
      queries: expect.objectContaining({
        q: 'テスト',
        limit: 10,
        offset: 0,
      }),
    })
    expect(result).toEqual(mockResponse)
  })

  it('リミットとオフセットが正しく渡される', async () => {
    ;(client.get as any).mockResolvedValue({ contents: [], totalCount: 0 })

    await searchPosts('検索', 20, 40)

    expect(client.get).toHaveBeenCalledWith({
      endpoint: 'blogs',
      queries: expect.objectContaining({
        q: '検索',
        limit: 20,
        offset: 40,
      }),
    })
  })

  it('APIエラー時にエラーをスローする', async () => {
    const error = new Error('API Error')
    ;(client.get as any).mockRejectedValue(error)

    // エラーがスローされることを確認
    await expect(searchPosts('エラー')).rejects.toThrow('API Error')
  })
})
