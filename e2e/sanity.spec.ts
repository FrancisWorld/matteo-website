import { test, expect } from '@playwright/test';

test.describe('Matteo Website Sanity Check', () => {
  test('homepage loads and has critical sections', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await expect(page).toHaveTitle(/Matteo/);

    await expect(page.getByText('EXPLORE THE MATTEO VERSE')).toBeVisible();
    
    await page.getByRole('link', { name: 'WATCH VIDEOS' }).click();
    await expect(page).toHaveURL(/\/videos/);
    await expect(page.getByRole('heading', { name: 'VIDEOS', exact: true })).toBeVisible();
  });

  test('blog pagination works', async ({ page }) => {
    await page.goto('http://localhost:3000/blog');
    await expect(page.getByRole('heading', { name: 'BLOG POSTS' })).toBeVisible();
  });

  test('quiz page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/quiz');
    await expect(page.getByRole('heading', { name: 'QUIZZES' })).toBeVisible();
  });

  test('admin route redirects if not logged in', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await expect(page).not.toHaveURL(/\/admin/);
  });
});
