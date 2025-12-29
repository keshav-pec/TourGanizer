import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Add proxy here when connecting to your API or Supabase functions
    // proxy: {
    //   '/api': { target: 'http://localhost:3000', changeOrigin: true }
    // }
  }
})
