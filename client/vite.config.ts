import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    define: {
      PROFILE_URL: JSON.stringify(env.PROFILE_URL),
      AUTH_URL: JSON.stringify(env.AUTH_URL)
    }
  }
})