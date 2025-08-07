// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/bantu-ayah-ibu-v2/', // 👈 Sesuaikan dengan nama repo
});