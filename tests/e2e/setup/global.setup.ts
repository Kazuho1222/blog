import { clerkSetup } from '@clerk/testing/playwright'

async function globalSetup() {
  // Clerk のテスト用 Frontend API の構成など、グローバルな初期化のみを行います
  await clerkSetup()
}

export default globalSetup
