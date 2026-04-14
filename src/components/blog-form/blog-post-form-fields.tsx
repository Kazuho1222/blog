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
        render={() => (
          <FormItem className="relative mt-4">
            <FormLabel className="mt-4 flex">投稿日</FormLabel>
            <InputDateTime
              selectedDate={publishDateAsPickerValue(form.watch('publishDate'))}
              onChange={onDateChange}
            />
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="_content"
        render={() => (
          <FormItem>
            <FormLabel>内容</FormLabel>
            <FormControl>
              <TiptapEditor
                content={form.watch('_content')}
                onChange={(val) => form.setValue('_content', val)}
              />
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="eyecatch"
        render={() => (
          <FormItem>
            <FormControl>
              <div>
                <Label htmlFor="eyecatch">アイキャッチ</Label>
                <FormDescription>ファイルサイズは最大5MBです</FormDescription>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
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
                        onClick={handleRemoveClick}
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
        render={() => (
          <FormItem>
            <FormLabel> カテゴリ</FormLabel>
            {categories.map((category) => (
              <FormItem key={category.id}>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={form.watch('categories').includes(category.id)}
                      onCheckedChange={(checked) => {
                        const selectedCategories = form.getValues('categories')
                        if (checked === true) {
                          form.setValue('categories', [
                            ...selectedCategories,
                            category.id,
                          ])
                        } else {
                          form.setValue(
                            'categories',
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
