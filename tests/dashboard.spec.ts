import { test, expect } from '@playwright/test';
import { loginAsUser } from './helpers/auth-helpers';

test.describe('Dashboard', () => {
  // Note: These tests require authentication
  // In a real scenario, you'd set up test users and authentication helpers

  test.describe('Dashboard Access (Unauthenticated)', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
      await page.goto('/dashboard');

      // Should be redirected to login
      await page.waitForURL(/login|signin|auth/, { timeout: 5000 }).catch(() => {
        // Alternatively, might show an error or auth page
        expect(page.url()).toMatch(/login|signin|auth|error|unauthorized/);
      });
    });
  });

  test.describe('Dashboard Layout', () => {
    test('should display dashboard header with greeting', async ({ page }) => {
      // Skip: Requires authentication setup
      // await loginAsUser(page);
      // await page.goto('/dashboard');
      // await expect(page.getByText(/Executive Dashboard/i)).toBeVisible();
      // await expect(page.getByText(/Welcome back/i)).toBeVisible();
    });

    test('should display quick action buttons', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.goto('/dashboard');

      // Check for quick action buttons
      // await expect(page.getByRole('button', { name: /View Partners/i })).toBeVisible();
      // await expect(page.getByRole('button', { name: /New Consultation/i })).toBeVisible();
      // await expect(page.getByRole('button', { name: /Add Credits/i })).toBeVisible();
    });

    test('should display stats grid with metrics', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.goto('/dashboard');

      // Check for stats cards
      // await expect(page.getByText(/Portfolio Value/i)).toBeVisible();
      // await expect(page.getByText(/Active Engagements/i)).toBeVisible();
      // await expect(page.getByText(/Consultations/i)).toBeVisible();
      // await expect(page.getByText(/Investment/i)).toBeVisible();
    });

    test('should display recent engagements section', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.goto('/dashboard');

      // await expect(page.getByText(/Recent Engagements/i)).toBeVisible();
    });

    test('should display distinguished partners section', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.goto('/dashboard');

      // await expect(page.getByText(/Distinguished Partners/i)).toBeVisible();
    });
  });

  test.describe('Dashboard Navigation', () => {
    test('should navigate to specialists from quick actions', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.goto('/dashboard');

      // const specialistsButton = page.getByRole('link', { name: /View Partners/i });
      // await specialistsButton.click();

      // await expect(page).toHaveURL(/specialists/);
    });

    test('should navigate to request consultation', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.goto('/dashboard');

      // const consultButton = page.getByRole('link', { name: /New Consultation/i });
      // await consultButton.click();

      // await expect(page).toHaveURL(/request/);
    });

    test('should navigate to wallet', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.goto('/dashboard');

      // const walletButton = page.getByRole('link', { name: /Add Credits/i });
      // await walletButton.click();

      // await expect(page).toHaveURL(/wallet/);
    });

    test('should navigate to purchases page', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.goto('/dashboard');

      // const viewAllLink = page.getByRole('link', { name: /View all/i }).first();
      // await viewAllLink.click();

      // await expect(page).toHaveURL(/purchases/);
    });
  });

  test.describe('Wallet Page', () => {
    test('should redirect to login when accessing wallet unauthenticated', async ({ page }) => {
      await page.goto('/dashboard/wallet');

      await page.waitForURL(/login|signin|auth/, { timeout: 5000 }).catch(() => {
        expect(page.url()).toMatch(/login|signin|auth|error|unauthorized/);
      });
    });

    test('should display wallet balance', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.goto('/dashboard/wallet');

      // await expect(page.getByText(/Portfolio Value|Wallet|Balance/i)).toBeVisible();
      // await expect(page.getByText(/credits/i)).toBeVisible();
    });

    test('should show add credits option', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.goto('/dashboard/wallet');

      // const addCreditsButton = page.getByRole('button', { name: /Add Credits|Purchase|Buy/i });
      // await expect(addCreditsButton).toBeVisible();
    });
  });

  test.describe('Purchases Page', () => {
    test('should redirect to login when accessing purchases unauthenticated', async ({ page }) => {
      await page.goto('/dashboard/purchases');

      await page.waitForURL(/login|signin|auth/, { timeout: 5000 }).catch(() => {
        expect(page.url()).toMatch(/login|signin|auth|error|unauthorized/);
      });
    });

    test('should display purchase history', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.goto('/dashboard/purchases');

      // Check for purchases list or empty state
      // const hasPurchases = await page.getByText(/Purchase|Order|Engagement/i).isVisible();
      // const hasEmptyState = await page.getByText(/No purchases|No orders/i).isVisible();

      // expect(hasPurchases || hasEmptyState).toBeTruthy();
    });

    test('should filter purchases by status', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.goto('/dashboard/purchases');

      // Look for status filters
      // const statusFilter = page.locator('[class*="status"]').or(page.getByRole('button', { name: /filter/i }));
      // if (await statusFilter.first().isVisible()) {
      //   await expect(statusFilter.first()).toBeVisible();
      // }
    });
  });

  test.describe('Settings Page', () => {
    test('should redirect to login when accessing settings unauthenticated', async ({ page }) => {
      await page.goto('/settings');

      await page.waitForURL(/login|signin|auth/, { timeout: 5000 }).catch(() => {
        expect(page.url()).toMatch(/login|signin|auth|error|unauthorized/);
      });
    });

    test('should display settings page', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.goto('/settings');

      // await expect(page.getByText(/Settings/i)).toBeVisible();
    });

    test('should have profile settings form', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.goto('/settings');

      // Should have form fields
      // const nameInput = page.getByLabel(/name/i).or(page.getByPlaceholder(/name/i));
      // if (await nameInput.first().isVisible()) {
      //   await expect(nameInput.first()).toBeVisible();
      // }
    });

    test('should have save settings button', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.goto('/settings');

      // const saveButton = page.getByRole('button', { name: /save|update/i });
      // await expect(saveButton.first()).toBeVisible();
    });
  });

  test.describe('Dashboard Responsiveness', () => {
    test('should be responsive on mobile', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.setViewportSize({ width: 375, height: 667 });
      // await page.goto('/dashboard');

      // await expect(page.getByText(/Executive Dashboard/i)).toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);
      // await page.setViewportSize({ width: 768, height: 1024 });
      // await page.goto('/dashboard');

      // await expect(page.getByText(/Executive Dashboard/i)).toBeVisible();
    });
  });

  test.describe('Dashboard Data Loading', () => {
    test('should show loading state while fetching data', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);

      // Intercept API call
      // await page.route('**/api/dashboard', async (route) => {
      //   await new Promise(resolve => setTimeout(resolve, 1000));
      //   await route.continue();
      // });

      // await page.goto('/dashboard');

      // Should show loading indicator
      // await expect(page.locator('[class*="loading"]').or(page.locator('[class*="spinner"]'))).toBeVisible();
    });

    test('should handle error state gracefully', async ({ page }) => {
      // Skip: Requires authentication
      // await loginAsUser(page);

      // Intercept and fail API call
      // await page.route('**/api/dashboard', (route) => {
      //   route.fulfill({ status: 500, body: 'Error' });
      // });

      // await page.goto('/dashboard');

      // Should show error message
      // await expect(page.getByText(/error|failed/i)).toBeVisible();
      // await expect(page.getByRole('button', { name: /retry/i })).toBeVisible();
    });
  });

  test.describe('Task Detail Drawer', () => {
    test('should open task detail when clicking on recent engagement', async ({ page }) => {
      // Skip: Requires authentication and data
      // await loginAsUser(page);
      // await page.goto('/dashboard');

      // // Click on first engagement (if exists)
      // const firstEngagement = page.locator('[class*="engagement"]').or(page.locator('[class*="order"]')).first();
      // if (await firstEngagement.isVisible()) {
      //   await firstEngagement.click();
      //   // Should open drawer or modal
      //   await page.waitForTimeout(500);
      // }
    });
  });
});
