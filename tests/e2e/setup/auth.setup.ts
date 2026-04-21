import path from 'node:path'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { expect, test as setup } from '@playwright/test'

const authFile = path.join(__dirname, '../../../playwright/.auth/user.json')

setup('authenticate as admin', async ({ page }) => {
  // 1. Clerk のバイパス用トークンをセット
  // これにより、Google認証の画面を通らずにログイン状態になります
  await setupClerkTestingToken({ page })

  // 2. ページにアクセス
  await page.goto('/')

  // 3. UserButtonが表示されることを確認（＝ログイン成功）
  // タイムアウトを少し長めに設定します
  await expect(page.getByTestId('user-button')).toBeVisible({ timeout: 15000 })

  // 4. 認証情報を保存
  await page.context().storageState({ path: authFile })
})
