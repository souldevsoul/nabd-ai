# VERTEX E2E Test Suite

Comprehensive Playwright end-to-end tests for the VERTEX platform.

## Overview

This test suite covers all major user flows and features of the VERTEX platform:

- **Public Pages**: Home, Specialists, Tasks, Pricing, Legal pages
- **Authentication**: Login, Registration, Protected routes
- **Dashboard**: User dashboard, Wallet, Purchases, Settings
- **Request Flow**: Specialist matching, AI-powered recommendations
- **Executor**: Executor dashboard, Assignments, Telegram integration

## Setup

### Prerequisites

- Node.js 18+ installed
- VERTEX development environment set up
- Database seeded with test data (optional, for authenticated tests)

### Installation

```bash
# Install Playwright (already done if you followed main setup)
npm install -D @playwright/test

# Install browser binaries
npx playwright install chromium
```

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run specific test file
```bash
npx playwright test tests/public.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Run only tests with specific tag
```bash
npx playwright test --grep @smoke
```

## Test Structure

```
tests/
├── README.md                  # This file
├── public.spec.ts            # Public pages tests
├── auth.spec.ts              # Authentication tests
├── dashboard.spec.ts         # Dashboard tests (many skipped - require auth)
├── request-flow.spec.ts      # Request & matching tests
├── executor.spec.ts          # Executor dashboard tests (skipped - require auth)
└── helpers/
    ├── auth-helpers.ts       # Authentication utilities
    ├── test-data.ts          # Test data and fixtures
    └── mock-helpers.ts       # API mocking utilities
```

## Test Coverage

### ✅ Active Tests (No Authentication Required)

- **Public Pages** (35+ tests)
  - Home page content and navigation
  - Specialists page
  - Tasks page
  - Pricing page
  - Legal pages (Contact, Terms, Privacy)
  - Responsive design testing
  - Performance checks

- **Authentication** (25+ tests)
  - Login page rendering and functionality
  - Form validation
  - Password toggle
  - Error handling
  - Registration page
  - Protected route redirects
  - Callback URL handling

- **Request Flow** (20+ tests)
  - Request page rendering
  - Form validation
  - API mocking for specialist matching
  - Loading states
  - Success states
  - Error handling
  - Specialist selection
  - Responsive design

### ⏭️ Skipped Tests (Require Authentication)

Many tests in `dashboard.spec.ts` and `executor.spec.ts` are skipped because they require:
- Authenticated user sessions
- Test user setup in database
- Proper role assignments (user, executor, admin)

To enable these tests:
1. Set up test users in your database
2. Update credentials in `tests/helpers/test-data.ts`
3. Implement the `loginAsUser()` and `loginAsExecutor()` functions
4. Remove `.skip` from relevant tests

## Configuration

Configuration is in `playwright.config.ts`:

- **Base URL**: Defaults to `http://localhost:3000`
- **Browsers**: Chromium (Firefox and WebKit commented out)
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: Captured on failure
- **Videos**: Retained on failure
- **Traces**: Captured on first retry

### Environment Variables

```bash
# Set custom base URL
PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test
```

## Writing New Tests

### Example Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path');

    await expect(page.getByText('Expected Text')).toBeVisible();

    await page.getByRole('button', { name: 'Click Me' }).click();

    await expect(page).toHaveURL(/expected-path/);
  });
});
```

### Using Helpers

```typescript
import { loginAsUser } from './helpers/auth-helpers';
import { mockMatchSpecialistsSuccess } from './helpers/mock-helpers';
import { TEST_REQUESTS } from './helpers/test-data';

test('should work with authentication', async ({ page }) => {
  await loginAsUser(page);
  await page.goto('/dashboard');
  // ... rest of test
});

test('should work with mocked API', async ({ page }) => {
  await mockMatchSpecialistsSuccess(page);
  await page.goto('/request');
  // ... rest of test
});
```

## Best Practices

1. **Use Locators Properly**
   - Prefer `page.getByRole()`, `page.getByText()`, `page.getByLabel()`
   - Use `data-testid` only when necessary
   - Avoid CSS selectors when possible

2. **Make Tests Independent**
   - Each test should be able to run alone
   - Clean up after tests if needed
   - Don't rely on test execution order

3. **Use Meaningful Names**
   - Test names should describe what they verify
   - Group related tests with `test.describe()`

4. **Handle Async Properly**
   - Always `await` Playwright actions
   - Use proper timeouts
   - Handle loading states

5. **Mock External Dependencies**
   - Mock API calls for reliability
   - Use helpers in `mock-helpers.ts`
   - Test both success and error cases

## CI/CD Integration

Tests are configured to run in CI with:
- Parallel execution disabled (for stability)
- 2 retry attempts
- Proper reporting

Add to your CI pipeline:

```yaml
- name: Run Playwright tests
  run: npm run test:e2e

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Viewing Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

## Debugging

### Debug specific test
```bash
npx playwright test tests/auth.spec.ts --debug
```

### Use trace viewer
```bash
npx playwright show-trace trace.zip
```

### Use Playwright Inspector
The `--debug` flag automatically opens the Playwright Inspector.

## Troubleshooting

### Tests timing out
- Increase timeout in `playwright.config.ts`
- Check if dev server is running
- Verify network conditions

### Flaky tests
- Add proper waits (`waitForLoadState`, `waitForTimeout`)
- Use `expect().toBeVisible()` with timeout
- Check for race conditions

### Authentication issues
- Verify test user credentials
- Check session handling
- Ensure database is seeded

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
