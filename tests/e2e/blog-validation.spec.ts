import { test, expect } from '@playwright/test'

test.describe('Blog Form Validation', () => {
  test('should show validation errors and clear them as fields are filled', async ({
    page,
  }) => {
    // 1. 作成画面に移動
    await page.goto('/create-blog')

    // 2. 何も入力せずに「公開」ボタンをクリック
    await page.getByRole('button', { name: '公開' }).click()

    // 3. エラーメッセージが表示されていることを確認
    const requiredError = '必須項目です'
    const categoryError = 'カテゴリを1つ以上選択してください'

    // 各フィールドのエラーメッセージコンテナ (FormMessage) を特定する
    // form 直下の div (FormItem) の中から、特定のラベルを持つものを探し、その中の p タグを取得する
    const getErrorMessage = (label: string) =>
      page
        .locator('form > div')
        .filter({ has: page.getByText(label, { exact: true }) })
        .locator('p[id*="-form-item-message"]')

    // タイトル
    await expect(getErrorMessage('タイトル')).toHaveText(requiredError)
    // スラッグ
    await expect(getErrorMessage('スラッグ')).toHaveText(requiredError)
    // 投稿日
    await expect(getErrorMessage('投稿日')).toHaveText(requiredError)
    // 内容
    await expect(getErrorMessage('内容')).toHaveText(requiredError)
    // カテゴリ
    await expect(page.getByText(categoryError)).toBeVisible()

    // 4. タイトルを入力 -> エラーが消えることを確認
    await page.getByLabel('タイトル').fill('テストタイトル')
    await expect(getErrorMessage('タイトル')).not.toBeVisible()

    // 5. スラッグを入力 -> エラーが消えることを確認
    await page.getByLabel('スラッグ').fill('test-slug')
    await expect(getErrorMessage('スラッグ')).not.toBeVisible()

    // 6. 投稿日を選択 -> エラーが消えることを確認
    await page.getByPlaceholder('日付を選択').fill('2026/04/14 10:00')
    await page.keyboard.press('Enter')
    await expect(getErrorMessage('投稿日')).not.toBeVisible()

    // 7. 内容（Tiptap）を入力 -> エラーが消えることを確認
    await page.locator('.tiptap.ProseMirror').fill('テスト本文の内容です。')
    await expect(getErrorMessage('内容')).not.toBeVisible()

    // 8. カテゴリを選択 -> エラーが消えることを確認
    await page.locator('button[role="checkbox"]').first().click()
    await expect(page.getByText(categoryError)).not.toBeVisible()
  })
})
