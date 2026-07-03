import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    rollupOptions: {
      output: {
        manualChunks(id: string): string | undefined {
          if (!id.includes('node_modules')) {
            return undefined;
          }
          if (id.includes('@mui/x-charts')) {
            return 'mui-charts';
          }
          if (id.includes('@mui/x-date-pickers')) {
            return 'mui-pickers';
          }
          if (id.includes('@mui/icons-material')) {
            return 'mui-icons';
          }
          if (id.includes('@mui/material') || id.includes('@emotion')) {
            return 'mui-core';
          }
          if (
            id.includes('react-dom') ||
            id.includes('react-router') ||
            id.includes('/react/')
          ) {
            return 'react-vendor';
          }
          if (id.includes('@tanstack/react-query')) {
            return 'query-vendor';
          }
          if (id.includes('@reduxjs') || id.includes('react-redux')) {
            return 'redux-vendor';
          }
          if (
            id.includes('axios') ||
            id.includes('dayjs') ||
            id.includes('zod') ||
            id.includes('react-hook-form') ||
            id.includes('@hookform')
          ) {
            return 'utils-vendor';
          }
          return undefined;
        },
      },
    },
  },
}));
