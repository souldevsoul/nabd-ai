import { Page, Route } from '@playwright/test';
import { MOCK_API_RESPONSES } from './test-data';

/**
 * Mock successful specialist matching
 */
export async function mockMatchSpecialistsSuccess(page: Page) {
  await page.route('**/api/match-specialists', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_API_RESPONSES.matchSpecialists.success),
    });
  });
}

/**
 * Mock no specialists found
 */
export async function mockMatchSpecialistsNoResults(page: Page) {
  await page.route('**/api/match-specialists', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_API_RESPONSES.matchSpecialists.noMatches),
    });
  });
}

/**
 * Mock specialist matching error
 */
export async function mockMatchSpecialistsError(page: Page) {
  await page.route('**/api/match-specialists', (route) => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_API_RESPONSES.matchSpecialists.error),
    });
  });
}

/**
 * Mock dashboard data
 */
export async function mockDashboardSuccess(page: Page) {
  await page.route('**/api/dashboard', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_API_RESPONSES.dashboard.success),
    });
  });
}

/**
 * Mock dashboard error
 */
export async function mockDashboardError(page: Page) {
  await page.route('**/api/dashboard', (route) => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Failed to fetch dashboard data' }),
    });
  });
}

/**
 * Mock slow API response (for testing loading states)
 */
export async function mockSlowResponse(
  page: Page,
  apiPath: string,
  delayMs: number = 2000,
  response: any = {}
) {
  await page.route(apiPath, async (route) => {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Mock custom API response
 */
export async function mockApiResponse(
  page: Page,
  apiPath: string,
  statusCode: number,
  response: any
) {
  await page.route(apiPath, (route) => {
    route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Clear all mocks
 */
export async function clearAllMocks(page: Page) {
  await page.unroute('**/api/**');
}
