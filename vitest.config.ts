import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => {
  // Load configuration from .env.test file
  const env = loadEnv('test', process.cwd(), '')
  
  // Inject variables into process.env so your Supabase client can see them
  process.env = { ...process.env, ...env }
  
  return {
    test: {
      // Your vitest configuration options...
    },
  }
})