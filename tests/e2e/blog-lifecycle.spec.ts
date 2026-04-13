import { test, expect } from '@playwright/test';

test.describe('Blog Lifecycle', () => {
  const timestamp = Date.now();
  const testTitle = `E2E Test Post ${timestamp}`;
  const testSlug = `e2e-test-post-${timestamp}`;
  const testContent = `This is a test post created by Playwright at ${new Date().toISOString()}`;

  test('should create, display, and delete a blog post', async ({ page }) => {
    // 1. Create a new blog post
    await page.goto('/create-blog');
    
    // Fill in the form
    await page.getByLabel('タイトル').fill(testTitle);
    await page.getByLabel('スラッグ').fill(testSlug);
    
    // Fill in the content (Tiptap editor)
    // Tiptap is a contenteditable div
    const editor = page.locator('.tiptap.ProseMirror');
    await editor.fill(testContent);

    // Fill in the post date
    await page.getByPlaceholder('日付を選択').fill('2026/04/13 12:00');
    // Press Enter to close the date picker if it stays open
    await page.keyboard.press('Enter');

    // Select a category (required by schema)
    const categoryCheckbox = page.locator('button[role="checkbox"]').first();
    await categoryCheckbox.click();

    // Submit the form
    await page.getByRole('button', { name: '送信' }).click();

    // Wait for redirection to home page
    await expect(page).toHaveURL('/', { timeout: 10000 });
    
    // 2. Verify it appears in the blog list
    await page.goto('/blog');
    
    // Find the specific post by title
    const postLink = page.getByRole('link', { name: testTitle });
    await expect(postLink).toBeVisible();

    // 3. Verify the detail page
    await postLink.click();
    await expect(page).toHaveURL(new RegExp(`/blog/${testSlug}`));
    await expect(page.locator('h1')).toHaveText(testTitle);
    await expect(page.locator('article')).toContainText(testContent);

    // 4. Delete the post
    // Assuming there's a delete button as seen in Post component
    const deleteButton = page.getByRole('button', { name: 'Delete' });
    await deleteButton.click();

    // Handle the alert dialog
    const confirmButton = page.getByRole('button', { name: 'はい' });
    await confirmButton.click();

    // Should redirect back to home or blog list after deletion
    // Looking at delete-blog.ts, it doesn't redirect itself, but components might
    // Let's check the BlogDeleteButton component if possible, but for now wait for redirection
    await page.waitForURL('/');

    // 5. Verify it's gone from the list
    await page.goto('/blog');
    await expect(page.locator('body')).not.toContainText(testTitle);
  });
});
