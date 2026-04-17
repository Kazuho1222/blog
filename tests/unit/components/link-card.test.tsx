import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LinkCard from '@/src/components/link-card'
import * as getLinkMetadataAction from '@/src/app/actions/get-link-metadata'

// Server Action をモック化
vi.mock('@/src/app/actions/get-link-metadata', () => ({
  getLinkMetadata: vi.fn(),
}))

describe('LinkCard component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show loading state initially', () => {
    vi.mocked(getLinkMetadataAction.getLinkMetadata).mockReturnValue(new Promise(() => {}))
    
    const { container } = render(<LinkCard url="https://example.com" />)
    
    // animate-pulse が含まれる div を探す
    const loader = container.querySelector('.animate-pulse')
    expect(loader).toBeTruthy()
  })

  it('should render YouTube icon for YouTube URLs', async () => {
    const mockMetadata = {
      url: 'https://www.youtube.com/watch?v=123',
      title: 'YouTube Video',
      description: 'A video description',
    }
    vi.mocked(getLinkMetadataAction.getLinkMetadata).mockResolvedValue(mockMetadata)

    render(<LinkCard url="https://www.youtube.com/watch?v=123" />)

    await waitFor(() => {
      expect(screen.getByText('YouTube Video')).toBeDefined()
    })

    // FontAwesome のアイコンが存在することを確認 (クラス名の一部をチェック)
    const icon = screen.getByRole('img', { hidden: true })
    expect(icon.classList.contains('fa-youtube')).toBeTruthy()
  })

  it('should render favicon for other sites', async () => {
    const mockMetadata = {
      url: 'https://example.com',
      title: 'Example Site',
      description: 'Site description',
      favicon: 'https://example.com/favicon.ico',
    }
    vi.mocked(getLinkMetadataAction.getLinkMetadata).mockResolvedValue(mockMetadata)

    render(<LinkCard url="https://example.com" />)

    await waitFor(() => {
      expect(screen.getByText('Example Site')).toBeDefined()
    })

    // favicon 画像が表示されていることを確認
    const favicon = screen.getByAltText('')
    expect(favicon).toBeDefined()
    expect(favicon.getAttribute('src')).toBe('https://example.com/favicon.ico')
  })

  it('should show fallback link when metadata fetch fails', async () => {
    vi.mocked(getLinkMetadataAction.getLinkMetadata).mockResolvedValue({ url: 'https://example.com' })

    render(<LinkCard url="https://example.com" />)

    await waitFor(() => {
      // フォールバックの単純なリンクが表示されていることを確認
      const link = screen.getByRole('link')
      expect(link.getAttribute('href')).toBe('https://example.com')
      expect(link.textContent).toBe('https://example.com')
    })
  })
})
