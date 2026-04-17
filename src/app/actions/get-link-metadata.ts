'use server'

import ogs from 'open-graph-scraper'
import type { LinkMetadata } from '@/src/types/link-metadata'

/**
 * 指定されたURLからOGPメタデータを取得するServer Action
 */
export async function getLinkMetadata(url: string): Promise<LinkMetadata> {
  try {
    const { result, error } = await ogs({
      url,
      fetchOptions: {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      },
    })

    if (error) {
      console.error('OGP fetch error for URL:', url, error)
      return { url }
    }

    // 画像URLの解決（OGPの画像があればそれを優先）
    const image =
      result.ogImage && result.ogImage.length > 0
        ? result.ogImage[0].url
        : undefined

    return {
      url,
      title: result.ogTitle || result.twitterTitle || url,
      description: result.ogDescription || result.twitterDescription || '',
      image,
      favicon: result.favicon,
    }
  } catch (error) {
    console.error('Failed to fetch link metadata for URL:', url, error)
    return { url }
  }
}
