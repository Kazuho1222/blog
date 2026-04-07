'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import Container from '../components/container'
import Hero from '../components/hero'

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    document.title = 'エラー: エラーが発生しました'
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <Container large={false}>
      <Hero title="エラー" subtitle="エラーが発生しました" imageOn={false} />
      <button
        type="button"
        onClick={
          // Attempt to recover by re-fetching and re-rendering the segment
          () => unstable_retry()
        }
      >
        再試行
      </button>
    </Container>
  )
}
