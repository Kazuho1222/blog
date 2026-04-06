/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // editBlog sends full post + form (large HTML); default 1MB triggers 413
      bodySizeLimit: '4mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
        pathname: '/assets/**',
      },
    ],
  },
  env: {
    MICROCMS_SERVICE_DOMAIN: process.env.MICROCMS_SERVICE_DOMAIN,
    MICROCMS_API_KEY: process.env.MICROCMS_API_KEY,
  },
  reactStrictMode: true,
}

export default nextConfig
