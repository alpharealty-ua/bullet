import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const ENV_PREFIX = 'BULLET_'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ENV_PREFIX)
  const API_URL = `${env[`${ENV_PREFIX}API_URL`]}`

  return {
    base: './',
    plugins: [tailwindcss(), tsconfigPaths(), react()],
    envPrefix: ENV_PREFIX,
    server: {
      proxy: {
        '/api': {
          target: API_URL,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
