import EditBlogForm from "@/app/components/edit-blog-form";
import { getAllCategories, getPostBySlug } from "../../lib/api";

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const post = await getPostBySlug(params.id)
  const categories = await getAllCategories()

  if (!post) {
    return <div>ブログ記事が見つかりません。</div>
  }

  if (!categories) {
    return <div>カテゴリが見つかりません。</div>
  }

  return <EditBlogForm post={post} categories={categories} />
}

export const revalidate = 0