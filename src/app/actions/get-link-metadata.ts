'use server'

import ogs from 'open-graph-scraper'
import type { LinkMetadata } from '@/src/types/link-metadata'

const YOUTUBE_API_ENDPOINT = 'https://www.googleapis.com/youtube/v3/videos'

/**
 * YouTubeの動画IDを抽出する
 */
function extractYouTubeId(url: string): string | null {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[7].length === 11 ? match[7] : null
}

/**
 * YouTube Data API を使用してメタデータを取得
 */
async function getYouTubeMetadata(
  videoId: string,
  url: string,
): Promise<LinkMetadata | null> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return null

  // YouTube IDの形式を厳密にチェック (11文字の英数字、ハイフン、アンダースコアのみ)
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return null
  }

  try {
    // URLオブジェクトを使用して安全に構築し、SSRFのリスクを排除
    const apiUrl = new URL(YOUTUBE_API_ENDPOINT)
    apiUrl.searchParams.set('part', 'snippet')
    apiUrl.searchParams.set('id', videoId)
    apiUrl.searchParams.set('key', apiKey)

    const res = await fetch(apiUrl, {
      next: { revalidate: 3600 * 24 }, // 24時間キャッシュ
    })
    const data = await res.json()

    if (!data.items || data.items.length === 0) return null

    const snippet = data.items[0].snippet
    return {
      url,
      title: snippet.title,
      description: snippet.description.substring(0, 160),
      image:
        snippet.thumbnails.maxres?.url ||
        snippet.thumbnails.high?.url ||
        snippet.thumbnails.default?.url,
      favicon: 'https://www.youtube.com/favicon.ico',
    }
  } catch (error) {
    console.error('YouTube API error:', error)
    return null
  }
}

/**
 * 指定されたURLからOGPメタデータを取得するServer Action
 */
export async function getLinkMetadata(url: string): Promise<LinkMetadata> {
  // 1. YouTubeかどうかを判定
  const videoId = extractYouTubeId(url)
  if (videoId) {
    const ytMetadata = await getYouTubeMetadata(videoId, url)
    if (ytMetadata) return ytMetadata
  }

  // 2. YouTube以外、またはAPIが失敗した場合は従来のスクレイピング
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
