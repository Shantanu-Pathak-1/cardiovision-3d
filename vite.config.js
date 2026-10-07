import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(import.meta.dirname, '..'), '')
  const localEnv = loadEnv(mode, import.meta.dirname, '')

  const geminiKey = env.GEMINI_API_KEY || localEnv.GEMINI_API_KEY || ''
  const groqKey = env.GROQ_API_KEY || localEnv.GROQ_API_KEY || ''

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiKey),
      'import.meta.env.VITE_GROQ_API_KEY': JSON.stringify(groqKey),
    },
  }
})

