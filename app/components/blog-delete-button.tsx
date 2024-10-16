'use client'

import { AlertDialogAction, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialog, AlertDialogCancel, AlertDialogContent } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

const BlogDeleteButton = async ({ blogId }: { blogId: string }) => {
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      const res = await fetch('/api/delete-blog', {
        method: "DELETE",
        body: JSON.stringify({ id: blogId }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error(errorData.error || "削除に失敗しました")
        return
      }

      router.push('/')
      router.refresh
      toast({
        title: '投稿を削除しました！'
      })

    } catch (error) {
      console.error("サーバーエラーが発生しました")
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>投稿を削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>削除すると元に戻せません。<br />本当に削除しますか？</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>いいえ</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} >はい</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default BlogDeleteButton