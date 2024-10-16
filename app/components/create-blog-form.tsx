"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import InputDateTime from "@/components/ui/inputdatetime"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import React, { useRef, useState } from "react"
import { useForm } from 'react-hook-form'
import { z } from "zod"
import Container from "./container"

const pattern = /^[\u0021-\u007e]+$/;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const FormSchema = z.object({
  title: z.string().min(1, {
    message: "必須項目です",
  }),
  slug: z.string().min(1, {
    message: "必須項目です",
  }).regex(pattern, "半角英数字で入力してください"),
  publishDate: z.string().min(1, {
    message: "必須項目です",
  }),
  content: z.string().min(1, {
    message: "必須項目です",
  }),
  eyecatch: z.string().default(""),
  categories: z.array(z.string()).min(1, {
    message: "カテゴリを1つ以上選択してください",
  }),
})

export default function CreateBlogForm({ categories }: { initialDate: string, categories: { slug: string, id: string }[] }) {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      eyecatch: "",
      categories: [],
      publishDate: "",
    },
  })

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('https://kazuho-blog.microcms-management.io/api/v1/media', {
      method: 'POST',
      headers: {
        'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY || '',
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('画像のアップロードに失敗しました')
    }

    const data = await response.json()
    return data.url
  }

  const createBlog = async (formData: any, imageUrl: string) => {
    const response = await fetch('https://kazuho-blog.microcms.io/api/v1/blogs', {
      method: 'POST',
      headers: {
        'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        eyecatch: imageUrl,
      }),
    })

    if (!response.ok) {
      throw new Error('ブログの投稿に失敗しました')
    }

    const data = await response.json()
    return data
  }

  const handleSubmit = async (formData: any) => {
    try {
      const fileInput = fileInputRef.current
      const file = fileInput?.files?.[0]

      let imageUrl = ''
      if (file) {
        imageUrl = await uploadImage(file)
      }

      const response = await createBlog(formData, imageUrl)

      if (response) {
        console.log('投稿に成功しました！')
        router.push('/')
        router.refresh
        toast({
          title: '投稿に成功しました！'
        })

      }

    } catch (error) {
      console.error('エラー', error)
    }
  }

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
    const isoString = date ? date.toISOString() : ""
    form.setValue("publishDate", isoString)
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        alert("ファイルサイズは最大5MBです")
        form.setValue("eyecatch", "")
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        const imageUrl = URL.createObjectURL(file)
        setPreviewImage(imageUrl)
        form.setValue("eyecatch", file.name)
      }
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    form.setValue("eyecatch", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="m-4">
      <Container large={false}>
        <h1 className="text-center">新規ブログ作成</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイトル</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publishDate"
              render={() => (
                <FormItem className="relative mt-4">
                  <FormLabel className="flex mt-4">投稿日</FormLabel>
                  <InputDateTime
                    selectedDate={selectedDate}
                    onChange={handleDateChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>内容</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
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
                      <Input id="eyecatch" type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
                      {previewImage && (
                        <div className="relative mt-4">
                          <Label className="flex mb-2">プレビュー</Label>
                          <div className="relative inline-block group">
                            <img src={previewImage} alt="アイキャッチプレビュー" className="max-w-xs h-auto" />
                            <button
                              type="button"
                              className="opacity-0 group-hover:opacity-100 absolute top-1 right-2 cursor-pointer transition-opacity duration-300" onClick={handleRemoveImage}>
                              <FontAwesomeIcon icon={faCircleXmark} size="2x" style={{ display: "hidden" }} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
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
                            checked={form.watch("categories").includes(category.slug)}
                            onCheckedChange={(checked) => {
                              const selectedCategories = form.getValues("categories")
                              if (checked) {
                                form.setValue("categories", [...selectedCategories, category.slug])
                              } else {
                                form.setValue("categories", selectedCategories.filter((slug) => slug !== category.slug))
                              }
                            }}
                          />
                          <Label>{category.slug}</Label>
                        </div>
                      </FormControl>
                    </FormItem>
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='hover:bg-red-500'>送信</Button>
          </form>
        </Form >
      </Container>
    </div>
  )
}
