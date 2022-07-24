import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import nodeToString from './vite-plugin-nodeToString'
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@script': path.resolve(__dirname, './node/index.ts')
    }
  },
  plugins: [react(), nodeToString()]
})
