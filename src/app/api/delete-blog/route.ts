import { NextResponse } from 'next/server'
import z from 'zod'

const DeleteSchema = z.object({
  id: z.string().min(1, 'IDが指定されていません'),
})

export async function DELETE(req: Request) {
  try {
    const body = DeleteSchema.parse(await req.json())
    const { id } = body
    const apiKey = process.env.MICROCMS_API_KEY
    const endpoint = `https://kazuho-blog.microcms.io/api/v1/blogs/${id}`

    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'X-MICROCMS-API-KEY': apiKey as string,
      },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: '削除に失敗しました' },
        { status: res.status },
      )
    }

    return NextResponse.json(
      { message: 'ブログが正常に削除されました' },
      { status: 200 },
    )
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? 'バリデーションエラー' },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 },
    )
  }
}
