import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use full backend URL - in production, this comes from the environment
// For Hostinger production build, set: VITE_API_URL=https://ecommerce-gestion-trabajo.onrender.com/api
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_API_URL': JSON.stringify(API_URL),
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
});
