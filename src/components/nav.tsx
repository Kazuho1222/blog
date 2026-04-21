'use client'

import { Show, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import styles from '../styles/nav.module.css'
import { SearchInput } from './search-input'

export default function Nav() {
  const [navIsOpen, setNavIsOpen] = useState(false)
  const { user } = useUser()

  const toggleNav = () => {
    setNavIsOpen((prev) => !prev)
  }

  const closeNav = () => {
    setNavIsOpen(false)
  }

  const isAdmin =
    user?.primaryEmailAddress?.emailAddress?.toLowerCase() ===
      process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAIL?.toLowerCase() &&
    !!process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAIL

  return (
    <nav className={navIsOpen ? styles.open : styles.close}>
      {navIsOpen && (
        <style jsx global>{`
        @media (max-width: 767px){
          body{
            overflow: hidden;
            position: fixed;
            width: 100%;
          }
        }
        `}</style>
      )}

      <button type="button" className={styles.btn} onClick={toggleNav}>
        <span className={styles.bar} />
        <span className="sr-only">MENU</span>
      </button>
      <ul className={styles.list}>
        <li>
          <SearchInput />
        </li>
        <li>
          <Link href="/" onClick={closeNav}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" onClick={closeNav}>
            About
          </Link>
        </li>
        <li>
          <Link href="/blog" onClick={closeNav}>
            Blog
          </Link>
        </li>
        <Show when="signed-in">
          {isAdmin && (
            <li>
              <Button
                asChild
                variant="default"
                className="bg-gray-800 text-white! hover:bg-red-500 hover:text-white"
              >
                <Link href="/create-blog" onClick={closeNav}>
                  Create-Blog
                </Link>
              </Button>
            </li>
          )}
          <li className="flex items-center" data-testid="user-button">
            <UserButton />
          </li>
        </Show>
        <Show when="signed-out">
          <li>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </SignInButton>
          </li>
        </Show>
      </ul>
    </nav>
  )
}
