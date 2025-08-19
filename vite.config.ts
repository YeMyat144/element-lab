import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@monaco-editor/react', '@chakra-ui/react'],
  },
  define: {
    global: 'globalThis',
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
