import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://carpidi-api-a3w662uxxq-uc.a.run.app',
        changeOrigin: true,
      },
    },
  },
});
