import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React core into its own chunk
          'react-vendor': ['react', 'react-dom'],
          // Split router into its own chunk
          'router': ['react-router-dom'],
          // Split Leaflet (map library) — biggest chunk contributor
          'leaflet-vendor': ['leaflet', 'react-leaflet'],
          // Split lucide icons
          'icons': ['lucide-react'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
