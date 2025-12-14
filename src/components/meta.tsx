'use client'

// サイトに関する情報
import { usePathname } from 'next/navigation'
import { siteMeta } from '../lib/constants'
const { siteTitle, siteDesc, siteUrl, siteLocale, siteType, siteIcon } =
  siteMeta

import type { MetaType } from '@/src/types/types'
import Head from 'next/head'
// 汎用OGP画像
const siteImg = '/images/ogp.jpg'

export default function Meta({
  pageTitle,
  pageDesc,
  pageImg,
  pageImgW,
  pageImgH,
}: MetaType) {
  // ページのタイトル
  const title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle

  const desc = pageDesc ?? siteDesc

  // ページのURL
  const pathname = usePathname()
  const url = `${siteUrl}${pathname}`

  // OGP画像
  const img = pageImg || siteImg
  const imgW = pageImgW || 1200
  const imgH = pageImgH || 630
  const imgUrl = img.startsWith('https') ? img : `${siteUrl}${img}`

  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="description" content={desc} />
      <meta property="og:description" content={desc} />

      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />

      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:type" content={siteType} />
      <meta property="og:locale" content={siteLocale} />

      <link rel="icon" href={siteIcon} />
      <link rel="apple-touch-icon" href={siteIcon} />

      <meta property="og:image" content={imgUrl} />
      <meta property="og:image:width" content={imgW.toString()} />
      <meta property="og:image:height" content={imgH.toString()} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}
