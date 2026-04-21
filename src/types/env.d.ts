declare namespace NodeJS {
  interface ProcessEnv {
    MICROCMS_SERVICE_DOMAIN: string
    MICROCMS_API_KEY?: string
    NEXT_PUBLIC_ALLOWED_ADMIN_EMAIL: string
  }
}

declare module '*.jpg'
declare module '*.jpeg'
declare module '*.png'
declare module '*.svg'
declare module '*.gif'
declare module '*.webp'
