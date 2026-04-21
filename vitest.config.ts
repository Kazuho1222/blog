import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    exclude: ['node_modules', 'tests/e2e/**'],
    css: {
      include: [], // CSSを処理対象外にする
    },
    env: {
      MICROCMS_SERVICE_DOMAIN: 'test-domain',
      MICROCMS_API_KEY: 'test-key',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
