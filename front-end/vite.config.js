import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    // Set the output directory for the build files
    outDir: path.resolve(__dirname, 'front-end', 'dist'), // Ensures the build output goes to frontend/dist
    rollupOptions: {
      input: path.resolve(__dirname, 'front-end', 'index.html'), // Ensure the entry point is correct
    },
  },
});
