import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // makes server accessible on your local network
    port: 5173,   // default port (you can change if needed)
  },
})
