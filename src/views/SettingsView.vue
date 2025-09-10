<template>
  <div class="settings-view">
    <header>
      <h1>设置</h1>
    </header>

    <div class="settings-content">
      <!-- 自定义分类设置 -->
      <section class="settings-section">
        <h2>自定义分类</h2>
        <div class="categories-settings">
          <div class="current-categories">
            <h3>当前分类</h3>
            <div class="category-list">
              <div 
                v-for="category in customCategories" 
                :key="category"
                class="category-item"
              >
                <span>{{ category }}</span>
                <button @click="removeCategory(category)" class="remove-btn">删除</button>
              </div>
            </div>
          </div>

          <div class="add-category">
            <h3>添加新分类</h3>
            <div class="add-category-form">
              <input 
                v-model="newCategory" 
                type="text" 
                placeholder="输入新分类名称"
                @keyup.enter="addCategory"
              >
              <button @click="addCategory" :disabled="!newCategory.trim()">添加</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 颜色设置 -->
      <section class="settings-section">
        <h2>颜色设置</h2>
        <div class="color-settings">
          <div 
            v-for="(color, name) in themeColors" 
            :key="name"
            class="color-setting-item"
          >
            <label>{{ getColorLabel(name) }}</label>
            <div class="color-picker-container">
              <input 
                type="color" 
                :value="color" 
                @input="updateColor(name, $event.target.value)"
              >
              <span class="color-value">{{ color }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 数据导入导出 -->
      <section class="settings-section">
        <h2>数据导入导出</h2>
        <div class="data-management">
          <div class="export-section">
            <h3>导出数据</h3>
            <p>将您的目标和记录导出为JSON文件，以便备份或在其他设备上使用。</p>
            <button @click="exportData" class="export-btn">导出数据</button>
          </div>
          
          <div class="import-section">
            <h3>导入数据</h3>
            <p>从JSON文件导入目标和记录。注意：这将覆盖您当前的数据。</p>
            <input 
              type="file" 
              ref="fileInput" 
              accept=".json" 
              @change="handleFileSelect" 
              style="display: none"
            >
            <button @click="triggerFileSelect" class="import-btn">选择文件导入</button>
            <button 
              v-if="selectedFileName" 
              @click="importData" 
              class="confirm-import-btn"
            >
              确认导入 "{{ selectedFileName }}"
            </button>
          </div>
        </div>
      </section>

      <!-- 操作按钮 -->
      <div class="settings-actions">
        <button @click="saveSettings" class="save-btn">保存设置</button>
        <button @click="resetSettings" class="reset-btn">重置为默认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useGoalsStore } from '../store/goals'

const store = useGoalsStore()

// 自定义分类
const customCategories = ref([])
const newCategory = ref('')

// 主题颜色
const themeColors = reactive({
  primary: '#409eff',
  success: '#42b983',
  warning: '#e6a23c',
  danger: '#ff6b6b',
  info: '#909399',
  background: '#f5f7fa',
  cardBackground: '#ffffff',
  textColor: '#2c3e50'
})

// 导入导出相关
const fileInput = ref(null)
const selectedFileName = ref('')

// 加载设置
onMounted(() => {
  loadCategories()
  loadThemeColors()
})

// 加载自定义分类
const loadCategories = () => {
  const savedCategories = localStorage.getItem('goalpurse-categories')
  if (savedCategories) {
    customCategories.value = JSON.parse(savedCategories)
  } else {
    // 默认分类
    customCategories.value = ['生活', '娱乐', '应急', '旅行', '教育', '其他']
  }
}

// 加载主题颜色
const loadThemeColors = () => {
  const savedColors = localStorage.getItem('goalpurse-theme-colors')
  if (savedColors) {
    Object.assign(themeColors, JSON.parse(savedColors))
  }
}

// 添加分类
const addCategory = () => {
  if (newCategory.value.trim() && !customCategories.value.includes(newCategory.value.trim())) {
    customCategories.value.push(newCategory.value.trim())
    newCategory.value = ''
  }
}

// 删除分类
const removeCategory = (category) => {
  if (customCategories.value.length > 1) {
    customCategories.value = customCategories.value.filter(c => c !== category)
  } else {
    alert('至少需要保留一个分类')
  }
}

// 获取颜色标签
const getColorLabel = (name) => {
  const labels = {
    primary: '主色调',
    success: '成功色',
    warning: '警告色',
    danger: '危险色',
    info: '信息色',
    background: '背景色',
    cardBackground: '卡片背景色',
    textColor: '文字颜色'
  }
  return labels[name] || name
}

// 更新颜色
const updateColor = (name, color) => {
  themeColors[name] = color
}

