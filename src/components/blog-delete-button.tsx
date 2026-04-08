'use client'

import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/components/ui/alert-dialog'
import { Button } from '@/src/components/ui/button'
import { useToast } from '@/src/hooks/use-toast'
import { deleteBlogAction } from '../app/actions/delete-blog'

const BlogDeleteButton = ({ blogId }: { blogId: string }) => {
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      const response = await deleteBlogAction(blogId)

      if (response.success) {
        toast({
          title: '投稿を削除しました！',
        })
        router.push('/')
        return
      }
      console.error(response.error)
      toast({
        title: '削除に失敗しました',
        variant: 'destructive',
      })
    } catch (error: unknown) {
      console.error('エラー', error)
      toast({
        title: '削除に失敗しました',
        variant: 'destructive',
      })
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="hover:bg-red-500">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>投稿を削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            削除すると元に戻せません。
            <br />
            本当に削除しますか？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>いいえ</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>はい</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default BlogDeleteButton
