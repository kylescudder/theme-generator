import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: process.env.URL ?? 'http://localhost:4321',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
})
