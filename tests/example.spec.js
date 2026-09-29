// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Admin Login Page', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('http://localhost:5173/admin-login');
  });

  test('renders all essential UI elements', async ({ page }) => {
    // Verify headings and text
    await expect(page.getByRole('heading', { name: 'Root Admin Gateway' })).toBeVisible();
    await expect(page.getByText('Core structural terminal access')).toBeVisible();

    // Verify inputs by their placeholders
    await expect(page.getByPlaceholder('admin@domain.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();

    // Verify the submit button
    await expect(page.getByRole('button', { name: 'Unlock Main Command' })).toBeVisible();
  });

  test('successfully logs in, sets session, and redirects', async ({ page }) => {
    const testEmail = 'admin@example.com';
    const testPassword = 'securepassword123';

    // Fill out the form
    await page.getByPlaceholder('admin@domain.com').fill(testEmail);
    await page.getByPlaceholder('••••••••').fill(testPassword);

    // Submit the form
    await page.getByRole('button', { name: 'Unlock Main Command' }).click();

    // Verify navigation to the floor operations page
    await expect(page).toHaveURL('http://localhost:5173/floors/floor-2-operations');

    // Verify localStorage was updated correctly
    const sessionToken = await page.evaluate(() => localStorage.getItem('app_session'));
    expect(sessionToken).not.toBeNull();
    
    // Parse and check the token contents
    const parsedToken = JSON.parse(sessionToken || '{}');
    expect(parsedToken.email).toBe(testEmail);
    expect(parsedToken.role).toBe('admin');
  });

  test('contains correct role-switching links', async ({ page }) => {
    // Verify "Switch to Keeper" link
    const keeperLink = page.getByRole('link', { name: 'Switch to Keeper' });
    await expect(keeperLink).toBeVisible();
    await expect(keeperLink).toHaveAttribute('href', '/keeper-login');

    // Verify "Switch to InCharge" link
    const inchargeLink = page.getByRole('link', { name: 'Switch to InCharge' });
    await expect(inchargeLink).toBeVisible();
    await expect(inchargeLink).toHaveAttribute('href', '/incharge-login');
  });

});