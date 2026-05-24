import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // For GitHub Pages: set base to /REPO_NAME/manual/
  // Override with VITE_BASE env var in CI/CD
  base: process.env.VITE_BASE || '/risk2safe-ra-studio/manual/',
})
