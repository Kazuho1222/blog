'use client'

import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { getLinkMetadata } from '@/src/app/actions/get-link-metadata'
import type { LinkMetadata } from '@/src/types/link-metadata'

interface LinkCardProps {
  url: string
}

const LinkCard = ({ url }: LinkCardProps) => {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null)
  const [loading, setLoading] = useState(true)

  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be')

  useEffect(() => {
    let cancelled = false

    const fetchMetadata = async () => {
      setLoading(true)
      try {
        const data = await getLinkMetadata(url)
        if (!cancelled) {
          setMetadata(data)
        }
      } catch (error) {
        console.error('Failed to fetch link metadata:', error)
        if (!cancelled) {
          setMetadata(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (url) {
      void fetchMetadata()
    }

    return () => {
      cancelled = true
    }
  }, [url])

  if (loading) {
    return (
      <div className="my-4 flex animate-pulse items-center gap-4 rounded-lg border-2 border-gray-200 p-4 shadow-sm">
        <div className="h-20 w-32 rounded bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  if (!metadata?.title) {
    return (
      <div className="my-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg border-2 border-gray-500 p-4 text-blue-600 underline hover:bg-gray-50"
        >
          {isYoutube && (
            <FontAwesomeIcon icon={faYoutube} className="mr-2 text-[#ff0000]" />
          )}
          {url}
        </a>
      </div>
    )
  }

  return (
    <div className="my-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex cursor-pointer overflow-hidden rounded-lg border-2 border-gray-500 bg-white transition-shadow hover:shadow-md no-underline"
      >
        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="space-y-1 text-left">
            <h4 className="line-clamp-1 text-lg font-bold text-gray-900 leading-tight">
              {isYoutube ? (
                <FontAwesomeIcon
                  icon={faYoutube}
                  className="mr-2 text-[#ff0000]"
                />
              ) : (
                metadata.favicon && (
                  <img
                    src={metadata.favicon}
                    alt=""
                    className="mr-2 inline-block h-4 w-4 align-middle"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                )
              )}
              {metadata.title}
            </h4>
            <p className="line-clamp-2 text-sm text-gray-600 leading-relaxed">
              {metadata.description}
            </p>
          </div>
          <span className="mt-2 text-xs text-gray-400 truncate">{url}</span>
        </div>
        {metadata.image && (
          <div className="relative w-32 sm:w-48 bg-gray-100 shrink-0">
            <img
              src={metadata.image}
              alt={metadata.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </a>
    </div>
  )
}

export default LinkCard
