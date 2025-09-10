<template>
  <div class="statistics-view">
    <h1>数据统计</h1>
    
    <div class="summary-stats">
      <div class="stat-card">
        <div class="stat-value">¥{{ totalTargetAmount.toFixed(2) }}</div>
        <div class="stat-label">总目标金额</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-value">¥{{ totalSavedAmount.toFixed(2) }}</div>
        <div class="stat-label">总已存金额</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-value">{{ completionRate }}%</div>
        <div class="stat-label">总体完成率</div>
      </div>
    </div>
    
    <div class="charts-section">
      <div class="chart-container">
        <h2>分类统计</h2>
        <div v-if="categoryStats.length > 0" class="category-stats">
          <div 
            v-for="stat in categoryStats" 
            :key="stat.category" 
            class="category-bar"
          >
            <div class="category-info">
              <span class="category-name">{{ stat.category }}</span>
              <span class="category-amount">¥{{ stat.amount.toFixed(2) }}</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: stat.percentage + '%' }"
              ></div>
            </div>
            <div class="category-percent">{{ stat.percentage }}%</div>
          </div>
        </div>
        <div v-else class="no-data">
          暂无分类数据
        </div>
      </div>
      
      <div class="chart-container">
        <h2>完成情况</h2>
        <div class="completion-stats">
          <div class="completion-item">
            <div class="completion-value">{{ completedGoals }}</div>
            <div class="completion-label">已完成</div>
          </div>
          <div class="completion-item">
            <div class="completion-value">{{ inProgressGoals }}</div>
            <div class="completion-label">进行中</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGoalsStore } from '../store/goals'

const store = useGoalsStore()

// 总目标金额
const totalTargetAmount = computed(() => {
  return store.goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
})

// 总已存金额
const totalSavedAmount = computed(() => {
  return store.goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
})

// 总体完成率
const completionRate = computed(() => {
  if (totalTargetAmount.value <= 0) return 0
  return Math.round((totalSavedAmount.value / totalTargetAmount.value) * 100)
})

// 已完成目标数
const completedGoals = computed(() => {
  return store.goals.filter(goal => goal.isCompleted).length
})

// 进行中目标数
const inProgressGoals = computed(() => {
  return store.goals.filter(goal => !goal.isCompleted).length
})

// 分类统计
const categoryStats = computed(() => {
  const categoryMap = {}
  
  // 计算每个分类的总金额
  store.goals.forEach(goal => {
    if (!categoryMap[goal.category]) {
      categoryMap[goal.category] = 0
    }
    categoryMap[goal.category] += goal.currentAmount
  })
  
  // 转换为数组并计算百分比
  const total = totalSavedAmount.value
  return Object.keys(categoryMap)
    .map(category => {
      const amount = categoryMap[category]
      const percentage = total > 0 ? Math.round((amount / total) * 100) : 0
      return {
        category,
        amount,
        percentage
      }
    })
    .sort((a, b) => b.amount - a.amount) // 按金额降序排列
})
</script>

<style scoped>
.statistics-view {
  padding: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

.statistics-view h1 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 32px;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 15px;
}

.stat-label {
  font-size: 18px;
  color: #666;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
}

.chart-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chart-container h2 {
  margin-top: 0;
  margin-bottom: 25px;
  text-align: center;
  font-size: 24px;
}

.category-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category-bar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.category-info {
  display: flex;
  justify-content: space-between;
}

.category-name {
  font-weight: 500;
  font-size: 16px;
}

.category-amount {
  color: #666;
  font-size: 16px;
}

.progress-bar {
  height: 16px;
  background-color: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #409eff;
  border-radius: 8px;
  transition: width 0.5s ease;
}

.category-percent {
  text-align: right;
  font-size: 16px;
  color: #666;
}

.completion-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
  padding: 20px 0;
}

.completion-item {
  flex: 1;
}

.completion-value {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 15px;
}

.completion-value:first-child {
  color: #42b983;
}

.completion-value:last-child {
  color: #ffcc00;
}

.completion-label {
  font-size: 18px;
  color: #666;
}

.no-data {
  text-align: center;
  padding: 50px;
  color: #999;
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-value {
    font-size: 28px;
  }
  
  .completion-stats {
    flex-direction: column;
    gap: 30px;
  }
  
  .statistics-view {
    padding: 15px;
  }
  
  .statistics-view h1 {
    font-size: 28px;
    margin-bottom: 30px;
  }
  
  .summary-stats {
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    padding: 25px;
  }
  
  .charts-section {
    gap: 20px;
  }
  
  .chart-container {
    padding: 25px;
  }
  
  .chart-container h2 {
    font-size: 22px;
    margin-bottom: 20px;
  }
  
  .completion-value {
    font-size: 40px;
  }
}

@media (max-width: 576px) {
  .statistics-view {
    padding: 10px;
  }
  
  .statistics-view h1 {
    font-size: 24px;
    margin-bottom: 25px;
  }
  
  .summary-stats {
    gap: 15px;
    margin-bottom: 25px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-value {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .stat-label {
    font-size: 16px;
  }
  
  .charts-section {
    gap: 15px;
  }
  
  .chart-container {
    padding: 20px;
  }
  
  .chart-container h2 {
    font-size: 20px;
    margin-bottom: 15px;
  }
  
  .category-info {
    flex-direction: column;
    gap: 5px;
  }
  
  .category-percent {
    text-align: left;
  }
  
  .completion-stats {
    gap: 20px;
    padding: 10px 0;
  }
  
  .completion-value {
    font-size: 36px;
    margin-bottom: 10px;
  }
  
  .completion-label {
    font-size: 16px;
  }
}

@media (max-width: 400px) {
  .statistics-view h1 {
    font-size: 22px;
  }
  
  .stat-value {
    font-size: 22px;
  }
  
  .stat-label {
    font-size: 15px;
  }
  
  .chart-container h2 {
    font-size: 18px;
  }
  
  .category-name,
  .category-amount {
    font-size: 15px;
  }
  
  .category-percent {
    font-size: 15px;
  }
  
  .completion-value {
    font-size: 32px;
  }
  
  .completion-label {
    font-size: 15px;
  }
}

@media (min-width: 1400px) {
  .charts-section {
    grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  }
}
</style>