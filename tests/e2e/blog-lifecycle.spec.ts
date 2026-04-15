import { test, expect } from '@playwright/test'

test.describe('Blog Lifecycle (Full)', () => {
  const timestamp = Date.now()
  const testTitle = `E2E Lifecycle ${timestamp}`
  const updatedTitle = `E2E Updated ${timestamp}`
  const testSlug = `lifecycle-${timestamp}`
  const testContent = `Testing lifecycle at ${new Date().toISOString()}`

  test('should create, edit, and delete a blog post, verifying all pages', async ({
    page,
  }) => {
    // --- 1. CREATE ---
    await page.goto('/create-blog')
    await page.getByLabel('タイトル').fill(testTitle)
    await page.getByLabel('スラッグ').fill(testSlug)
    await page.locator('.tiptap.ProseMirror').fill(testContent)
    await page.getByPlaceholder('日付を選択').fill('2026/04/13 12:00')
    await page.keyboard.press('Enter')
    await page.locator('button[role="checkbox"]').first().click()
    await page.getByRole('button', { name: '公開' }).click()

    // Verify redirect to Home and presence on Home
    await page.waitForURL('/', { timeout: 10000 })
    await expect(page.getByRole('link', { name: testTitle })).toBeVisible({
      timeout: 10000,
    })

    try {
      // --- 2. EDIT ---
      // Go to detail page then to edit
      await page.goto(`/blog/${testSlug}`)
      await page.getByRole('link', { name: 'Edit' }).click()

      // Update title
      await page.getByLabel('タイトル').fill(updatedTitle)
      await page.getByRole('button', { name: '更新' }).click()

      // After editing, the app redirects to the Home page ('/')
      await page.waitForURL('/', { timeout: 10000 })
      await expect(page.getByRole('link', { name: updatedTitle })).toBeVisible({
        timeout: 10000,
      })

      // Go back to the detail page to verify the content
      await page.getByRole('link', { name: updatedTitle }).click()
      await expect(page.locator('h1')).toHaveText(updatedTitle)

      // Verify update on Blog list page
      await page.goto('/blog')
      await expect(page.getByRole('link', { name: updatedTitle })).toBeVisible()
    } finally {
      // --- 3. DELETE (Cleanup) ---
      // Navigate directly to the post detail page
      await page.goto(`/blog/${testSlug}`)

      const deleteButton = page.getByRole('button', { name: 'Delete' })
      try {
        // Wait for the button to ensure it's rendered
        await deleteButton.waitFor({ state: 'visible', timeout: 5000 })
        await deleteButton.click()
        await page.getByRole('button', { name: 'はい' }).click()

        // Verify redirect to Home after deletion
        await page.waitForURL('/', { timeout: 10000 })
      } catch (e) {
        // If the button never appeared, the post might not have been created or was already deleted
        console.log('Cleanup: Delete button not found or already deleted')
      }

      // Final verification that it's gone from all lists
      // Use a slightly longer timeout for the "not visible" check to account for cache propagation
      await expect(
        page.getByRole('link', { name: updatedTitle }),
      ).not.toBeVisible({ timeout: 20000 })
      await expect(page.getByRole('link', { name: testTitle })).not.toBeVisible(
        { timeout: 20000 },
      )

      await page.goto('/blog')
      await expect(
        page.getByRole('link', { name: updatedTitle }),
      ).not.toBeVisible({ timeout: 20000 })
    }
  })
})
