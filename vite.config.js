import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deteksi apakah sedang build di GitHub Pages
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  plugins: [react()],
  base: isGitHubPages ? '/bantu-ayah-ibu-v2/' : '/',
})