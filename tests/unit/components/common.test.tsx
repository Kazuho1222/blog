import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Nav from '@/src/components/nav'
import PostCategories from '@/src/components/post-categories'
import Logo from '@/src/components/logo'
import Social from '@/src/components/social'
import Hero from '@/src/components/hero'

// Clerk のモック化
vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      primaryEmailAddress: {
        emailAddress: 'admin@example.com',
      },
    },
  }),
  Show: ({ children, when }: { children: React.ReactNode; when: string }) => {
    if (when === 'signed-in') return <>{children}</>
    return null
  },
  SignInButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  UserButton: () => <div data-testid="user-button" />,
}))

// SearchInput が内部で使用されているため、モック化
vi.mock('@/src/components/search-input', () => ({
  SearchInput: () => <div data-testid="search-input" />
}))

// next/image をモック化
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />
  },
}))

describe('Common Components Display', () => {
  describe('Nav', () => {
    it('主要なナビゲーションリンクが表示される', () => {
      process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAIL = 'admin@example.com'
      render(<Nav />)
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Blog')).toBeInTheDocument()
      expect(screen.getByText('Create-Blog')).toBeInTheDocument()
    })
  });

  describe('PostCategories', () => {
    it('渡されたカテゴリがリスト表示される', () => {
      const categories = [
        { name: 'React', slug: 'react' },
        { name: 'Next.js', slug: 'nextjs' }
      ]
      render(<PostCategories categories={categories} />)
      
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'React' })).toHaveAttribute('href', '/blog/category/react')
      expect(screen.getByText('Next.js')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Next.js' })).toHaveAttribute('href', '/blog/category/nextjs')
    })
  });

  describe('Logo', () => {
    it('ロゴテキストが表示され、トップページへのリンクになっている', () => {
      render(<Logo />)
      const logoLink = screen.getByRole('link', { name: 'CUBE' })
      expect(logoLink).toBeInTheDocument()
      expect(logoLink).toHaveAttribute('href', '/')
    })
  });

  describe('Social', () => {
    it('ソーシャルメディアのリンクが表示される', () => {
      render(<Social />)
      expect(screen.getByRole('link', { name: /Twitter/i })).toHaveAttribute('href', 'https://twitter.com')
      expect(screen.getByRole('link', { name: /Facebook/i })).toHaveAttribute('href', 'https://www.facebook.com')
      expect(screen.getByRole('link', { name: /GitHub/i })).toHaveAttribute('href', 'https://github.com')
    })
  });

  describe('Hero', () => {
    it('タイトルとサブタイトルが表示される', () => {
      render(<Hero title="こんにちは" subtitle="サブタイトルです" imageOn={false} />)
      expect(screen.getByText('こんにちは')).toBeInTheDocument()
      expect(screen.getByText('サブタイトルです')).toBeInTheDocument()
    })

    it('imageOnがtrueのときに画像が表示される', () => {
      render(<Hero title="T" subtitle="S" imageOn={true} />)
      expect(screen.getByAltText('Hero image')).toBeInTheDocument()
    })

    it('imageOnがfalseのときに画像が表示されない', () => {
      render(<Hero title="T" subtitle="S" imageOn={false} />)
      expect(screen.queryByAltText('Hero image')).not.toBeInTheDocument()
    })
  });
})
