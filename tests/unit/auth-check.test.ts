import { auth, currentUser } from '@clerk/nextjs/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { checkAdmin } from '@/src/lib/auth-check'

type AuthReturn = Awaited<ReturnType<typeof auth>>
type CurrentUserReturn = Awaited<ReturnType<typeof currentUser>>
// Clerkのモック化
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}))

describe('checkAdmin', () => {
  const ADMIN_EMAIL = 'admin@example.com'

  beforeEach(() => {
    vi.resetAllMocks()
    process.env.ALLOWED_ADMIN_EMAIL = ADMIN_EMAIL
  })

  it('未ログインの場合は null を返すこと', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as AuthReturn)

    const result = await checkAdmin()
    expect(result).toBeNull()
  })

  it('ログインしていてもメールアドレスが管理者でない場合は null を返すこと', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as AuthReturn)
    vi.mocked(currentUser).mockResolvedValue({
      emailAddresses: [{ emailAddress: 'other@example.com' }],
    } as unknown as CurrentUserReturn)

    const result = await checkAdmin()
    expect(result).toBeNull()
  })

  it('管理者メールアドレスでログインしている場合は userId を返すこと', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'admin_123' } as AuthReturn)
    vi.mocked(currentUser).mockResolvedValue({
      emailAddresses: [{ emailAddress: ADMIN_EMAIL }],
    } as unknown as CurrentUserReturn)

    const result = await checkAdmin()
    expect(result).toBe('admin_123')
  })
})
