import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import node2string from "vite-plugin-node2string"

let opts = { path: path.resolve(__dirname, "./node/script"), targetFile: path.resolve(__dirname, "./node/index.ts") }

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@script': path.resolve(__dirname, './node/index.ts')
    }
  },
  plugins: [react(), node2string(opts)]
})
