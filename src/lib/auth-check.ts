import { auth, currentUser } from '@clerk/nextjs/server'

/**
 * 現在のユーザーが管理者（許可されたメールアドレス）であるかチェックする
 * @returns 管理者であれば userId、そうでなければ null
 */
export async function checkAdmin() {
  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress
  const allowedEmail = process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAIL

  if (email && email === allowedEmail) {
    return userId
  }

  return null
}
