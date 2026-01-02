import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "ファイルが指定されていません" },
        { status: 400 }
      );
    }

    const apiKey = process.env.MICROCMS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "APIキーが設定されていません" },
        { status: 500 }
      );
    }

    // 新しいFormDataを作成してファイルを追加
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const response = await fetch(
      "https://kazuho-blog.microcms-management.io/api/v1/media",
      {
        method: "POST",
        headers: {
          "X-MICROCMS-API-KEY": apiKey,
        },
        body: uploadFormData,
      }
    );

    if (!response.ok) {
      const statusText = response.statusText || "Unknown error";
      return NextResponse.json(
        {
          success: false,
          error: `画像のアップロードに失敗しました (${response.status}): ${statusText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const imageUrl = data?.url || data?.id;
    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json(
        { success: false, error: "画像URLが取得できませんでした" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, url: String(imageUrl) });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message.substring(0, 200)
        : "予期しないエラーが発生しました";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

