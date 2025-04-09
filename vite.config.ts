import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const ENV_PREFIX = 'BULLET_'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ENV_PREFIX)

  return {
    base: '/',
    plugins: [tailwindcss(), tsconfigPaths(), react()],
    envPrefix: ENV_PREFIX,
  }
})
