import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  preview: {
    allowedHosts: [
      "accomplished-intuition-production-243d.up.railway.app"
    ]
  }
})
