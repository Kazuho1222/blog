import { expect, test } from '@playwright/test'

test.describe('Security E2E (Unauthenticated)', () => {
  test('未ログインユーザーはブログ作成ページにアクセスできないこと', async ({
    page,
  }) => {
    // 直接URLを叩く
    await page.goto('/create-blog')

    // ClerkのMiddlewareによりログイン画面に飛ばされるか、
    // あるいはページ内のcheckAdminにより404になることを期待
    // 現状の実装では 404 (notFound) になるはず
    console.log('Current URL:', page.url())
    const content = await page.textContent('body')
    console.log('Body content:', content?.substring(0, 100))
    await expect(page.locator('text=404')).toBeVisible()
  })

  test('未ログインユーザーはブログ編集ページにアクセスできないこと', async ({
    page,
  }) => {
    await page.goto('/edit-blog/test-slug')
    await expect(page.locator('text=404')).toBeVisible()
  })

  test('未ログインユーザーの記事詳細画面に管理用ボタンが表示されないこと', async ({
    page,
  }) => {
    // 既存のブログ記事へ移動 (slugは環境に合わせて調整が必要ですが、ここでは一般的なページを想定)
    await page.goto('/')
    const firstPost = page.locator('a[href^="/blog/"]').first()

    // Fail explicitly if no posts exist - security tests must actually run
    await expect(
      firstPost,
      'No blog posts found on home page - cannot verify security controls',
    ).toBeVisible()
    await firstPost.click()

    // 編集・削除ボタンが存在しないことを確認
    await expect(page.getByRole('button', { name: 'Edit' })).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible()
  })
})
