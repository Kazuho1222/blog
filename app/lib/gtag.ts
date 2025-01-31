declare global {
  interface Window {
    gtag: (
      command: string,
      measurementId: string,
      config?: { [key: string]: unknown }
    ) => void
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID
export const pageview = (url: string) => {
  if (GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}