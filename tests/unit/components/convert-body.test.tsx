import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ConvertBody from '@/src/components/convert-body'

// Mock LinkCard since it has 'use client' and fetches metadata
vi.mock('@/src/components/link-card', () => ({
  default: ({ url }: { url: string }) => <div data-testid="link-card">{url}</div>,
}))

describe('ConvertBody', () => {
  it('replaces a single URL in a <p> tag with LinkCard', () => {
    const html = '<p>https://example.com</p>'
    render(<ConvertBody contentHTML={html} />)
    
    expect(screen.getByTestId('link-card')).toBeInTheDocument()
    expect(screen.getByTestId('link-card')).toHaveTextContent('https://example.com')
  })

  it('replaces a single URL in an <a> tag with LinkCard', () => {
    const html = '<a href="https://example.com">https://example.com</a>'
    render(<ConvertBody contentHTML={html} />)
    
    expect(screen.getByTestId('link-card')).toBeInTheDocument()
    expect(screen.getByTestId('link-card')).toHaveTextContent('https://example.com')
  })

  it('replaces a link with data-type="link-card" even if text is different', () => {
    const html = '<a href="https://example.com" data-type="link-card">Click here</a>'
    render(<ConvertBody contentHTML={html} />)
    
    expect(screen.getByTestId('link-card')).toBeInTheDocument()
    expect(screen.getByTestId('link-card')).toHaveTextContent('https://example.com')
  })

  it('does not replace a link if it is part of a larger paragraph', () => {
    const html = '<p>Check this out: https://example.com</p>'
    render(<ConvertBody contentHTML={html} />)
    
    expect(screen.queryByTestId('link-card')).not.toBeInTheDocument()
    expect(screen.getByText(/Check this out:/)).toBeInTheDocument()
  })

  it('replaces an <a> tag even if it is inside a <p> with other text', () => {
    const html = '<p>Check this: <a href="https://example.com">https://example.com</a></p>'
    render(<ConvertBody contentHTML={html} />)
    
    expect(screen.getByTestId('link-card')).toBeInTheDocument()
    expect(screen.getByTestId('link-card')).toHaveTextContent('https://example.com')
  })
})
