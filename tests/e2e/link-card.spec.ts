import { expect, test } from '@playwright/test'

test.describe('Link Card E2E', () => {
  test('エディタにYouTubeのURLを貼り付けた際、リンクカードが正しく生成されること', async ({ page, context }) => {
    // クリップボードへのアクセス権限を付与
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    const youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

    // 1. ブログ作成画面へ移動
    await page.goto('/create-blog')

    // 2. エディタにフォーカス
    const editor = page.locator('.tiptap.ProseMirror')
    await editor.click()
    await editor.focus()

    // クリップボードにURLを書き込み、キーボードショートカットで貼り付け
    await page.evaluate((url) => {
      return navigator.clipboard.writeText(url)
    }, youtubeUrl)

    // OSに応じて修飾キーを使い分け
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control'
    await page.keyboard.press(`${modifier}+v`)

    // 3. リンクカードが生成され、メタデータが表示されることを確認
    try {
      // エディタ上では NodeView (Reactコンポーネント) として描画されるため、
      // 拡張機能が生成するクラス名 .node-linkCard でコンテナを探します
      const linkCardContainer = page.locator('.node-linkCard')
      await expect(linkCardContainer).toBeVisible({ timeout: 15000 })

      // コンテナ内の <a> タグを検証
      const linkCard = linkCardContainer.locator('a')
      await expect(linkCard).toHaveAttribute('href', youtubeUrl)

      // YouTube API経由で取得されたタイトル (h4タグ) を確認
      const cardTitle = linkCard.locator('h4')
      await expect(cardTitle).toContainText('Rick Astley', { timeout: 10000 })
      
      const titleText = await cardTitle.innerText()
      console.log('Detected Link Card Title:', titleText)
      
      // 画像 (imgタグ) が表示されているか確認
      const cardImage = linkCard.locator('img')
      await expect(cardImage).toBeVisible()
      await expect(cardImage).toHaveAttribute('src', /ytimg\.com/)
    } catch (e) {
      // 失敗した場合はスクリーンショットを撮り、エディタのHTML構造を出力してデバッグしやすくします
      await page.screenshot({ path: 'test-results/link-card-error.png' })
      const content = await page.locator('.tiptap.ProseMirror').innerHTML()
      console.log('Editor Content on Failure:', content)
      throw e
    }
  })
})
