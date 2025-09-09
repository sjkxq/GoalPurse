<template>
  <div class="goals-view">
    <header>
      <h1>我的储蓄目标</h1>
      <button class="add-button" @click="showAddForm = true">+</button>
    </header>
    
    <div v-if="goals.length === 0" class="empty-state">
      <p>还没有储蓄目标，创建第一个目标吧！</p>
      <button @click="showAddForm = true">创建目标</button>
    </div>
    
    <div v-else class="goals-list">
      <GoalCard 
        v-for="goal in goals" 
        :key="goal.id" 
        :goal="goal"
        @edit="editGoal"
        @delete="deleteGoal"
        @complete="toggleComplete"
      />
    </div>
    
    <!-- 添加/编辑目标表单 -->
    <div v-if="showAddForm" class="modal">
      <div class="modal-content">
        <h2>{{ editingGoal ? '编辑目标' : '创建新目标' }}</h2>
        <GoalForm 
          :goal="editingGoal" 
          @save="saveGoal" 
          @cancel="closeForm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGoalsStore } from '../store/goals'
import GoalCard from '../components/GoalCard.vue'
import GoalForm from '../components/GoalForm.vue'

const store = useGoalsStore()
const showAddForm = ref(false)
const editingGoal = ref(null)

// 计算属性
const goals = computed(() => store.goals)

// 方法
const editGoal = (goal) => {
  editingGoal.value = goal
  showAddForm.value = true
}

const deleteGoal = (id) => {
  if (confirm('确定要删除这个目标吗？')) {
    store.deleteGoal(id)
  }
}

const toggleComplete = (id) => {
  const goal = store.getGoalById(id)
  store.updateGoal(id, { isCompleted: !goal.isCompleted })
}

const saveGoal = (goalData) => {
  if (editingGoal.value) {
    store.updateGoal(editingGoal.value.id, goalData)
  } else {
    store.addGoal(goalData)
  }
  closeForm()
}

const closeForm = () => {
  showAddForm.value = false
  editingGoal.value = null
}

// 生命周期
onMounted(() => {
  store.loadFromLocalStorage()
})
</script>

<style scoped>
.goals-view {
  padding: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

header h1 {
  margin: 0;
  font-size: 28px;
}

.add-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 30px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  transition: all 0.2s;
}

.add-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0,0,0,0.3);
}

.empty-state {
  text-align: center;
  padding: 60px 30px;
}

.empty-state p {
  font-size: 20px;
  color: #666;
  margin-bottom: 30px;
}

.goals-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--card-background-color);
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .goals-view {
    padding: 15px;
  }
  
  .goals-list {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  header h1 {
    font-size: 24px;
  }
  
  .add-button {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
}
</style>