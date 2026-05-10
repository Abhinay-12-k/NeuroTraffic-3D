import { test, expect } from '@playwright/test';

test.describe('NeuroTraffic 3D E2E Smoke Tests', () => {
  test('has dashboard title and essential components', async ({ page }) => {
    await page.goto('/');

    // Validate navigation exists
    await expect(page.getByText('NEXUS AI')).toBeVisible();
    await expect(page.getByText('SMART JUNCTION SYSTEM')).toBeVisible();

    // Validate stat cards rendered
    await expect(page.getByText('TOTAL VEHICLES NOW')).toBeVisible();
    await expect(page.getByText('AVERAGE WAIT TIME')).toBeVisible();

    // Validate live feed presence
    await expect(page.getByText('LIVE TRAFFIC FEED')).toBeVisible();
  });

  test('navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Analytics
    await page.click('text=Analytics');
    await expect(page.getByText('SYSTEM ANALYTICS')).toBeVisible();
    await expect(page.getByText('PREDICTION ACCURACY')).toBeVisible();

    // Navigate to Emergency
    await page.click('text=Emergency');
    await expect(page.getByText('EMERGENCY RESPONSE')).toBeVisible();
    await expect(page.getByText('MANUAL OVERRIDE')).toBeVisible();
  });

  test('can trigger emergency mode', async ({ page }) => {
    await page.goto('/emergency');
    
    page.on('dialog', dialog => dialog.accept());
    
    // Try to trigger NORTH lane emergency
    await page.locator('button', { hasText: 'NORTH' }).first().click();
    
    // We expect the global emergency overlay to appear
    await expect(page.getByText('EMERGENCY VEHICLE DETECTED')).toBeVisible({ timeout: 5000 });
    
    // Clear emergency
    await page.click('text=MANUALLY CLEAR EMERGENCY');
    await expect(page.getByText('EMERGENCY VEHICLE DETECTED')).toBeHidden();
  });
});
