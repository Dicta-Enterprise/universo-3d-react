import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003, // Cambia el puerto si es necesario
  },
  resolve: {
    alias: {
      '@': '/src', // Alias para simplificar importaciones
    },
  },
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.glb'], // Incluye tipos de assets
});
