// サイトに関する情報
import { siteMeta } from './constants'
const { siteTitle, siteDesc, siteUrl, siteLocale, siteType, siteIcon } =
  siteMeta

// 汎用OGP画像
const siteImg = '/images/ogp.jpg'
const OGP_WIDTH = 1200
const OGP_HEIGHT = 630

// ベースとなる設定
export const baseMetadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: './',
  },
  // viewport: {
  // 	width: 'device-width',
  // 	initialScale: 1,
  // 	maximumScale: 1,
  // },
  title: {
    template: `%s | ${siteTitle}`,
    default: siteTitle,
  },
  description: siteDesc,
  icons: {
    icon: siteIcon,
    apple: siteIcon,
  },
}

// viewport設定を追加
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

// openGraphに関する設定
export const openGraphMetadata = {
  title: siteTitle,
  description: siteDesc,
  url: siteUrl,
  siteName: siteTitle,
  images: [
    {
      url: siteImg,
      width: OGP_WIDTH,
      height: OGP_HEIGHT,
    },
  ],
  locale: siteLocale,
  type: siteType,
}

// twitterに関する設定
export const twitterMetadata = {
  card: 'summary_large_image',
  title: siteTitle,
  description: siteDesc,
  images: [siteImg],
}
