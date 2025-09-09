import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    // 为了解决 Node.js 版本兼容性问题
    global: 'globalThis',
  },
  server: {
    host: true,
    port: 3000,
  },
  build: {
    // 为较低版本 Node.js 提供兼容性支持
    target: ['es2015']
  }
})