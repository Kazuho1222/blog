/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: 'imgix',
    path: '',
    domains: ['images.microcms-assets.io'],
    // 特定のドメインからの画像取得を許可
    remotePatterns: [
      {
      protocol: 'https',
      hostname: 'images.microcms-assets.io/assets',
      port: '',
      pathname: '**',
      },
    ],
  },
  env: {
    MICROCMS_SERVICE_DOMAIN: process.env.MICROCMS_SERVICE_DOMAIN,
    MICROCMS_API_KEY: process.env.MICROCMS_API_KEY,
  },
}

export default nextConfig
