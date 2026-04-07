import { MicroCMSImageSchema } from '../schemas/microcmsImage'

export const uploadImageToMicroCMS = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(
    'https://kazuho-blog.microcms-management.io/api/v1/media',
    {
      method: 'POST',
      headers: {
        'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY || '',
      },
      body: formData,
    },
  )

  if (!response.ok) {
    throw new Error('画像のアップロードに失敗しました')
  }

  return response.json()
}
