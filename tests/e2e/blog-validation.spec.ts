import { expect, test } from '@playwright/test'

test.describe('Blog Validation and Button States', () => {
  test('未入力の状態で送信しようとした際、バリデーションエラーが表示されること', async ({ page }) => {
    // 1. ブログ作成画面へ移動
    await page.goto('/create-blog')

    // 2. 何も入力せずに公開ボタンをクリック
    const submitButton = page.getByRole('button', { name: '公開' })
    await submitButton.click()

    // 3. エラーメッセージが表示されていることを確認
    // 複数のフィールドで「必須項目です」が表示されるため、少なくとも1つが見えることを確認
    await expect(page.locator('text=必須項目です').first()).toBeVisible()
    await expect(page.locator('text=カテゴリを1つ以上選択してください')).toBeVisible()
  })

  test('送信中、ボタンが「送信中...」に切り替わり、Disabled状態になること', async ({ page }) => {
    // 1. 必要な項目を入力
    const timestamp = Date.now()
    const title = `Validation Test ${timestamp}`
    const slug = `val-test-${timestamp}`
    await page.goto('/create-blog')
    await page.getByLabel('タイトル').fill(title)
    await page.getByLabel('スラッグ').fill(slug)
    await page.locator('.tiptap.ProseMirror').fill('Valid Content')
    
    const now = new Date()
    const formattedDate = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    await page.getByPlaceholder('日付を選択').fill(formattedDate)
    await page.keyboard.press('Enter')
    await page.locator('button[role="checkbox"]').first().click()

    // 2. 公開ボタンをクリック
    const submitButton = page.getByRole('button', { name: '公開' })
    await submitButton.click()

    // 3. ボタンが「送信中...」になり、Disabled（操作不能）であることを確認
    await expect(page.getByRole('button', { name: '送信中...' })).toBeVisible()
    // shadcn/uiのButtonはloading時にaria-disabledやdisabled属性が付与されることを期待
    await expect(page.getByRole('button', { name: '送信中...' })).toBeDisabled()
    
    // 4. ホーム画面へ遷移することを確認
    await page.waitForURL('/', { timeout: 15000 })

    // --- クリーンアップ: 作成したテスト投稿を削除 ---
    await page.goto(`/blog/${slug}`)
    const deleteButton = page.getByRole('button', { name: 'Delete' })
    await deleteButton.waitFor({ state: 'visible', timeout: 5000 })
    await deleteButton.click()
    await page.getByRole('button', { name: 'はい' }).click()
    await page.waitForURL('/', { timeout: 10000 })
    
    // 削除されたことを確認
    await expect(page.getByRole('link', { name: title })).not.toBeVisible()
  })
})
