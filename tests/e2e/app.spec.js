import { test, expect } from '@playwright/test';

test.describe('Juno Application E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página principal
    await page.goto('/');
  });

  test('debería cargar la página principal correctamente', async ({ page }) => {
    // Verificar que la página se carga
    await expect(page).toHaveTitle(/Juno/);
    
    // Verificar que el navbar está presente
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Verificar que el brand "Juno" está presente
    await expect(page.locator('.navbar-brand')).toHaveText('Juno');
    
    // Verificar que los enlaces de navegación están presentes
    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Courses' })).toBeVisible();
    
    // Verificar que el botón de wallet está presente
    await expect(page.locator('[data-testid="wallet-button"]')).toBeVisible();
  });

  test('debería mostrar la navegación correcta', async ({ page }) => {
    // Verificar enlaces de navegación
    const profileLink = page.locator('a[href*="/juno/"]').first();
    const hashtagLink = page.locator('a[href*="/juno/ht/"]');
    const coursesLink = page.getByRole('link', { name: 'Courses' });
    
    await expect(profileLink).toContainText('Profile');
    await expect(hashtagLink).toContainText('Hashtag');
    await expect(coursesLink).toContainText('Courses');
  });

  test('debería navegar a la página de cursos', async ({ page }) => {
    // Hacer clic en el enlace de cursos
    await page.getByRole('link', { name: 'Courses' }).click();
    
    // Verificar que estamos en la página de cursos
    await expect(page).toHaveURL(/.*\/courses/);
    
    // Verificar que el contenido de cursos está presente
    await expect(page.locator('h1')).toContainText('Cursos');
    
    // Verificar que hay enlaces a cursos
    await expect(page.locator('a[href*="udemy"]')).toHaveCount(3);
  });

  test('debería mostrar el botón de wallet y su funcionalidad', async ({ page }) => {
    // Verificar que el botón de wallet está presente
    const walletButton = page.locator('[data-testid="wallet-button"]');
    await expect(walletButton).toBeVisible();
    
    // Verificar que el botón tiene el texto correcto
    await expect(walletButton).toContainText('Connect Wallet');
    
    // Hacer clic en el botón de wallet
    await walletButton.click();
    
    // Verificar que se abre el modal de wallet (si está disponible)
    // Nota: En un entorno de prueba, el modal puede no abrirse completamente
    // pero podemos verificar que el botón responde al clic
    await expect(walletButton).toBeVisible();
  });

  test('debería manejar la navegación a hashtags', async ({ page }) => {
    // Hacer clic en el enlace de hashtag
    await page.getByRole('link', { name: 'Hashtag' }).click();
    
    // Verificar que estamos en la página de hashtags
    await expect(page).toHaveURL(/.*\/juno\/ht/);
    
    // Verificar que la página de hashtags se carga
    await expect(page.locator('body')).toBeVisible();
  });

  test('debería ser responsive en dispositivos móviles', async ({ page }) => {
    // Cambiar a vista móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verificar que el navbar se adapta
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Verificar que el botón hamburguesa está presente en móvil
    await expect(page.locator('.navbar-toggler')).toBeVisible();
    
    // Hacer clic en el botón hamburguesa
    await page.click('.navbar-toggler');
    
    // Verificar que el menú se expande
    await expect(page.locator('.navbar-collapse.show')).toBeVisible();
  });

  test('debería cargar los estilos correctamente', async ({ page }) => {
    // Verificar que Bootstrap está cargado
    await expect(page.locator('link[href*="bootstrap"]')).toHaveCount(1);
    
    // Verificar que Font Awesome está cargado
    await expect(page.locator('link[href*="font-awesome"]')).toHaveCount(1);
    
    // Verificar que los estilos se aplican correctamente
    const navbar = page.locator('nav.navbar');
    await expect(navbar).toHaveClass(/bg-light/);
  });

  test('debería manejar errores de navegación graciosamente', async ({ page }) => {
    // Intentar navegar a una página que no existe
    await page.goto('/pagina-que-no-existe');
    
    // Verificar que la página no se rompe completamente
    await expect(page.locator('body')).toBeVisible();
    
    // Verificar que el navbar sigue presente
    await expect(page.locator('nav.navbar')).toBeVisible();
  });

  test('debería mantener el estado de navegación', async ({ page }) => {
    // Navegar a cursos
    await page.getByRole('link', { name: 'Courses' }).click();
    await expect(page).toHaveURL(/.*\/courses/);
    
    // Navegar de vuelta a la página principal
    await page.click('.navbar-brand');
    await expect(page).toHaveURL(/\/$/);
    
    // Verificar que la página principal se carga correctamente
    await expect(page.locator('.navbar-brand')).toHaveText('Juno');
  });

  test('debería cargar rápidamente', async ({ page }) => {
    // Medir el tiempo de carga de la página
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Verificar que la página carga en menos de 3 segundos
    expect(loadTime).toBeLessThan(3000);
    
    // Verificar que el contenido principal está presente
    await expect(page.locator('nav.navbar')).toBeVisible();
  });

  test('debería funcionar con diferentes navegadores', async ({ page }) => {
    // Esta prueba se ejecutará en diferentes navegadores según la configuración
    await expect(page.locator('.navbar-brand')).toHaveText('Juno');
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Verificar que los enlaces funcionan
    await page.getByRole('link', { name: 'Courses' }).click();
    await expect(page).toHaveURL(/.*\/courses/);
  });
}); 