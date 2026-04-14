'use client'

import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import type React from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { Button } from '@/src/components/ui/button'
import { Checkbox } from '@/src/components/ui/checkbox'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import InputDateTime from '@/src/components/ui/inputdatetime'
import { Label } from '@/src/components/ui/label'

import type { BlogPostFormValues } from './blog-post-form-schema'

const TiptapEditor = dynamic(() => import('../tiptapeditor'), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>,
})

export type BlogFormCategory = { id: string; slug: string }

type BlogPostFormFieldsProps = {
  form: UseFormReturn<BlogPostFormValues>
  categories: BlogFormCategory[]
  fileInputRef: React.RefObject<HTMLInputElement | null>
  previewImage: string | null
  previewImageWidth: number
  previewImageHeight: number
  onDateChange: (date: Date | null) => void
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
  submitLabel: string
  isSubmitting?: boolean
}

function publishDateAsPickerValue(publishDate: string): Date | null {
  if (!publishDate || Number.isNaN(Date.parse(publishDate))) {
    return null
  }
  return new Date(publishDate)
}

export function BlogPostFormFields({
  form,
  categories,
  fileInputRef,
  previewImage,
  previewImageWidth,
  previewImageHeight,
  onDateChange,
  onImageChange,
  onRemoveImage,
  submitLabel,
  isSubmitting = false,
}: BlogPostFormFieldsProps) {
  const handleRemoveClick = () => {
    if (previewImage?.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage)
    }
    onRemoveImage()
  }

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>タイトル</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>スラッグ</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="publishDate"
        render={({ field }) => (
          <FormItem className="relative mt-4">
            <FormLabel className="mt-4 flex">投稿日</FormLabel>
            <InputDateTime
              selectedDate={publishDateAsPickerValue(field.value)}
              onChange={(date) => {
                const isoString = date ? date.toISOString() : ''
                field.onChange(isoString)
                onDateChange(date)
              }}
            />
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="_content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>内容</FormLabel>
            <FormControl>
              <TiptapEditor content={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="eyecatch"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div>
                <Label htmlFor="eyecatch">アイキャッチ</Label>
                <FormDescription>ファイルサイズは最大5MBです</FormDescription>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    onImageChange(e)
                    // ファイル名は React Hook Form にも通知
                    const file = e.target.files?.[0]
                    field.onChange(file ? file.name : '')
                  }}
                  ref={fileInputRef}
                />
                {previewImage ? (
                  <div className="relative mt-4">
                    <Label className="mb-2 flex">プレビュー</Label>
                    <div className="group relative inline-block hover:opacity-80">
                      <Image
                        src={previewImage}
                        alt="アイキャッチプレビュー"
                        className="h-auto max-w-xs"
                        width={previewImageWidth}
                        height={previewImageHeight}
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 transform cursor-pointer rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        onClick={() => {
                          handleRemoveClick()
                          field.onChange('')
                        }}
                        aria-label="画像を削除"
                      >
                        <FontAwesomeIcon icon={faCircleXmark} size="2x" />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="categories"
        render={({ field }) => (
          <FormItem>
            <FormLabel> カテゴリ</FormLabel>
            {categories.map((category) => (
              <FormItem key={category.id}>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value.includes(category.id)}
                      onCheckedChange={(checked) => {
                        const selectedCategories = [...field.value]
                        if (checked === true) {
                          field.onChange([...selectedCategories, category.id])
                        } else {
                          field.onChange(
                            selectedCategories.filter(
                              (id) => id !== category.id,
                            ),
                          )
                        }
                      }}
                    />
                    <Label>{category.slug}</Label>
                  </div>
                </FormControl>
              </FormItem>
            ))}
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
      <Button type="submit" className="hover:bg-red-500" loading={isSubmitting}>
        {submitLabel}
      </Button>
    </>
  )
}
