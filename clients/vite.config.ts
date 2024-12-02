import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    // Define global constants for env variables if needed
    define: {
      BASE_URL: JSON.stringify(env.URL),
      PROFILE_URL: JSON.stringify(env.PROFILE_URL),
      AUTH_URL: JSON.stringify(env.AUTH_URL)
    }
  }
})