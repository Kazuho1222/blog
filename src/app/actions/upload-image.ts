'use server'

import { uploadImageToMicroCMS } from '@/src/lib/api/microcms'
import { checkAdmin } from '@/src/lib/auth-check'

export type UploadImageActionResult =
  | { success: true; url: string }
  | { success: false; error: string }

export async function uploadImageAction(
  file: File,
): Promise<UploadImageActionResult> {
  const userId = await checkAdmin()
  if (!userId) {
    return { success: false, error: '管理者権限が必要です' }
  }

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
