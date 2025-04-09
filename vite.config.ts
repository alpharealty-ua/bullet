import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const ENV_PREFIX = 'BULLET_'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    base: '/',
    plugins: [tailwindcss(), tsconfigPaths(), react()],
    envPrefix: ENV_PREFIX,
  }
})
