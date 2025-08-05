import { test, expect } from '@playwright/test';

test.describe('Seguridad de Transacciones', () => {
  test('debe validar monto de SOL correcto', async ({ page }) => {
    await page.goto('/juno/new-post');
    
    // Intentar enviar transacción con monto incorrecto
    await page.evaluate(() => {
      if (window.solana) {
        window.solana.request({
          method: 'signTransaction',
          params: { amount: 999999999 }
        });
      }
    });
    
    await expect(page.locator('text=Invalid transaction amount')).toBeVisible();
  });

  test('debe verificar destinatario correcto', async ({ page }) => {
    await page.goto('/juno/new-post');
    
    // Verificar que las transacciones vayan al contrato correcto
    const programAddress = 'TU_PROGRAM_ID_AQUI';
    
    await page.fill('textarea[placeholder="What\'s on your mind?"]', 'Test post');
    await page.fill('input[placeholder="# hashtag"]', 'test');
    
    // Monitorear la transacción
    const [request] = await Promise.all([
      page.waitForRequest('**/api/post'),
      page.click('button:has-text("Post")')
    ]);
    
    expect(request.url()).toContain(programAddress);
  });

  test('debe rechazar transacciones duplicadas', async ({ page }) => {
    await page.goto('/juno/new-post');
    
    await page.fill('textarea[placeholder="What\'s on your mind?"]', 'Test post');
    await page.fill('input[placeholder="# hashtag"]', 'test');
    
    // Intentar enviar transacción duplicada
    await page.click('button:has-text("Post")');
    await page.click('button:has-text("Post")');
    
    await expect(page.locator('text=Transaction already submitted')).toBeVisible();
  });
});
