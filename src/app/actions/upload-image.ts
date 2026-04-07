'use server'

import { uploadImageToMicroCMS } from '@/src/lib/api/microcms'

export type UploadImageResult =
  | { success: true; url: string }
  | { success: false; error: string }

export const uploadImageAction = async (
  file: File,
): Promise<UploadImageResult> => {
  try {
    const data = await uploadImageToMicroCMS(file)

    if (!data?.url) {
      return {
        success: false,
        error: '画像URLの取得に失敗しました',
      }
    }

    return {
      success: true,
      url: data.url,
    }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'アップロードに失敗しました',
    }
  }
}
