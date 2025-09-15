<template>
  <!-- 目标卡片容器 -->
  <div class="goal-card" :class="{ completed: goal.isCompleted }" @click="goToDetail">
    <!-- 卡片头部，显示目标名称和分类 -->
    <div class="card-header">
      <h3>{{ goal.name }}</h3>
      <span class="category-tag">{{ goal.category }}</span>
    </div>
    
    <!-- 进度信息区域 -->
    <div class="progress-info">
      <div class="amount">
        ¥{{ goal.currentAmount.toFixed(2) }} / ¥{{ goal.targetAmount.toFixed(2) }}
      </div>
      <!-- 截止日期 -->
      <div class="deadline" v-if="goal.deadline">
        截止: {{ formatDate(goal.deadline) }}
      </div>
    </div>
    
    <!-- 进度条组件 -->
    <ProgressBar 
      :current="goal.currentAmount" 
      :target="goal.targetAmount" 
      :completed="goal.isCompleted"
    />
    
    <!-- 操作按钮区域 -->
    <div class="card-actions">
      <button @click.stop="$emit('edit', goal)">编辑</button>
      <button @click.stop="$emit('delete', goal.id)">删除</button>
      <button @click.stop="$emit('complete', goal.id)">
        {{ goal.isCompleted ? '取消完成' : '标记完成' }}
      </button>
      <button @click.stop="goToDetail">详情</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import ProgressBar from './ProgressBar.vue'

/**
 * 定义组件的属性
 */
const props = defineProps({
  /**
   * 目标对象，必须提供
   * @type {Object}
   * @required
   */
  goal: {
    type: Object,
    required: true
  }
})

/**
 * 定义组件的事件
 */
const emit = defineEmits(['edit', 'delete', 'complete'])

/**
 * 路由实例
 * @type {Object}
 */
const router = useRouter()

/**
 * 格式化日期为中文格式
 * @param {Date|string} date - 日期对象或日期字符串
 * @returns {string} 格式化后的日期字符串
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

/**
 * 跳转到目标详情页面
 */
const goToDetail = () => {
  router.push(`/goal/${props.goal.id}`)
}
</script>

<style scoped>
.goal-card {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.goal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #ffffff, #f0f4ff);
}

.goal-card.completed {
  opacity: 0.7;
}

.goal-card:active {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  flex: 1;
}

.category-tag {
  background-color: var(--info-color);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  white-space: nowrap;
  color: white;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;
}

.amount {
  font-weight: bold;
  color: var(--text-color);
  font-size: 20px;
}

.deadline {
  font-size: 16px;
  color: #666;
}

.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
}

.card-actions button {
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s;
}

.card-actions button:first-child {
  background-color: #f0f0f0;
  color: #333;
}

.card-actions button:nth-child(2) {
  background-color: var(--danger-color);
  color: white;
}

.card-actions button:nth-child(3) {
  background-color: var(--success-color);
  color: white;
}

.card-actions button:last-child {
  background-color: var(--primary-color);
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .goal-card {
    padding: 20px;
  }
  
  .card-header h3 {
    font-size: 20px;
  }
  
  .category-tag {
    padding: 5px 10px;
    font-size: 13px;
  }
  
  .amount {
    font-size: 18px;
  }
  
  .deadline {
    font-size: 14px;
  }
  
  .card-actions button {
    padding: 10px;
    font-size: 15px;
  }
}

@media (max-width: 576px) {
  .goal-card {
    padding: 15px;
    min-height: 180px;
  }
  
  .card-header {
    margin-bottom: 15px;
  }
  
  .card-header h3 {
    font-size: 18px;
  }
  
  .category-tag {
    padding: 4px 8px;
    font-size: 12px;
  }
  
  .progress-info {
    margin-bottom: 15px;
  }
  
  .amount {
    font-size: 16px;
  }
  
  .deadline {
    font-size: 13px;
  }
  
  .card-actions {
    gap: 8px;
    margin-top: 15px;
  }
  
  .card-actions button {
    padding: 8px;
    font-size: 14px;
  }
}

@media (max-width: 400px) {
  .goal-card {
    padding: 12px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .card-header h3 {
    font-size: 16px;
  }
  
  .progress-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .amount {
    font-size: 15px;
  }
  
  .deadline {
    font-size: 12px;
  }
  
  .card-actions {
    grid-template-columns: 1fr;
  }
}
</style>