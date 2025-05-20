import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    host: '0.0.0.0',
    allowedHosts: ['10.116.64.23'],
    port: 5173,   
    open: true,         
    }
})
