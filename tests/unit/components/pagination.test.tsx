import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Pagination from '@/src/components/pagination'

describe('Pagination Component', () => {
  it('prevとnextの両方が渡されたとき、両方のリンクが表示される', () => {
    render(
      <Pagination
        prevText="前の記事"
        prevUrl="/blog/prev"
        nextText="次の記事"
        nextUrl="/blog/next"
      />
    )

    const prevLink = screen.getByRole('link', { name: /前の記事/ })
    const nextLink = screen.getByRole('link', { name: /次の記事/ })

    expect(prevLink).toBeInTheDocument()
    expect(prevLink).toHaveAttribute('href', '/blog/prev')
    expect(nextLink).toBeInTheDocument()
    expect(nextLink).toHaveAttribute('href', '/blog/next')
  })

  it('prevのみ渡されたとき、prevリンクのみが表示される', () => {
    render(<Pagination prevText="前の記事" prevUrl="/blog/prev" />)

    expect(screen.getByRole('link', { name: /前の記事/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /次の記事/ })).not.toBeInTheDocument()
  })

  it('nextのみ渡されたとき、nextリンクのみが表示される', () => {
    render(<Pagination nextText="次の記事" nextUrl="/blog/next" />)

    expect(screen.queryByRole('link', { name: /前の記事/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /次の記事/ })).toBeInTheDocument()
  })

  it('何も渡されないとき、リンクが表示されない', () => {
    const { container } = render(<Pagination />)
    // ulタグは存在するが中身のliは空
    expect(container.querySelector('li')).toBeNull()
  })
})
