import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Esta línea es crucial para que Vercel encuentre los archivos CSS/JS
  base: './', 
});
