import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, type Mock } from 'vitest'
import { SearchInput } from '@/src/components/search-input'
import { useRouter } from 'next/navigation'

// next/navigation のモック
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

describe('SearchInput Interaction', () => {
  const pushMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useRouter as Mock).mockReturnValue({ push: pushMock })
  })

  it('文字を入力してEnterを押すと、検索ページに遷移する', () => {
    render(<SearchInput />)
    const input = screen.getByPlaceholderText('検索文字を入力...')
    
    // 文字入力
    fireEvent.change(input, { target: { value: 'テスト記事' } })
    // Enterキー押下
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(pushMock).toHaveBeenCalledWith('/search?q=%E3%83%86%E3%82%B9%E3%83%88%E8%A8%98%E4%BA%8B')
  })

  it('空文字でEnterを押しても、遷移しない', () => {
    render(<SearchInput />)
    const input = screen.getByPlaceholderText('検索文字を入力...')
    
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(pushMock).not.toHaveBeenCalled()
  })

  it('日本語変換中 (isComposing: true) は Enter を押しても遷移しない', () => {
    render(<SearchInput />)
    const input = screen.getByPlaceholderText('検索文字を入力...')
    
    fireEvent.change(input, { target: { value: '変換中' } })
    
    // 変換開始
    fireEvent.compositionStart(input)
    // Enter押下
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(pushMock).not.toHaveBeenCalled()

    // 変換確定
    fireEvent.compositionEnd(input)
    // 再度Enter押下
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(pushMock).toHaveBeenCalledWith('/search?q=%E5%A4%89%E6%8F%9B%E4%B8%AD')
  })
})