// 保存设置
const saveSettings = () => {
  localStorage.setItem('goalpurse-categories', JSON.stringify(customCategories.value))
  localStorage.setItem('goalpurse-theme-colors', JSON.stringify(themeColors))
  applyThemeColors()
  alert('设置已保存')
}

// 应用主题颜色
const applyThemeColors = () => {
  const root = document.documentElement
  root.style.setProperty('--primary-color', themeColors.primary)
  root.style.setProperty('--success-color', themeColors.success)
  root.style.setProperty('--warning-color', themeColors.warning)
  root.style.setProperty('--danger-color', themeColors.danger)
  root.style.setProperty('--info-color', themeColors.info)
  root.style.setProperty('--background-color', themeColors.background)
  root.style.setProperty('--card-background-color', themeColors.cardBackground)
  root.style.setProperty('--text-color', themeColors.textColor)
}

// 重置设置
const resetSettings = () => {
  if (confirm('确定要重置所有设置为默认值吗？')) {
    // 重置分类
    customCategories.value = ['生活', '娱乐', '应急', '旅行', '教育', '其他']
    
    // 重置颜色
    Object.assign(themeColors, {
      primary: '#409eff',
      success: '#42b983',
      warning: '#e6a23c',
      danger: '#ff6b6b',
      info: '#909399',
      background: '#f5f7fa',
      cardBackground: '#ffffff',
      textColor: '#2c3e50'
    })
    
    saveSettings()
  }
}

