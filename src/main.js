import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// 初始化主题颜色
const initThemeColors = () => {
  const savedColors = localStorage.getItem('goalpurse-theme-colors')
  if (savedColors) {
    const colors = JSON.parse(savedColors)
    const root = document.documentElement
    
    Object.keys(colors).forEach(key => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}-color`
      root.style.setProperty(cssVarName, colors[key])
    })
    
    // 特殊处理部分CSS变量
    root.style.setProperty('--primary-color', colors.primary)
    root.style.setProperty('--success-color', colors.success)
    root.style.setProperty('--warning-color', colors.warning)
    root.style.setProperty('--danger-color', colors.danger)
    root.style.setProperty('--info-color', colors.info)
    root.style.setProperty('--background-color', colors.background)
    root.style.setProperty('--card-background-color', colors.cardBackground)
    root.style.setProperty('--text-color', colors.textColor)
  }
}

// 初始化主题颜色
initThemeColors()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')