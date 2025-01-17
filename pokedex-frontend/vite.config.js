import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',  // Esto corrige rutas de imágenes y recursos estáticos
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 4000,
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4000
  }
});
