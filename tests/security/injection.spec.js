import { test, expect } from '@playwright/test';

test.describe('Prevención de Inyección', () => {
  test('debe sanitizar entrada de texto', async ({ page }) => {
    await page.goto('/juno/new-post');
    
    const xssPayload = '<script>alert("XSS")</script>';
    await page.fill('textarea[placeholder="What\'s on your mind?"]', xssPayload);
    await page.fill('input[placeholder="# hashtag"]', 'test');
    await page.click('button:has-text("Post")');
    
    // Verificar que el script no se ejecute
    const content = await page.textContent('.post-content');
    expect(content).not.toContain('<script>');
  });

  test('debe escapar hashtags maliciosos', async ({ page }) => {
    await page.goto('/juno/new-post');
    
    await page.fill('textarea[placeholder="What\'s on your mind?"]', 'Test post');
    await page.fill('input[placeholder="# hashtag"]', '#<img src=x onerror=alert(1)>');
    await page.click('button:has-text("Post")');
    
    await expect(page.locator('text=Invalid hashtag format')).toBeVisible();
  });

  test('debe prevenir SQL injection en búsqueda', async ({ page }) => {
    await page.goto('/juno/wallet');
    
    const sqlInjection = "'; DROP TABLE posts; --";
    await page.fill('input[placeholder="Wallet"]', sqlInjection);
    await page.click('button:has-text("Search")');
    
    await expect(page.locator('text=Invalid wallet address')).toBeVisible();
  });
});
