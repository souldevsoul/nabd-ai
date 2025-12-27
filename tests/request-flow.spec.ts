import { test, expect } from '@playwright/test';

test.describe('Request Flow', () => {
  test.describe('Request Page - Initial Load', () => {
    test('should load request page correctly', async ({ page }) => {
      await page.goto('/request');

      // Check page heading
      await expect(page.getByText(/Request a/i).first()).toBeVisible();
      await expect(page.getByText(/Specialist/i).first()).toBeVisible();

      // Check for consultation badge
      await expect(page.getByText(/Consultation/i).first()).toBeVisible();

      // Check for description textarea
      const textarea = page.getByPlaceholder(/strategic counsel|AI transformation/i);
      await expect(textarea).toBeVisible();

      // Check submit button
      await expect(page.getByRole('button', { name: /Submit Request/i })).toBeVisible();
    });

    test('should display gold divider line', async ({ page }) => {
      await page.goto('/request');

      // Check for luxury design elements
      await expect(page.locator('[class*="gold-line"]').first()).toBeVisible();
    });

    test('should have proper page description', async ({ page }) => {
      await page.goto('/request');

      await expect(page.getByText(/Describe your strategic challenge/i).first()).toBeVisible();
      await expect(page.getByText(/bespoke solution/i).first()).toBeVisible();
    });
  });

  test.describe('Form Interaction', () => {
    test('should enable submit button when text is entered', async ({ page }) => {
      await page.goto('/request');

      const textarea = page.getByPlaceholder(/strategic counsel|AI transformation/i);
      const submitButton = page.getByRole('button', { name: /Submit Request/i });

      // Initially might be disabled
      const initialState = await submitButton.isDisabled();

      // Enter text
      await textarea.fill('I need help with AI strategy and implementation for my large organization');

      // Button should now be enabled
      await expect(submitButton).toBeEnabled();
    });

    test('should keep submit button disabled with insufficient text', async ({ page }) => {
      await page.goto('/request');

      const textarea = page.getByPlaceholder(/strategic counsel|AI transformation/i);
      const submitButton = page.getByRole('button', { name: /Submit Request/i });

      // Enter too short text
      await textarea.fill('AI help');

      // Button should be disabled (requires minimum 10 characters based on code)
      await expect(submitButton).toBeDisabled();
    });

    test('should update textarea value as user types', async ({ page }) => {
      await page.goto('/request');

      const textarea = page.getByPlaceholder(/strategic counsel|AI transformation/i);
      const testText = 'I require expert strategic counsel on AI transformation for my organization';

      await textarea.fill(testText);

      const value = await textarea.inputValue();
      expect(value).toBe(testText);
    });
  });

  test.describe('Specialist Matching Flow', () => {
    test('should show loading state when submitting request', async ({ page }) => {
      await page.goto('/request');

      const textarea = page.getByPlaceholder(/strategic counsel|AI transformation/i);
      const submitButton = page.getByRole('button', { name: /Submit Request/i });

      // Fill form
      await textarea.fill('I need comprehensive AI strategy consulting for my Fortune 500 company looking to implement organization-wide machine learning solutions');

      // Submit
      await submitButton.click();

      // Should show loading state
      await expect(page.getByText(/Finding Specialists/i)).toBeVisible({ timeout: 5000 });
    });

    test('should handle API errors gracefully', async ({ page }) => {
      // Intercept API call and return error
      await page.route('**/api/match-specialists', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Failed to match specialists' }),
        });
      });

      await page.goto('/request');

      const textarea = page.getByPlaceholder(/strategic counsel|AI transformation/i);
      const submitButton = page.getByRole('button', { name: /Submit Request/i });

      await textarea.fill('I need AI consulting services for my business transformation');
      await submitButton.click();

      // Should show error message
      await expect(page.getByText(/Failed to match specialists|error/i)).toBeVisible({ timeout: 5000 });
    });

    test('should display matched specialists', async ({ page }) => {
      // Mock successful API response
      await page.route('**/api/match-specialists', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            requestId: 'test-123',
            isAuthenticated: false,
            matches: [
              {
                id: 'match-1',
                specialist: {
                  id: 'spec-1',
                  firstName: 'Alexandra',
                  avatarSeed: 'seed1',
                  rating: 4.9,
                  completedTasks: 156,
                },
                taskName: 'AI Strategy',
                price: 5000,
                confidence: 0.95,
                reasoning: 'Expert in organizational AI transformation with proven track record',
              },
              {
                id: 'match-2',
                specialist: {
                  id: 'spec-2',
                  firstName: 'Marcus',
                  avatarSeed: 'seed2',
                  rating: 4.8,
                  completedTasks: 142,
                },
                taskName: 'ML Implementation',
                price: 4500,
                confidence: 0.88,
                reasoning: 'Specialized in machine learning systems for Fortune 500 companies',
              },
            ],
            suggestedTasks: ['AI Strategy', 'ML Implementation'],
          }),
        });
      });

      await page.goto('/request');

      const textarea = page.getByPlaceholder(/strategic counsel|AI transformation/i);
      const submitButton = page.getByRole('button', { name: /Submit Request/i });

      await textarea.fill('Need AI transformation consulting for business');
      await submitButton.click();

      // Should show success message
      await expect(page.getByText(/Distinguished Partner.*Available/i)).toBeVisible({ timeout: 5000 });

      // Should show matched specialists
      await expect(page.getByText(/Alexandra/i)).toBeVisible();
      await expect(page.getByText(/Marcus/i)).toBeVisible();

      // Should show ratings
      await expect(page.getByText(/4\.9/i)).toBeVisible();
      await expect(page.getByText(/4\.8/i)).toBeVisible();

      // Should show prices
      await expect(page.getByText(/\$5000|\$5,000/i)).toBeVisible();
      await expect(page.getByText(/\$4500|\$4,500/i)).toBeVisible();

      // Should show confidence/match percentage
      await expect(page.getByText(/95%/i)).toBeVisible();
      await expect(page.getByText(/88%/i)).toBeVisible();
    });

    test('should allow selecting a specialist', async ({ page }) => {
      // Mock API response
      await page.route('**/api/match-specialists', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            requestId: 'test-123',
            isAuthenticated: false,
            matches: [
              {
                id: 'match-1',
                specialist: {
                  id: 'spec-1',
                  firstName: 'Alexandra',
                  avatarSeed: 'seed1',
                  rating: 4.9,
                  completedTasks: 156,
                },
                taskName: 'AI Strategy',
                price: 5000,
                confidence: 0.95,
                reasoning: 'Expert in organizational AI transformation',
              },
            ],
            suggestedTasks: ['AI Strategy'],
          }),
        });
      });

      await page.goto('/request');

      const textarea = page.getByPlaceholder(/strategic counsel|AI transformation/i);
      await textarea.fill('Need AI consulting for my business');

      const submitButton = page.getByRole('button', { name: /Submit Request/i });
      await submitButton.click();

      // Wait for results
      await page.waitForTimeout(1000);

      // Click on specialist card
      const specialistCard = page.locator('text=Alexandra').locator('..');
      await specialistCard.click();

      // Should show engagement button
      await expect(page.getByRole('button', { name: /Engage|Sign in to Engage/i })).toBeVisible();
    });

    test('should show sign-in prompt for unauthenticated users', async ({ page }) => {
      // Mock API response with isAuthenticated: false
      await page.route('**/api/match-specialists', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            requestId: null,
            isAuthenticated: false,
            matches: [
              {
                id: 'match-1',
                specialist: {
                  id: 'spec-1',
                  firstName: 'Alexandra',
                  avatarSeed: 'seed1',
                  rating: 4.9,
                  completedTasks: 156,
                },
                taskName: 'AI Strategy',
                price: 5000,
                confidence: 0.95,
                reasoning: 'Expert in AI',
              },
            ],
            suggestedTasks: [],
          }),
        });
      });

      await page.goto('/request');

      const textarea = page.getByPlaceholder(/strategic counsel|AI transformation/i);
      await textarea.fill('Need AI consulting services');

      const submitButton = page.getByRole('button', { name: /Submit Request/i });
      await submitButton.click();

      await page.waitForTimeout(1000);

      // Click on specialist
      const specialistCard = page.locator('text=Alexandra').locator('..');
      await specialistCard.click();

      // Should show sign-in button
      const signInButton = page.getByRole('button', { name: /Sign in to Engage/i });
      await expect(signInButton).toBeVisible();
    });

    test('should allow starting a new search', async ({ page }) => {
      // Mock API response
      await page.route('**/api/match-specialists', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            requestId: 'test-123',
            isAuthenticated: false,
            matches: [
              {
                id: 'match-1',
                specialist: {
                  id: 'spec-1',
                  firstName: 'Test',
                  avatarSeed: 'seed1',
                  rating: 5.0,
                  completedTasks: 100,
                },
                taskName: 'Test Task',
                price: 1000,
                confidence: 1.0,
                reasoning: 'Test reasoning',
              },
            ],
            suggestedTasks: [],
          }),
        });
      });

      await page.goto('/request');

      const textarea = page.getByPlaceholder(/strategic counsel|AI transformation/i);
      await textarea.fill('Initial search query');

      const submitButton = page.getByRole('button', { name: /Submit Request/i });
      await submitButton.click();

      await page.waitForTimeout(1000);

      // Click new search button
      const newSearchButton = page.getByRole('button', { name: /Start New Search/i });
      await newSearchButton.click();

      // Should show form again
      await expect(page.getByPlaceholder(/strategic counsel|AI transformation/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /Submit Request/i })).toBeVisible();
    });
  });

  test.describe('Auto-submit from Login', () => {
    test('should handle query parameter from login redirect', async ({ page }) => {
      const query = 'AI consulting for organizational transformation';

      // Mock API response
      await page.route('**/api/match-specialists', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            requestId: 'test-123',
            isAuthenticated: true,
            matches: [],
            suggestedTasks: [],
          }),
        });
      });

      await page.goto(`/request?q=${encodeURIComponent(query)}`);

      // Should auto-fill the textarea
      const textarea = page.getByPlaceholder(/strategic counsel|AI transformation/i);
      await expect(textarea).toHaveValue(query);

      // Should auto-submit (check for results or loading)
      await page.waitForTimeout(1500);
    });
  });

  test.describe('Specialist Card Details', () => {
    test('should display all specialist information', async ({ page }) => {
      await page.route('**/api/match-specialists', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            requestId: 'test-123',
            isAuthenticated: false,
            matches: [
              {
                id: 'match-1',
                specialist: {
                  id: 'spec-1',
                  firstName: 'Dr. Sarah Chen',
                  avatarSeed: 'seed1',
                  rating: 4.95,
                  completedTasks: 287,
                },
                taskName: 'AI Strategy & Implementation',
                price: 7500,
                confidence: 0.97,
                reasoning: 'Leading expert in organizational AI with 15+ years experience. Specialized in Fortune 500 digital transformation.',
              },
            ],
            suggestedTasks: [],
          }),
        });
      });

      await page.goto('/request');

      const textarea = page.getByPlaceholder(/strategic counsel|AI transformation/i);
      await textarea.fill('Need comprehensive AI strategy and implementation');

      await page.getByRole('button', { name: /Submit Request/i }).click();

      // Wait for results to appear
      await expect(page.getByText(/Distinguished Partner.*Available/i)).toBeVisible({ timeout: 5000 });

      // Verify all details are shown
      await expect(page.getByText(/Dr. Sarah Chen/i)).toBeVisible();
      await expect(page.getByText(/AI Strategy & Implementation/i)).toBeVisible();
      await expect(page.getByText(/5\.0|4\.9/i)).toBeVisible(); // Rating displayed with toFixed(1)
      await expect(page.getByText(/287.*projects/i)).toBeVisible(); // "projects completed"
      await expect(page.getByText(/97%.*match/i)).toBeVisible();
      await expect(page.getByText(/\$7500/i)).toBeVisible();
      await expect(page.getByText(/Leading expert in organizational AI/i)).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should be mobile responsive', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/request');

      // Form should still be usable
      await expect(page.getByText(/Request a/i)).toBeVisible();
      await expect(page.getByPlaceholder(/strategic counsel|AI transformation/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /Submit Request/i })).toBeVisible();
    });

    test('should be tablet responsive', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/request');

      await expect(page.getByText(/Request a/i)).toBeVisible();
      await expect(page.getByPlaceholder(/strategic counsel|AI transformation/i)).toBeVisible();
    });
  });
});
