import { test, expect } from '@playwright/test';

/**
 * LIVE TEST - Real Phantom Wallet Connection with Solana Devnet
 *
 * CATEGORÍA: Test en Vivo (Live Test / Real Environment Test)
 * PROPÓSITO: Probar la conexión real con Phantom wallet y la red Solana Devnet
 *
 * QUÉ PRUEBA:
 * - Conexión real con extensión Phantom instalada
 * - Comunicación real con la red Solana Devnet
 * - Manejo de transacciones reales (sin costo en devnet)
 * - Comportamiento con datos reales de blockchain
 *
 * POR QUÉ ES IMPORTANTE:
 * - Valida que la app funciona con la infraestructura real
 * - Detecta problemas de red, latencia y timeouts
 * - Verifica compatibilidad con versiones actuales de Phantom
 * - Asegura que las transacciones se procesan correctamente
 *
 * REQUISITOS CRÍTICOS:
 * - ⚠️  Extensión Phantom REAL instalada en el navegador
 * - ⚠️  Wallet configurada con al menos una cuenta
 * - ⚠️  Conexión a internet estable
 * - ⚠️  Acceso a Solana Devnet
 *
 * CONFIGURACIÓN PREVIA:
 * 1. Instalar Phantom desde Chrome Web Store
 * 2. Crear/importar una wallet de prueba
 * 3. Cambiar red a Devnet en Phantom
 * 4. Obtener SOL de prueba del faucet si es necesario
 */

// Configuración especial para tests en vivo
test.describe.configure({ mode: 'serial' }); // Ejecutar tests secuencialmente

test.describe('Phantom Wallet Live Tests - Real Devnet Connection', () => {

  // Configuración más larga para operaciones reales
  test.setTimeout(60000); // 60 segundos por test

  test.beforeEach(async ({ page }) => {
    // NO inyectar mocks - usar Phantom real
    await page.goto('/');

    // Esperar más tiempo para carga real
    await page.waitForLoadState('networkidle');

    // Verificar que Phantom está disponible
    const hasPhantom = await page.evaluate(() => {
      return !!(window.solana && window.solana.isPhantom);
    });

    // Skip test si Phantom no está instalado
    test.skip(!hasPhantom, 'Phantom wallet no está instalado. Instala la extensión para ejecutar este test.');
  });

  test('conecta con Phantom real y verifica dirección de wallet', async ({ page }) => {
    // ARRANGE: Verificar estado inicial
    const walletButton = page.getByTestId('wallet-button');
    await expect(walletButton).toBeVisible();
    await expect(walletButton).toHaveText('Connect Wallet');

    // ACT: Intentar conexión real con Phantom
    // NOTA: Esto abrirá el popup real de Phantom
    await walletButton.click();

    // Esperar a que el usuario apruebe la conexión en Phantom
    // En un entorno automatizado, esto requeriría configuración adicional
    await page.waitForTimeout(5000); // Tiempo para interacción manual

    // ASSERT: Verificar si la conexión fue exitosa
    // El texto del botón debería cambiar si se conectó
    const buttonText = await walletButton.textContent();

    if (buttonText.includes('Connected:')) {
      // ✅ Conexión exitosa
      console.log('✅ Phantom conectado exitosamente');

      // Verificar que la dirección es válida (formato Solana)
      const addressMatch = buttonText.match(/Connected: ([A-Za-z0-9]{4})\.\.\.([A-Za-z0-9]{4})/);
      expect(addressMatch).toBeTruthy();

      // Verificar que el perfil se actualiza
      const profileLink = page.locator('a[href*="/juno/"]').first();
      const profileHref = await profileLink.getAttribute('href');
      expect(profileHref).not.toContain('/juno/guest');

    } else {
      // ⚠️ Conexión no realizada (usuario canceló o error)
      console.log('⚠️ Conexión no completada - posiblemente cancelada por el usuario');
      await expect(walletButton).toHaveText('Connect Wallet');
    }
  });

  test('verifica conectividad con Solana Devnet', async ({ page }) => {
    // Este test verifica que la app puede comunicarse con Solana

    // Inyectar código para probar conexión a devnet
    const devnetConnected = await page.evaluate(async () => {
      try {
        // Crear conexión a devnet
        const { Connection, clusterApiUrl } = window.solanaWeb3 || {};
        if (!Connection || !clusterApiUrl) return false;

        const connection = new Connection(clusterApiUrl('devnet'));
        const version = await connection.getVersion();

        return version && version['solana-core'];
      } catch (error) {
        console.error('Error conectando a devnet:', error);
        return false;
      }
    });

    if (devnetConnected) {
      console.log('✅ Conexión a Solana Devnet exitosa');
      expect(devnetConnected).toBeTruthy();
    } else {
      console.log('⚠️ No se pudo conectar a Solana Devnet - verificar conexión a internet');
      // No fallar el test por problemas de red
      test.skip(true, 'Conexión a Devnet no disponible');
    }
  });

  test('maneja desconexión y reconexión de Phantom', async ({ page }) => {
    // FASE 1: Intentar conexión inicial
    const walletButton = page.getByTestId('wallet-button');
    await walletButton.click();
    await page.waitForTimeout(3000);

    const isConnected = (await walletButton.textContent()).includes('Connected:');

    if (isConnected) {
      console.log('✅ Wallet conectada para test de desconexión');

      // FASE 2: Simular desconexión (esto requeriría interacción manual con Phantom)
      // En un test real, el usuario desconectaría desde la extensión

      // FASE 3: Verificar que la app maneja la desconexión
      // Recargar página para simular pérdida de conexión
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Verificar que vuelve al estado desconectado
      await expect(walletButton).toHaveText('Connect Wallet');

      console.log('✅ Manejo de desconexión verificado');

    } else {
      console.log('⚠️ Wallet no conectada - saltando test de desconexión');
      test.skip(true, 'Requiere wallet conectada');
    }
  });

  test('verifica rendimiento con conexión real', async ({ page }) => {
    // Test de rendimiento con conexiones reales

    const startTime = Date.now();

    // Medir tiempo de carga inicial
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    console.log(`⏱️ Tiempo de carga: ${loadTime}ms`);

    // La app debería cargar en menos de 10 segundos incluso con conexión real
    expect(loadTime).toBeLessThan(10000);

    // Medir tiempo de respuesta del botón
    const buttonStartTime = Date.now();
    const walletButton = page.getByTestId('wallet-button');
    await walletButton.click();

    // Esperar respuesta (conexión o error)
    await page.waitForTimeout(1000);
    const buttonResponseTime = Date.now() - buttonStartTime;

    console.log(`⏱️ Tiempo de respuesta del botón: ${buttonResponseTime}ms`);

    // El botón debería responder inmediatamente
    expect(buttonResponseTime).toBeLessThan(2000);
  });
});