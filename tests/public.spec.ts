import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test.describe('Home Page', () => {
    test('should load home page correctly', async ({ page }) => {
      await page.goto('/');

      // Check page title and main heading
      await expect(page).toHaveTitle(/VERTEX/i);

      // Check for main hero heading
      await expect(page.getByText(/Where Excellence/i)).toBeVisible();
      await expect(page.getByText(/Meets Innovation/i)).toBeVisible();

      // Check for CTA buttons
      await expect(page.getByRole('button', { name: /Request Consultation/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /View Membership/i })).toBeVisible();

      // Check trust indicators
      await expect(page.getByText(/Confidential/i).first()).toBeVisible();
      await expect(page.getByText(/Award-Winning/i).first()).toBeVisible();
    });

    test('should have working navigation links', async ({ page }) => {
      await page.goto('/');

      // Wait for header to load
      await page.waitForLoadState('networkidle');

      // Test navigation to partners (specialists)
      const partnersLink = page.getByRole('link', { name: /Partners/i }).first();
      await expect(partnersLink).toBeVisible();

      // Test navigation to services (tasks)
      const servicesLink = page.getByRole('link', { name: /Services/i }).first();
      await expect(servicesLink).toBeVisible();

      // Test navigation to membership (pricing)
      const membershipLink = page.getByRole('link', { name: /Membership/i }).first();
      await expect(membershipLink).toBeVisible();
    });

    test('should display elite services section', async ({ page }) => {
      await page.goto('/');

      // Scroll to services section
      await page.getByText(/Elite Offerings/i).scrollIntoViewIfNeeded();

      // Check service titles
      await expect(page.getByText(/BESPOKE AI STRATEGY/i)).toBeVisible();
      await expect(page.getByText(/EXECUTIVE ML SOLUTIONS/i)).toBeVisible();
      await expect(page.getByText(/PRIVATE DATA ARCHITECTURE/i)).toBeVisible();
    });

    test('should display testimonials section', async ({ page }) => {
      await page.goto('/');

      // Scroll to testimonials
      await page.getByText(/C-Suite Endorsements/i).scrollIntoViewIfNeeded();

      // Check for testimonial content
      await expect(page.getByText(/Alexandra Chen/i)).toBeVisible();
      await expect(page.getByText(/Marcus Dupont/i)).toBeVisible();
      await expect(page.getByText(/Sophia Ramirez/i)).toBeVisible();
    });

    test('should display accolades metrics', async ({ page }) => {
      await page.goto('/');

      // Check metrics are displayed
      await expect(page.getByText(/\$2\.4B\+/i)).toBeVisible();
      await expect(page.getByText(/Fortune 100/i)).toBeVisible();
      await expect(page.getByText(/99\.9%/i)).toBeVisible();
    });
  });

  test.describe('Specialists Page', () => {
    test('should load specialists page', async ({ page }) => {
      await page.goto('/specialists');

      // Check page heading
      await expect(page.getByText(/Distinguished Partners/i).or(page.getByText(/Specialists/i)).first()).toBeVisible();

      // Page should load without errors
      await expect(page).not.toHaveURL(/error/);
    });

    test('should display specialist listings', async ({ page }) => {
      await page.goto('/specialists');

      // Wait for content to load
      await page.waitForLoadState('networkidle');

      // Should have some specialist cards or a no partners message
      const hasSpecialistCards = await page.locator('.elite-card').count() > 0;
      const hasNoPartnersMessage = await page.getByText(/No Partners Available/i).isVisible().catch(() => false);
      const hasEmptyFilter = await page.getByText(/We are curating exceptional talent/i).isVisible().catch(() => false);

      expect(hasSpecialistCards || hasNoPartnersMessage || hasEmptyFilter).toBeTruthy();
    });
  });

  test.describe('Tasks Page', () => {
    test('should load tasks page', async ({ page }) => {
      await page.goto('/tasks');

      // Check page heading or title
      await expect(page.getByText(/Tasks/i).or(page.getByText(/Services/i)).first()).toBeVisible();

      // Page should load without errors
      await expect(page).not.toHaveURL(/error/);
    });

    test('should display task categories or listings', async ({ page }) => {
      await page.goto('/tasks');

      // Wait for content
      await page.waitForLoadState('networkidle');

      // Should have task cards (elite-card class) or category headings
      const hasTaskCards = await page.locator('.elite-card').count() > 0;
      const hasCategoryHeadings = await page.locator('h2.font-display.uppercase').count() > 0;
      const hasFilterButtons = await page.getByRole('button', { name: /All Services/i }).isVisible().catch(() => false);

      expect(hasTaskCards || hasCategoryHeadings || hasFilterButtons).toBeTruthy();
    });
  });

  test.describe('Pricing Page', () => {
    test('should load pricing page', async ({ page }) => {
      await page.goto('/pricing');

      // Check for pricing content
      await expect(page.getByText(/Pricing/i).or(page.getByText(/Membership/i)).or(page.getByText(/Plans/i)).first()).toBeVisible();

      // Page should load without errors
      await expect(page).not.toHaveURL(/error/);
    });
  });

  test.describe('Legal Pages', () => {
    test('should load contact page', async ({ page }) => {
      await page.goto('/contact');

      await expect(page.getByText(/Contact/i).first()).toBeVisible();
      await expect(page).not.toHaveURL(/error/);
    });

    test('should load terms page', async ({ page }) => {
      await page.goto('/terms');

      await expect(page.getByText(/Terms/i).first()).toBeVisible();
      await expect(page).not.toHaveURL(/error/);
    });

    test('should load privacy page', async ({ page }) => {
      await page.goto('/privacy');

      await expect(page.getByText(/Privacy/i).first()).toBeVisible();
      await expect(page).not.toHaveURL(/error/);
    });
  });

  test.describe('Responsive Design', () => {
    test('should be mobile responsive on home page', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Main heading should still be visible
      await expect(page.getByText(/Where Excellence/i)).toBeVisible();

      // CTA buttons should be visible
      await expect(page.getByRole('button', { name: /Request Consultation/i })).toBeVisible();
    });

    test('should be tablet responsive on home page', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      // Check layout adapts
      await expect(page.getByText(/Where Excellence/i)).toBeVisible();
      await expect(page.getByText(/Elite Offerings/i)).toBeVisible();
    });
  });

  test.describe('Performance & Accessibility', () => {
    test('should have no console errors on home page', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto('/');

      // Filter out known acceptable errors (like network errors in dev)
      const criticalErrors = errors.filter(e =>
        !e.includes('favicon') &&
        !e.includes('DevTools') &&
        !e.includes('net::ERR_')
      );

      expect(criticalErrors.length).toBe(0);
    });

    test('should have proper meta tags', async ({ page }) => {
      await page.goto('/');

      // Check for viewport meta tag
      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewport).toBeTruthy();
    });
  });
});
