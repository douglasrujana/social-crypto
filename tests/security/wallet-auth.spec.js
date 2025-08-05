import { test, expect } from '@playwright/test';

test.describe('Seguridad de Autenticación Wallet', () => {
  test('debe rechazar acceso sin wallet conectada', async ({ page }) => {
    await page.goto('/juno/wallet');
    
    // Simular desconexión de wallet
    await page.evaluate(() => {
      if (window.solana) {
        window.solana.disconnect();
      }
    });
    
    await expect(page.locator('text=Connect Wallet')).toBeVisible();
  });

  test('debe validar firma de transacciones', async ({ page }) => {
    await page.goto('/juno/new-post');
    
    // Intentar crear post sin wallet
    await page.click('button:has-text("Post")');
    await expect(page.locator('text=Please connect your wallet')).toBeVisible();
  });

  test('debe verificar wallet address válido', async ({ page }) => {
    await page.goto('/juno/wallet');
    
    const invalidAddress = '0xinvalid_address';
    await page.fill('input[placeholder="Wallet"]', invalidAddress);
    await page.click('button:has-text("Search")');
    
    await expect(page.locator('text=Invalid wallet address')).toBeVisible();
  });
});
