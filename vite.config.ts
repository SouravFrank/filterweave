import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // or '0.0.0.0' or your local IP address
    port: 5173, // Keep your port
  },
  base: '/filterweave/', // Changed the base directory
});