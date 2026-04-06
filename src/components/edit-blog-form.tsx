'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Form } from '@/src/components/ui/form'
import { useToast } from '@/src/hooks/use-toast'
import type { CategoryType } from '@/src/types/category'
import type { PostType } from '@/src/types/post'
import { editBlog, uploadImage } from '../app/actions/edit-blog'

import { BlogPostFormFields } from './blog-form/blog-post-form-fields'
import {
  type BlogPostFormValues,
  blogPostFormSchema,
  MAX_BLOG_IMAGE_BYTES,
} from './blog-form/blog-post-form-schema'
import Container from './container'

export default function EditBlogForm({
  post,
  categories,
}: {
  post: PostType
  categories: CategoryType[]
}) {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: post.title,
      slug: post.slug,
      _content: post._content,
      eyecatch: post.eyecatch?.url ?? '',
      categories: post.categories.map((c) => c.id),
      publishDate: post.publishDate
        ? new Date(post.publishDate).toISOString()
        : '',
    },
  })

  const extractFileNameFromUrl = (url: string) => {
    return url.split('/').pop() || ''
  }

  const handleSubmit = async (formData: BlogPostFormValues) => {
    try {
      const fileInput = fileInputRef.current
      const file = fileInput?.files?.[0]

      let imageUrl = formData.eyecatch
      if (file) {
        imageUrl = await uploadImage(file)
        const fileName = file.name
        form.setValue('eyecatch', fileName)
      } else if (imageUrl) {
        const fileName = extractFileNameFromUrl(imageUrl)
        form.setValue('eyecatch', fileName)
      }

      const response = await editBlog(post, formData, imageUrl)

      if (response) {
        toast({
          title: '投稿に成功しました！',
        })
        router.push('/')
      }
    } catch (error: unknown) {
      console.error('エラー', error)
    }
  }

  const [previewImage, setPreviewImage] = useState<string | null>(
    post.eyecatch?.url || null,
  )

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

  const previewW = post.eyecatch?.width || 500
  const previewH = post.eyecatch?.height || 500

  return (
    <div className="m-4">
      <Container large={false}>
        <h1 className="text-center">ブログ編集画面</h1>
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
              previewImageWidth={previewW}
              previewImageHeight={previewH}
              onDateChange={handleDateChange}
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
              submitLabel="更新"
            />
          </form>
        </Form>
      </Container>
    </div>
  )
}
