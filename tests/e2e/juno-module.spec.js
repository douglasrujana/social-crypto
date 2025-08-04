import { test, expect } from '@playwright/test';

test.describe('Solana Module E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  });

  test('debería manejar la conexión de Phantom Wallet', async ({ page }) => {
    const walletButton = page.locator('[data-testid="phantom-connect"]');
    await expect(walletButton).toBeVisible();
    await walletButton.click();

    await page.evaluate(() => {
      window.solana = {
        isPhantom: true,
        connect: async () => ({
          publicKey: { toString: () => 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS' }
        })
      };
    });
    
    await expect(walletButton).toHaveText(/Connected/);
  });
});
'@

Set-Content -Path ".\tests\e2e\juno-module.spec.js" -Value $content -Encoding UTF8import { test, expect } from '@playwright/test';

test.describe('Solana Module E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });

  test('debería manejar la conexión de Phantom Wallet', async ({ page }) => {
    const walletButton = page.locator('[data-testid="phantom-connect"]');
    await expect(walletButton).toBeVisible();
    await walletButton.click();
    
    // Simular conexión exitosa de wallet
    await page.evaluate(() => {
      window.solana = {
        isPhantom: true,
        connect: async () => ({
          publicKey: { toString: () => 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS' }
        })
      };
    
    await expect(walletButton).toHaveText(/Connected/);

  test('debería mostrar error al fallar conexión wallet', async ({ page }) => {
    const walletButton = page.locator('[data-testid="phantom-connect"]');
    await expect(walletButton).toBeVisible();
    
    // Simular error de conexión
    await page.evaluate(() => {
      window.solana = {
        isPhantom: true,
        connect: async () => { throw new Error('User rejected'); }
      };
    
    await walletButton.click();
    await expect(page.locator('.error-message')).toBeVisible();

  test('debería navegar correctamente en rutas protegidas', async ({ page }) => {
    await page.goto('/#/courses');
    await expect(page).toHaveURL(/.*\/courses/);
    
    const walletButton = page.locator('[data-testid="phantom-connect"]');
    await expect(walletButton).toBeVisible();
    
    // Intentar acceder a ruta protegida
    await page.goto('/#/profile');
    // Debería redireccionar al home si no hay wallet conectada
    await expect(page).toHaveURL(/.*\//);

  test('debería persistir estado de wallet entre navegaciones', async ({ page }) => {
    const walletButton = page.locator('[data-testid="phantom-connect"]');
    
    // Simular conexión exitosa
    await page.evaluate(() => {
      window.solana = {
        isPhantom: true,
        connect: async () => ({
          publicKey: { toString: () => 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS' }
        })
      };
    
    await walletButton.click();
    await page.goto('/#/courses');
    await expect(walletButton).toHaveText(/Connected/);
});

  test('debería mantener la navegación entre módulos', async ({ page }) => {
    await page.getByRole('link', { name: 'Profile' }).first().click();
    await expect(page).toHaveURL(/.*\/juno/);
    
    await page.getByRole('link', { name: 'Courses' }).first().click();
    await expect(page).toHaveURL(/.*\/courses/);
    
    await page.getByRole('link', { name: 'Profile' }).first().click();
    await expect(page).toHaveURL(/.*\/juno/);
    
    await expect(page.locator('.navbar-brand').first()).toHaveText('Juno');

  test('debería manejar la conexión de wallet', async ({ page }) => {
    await page.getByRole('link', { name: 'Profile' }).first().click();
    await expect(page).toHaveURL(/.*\/juno/);
    
    const walletButton = page.locator('[data-testid="wallet-button"]');
    await expect(walletButton).toBeVisible();
    await walletButton.click();
    await expect(walletButton).toBeVisible();

  test('debería ser responsive en el módulo Juno', async ({ page }) => {
    await page.getByRole('link', { name: 'Profile' }).first().click();
    await expect(page).toHaveURL(/.*\/juno/);
    
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.navbar-toggler').first()).toBeVisible();
    await page.locator('.navbar-toggler').first().click();
    await expect(page.locator('.navbar-collapse.show')).toBeVisible();

  test('debería cargar rápidamente el módulo Juno', async ({ page }) => {
    const startTime = Date.now();
    await page.getByRole('link', { name: 'Profile' }).first().click();
    await expect(page).toHaveURL(/.*\/juno/);
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);

  test('debería manejar errores en el módulo Juno', async ({ page }) => {
    await page.getByRole('link', { name: 'Profile' }).first().click();
    await expect(page).toHaveURL(/.*\/juno/);
    
    await page.goto('/juno/ruta-invalida');

  test('debería mantener el estado del módulo Juno', async ({ page }) => {
    await page.getByRole('link', { name: 'Profile' }).first().click();
    await expect(page).toHaveURL(/.*\/juno/);
    
    await page.getByRole('link', { name: 'Hashtag' }).first().click();
    await expect(page).toHaveURL(/.*\/juno\/ht/);
    
    await page.getByRole('link', { name: 'Juno' }).first().click();
    await expect(page).toHaveURL(/.*\//);
    
    await expect(page.locator('.navbar-brand').first()).toHaveText('Juno');
});
