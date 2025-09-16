<template>
  <form @submit.prevent="submitForm" class="goal-form">
    <div class="form-group">
      <label for="name">目标名称 *</label>
      <input 
        id="name" 
        v-model="form.name" 
        type="text" 
        required 
        placeholder="例如：旅行基金、购买相机"
      >
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label for="targetAmount">目标金额 *</label>
        <input 
          id="targetAmount" 
          v-model.number="form.targetAmount" 
          type="number" 
          min="0" 
          step="0.01"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="category">分类</label>
        <select id="category" v-model="form.category">
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="form-group">
      <label for="deadline">截止日期</label>
      <input 
        id="deadline" 
        v-model="form.deadline" 
        type="date"
      >
    </div>
    
    <div class="form-group">
      <label for="description">目标描述</label>
      <textarea 
        id="description" 
        v-model="form.description" 
        placeholder="记录你的目标动机或细节..."
        rows="4"
      ></textarea>
    </div>
    
    <div class="form-actions">
      <button type="button" @click="$emit('cancel')" class="cancel-btn">取消</button>
      <button type="submit" class="submit-btn">
        {{ goal ? '更新目标' : '创建目标' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

/**
 * 定义组件属性
 */
const props = defineProps({
  /**
   * 目标对象，用于编辑模式
   * @type {Object|null}
   * @default null
   */
  goal: {
    type: Object,
    default: null
  }
})

/**
 * 定义组件事件
 */
const emit = defineEmits(['save', 'cancel'])

/**
 * 预定义的分类列表
 * @type {Array<string>}
 */
const categories = ref(['生活', '娱乐', '应急', '旅行', '教育', '其他'])

/**
 * 表单数据对象
 * @type {Object}
 */
const form = ref({
  /**
   * 目标名称
   * @type {string}
   */
  name: '',
  
  /**
   * 目标金额
   * @type {number}
   */
  targetAmount: 0,
  
  /**
   * 目标分类
   * @type {string}
   */
  category: '生活',
  
  /**
   * 截止日期
   * @type {string}
   */
  deadline: '',
  
  /**
   * 目标描述
   * @type {string}
   */
  description: ''
})

/**
 * 组件挂载时加载自定义分类
 */
onMounted(() => {
  const savedCategories = localStorage.getItem('goalpurse-categories')
  if (savedCategories) {
    categories.value = JSON.parse(savedCategories)
  }
})

/**
 * 监听目标属性变化，用于编辑模式下填充表单数据
 */
watch(() => props.goal, (newGoal) => {
  if (newGoal) {
    form.value = {
      name: newGoal.name,
      targetAmount: newGoal.targetAmount,
      category: newGoal.category || '生活',
      deadline: newGoal.deadline ? new Date(newGoal.deadline).toISOString().split('T')[0] : '',
      description: newGoal.description || ''
    }
  }
}, { immediate: true })

/**
 * 提交表单处理函数
 * 验证表单数据并触发保存事件
 */
const submitForm = () => {
  // 验证表单
  if (!form.value.name || form.value.targetAmount <= 0) {
    alert('请填写必填项')
    return
  }
  
  // 处理日期
  const formData = {
    ...form.value,
    deadline: form.value.deadline ? new Date(form.value.deadline) : null
  }
  
  emit('save', formData)
}
</script>

<style scoped>
.goal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 16px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.form-actions button {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.submit-btn {
  background-color: #409eff;
  color: white;
}

.submit-btn:hover {
  background-color: #3388ff;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
}
</style>