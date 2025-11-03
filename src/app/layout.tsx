import { Toaster } from '@/src/components/ui/toaster'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import Footer from '../components/footer'
import GoogleAnalytics from '../components/googleanalytics'
import Header from '../components/header'
import {
	baseMetadata,
	openGraphMetadata,
	twitterMetadata,
} from '../lib/base-metadata'
import './globals.css'

config.autoAddCss = false

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	...baseMetadata,
	openGraph: {
		...openGraphMetadata,
	},
	twitter: {
		...twitterMetadata,
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://images.microcms-assets.io" crossOrigin="anonymous" />
				<link rel="dns-prefetch" href="https://images.microcms-assets.io" />
			</head>
			<body className={inter.className}>
				<Suspense>
					<GoogleAnalytics />
				</Suspense>
				{/* <Suspense fallback={<Loading />}> */}
				<Header />
				{children}
				<Toaster />
				<Footer />
				{/* </Suspense> */}
			</body>
		</html>
	)
}
