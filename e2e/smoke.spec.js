const { test, expect } = require('@playwright/test');

test.describe('FlyAjwa Smoke Tests', () => {
  test('should load the homepage successfully', async ({ page }) => {
    // Go to homepage
    await page.goto('/');
    
    // Check page title contains FlyAjwa
    const title = await page.title();
    expect(title.toLowerCase()).toContain('flyajwa');
  });

  test('should load the login page', async ({ page }) => {
    await page.goto('/login');
    // Login form should be present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});
