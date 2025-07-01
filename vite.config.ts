import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/ts-matrix.ts'),
      name: 'TsMatrix',
      formats: ['es', 'umd'],
      fileName: (format) => `ts-matrix.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
});