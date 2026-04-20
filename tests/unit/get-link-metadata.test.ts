import ogs from 'open-graph-scraper'
import type { ErrorResult, SuccessResult } from 'open-graph-scraper/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getLinkMetadata } from '@/src/app/actions/get-link-metadata'

// open-graph-scraper をモック化
vi.mock('open-graph-scraper', () => {
  return {
    default: vi.fn(),
  }
})

describe('getLinkMetadata サーバーアクション', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
    global.fetch = vi.fn()
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  describe('一般的なURL (ogs)', () => {
    it('有効なURLに対してメタデータを取得できること', async () => {
      const mockMetadata = {
        ogTitle: 'テストページ',
        ogDescription: 'これはテストページです',
        ogImage: [{ url: 'https://example.com/image.jpg' }],
        favicon: 'https://example.com/favicon.ico',
      }

      vi.mocked(ogs).mockResolvedValue({
        result: mockMetadata,
        error: false,
      } as SuccessResult)

      const url = 'https://example.com'
      const result = await getLinkMetadata(url)

      expect(result).toEqual({
        url,
        title: 'テストページ',
        description: 'これはテストページです',
        image: 'https://example.com/image.jpg',
        favicon: 'https://example.com/favicon.ico',
      })
    })

    it('ogTitleがない場合はTwitterのタイトルを使用すること', async () => {
      const mockMetadata = {
        twitterTitle: 'Twitterページ',
        ogDescription: 'これはテストページです',
      }

      vi.mocked(ogs).mockResolvedValue({
        result: mockMetadata,
        error: false,
      } as SuccessResult)

      const url = 'https://example.com'
      const result = await getLinkMetadata(url)

      expect(result?.title).toBe('Twitterページ')
    })

    it('ogsが失敗した場合は適切にエラーハンドリングされること', async () => {
      vi.mocked(ogs).mockResolvedValue({
        result: {},
        error: true,
      } as unknown as ErrorResult)

      const url = 'https://example.com'
      const result = await getLinkMetadata(url)

      expect(result).toEqual({ url })
    })
  })

  describe('YouTube URL', () => {
    const youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

    it('APIキーがある場合はYouTube APIからメタデータを取得すること', async () => {
      process.env.YOUTUBE_API_KEY = 'test-api-key'

      const mockApiResponse = {
        items: [
          {
            snippet: {
              title: 'Rick Astley - Never Gonna Give You Up',
              description: 'The official video for...',
              thumbnails: {
                maxres: {
                  url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                },
              },
            },
          },
        ],
      }

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      } as Response)

      // 異なるYouTube URL形式でテスト
      const urls = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtu.be/dQw4w9WgXcQ',
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
      ]

      for (const url of urls) {
        const result = await getLinkMetadata(url)
        expect(result.title).toBe('Rick Astley - Never Gonna Give You Up')
      }

      expect(global.fetch).toHaveBeenCalledTimes(urls.length)
    })

    it('YouTube APIキーがない場合はogsにフォールバックすること', async () => {
      delete process.env.YOUTUBE_API_KEY

      vi.mocked(ogs).mockResolvedValue({
        result: { ogTitle: 'YouTube OGS Title' },
        error: false,
      } as SuccessResult)

      const result = await getLinkMetadata(youtubeUrl)

      expect(global.fetch).not.toHaveBeenCalled()
      expect(result.title).toBe('YouTube OGS Title')
    })

    it('YouTube APIがアイテムを返さない場合はogsにフォールバックすること', async () => {
      process.env.YOUTUBE_API_KEY = 'test-api-key'

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ items: [] }),
      } as Response)

      vi.mocked(ogs).mockResolvedValue({
        result: { ogTitle: 'YouTube OGS Title' },
        error: false,
      } as SuccessResult)

      const result = await getLinkMetadata(youtubeUrl)

      expect(result.title).toBe('YouTube OGS Title')
    })

    it('YouTube APIの取得に失敗した場合はogsにフォールバックすること', async () => {
      process.env.YOUTUBE_API_KEY = 'test-api-key'

      vi.mocked(global.fetch).mockRejectedValue(new Error('API Error'))

      vi.mocked(ogs).mockResolvedValue({
        result: { ogTitle: 'YouTube OGS Title' },
        error: false,
      } as SuccessResult)

      const result = await getLinkMetadata(youtubeUrl)

      expect(result.title).toBe('YouTube OGS Title')
    })
  })
})
