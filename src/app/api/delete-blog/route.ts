import { NextResponse } from 'next/server'

export async function DELETE(req: Request) {
	try {
		const { id } = await req.json()

		if (!id) {
			return NextResponse.json(
				{ error: 'IDが指定されていません' },
				{ status: 400 },
			)
		}

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
	} catch (_error) {
		return NextResponse.json(
			{ error: 'サーバーエラーが発生しました' },
			{ status: 500 },
		)
	}
}
