'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useId } from 'react'
import * as gtag from '../lib/gtag'

function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const scriptId = useId()

  useEffect(() => {
    if (!gtag.IS_GATAG) {
      return
    }
    const searchString = searchParams.toString()
    const url = searchString ? `${pathname}?${searchString}` : pathname
    gtag.pageview(url)
  }, [pathname, searchParams])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TAG_ID}`}
      />
      <Script id={scriptId} strategy="afterInteractive">
        {`
        window.dataLayer=window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js',new Date());
        gtag('config','${gtag.GA_TAG_ID}',{
        page_path:window.location.pathname,
        });
      `}
      </Script>
    </>
  )
}

export default GoogleAnalytics
