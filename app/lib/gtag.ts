// declare global {
//   interface Window {
//     gtag: (
//       command: string,
//       measurementId: string,
//       config?: { [key: string]: unknown }
//     ) => void
//   }
// }

export const GA_TAG_ID = process.env.NEXT_PUBLIC_GA_ID || ""
export const IS_GATAG = GA_TAG_ID !== ""

export const pageview = (path: string) => {
  if (GA_TAG_ID) {
    window.gtag('config', GA_TAG_ID, {
      page_path: path,
    })
  }
}