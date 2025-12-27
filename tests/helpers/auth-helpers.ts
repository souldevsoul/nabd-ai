import { Page } from '@playwright/test';

/**
 * Helper function to login as a regular user
 * Note: You'll need to set up test users in your database
 * and update these credentials accordingly
 */
export async function loginAsUser(
  page: Page,
  email: string = 'test.buyer@vertex.test',
  password: string = 'testpassword123'
): Promise<void> {
  await page.goto('/login');

  // Fill login form
  await page.getByPlaceholder(/executive@company\.com/i).fill(email);
  await page.getByPlaceholder(/••••••••/i).fill(password);

  // Submit form
  await page.getByRole('button', { name: /Enter/i }).click();

  // Wait for redirect to dashboard
  await page.waitForURL(/dashboard/, { timeout: 10000 });
}

/**
 * Helper function to login as an executor
 * Note: You'll need to set up test executor users
 */
export async function loginAsExecutor(
  page: Page,
  email: string = 'test.specialist@vertex.test',
  password: string = 'testpassword123'
): Promise<void> {
  await page.goto('/login');

  // Fill login form
  await page.getByPlaceholder(/executive@company\.com/i).fill(email);
  await page.getByPlaceholder(/••••••••/i).fill(password);

  // Submit form
  await page.getByRole('button', { name: /Enter/i }).click();

  // Wait for redirect
  await page.waitForURL(/executor|dashboard/, { timeout: 10000 });
}

/**
 * Helper function to logout
 */
export async function logout(page: Page): Promise<void> {
  // Look for logout button (might be in a menu/dropdown)
  const logoutButton = page.getByRole('button', { name: /logout|sign out/i });

  if (await logoutButton.isVisible()) {
    await logoutButton.click();
  } else {
    // Might be in a dropdown menu
    const menuButton = page.getByRole('button', { name: /menu|account|profile/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.getByRole('button', { name: /logout|sign out/i }).click();
    }
  }

  // Wait for redirect to home or login
  await page.waitForURL(/\/$|login/, { timeout: 5000 });
}

/**
 * Helper to check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  // Navigate to a protected route and see if we get redirected
  const currentUrl = page.url();
  await page.goto('/dashboard');

  const isAuth = !page.url().includes('login') && !page.url().includes('signin');

  // Go back to original URL
  await page.goto(currentUrl);

  return isAuth;
}
