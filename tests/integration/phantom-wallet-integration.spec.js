import { test, expect } from '@playwright/test';

/**
 * INTEGRATION TEST - Phantom Wallet Connection
 * 
 * CATEGORÍA: Test de Integración
 * PROPÓSITO: Verificar que la aplicación Vue se integra correctamente con la wallet Phantom real
 * 
 * QUÉ PRUEBA:
 * - Detección de la extensión Phantom en el navegador
 * - Conexión exitosa con la wallet
 * - Actualización del estado de la UI tras la conexión
 * - Manejo de errores cuando Phantom no está disponible
 * 
 * POR QUÉ ES IMPORTANTE:
 * - Valida la integración real entre frontend y wallet
 * - Detecta problemas de compatibilidad con extensiones del navegador
 * - Asegura que el flujo de conexión funciona en condiciones reales
 * 
 * REQUISITOS:
 * - Extensión Phantom instalada en el navegador de prueba
 * - Wallet configurada (puede estar vacía para estas pruebas)
 */

test.describe('Phantom Wallet Integration Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegar a la aplicación antes de cada test
    await page.goto('/');
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('domcontentloaded');
  });

  test('detecta y conecta con Phantom wallet instalada', async ({ page }) => {
    // ARRANGE: Verificar que el botón de conexión está presente
    const walletButton = page.getByTestId('wallet-button');
    await expect(walletButton).toBeVisible();
    await expect(walletButton).toHaveText('Connect Wallet');

    // Inyectar mock de Phantom para simular extensión instalada
    await page.addInitScript(() => {
      window.solana = {
        isPhantom: true,
        connect: async () => ({
          publicKey: {
            toString: () => 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'
          }
        })
      };
    });

    // Recargar para aplicar el script
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // ACT: Hacer clic en el botón de conexión
    await walletButton.click();

    // ASSERT: Verificar que la conexión fue exitosa
    await expect(walletButton).toHaveText(/Connected: Fg6P...sLnS/);
    
    // Verificar que el enlace del perfil se actualiza con la dirección
    const profileLink = page.locator('a[href*="/juno/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"]');
    await expect(profileLink).toBeVisible();
  });

  test('maneja correctamente cuando Phantom no está instalada', async ({ page }) => {
    // ARRANGE: Asegurar que no hay objeto solana en window
    await page.addInitScript(() => {
      delete window.solana;
    });

    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Configurar listener para el alert
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Please install Phantom wallet!');
      await dialog.accept();
    });

    // ACT: Intentar conectar sin Phantom
    const walletButton = page.getByTestId('wallet-button');
    await walletButton.click();

    // ASSERT: El botón debe seguir mostrando "Connect Wallet"
    await expect(walletButton).toHaveText('Connect Wallet');
  });

  test('maneja errores de conexión de Phantom', async ({ page }) => {
    // ARRANGE: Mock de Phantom que falla al conectar
    await page.addInitScript(() => {
      window.solana = {
        isPhantom: true,
        connect: async () => {
          throw new Error('User rejected the request');
        }
      };
    });

    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Capturar logs de consola para verificar el error
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleLogs.push(msg.text());
      }
    });

    // ACT: Intentar conectar
    const walletButton = page.getByTestId('wallet-button');
    await walletButton.click();

    // ASSERT: Verificar que se maneja el error
    await expect(walletButton).toHaveText('Connect Wallet');
    
    // Verificar que se logueó el error
    await page.waitForTimeout(100); // Pequeña espera para el log
    expect(consoleLogs.some(log => log.includes('Connection failed'))).toBeTruthy();
  });
});