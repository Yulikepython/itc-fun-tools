import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
  },
  publicDir: "public",
  assetsInclude: ["robots.txt"],
  base: "/itc-fun-tools/" // GitHubリポジトリ名に基づくbase設定
})
