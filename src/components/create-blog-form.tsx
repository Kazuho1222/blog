'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { createBlogAction } from '@/src/app/actions/create-blog'
import { Form } from '@/src/components/ui/form'
import { useToast } from '@/src/hooks/use-toast'
import { uploadImageAction } from '../app/actions/upload-image'
import { BlogPostFormFields } from './blog-form/blog-post-form-fields'
import {
  type BlogPostFormValues,
  blogPostFormSchema,
  MAX_BLOG_IMAGE_BYTES,
} from './blog-form/blog-post-form-schema'
import Container from './container'

export default function CreateBlogForm({
  categories,
}: {
  initialDate: string
  categories: { slug: string; id: string }[]
}) {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      _content: '',
      eyecatch: '',
      categories: [],
      publishDate: '',
    },
  })

  const handleSubmit = async (formData: BlogPostFormValues) => {
    try {
      const fileInput = fileInputRef.current
      const file = fileInput?.files?.[0]

      let imageUrl = ''
      if (file) {
        try {
          const uploadResult = await uploadImageAction(file)

          if (!uploadResult.success) {
            toast({
              title: '画像のアップロードに失敗しました',
              description: uploadResult.error,
              variant: 'destructive',
            })
            return
          }

          imageUrl = uploadResult.url
        } catch (uploadError) {
          console.error('画像アップロードエラー:', uploadError)
          toast({
            title: '画像のアップロードに失敗しました',
            description:
              uploadError instanceof Error
                ? uploadError.message
                : '予期しないエラーです',
            variant: 'destructive',
          })
          return
        }
      }

      try {
        const result = await createBlogAction({
          ...formData,
          eyecatch: imageUrl,
        })

        if (!result.success) {
          toast({
            title: 'エラーが発生しました',
            description: result.error,
            variant: 'destructive',
          })
          return
        }

        toast({
          title: '投稿に成功しました！',
        })
        router.push('/')
        router.refresh()
      } catch (createError) {
        console.error('ブログ作成エラー:', createError)
        toast({
          title: 'ブログの作成に失敗しました',
          description:
            createError instanceof Error
              ? createError.message
              : '予期しないエラーです',
          variant: 'destructive',
        })
      }
    } catch (error: unknown) {
      console.error('予期しないエラー:', error)
      toast({
        title: 'エラーが発生しました',
        description:
          error instanceof Error ? error.message : '予期しないエラーです',
        variant: 'destructive',
      })
    }
  }

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDateChange = (date: Date | null) => {
    const isoString = date ? date.toISOString() : ''
    form.setValue('publishDate', isoString)
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (file.size > MAX_BLOG_IMAGE_BYTES) {
        alert('ファイルサイズは最大5MBです')
        form.setValue('eyecatch', '')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        const imageUrl = URL.createObjectURL(file)
        setPreviewImage(imageUrl)
        form.setValue('eyecatch', file.name)
      }
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    form.setValue('eyecatch', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="m-4">
      <Container large={false}>
        <h1 className="text-center">新規ブログ作成</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <BlogPostFormFields
              form={form}
              categories={categories}
              fileInputRef={fileInputRef}
              previewImage={previewImage}
              previewImageWidth={500}
              previewImageHeight={500}
              onDateChange={handleDateChange}
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
              submitLabel="送信"
            />
          </form>
        </Form>
      </Container>
    </div>
  )
}
