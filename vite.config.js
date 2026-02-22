import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    // This tells Vite to serve index.html for any 404
    historyApiFallback: true, 
  }
})