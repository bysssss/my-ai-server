import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// FE dev 서버는 /health·/api 를 백엔드(localhost:5555)로 프록시한다.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/health': 'http://localhost:5555',
      '/api': 'http://localhost:5555',
    },
  },
})
