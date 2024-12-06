import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3001, 
    host: true, 
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})