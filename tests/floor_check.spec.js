// @ts-check
import { test, expect } from '@playwright/test';

// Change this URL to the actual route where FloorCheckHub is rendered in your app
const PAGE_URL = 'http://localhost:5173/floors/floor-2-operations';

test.describe('FloorCheckHub Page', () => {

  test.beforeEach(async ({ page }) => {
    // Set a dummy session to simulate a logged-in state before navigating
    await page.addInitScript(() => {
      localStorage.setItem("app_session", JSON.stringify({ email: "admin@example.com", role: "admin" }));
    });
    await page.goto(PAGE_URL);
  });

  test('renders initial layout, header, and static metrics correctly', async ({ page }) => {
    // Check Header Info
    await expect(page.getByRole('heading', { name: 'Floor 2 - Operations' })).toBeVisible();
    await expect(page.getByText('Active Duty Floor Inspection Panel')).toBeVisible();
    await expect(page.getByText('Gayan Perera')).toBeVisible(); // Duty Keeper

    // Check Metrics Panel (Based on the initial state provided in the component)
    // Completed: Alpha (1) / Total: 4
    await expect(page.locator('h4', { hasText: '1 / 4' })).toBeVisible();
    
    // Discrepancies: Delta has 1 issue
    await expect(page.locator('h4', { hasText: '1 Issues' })).toBeVisible();
    
    // Laptops: 10 + 5 + 0 + 11 = 26 checked out of 10 + 12 + 8 + 12 = 42 total
    await expect(page.getByText('26', { exact: true })).toBeVisible();
    await expect(page.getByText('/42')).toBeVisible();

    // Phones: 5 + 3 + 0 + 7 = 15 checked out of 5 + 10 + 6 + 7 = 28 total
    await expect(page.getByText('15', { exact: true })).toBeVisible();
    await expect(page.getByText('/ 28')).toBeVisible();
  });

  test('displays all platforms with correct initial data and statuses', async ({ page }) => {
    // Verify Platform Alpha (Completed)
    const alphaCard = page.locator('.bg-brand-darkGray').filter({ hasText: 'Platform Alpha' });
    await expect(alphaCard.getByText('completed', { exact: true })).toBeVisible();
    await expect(alphaCard.getByText('10 / 10')).toBeVisible(); // Laptops
    await expect(alphaCard.getByText('5 / 5')).toBeVisible();   // Phones

    // Verify Platform Delta (Failed with Discrepancy)
    const deltaCard = page.locator('.bg-brand-darkGray').filter({ hasText: 'Platform Delta' });
    await expect(deltaCard.getByText('failed', { exact: true })).toBeVisible();
    await expect(deltaCard.getByText('Flagged Issue: 1 Laptop Damaged')).toBeVisible();
  });

  test('disables "+ Scan" buttons when assets are fully checked', async ({ page }) => {
    const alphaCard = page.locator('.bg-brand-darkGray').filter({ hasText: 'Platform Alpha' });
    
    // Both laptop and phone scan buttons should be disabled for Alpha (10/10 and 5/5)
    const scanButtons = alphaCard.getByRole('button', { name: '+ Scan' });
    await expect(scanButtons.nth(0)).toBeDisabled();
    await expect(scanButtons.nth(1)).toBeDisabled();
  });

  test('increments asset counts and dynamically updates platform status', async ({ page }) => {
    const gammaCard = page.locator('.bg-brand-darkGray').filter({ hasText: 'Platform Gamma' });
    
    // Initial state: pending, 0/8 laptops
    await expect(gammaCard.getByText('pending', { exact: true })).toBeVisible();
    await expect(gammaCard.getByText('0 / 8')).toBeVisible();

    // Click "+ Scan" for Laptops
    const laptopScanBtn = gammaCard.locator('button', { hasText: '+ Scan' }).first();
    await laptopScanBtn.click();

    // Verify count increments to 1/8 and status changes to in-progress
    await expect(gammaCard.getByText('1 / 8')).toBeVisible();
    await expect(gammaCard.getByText('in-progress', { exact: true })).toBeVisible();

    // Verify the global laptop telemetry metric updated from 26 to 27
    await expect(page.getByText('27', { exact: true })).toBeVisible();
  });

  test('interacts with the Radio Dispatch Wire (Chat System)', async ({ page }) => {
    // Initial state: Placeholder should be visible
    await expect(page.getByText('Select "Radio Link" next to any active platform')).toBeVisible();

    // Open chat for Platform Beta
    const betaCard = page.locator('.bg-brand-darkGray').filter({ hasText: 'Platform Beta' });
    await betaCard.getByRole('button', { name: 'Radio link' }).click();

    // Verify chat header and historical messages
    await expect(page.getByText('Lead Console: Dilhani Cooray')).toBeVisible();
    await expect(page.getByText('Double check laptop tags.')).toBeVisible();

    // Type and send a new message
    const chatInput = page.getByPlaceholder('Type dispatch info...');
    await chatInput.fill('Understood, checking tags now.');
    await chatInput.press('Enter'); // Test Enter key submission

    // Verify message appears in log
    await expect(page.getByText('[Keeper]: Understood, checking tags now.')).toBeVisible();
    // Input should be cleared
    await expect(chatInput).toHaveValue('');

    // Open chat for Platform Gamma (No history)
    const gammaCard = page.locator('.bg-brand-darkGray').filter({ hasText: 'Platform Gamma' });
    await gammaCard.getByRole('button', { name: 'Radio link' }).click();
    await expect(page.getByText('No historical transmissions logged.')).toBeVisible();

    // Send a message using the click button instead of Enter
    await chatInput.fill('Gamma comms check');
    // Finding the send button by getting the button next to the input
    await page.locator('button.bg-brand-neonCyan').click(); 
    await expect(page.getByText('[Keeper]: Gamma comms check')).toBeVisible();

    // Close chat
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByText('Select "Radio Link" next to any active platform')).toBeVisible();
  });

  test('handles user logout correctly', async ({ page }) => {
    // Click the exit hub button
    await page.getByRole('button', { name: 'Exit Hub' }).click();

    // Verify URL redirected to login
    await expect(page).toHaveURL('http://localhost:5173/login');

    // Verify localStorage was cleared
    const sessionToken = await page.evaluate(() => localStorage.getItem('app_session'));
    expect(sessionToken).toBeNull();
  });
});