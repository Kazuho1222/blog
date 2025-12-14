import { getAllCategories } from '../lib/api'
import CreateBlogForm from './create-blog-form'

export default async function CreateBlog({
  initialDate,
}: {
  initialDate: string
}) {
  const categories = await getAllCategories()

  if (!categories) {
    return <div>カテゴリが見つかりません。</div>
  }

  return <CreateBlogForm initialDate={initialDate} categories={categories} />
}
