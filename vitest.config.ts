import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/**/*.ts'
      ],
      exclude: [
        'node_modules/',
        'dist/',
        'lib/',
        'coverage/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.d.ts',
        '**/vite.config.ts',
        '**/vitest.config.ts',
        '**/.eslintrc.js',
        '**/tsconfig*.json',
        'src/ts-matrix.ts', // Main export file - just re-exports, no logic to test
      ],
    },
  },
});