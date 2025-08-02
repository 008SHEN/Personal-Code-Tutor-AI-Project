import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ollama': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Direct proxy to Ollama (bypasses Open WebUI authentication)
      '/direct-ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/direct-ollama/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'syntax-highlighter': ['react-syntax-highlighter'],
          'markdown': ['react-markdown'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
