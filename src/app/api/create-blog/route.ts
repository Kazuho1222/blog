import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { content, ...rest } = body
    const newBody = {
      ...rest,
      _content: content,
    }
    const apiKey = process.env.MICROCMS_API_KEY
    const endpoint = 'https://kazuho-blog.microcms.io/api/v1/blogs'

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MICROCMS-API-KEY': apiKey as string,
      },
      body: JSON.stringify(newBody),
    })

    if (!res.ok) {
      throw new Error(`MicroCMS Error: ${res.statusText}`)
    }

    return NextResponse.json(await res.json())
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
