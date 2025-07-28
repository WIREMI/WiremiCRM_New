import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react', '@prisma/client'],
  },
  build: {
    rollupOptions: {
      external: ['@prisma/client', '.prisma/client/index-browser']
    }
  }
});
