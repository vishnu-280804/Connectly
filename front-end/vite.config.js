import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Simplified version without rollupOptions
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'front-end', 'dist'),  // Output directory
  },
});
