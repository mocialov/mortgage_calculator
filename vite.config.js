import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  // Ensure assets are served correctly on GitHub Pages under /mortgage_calculator/
  base: '/mortgage_calculator/',
  build: {
    // Use default 'dist' so GitHub Pages workflow artifact path matches
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Copy public directory files to dist during build
  publicDir: 'public',
})
