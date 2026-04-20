import { notFound } from 'next/navigation'
import CreateBlog from '@/src/components/create-blog'
import { checkAdmin } from '@/src/lib/auth-check'

export default async function CreatePage() {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    notFound()
  }

  const initialDate = new Date().toISOString()
  return <CreateBlog initialDate={initialDate} />
}
