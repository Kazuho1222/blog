'use client'

import { Command, CommandInput } from '@/components/ui/command'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SearchInput() {
  const router = useRouter()
  const [isComposing, setIsComposing] = useState(false)

  return (
    <Command className="max-w-sm rounded-lg border">
      <CommandInput
        placeholder="検索文字を入力..."
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isComposing) {
            const value = (e.target as HTMLInputElement).value.trim()
            if (value) {
              router.push(`/search?q=${encodeURIComponent(value)}`)
            }
          }
        }}
      />
    </Command>
  )
}
