import { test, expect } from '@playwright/test';

test.describe('Phantom Wallet E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  });

  test('flujo completo: conectar wallet y navegar por la aplicación', async ({ page }) => {
    const walletButton = page.locator('[data-testid="phantom-connect"]');
    await expect(walletButton).toBeVisible();
    
    // FASE 1: CONEXIÓN WALLET
    await page.evaluate(() => {
      window.solana = {
        isPhantom: true,
        connect: async () => ({
          publicKey: { toString: () => 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS' }
        })
      };
    });

    await walletButton.click();
    await expect(walletButton).toHaveText(/Connected/);

    // FASE 2: NAVEGACIÓN A PROFILE
    await page.goto('/#/profile');
    await expect(page).toHaveURL(/.*\/profile/);
    
    // FASE 3: NAVEGACIÓN A OTRAS SECCIONES
    await page.goto('/#/courses');
    await expect(page).toHaveURL(/.*\/courses/);
  });

  test('experiencia de usuario: primer uso de la aplicación', async ({ page }) => {
    await expect(page.locator('nav.navbar').first()).toBeVisible();
    await expect(page.locator('[data-testid="phantom-connect"]')).toBeVisible();
    
    await page.goto('/#/courses');
    await expect(page).toHaveURL(/.*\/courses/);
  });

  test('manejo de errores durante el flujo completo', async ({ page }) => {
    const walletButton = page.locator('[data-testid="phantom-connect"]');
    
    // Simular error de conexión
    await page.evaluate(() => {
      window.solana = {
        isPhantom: true,
        connect: async () => { throw new Error('User rejected'); }
      };
    });
    
    await walletButton.click();
    await expect(page.locator('.error-message')).toBeVisible();
  });
});