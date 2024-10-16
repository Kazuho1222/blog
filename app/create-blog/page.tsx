import CreateBlog from "@/app/components/create-blog"

export default async function CreatePage() {
  const initialDate = new Date().toISOString()
  return <CreateBlog initialDate={initialDate} />
}