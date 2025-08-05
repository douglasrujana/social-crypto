/**
 * Pruebas E2E con Playwright para verificar la carga y visualización de imágenes en el frontend Juno (versión moderna).
 * 
 * Estas pruebas aseguran que:
 * - El usuario puede seleccionar un archivo de imagen para subir.
 * - La imagen seleccionada se muestra correctamente en la vista previa antes de publicar.
 * - La imagen publicada se muestra correctamente en el post.
 */

const { test, expect } = require('@playwright/test');

test.describe('Carga y visualización de imágenes en Juno (versión moderna)', () => {

  test.beforeEach(async ({ page }) => {
    // Navegar a la página principal de la versión moderna antes de cada prueba
    await page.goto('http://localhost:5173/#/');
  });

  test('El usuario puede seleccionar una imagen y verla en la vista previa', async ({ page }) => {
    // Click en el botón para seleccionar archivo
    await page.click('button:has-text("Upload")'); // Ajustar selector si es necesario

    // Subir archivo de imagen
    const filePath = 'tests/assets/sample-image.jpg'; // Asegúrate de tener esta imagen en tests/assets/
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.click('input[type="file"]', { force: true }),
    ]);
    await fileChooser.setFiles(filePath);

    // Verificar que la imagen se muestre en la vista previa
    const previewImage = page.locator('img[alt="entry-picture"]');
    await expect(previewImage).toBeVisible();
  });

  test('La imagen publicada se muestra en el post', async ({ page }) => {
    // Simular escribir texto en el textarea
    await page.fill('textarea[placeholder="What\'s on your mind?"]', 'Prueba de imagen');

    // Subir archivo de imagen
    const filePath = 'tests/assets/sample-image.jpg';
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.click('button:has-text("Upload")'),
    ]);
    await fileChooser.setFiles(filePath);

    // Click en el botón Post
    await page.click('button:has-text("Post")');

    // Esperar que el post aparezca con la imagen
    const postImage = page.locator('.card img.img-fluid');
    await expect(postImage).toBeVisible();
  });

});
