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
  },
  test: {
    // 启用jsdom环境
    environment: 'jsdom',
    // 设置全局API
    globals: true,
    // 测试文件目录
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // 测试环境设置
    environmentOptions: {
      jsdom: {
        resources: "usable"
      }
    },
    // 覆盖率设置
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,ts,vue}'],
      exclude: ['src/main.js', 'src/router/**', 'src/**/*.d.ts']
    }
  }
})