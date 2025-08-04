# Pruebas E2E con Playwright

Este directorio contiene las pruebas end-to-end (E2E) para la aplicación Juno usando Playwright.

## Estructura

```
tests/e2e/
├── app.spec.js          # Pruebas generales de la aplicación
├── juno-module.spec.js  # Pruebas específicas del módulo Juno
└── README.md           # Esta documentación
```

## Comandos disponibles

### Ejecutar todas las pruebas E2E
```bash
yarn test:e2e
```

### Ejecutar pruebas E2E con interfaz visual
```bash
yarn test:e2e:ui
```

### Ejecutar pruebas E2E en modo headed (con navegador visible)
```bash
yarn test:e2e:headed
```

### Ejecutar pruebas en un navegador específico
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Ejecutar pruebas en dispositivos móviles
```bash
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## Configuración

Las pruebas están configuradas en `playwright.config.js` en la raíz del proyecto.

### Características de la configuración:

- **Servidor de desarrollo**: Se inicia automáticamente antes de las pruebas
- **Múltiples navegadores**: Chrome, Firefox, Safari, y dispositivos móviles
- **Paralelización**: Las pruebas se ejecutan en paralelo cuando es posible
- **Retry**: Reintentos automáticos en CI
- **Trazas**: Captura de trazas para debugging

## Casos de prueba

### app.spec.js
Pruebas generales de la aplicación:
- ✅ Carga de página principal
- ✅ Navegación entre páginas
- ✅ Funcionalidad del botón de wallet
- ✅ Responsive design
- ✅ Carga de estilos
- ✅ Manejo de errores
- ✅ Rendimiento

### juno-module.spec.js
Pruebas específicas del módulo Juno:
- ✅ Navegación al módulo Juno
- ✅ Funcionalidad de posts
- ✅ Página de hashtags
- ✅ Conexión de wallet
- ✅ Responsive design en el módulo
- ✅ Rendimiento del módulo
- ✅ Manejo de errores

## Elementos de prueba

Los elementos de la interfaz se identifican usando:
- **Selectores CSS**: `.navbar-brand`, `nav.navbar`
- **Atributos data-testid**: `[data-testid="wallet-button"]`
- **URLs**: Verificación de rutas con regex
- **Texto**: Verificación de contenido visible

## Debugging

### Ver reporte HTML
```bash
npx playwright show-report
```

### Ejecutar una prueba específica
```bash
npx playwright test app.spec.js -g "debería cargar la página principal"
```

### Modo debug
```bash
npx playwright test --debug
```

### Capturar screenshots
```bash
npx playwright test --screenshot=on
```

## Notas importantes

1. **Wallet Connection**: Las pruebas verifican la presencia del botón de wallet pero no pueden simular la conexión real debido a limitaciones del entorno de prueba.

2. **Blockchain Interactions**: Las interacciones con la blockchain no se prueban en E2E debido a la complejidad de simular transacciones reales.

3. **Responsive Design**: Las pruebas incluyen verificaciones de responsive design en diferentes tamaños de pantalla.

4. **Performance**: Se incluyen pruebas de rendimiento básicas (tiempo de carga).

## Contribución

Al agregar nuevas funcionalidades, asegúrate de:
1. Agregar pruebas E2E correspondientes
2. Usar `data-testid` para elementos importantes
3. Verificar responsive design
4. Incluir casos de error
5. Mantener las pruebas actualizadas 