import path from 'node:path'
import { clerkSetup } from '@clerk/testing/playwright'
import { expect, test as setup } from '@playwright/test'

const authFile = path.join(__dirname, '../../../playwright/.auth/user.json')

setup('authenticate as admin', async ({ page }) => {
  // 1. ホーム画面へ移動
  await page.goto('/')

  // 2. clerk.signIn をパラメータなしで呼び出す
  // これにより、環境変数の CLERK_SECRET_KEY を使用して
  // GoogleなどのOAuthをバイパスし、自動的にテストユーザーとしてログインします
  await clerkSetup()

  // 3. ログイン完了（UserButtonの表示）を待機
  await expect(page.getByTestId('user-button')).toBeVisible({ timeout: 25000 })

  // 4. 認証状態を保存
  await page.context().storageState({ path: authFile })
})
