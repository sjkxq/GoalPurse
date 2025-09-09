<template>
  <div class="goal-card" :class="{ completed: goal.isCompleted }">
    <div class="card-header">
      <h3>{{ goal.name }}</h3>
      <span class="category-tag">{{ goal.category }}</span>
    </div>
    
    <div class="progress-info">
      <div class="amount">
        ¥{{ goal.currentAmount.toFixed(2) }} / ¥{{ goal.targetAmount.toFixed(2) }}
      </div>
      <div class="deadline" v-if="goal.deadline">
        截止: {{ formatDate(goal.deadline) }}
      </div>
    </div>
    
    <ProgressBar 
      :current="goal.currentAmount" 
      :target="goal.targetAmount" 
      :completed="goal.isCompleted"
    />
    
    <div class="card-actions">
      <button @click="$emit('edit', goal)">编辑</button>
      <button @click="$emit('delete', goal.id)">删除</button>
      <button @click="$emit('complete', goal.id)">
        {{ goal.isCompleted ? '取消完成' : '标记完成' }}
      </button>
      <button @click="goToDetail">详情</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import ProgressBar from './ProgressBar.vue'

const props = defineProps({
  goal: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'complete'])

const router = useRouter()

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const goToDetail = () => {
  router.push(`/goal/${props.goal.id}`)
}
</script>

<style scoped>
.goal-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.goal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.goal-card.completed {
  opacity: 0.7;
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
  background-color: #e0e0e0;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  white-space: nowrap;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;
}

.amount {
  font-weight: bold;
  color: #333;
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
  background-color: #ff6b6b;
  color: white;
}

.card-actions button:nth-child(3) {
  background-color: #42b983;
  color: white;
}

.card-actions button:last-child {
  background-color: #409eff;
  color: white;
}
</style>