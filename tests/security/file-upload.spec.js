import { test, expect } from '@playwright/test';

test.describe('Seguridad de Carga de Archivos', () => {
  test('debe rechazar archivos maliciosos', async ({ page }) => {
    await page.goto('/juno/new-post');
    
    // Crear archivo malicioso
    const maliciousFile = new File(['<script>alert("XSS")</script>'], 'hack.html', {
      type: 'text/html'
    });
    
    await page.setInputFiles('input[type="file"]', maliciousFile);
    await expect(page.locator('text=Invalid file type')).toBeVisible();
  });

  test('debe limitar tamaño de archivos', async ({ page }) => {
    await page.goto('/juno/new-post');
    
    const largeFile = new File([new ArrayBuffer(10 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg'
    });
    
    await page.setInputFiles('input[type="file"]', largeFile);
    await expect(page.locator('text=File too large')).toBeVisible();
  });

  test('debe rechazar archivos ejecutables', async ({ page }) => {
    await page.goto('/juno/new-post');
    
    const exeFile = new File(['MZ...'], 'malware.exe', {
      type: 'application/x-msdownload'
    });
    
    await page.setInputFiles('input[type="file"]', exeFile);
    await expect(page.locator('text=Executable files not allowed')).toBeVisible();
  });
});
