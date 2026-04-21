import { expect, type Page, test } from '@playwright/test'

test.describe('ブログの表示順', () => {
  const timestamp = Date.now()
  const now = new Date()
  const yyyymmdd = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`
  const sameDate = `${yyyymmdd} 12:00`

  interface BlogPost {
    title: string
    slug: string
    content: string
  }

  const postA: BlogPost = {
    title: `Order Test A ${timestamp}`,
    slug: `order-test-a-${timestamp}`,
    content: 'First created post with same date',
  }

  const postB: BlogPost = {
    title: `Order Test B ${timestamp}`,
    slug: `order-test-b-${timestamp}`,
    content: 'Second created post with same date',
  }

  async function createPost(page: Page, post: BlogPost, date: string) {
    await page.goto('/create-blog')
    await page.getByLabel('タイトル').fill(post.title)
    await page.getByLabel('スラッグ').fill(post.slug)
    await page.locator('.tiptap.ProseMirror').fill(post.content)
    await page.getByPlaceholder('日付を選択').fill(date)
    await page.keyboard.press('Enter')
    await page.locator('button[role="checkbox"]').first().click()
    await page.getByRole('button', { name: '公開' }).click()
    await page.waitForURL('/', { timeout: 10000 })
  }

  async function deletePost(page: Page, slug: string, title: string) {
    await page.goto(`/blog/${slug}`)
    await page.getByRole('button', { name: 'Delete' }).click()
    await page.getByRole('button', { name: 'はい' }).click()
    await page.waitForURL('/', { timeout: 10000 })
    // Verify it's gone
    await page.goto('/blog')
    await expect(page.getByRole('link', { name: title })).not.toBeVisible({
      timeout: 10000,
    })
  }

  test('公開日が同じ場合、作成日時が新しい記事が先に表示されること', async ({
    page,
  }) => {
    // 1. Create Post A
    await createPost(page, postA, sameDate)

    // Wait a bit to ensure createdAt difference in microCMS
    await page.waitForTimeout(2000)

    // 2. Create Post B (same publishDate)
    await createPost(page, postB, sameDate)

    // 3. Verify ordering on /blog page
    await page.goto('/blog')

    // Get all article titles
    const titles = page.locator('article h2')

    // Find indexes of Post A and Post B in the list
    const allTitles = await titles.allTextContents()
    const indexA = allTitles.indexOf(postA.title)
    const indexB = allTitles.indexOf(postB.title)

    console.log(`Found titles: A at ${indexA}, B at ${indexB}`)

    expect(indexA).not.toBe(-1)
    expect(indexB).not.toBe(-1)

    // Post B should be before Post A (index should be smaller)
    expect(indexB).toBeLessThan(indexA)

    // 4. Cleanup
    await deletePost(page, postB.slug, postB.title)
    await deletePost(page, postA.slug, postA.title)
  })

  test('公開日が同じで時刻が異なる場合、時刻が遅い記事が先に表示されること', async ({
    page,
  }) => {
    const postC = {
      title: `Time Test C ${timestamp}`,
      slug: `time-test-c-${timestamp}`,
      content: 'Early time post',
    }
    const postD = {
      title: `Time Test D ${timestamp}`,
      slug: `time-test-d-${timestamp}`,
      content: 'Later time post',
    }

    // 1. Create Post C (12:00)
    await createPost(page, postC, `${yyyymmdd} 12:00`)

    // 2. Create Post D (13:00)
    await createPost(page, postD, `${yyyymmdd} 13:00`)

    // 3. Verify ordering
    await page.goto('/blog')
    const allTitles = await page.locator('article h2').allTextContents()

    const indexC = allTitles.indexOf(postC.title)
    const indexD = allTitles.indexOf(postD.title)

    console.log(`Found titles: C at ${indexC}, D at ${indexD}`)

    expect(indexC).not.toBe(-1)
    expect(indexD).not.toBe(-1)

    // Post D (13:00) should be before Post C (12:00)
    expect(indexD).toBeLessThan(indexC)

    // 4. Cleanup
    await deletePost(page, postD.slug, postD.title)
    await deletePost(page, postC.slug, postC.title)
  })
})
