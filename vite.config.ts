import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.tsx'),
      output: {
        format: 'iife',
        name: 'Timeline',
        entryFileNames: 'timeline.bundle.js',
        inlineDynamicImports: true,
      },
    },
    minify: 'esbuild',
    watch: null
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