// 导出数据
const exportData = () => {
  try {
    // 获取当前所有数据
    const goalsData = localStorage.getItem('goalpurse-goals') || '[]'
    const recordsData = localStorage.getItem('goalpurse-records') || '[]'
    const categoriesData = localStorage.getItem('goalpurse-categories') || '[]'
    const themeData = localStorage.getItem('goalpurse-theme-colors') || '{}'
    
    // 创建导出对象
    const exportData = {
      goals: JSON.parse(goalsData),
      records: JSON.parse(recordsData),
      categories: JSON.parse(categoriesData),
      theme: JSON.parse(themeData),
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    // 创建并下载文件
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `goalpurse-export-${new Date().toISOString().slice(0, 10)}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    alert('数据导出成功!')
  } catch (error) {
    console.error('导出数据时出错:', error)
    alert('导出数据时出错，请查看控制台了解详情')
  }
}

// 触发文件选择
const triggerFileSelect = () => {
  fileInput.value.click()
}

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFileName.value = file.name
  } else {
    selectedFileName.value = ''
  }
}

// 导入数据
const importData = () => {
  if (!fileInput.value.files.length) {
    alert('请先选择一个文件')
    return
  }
  
  const file = fileInput.value.files[0]
  const reader = new FileReader()
  
  reader.onload = (e) => {
    try {
      const importData = JSON.parse(e.target.result)
      
      // 确认是否导入
      const confirmMsg = `确定要导入 "${file.name}" 中的数据吗？这将覆盖您当前的所有数据。`
      if (!confirm(confirmMsg)) {
        return
      }
      
      // 导入数据到localStorage
      if (importData.goals) {
        localStorage.setItem('goalpurse-goals', JSON.stringify(importData.goals))
      }
      
      if (importData.records) {
        localStorage.setItem('goalpurse-records', JSON.stringify(importData.records))
      }
      
      if (importData.categories) {
        localStorage.setItem('goalpurse-categories', JSON.stringify(importData.categories))
        customCategories.value = importData.categories
      }
      
      if (importData.theme) {
        localStorage.setItem('goalpurse-theme-colors', JSON.stringify(importData.theme))
        Object.assign(themeColors, importData.theme)
        applyThemeColors()
      }
      
      // 重新加载store数据
      store.loadFromLocalStorage()
      
      alert('数据导入成功!')
      
      // 清空文件选择
      fileInput.value.value = ''
      selectedFileName.value = ''
    } catch (error) {
      console.error('导入数据时出错:', error)
      alert('导入数据时出错，请确保选择的是有效的JSON文件')
    }
  }
  
  reader.readAsText(file)
}
</script>

<style scoped>
.settings-view {
  padding: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

header h1 {
  margin: 0 0 30px 0;
  font-size: 28px;
}

.settings-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.settings-section {
  margin-bottom: 40px;
}

.settings-section h2 {
  margin-top: 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.settings-section h3 {
  margin: 0 0 15px 0;
  color: #555;
}

/* 分类设置样式 */
.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.category-item {
  display: flex;
  align-items: center;
  background: #f0f0f0;
  padding: 8px 15px;
  border-radius: 20px;
}

.category-item span {
  margin-right: 10px;
}

.remove-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-category-form {
  display: flex;
  gap: 15px;
}

.add-category-form input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.add-category-form button {
  padding: 12px 20px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.add-category-form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 颜色设置样式 */
.color-settings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.color-setting-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.color-setting-item label {
  font-weight: 500;
  color: #333;
}

.color-picker-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-picker-container input[type="color"] {
  width: 50px;
  height: 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.color-value {
  font-family: monospace;
  font-size: 14px;
  color: #666;
}

/* 数据导入导出样式 */
.data-management {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.export-section,
.import-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.export-section:hover,
.import-section:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.export-section h3,
.import-section h3 {
  margin-top: 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.export-section p,
.import-section p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.export-btn,
.import-btn,
.confirm-import-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  outline: none;
}

.export-btn {
  background: linear-gradient(135deg, #42b983 0%, #2c8d65 100%);
  color: white;
  min-width: 150px;
}

.export-btn:hover {
  background: linear-gradient(135deg, #3aa873 0%, #257454 100%);
  box-shadow: 0 6px 15px rgba(66, 185, 131, 0.3);
  transform: translateY(-2px);
}

.export-btn:active {
  transform: translateY(0);
}

.export-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.export-btn:hover::before {
  opacity: 1;
}

.import-btn {
  background: linear-gradient(135deg, #409eff 0%, #2a7de0 100%);
  color: white;
  min-width: 150px;
}

.import-btn:hover {
  background: linear-gradient(135deg, #3388ff 0%, #226bd0 100%);
  box-shadow: 0 6px 15px rgba(64, 158, 255, 0.3);
  transform: translateY(-2px);
}

.import-btn:active {
  transform: translateY(0);
}

.confirm-import-btn {
  background: linear-gradient(135deg, #e6a23c 0%, #c68a2d 100%);
  color: white;
  min-width: 200px;
  margin-top: 15px;
}

.confirm-import-btn:hover {
  background: linear-gradient(135deg, #d6922c 0%, #b67a1d 100%);
  box-shadow: 0 6px 15px rgba(230, 162, 60, 0.3);
  transform: translateY(-2px);
}

.confirm-import-btn:active {
  transform: translateY(0);
}

.export-btn:focus,
.import-btn:focus,
.confirm-import-btn:focus {
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.3);
}

/* 操作按钮样式 */
.settings-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.save-btn, .reset-btn {
  padding: 15px 30px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.save-btn {
  background: #409eff;
  color: white;
}

.save-btn:hover {
  background: #3388ff;
}

.reset-btn {
  background: #f0f0f0;
  color: #333;
}

.reset-btn:hover {
  background: #e0e0e0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-view {
    padding: 15px;
  }
  
  .settings-content {
    padding: 20px;
  }
  
  .color-settings {
    grid-template-columns: 1fr;
  }
  
  .add-category-form {
    flex-direction: column;
  }
  
  .settings-actions {
    flex-direction: column;
  }
  
  header h1 {
    font-size: 24px;
    margin-bottom: 25px;
  }
  
  .settings-section {
    margin-bottom: 30px;
  }
  
  .settings-section h2 {
    font-size: 22px;
  }
  
  .settings-section h3 {
    font-size: 20px;
  }
}

@media (max-width: 576px) {
  .settings-view {
    padding: 10px;
  }
  
  .settings-content {
    padding: 15px;
  }
  
  header h1 {
    font-size: 22px;
    margin-bottom: 20px;
  }
  
  .settings-section {
    margin-bottom: 25px;
  }
  
  .settings-section h2 {
    font-size: 20px;
    padding-bottom: 10px;
  }
  
  .settings-section h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .category-list {
    gap: 10px;
  }
  
  .category-item {
    padding: 6px 12px;
  }
  
  .add-category-form {
    gap: 10px;
  }
  
  .add-category-form input {
    padding: 10px 12px;
    font-size: 15px;
  }
  
  .add-category-form button {
    padding: 10px 15px;
    font-size: 15px;
  }
  
  .color-setting-item {
    gap: 8px;
  }
  
  .color-picker-container {
    gap: 8px;
  }
  
  .color-picker-container input[type="color"] {
    width: 40px;
    height: 35px;
  }
  
  .color-value {
    font-size: 13px;
  }
  
  .settings-actions {
    gap: 15px;
    padding-top: 15px;
  }
  
  .save-btn, .reset-btn {
    padding: 12px 25px;
    font-size: 15px;
  }
}

@media (max-width: 400px) {
  header h1 {
    font-size: 20px;
  }
  
  .settings-section h2 {
    font-size: 18px;
  }
  
  .settings-section h3 {
    font-size: 16px;
  }
  
  .add-category-form input {
    font-size: 14px;
  }
  
  .add-category-form button {
    font-size: 14px;
  }
  
  .color-value {
    font-size: 12px;
  }
  
  .save-btn, .reset-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>