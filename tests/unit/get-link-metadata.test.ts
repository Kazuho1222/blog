import { describe, it, expect, vi } from 'vitest'
import { getLinkMetadata } from '@/src/app/actions/get-link-metadata'
import ogs from 'open-graph-scraper'

// open-graph-scraper をモック化
vi.mock('open-graph-scraper', () => {
  return {
    default: vi.fn(),
  }
})

describe('getLinkMetadata Server Action', () => {
  it('should return metadata for a valid URL', async () => {
    const mockMetadata = {
      ogTitle: 'Test Page',
      ogDescription: 'This is a test page',
      ogImage: [{ url: 'https://example.com/image.jpg' }],
      favicon: 'https://example.com/favicon.ico',
    }

    vi.mocked(ogs).mockResolvedValue({
      result: mockMetadata,
      error: false,
    } as any)

    const url = 'https://example.com'
    const result = await getLinkMetadata(url)

    expect(result).toEqual({
      url,
      title: 'Test Page',
      description: 'This is a test page',
      image: 'https://example.com/image.jpg',
      favicon: 'https://example.com/favicon.ico',
    })
  })

  it('should use twitter title if ogTitle is missing', async () => {
    const mockMetadata = {
      twitterTitle: 'Twitter Page',
      ogDescription: 'This is a test page',
    }

    vi.mocked(ogs).mockResolvedValue({
      result: mockMetadata,
      error: false,
    } as any)

    const url = 'https://example.com'
    const result = await getLinkMetadata(url)

    expect(result?.title).toBe('Twitter Page')
  })

  it('should return URL as title when no title is found', async () => {
    vi.mocked(ogs).mockResolvedValue({
      result: {},
      error: false,
    } as any)

    const url = 'https://example.com'
    const result = await getLinkMetadata(url)

    expect(result?.title).toBe(url)
  })

  it('should handle error when ogs fails', async () => {
    vi.mocked(ogs).mockResolvedValue({
      result: {},
      error: true,
    } as any)

    const url = 'https://example.com'
    const result = await getLinkMetadata(url)

    expect(result).toEqual({ url })
  })

  it('should handle exception gracefully', async () => {
    vi.mocked(ogs).mockRejectedValue(new Error('Network error'))

    const url = 'https://example.com'
    const result = await getLinkMetadata(url)

    expect(result).toEqual({ url })
  })
})
