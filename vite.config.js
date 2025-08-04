/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/modules': path.resolve(__dirname, './src/modules')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['**/tests/e2e/**', '**/node_modules/**']
  },
  server: {
    deps: {
      inline: ['solana-wallets-vue'],
    },
  },
  define: {
    global: 'globalThis',
    process: { env: {} }
  },
  optimizeDeps: {
    include: ['@solana/web3.js', '@coral-xyz/anchor', 'solana-wallets-vue']
  }
});