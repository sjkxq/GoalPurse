<template>
  <div class="goal-detail-view" v-if="goal">
    <div class="goal-header">
      <button class="back-button" @click="goBack">← 返回</button>
      <h1>{{ goal.name }}</h1>
      <div class="goal-meta">
        <span class="category">{{ goal.category }}</span>
        <span v-if="goal.deadline" class="deadline">
          截止日期: {{ formatDate(goal.deadline) }}
        </span>
      </div>
    </div>
    
    <div class="goal-progress">
      <div class="amount-display">
        <div class="current-amount">
          <span class="label">已存金额</span>
          <span class="value">¥{{ goal.currentAmount.toFixed(2) }}</span>
        </div>
        <div class="separator">/</div>
        <div class="target-amount">
          <span class="label">目标金额</span>
          <span class="value">¥{{ goal.targetAmount.toFixed(2) }}</span>
        </div>
        <div class="remaining-amount">
          <span class="label">剩余金额</span>
          <span class="value">¥{{ remainingAmount.toFixed(2) }}</span>
        </div>
      </div>
      
      <ProgressBar 
        :current="goal.currentAmount" 
        :target="goal.targetAmount" 
        :completed="goal.isCompleted"
      />
      
      <div class="progress-percent">
        完成度: {{ progressPercent }}%
      </div>
    </div>
    
    <div class="actions-section">
      <button class="action-button deposit" @click="showDepositModal = true">
        添加存款
      </button>
      <button class="action-button withdraw" @click="showWithdrawModal = true">
        减少金额
      </button>
    </div>
    
    <div class="records-section">
      <h2>存款记录</h2>
      <div v-if="records.length === 0" class="no-records">
        暂无存款记录
      </div>
      <div v-else class="records-list">
        <div 
          v-for="record in records" 
          :key="record.id" 
          class="record-item"
        >
          <div class="record-info">
            <div class="record-amount" :class="{ negative: record.amount < 0 }">
              {{ record.amount > 0 ? '+' : '' }}{{ record.amount.toFixed(2) }}
            </div>
            <div class="record-remark">
              {{ record.remark || (record.amount > 0 ? '存款' : '取款') }}
            </div>
          </div>
          <div class="record-date">
            {{ formatDateTime(record.recordedAt) }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 存款模态框 -->
    <div v-if="showDepositModal" class="modal">
      <div class="modal-content">
        <h2>添加存款</h2>
        <form @submit.prevent="addDeposit" class="record-form">
          <div class="form-group">
            <label for="depositAmount">存款金额</label>
            <input 
              id="depositAmount" 
              v-model.number="depositForm.amount" 
              type="number" 
              min="0" 
              step="0.01"
              required
              placeholder="输入存款金额"
            >
          </div>
          
          <div class="form-group">
            <label for="depositRemark">备注</label>
            <input 
              id="depositRemark" 
              v-model="depositForm.remark" 
              type="text" 
              placeholder="例如：工资存入、兼职收入"
            >
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showDepositModal = false" class="cancel-btn">
              取消
            </button>
            <button type="submit" class="submit-btn">确认存款</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 取款模态框 -->
    <div v-if="showWithdrawModal" class="modal">
      <div class="modal-content">
        <h2>减少金额</h2>
        <form @submit.prevent="addWithdrawal" class="record-form">
          <div class="form-group">
            <label for="withdrawAmount">取款金额</label>
            <input 
              id="withdrawAmount" 
              v-model.number="withdrawForm.amount" 
              type="number" 
              min="0" 
              :max="goal.currentAmount"
              step="0.01"
              required
              placeholder="输入取款金额"
            >
          </div>
          
          <div class="form-group">
            <label for="withdrawReason">取款原因</label>
            <input 
              id="withdrawReason" 
              v-model="withdrawForm.reason" 
              type="text" 
              placeholder="请输入取款原因（选填）"
            >
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showWithdrawModal = false" class="cancel-btn">
              取消
            </button>
            <button type="submit" class="submit-btn">确认取款</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  
  <div v-else class="not-found">
    目标未找到
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGoalsStore } from '../store/goals'
import ProgressBar from '../components/ProgressBar.vue'

const route = useRoute()
const router = useRouter()
const store = useGoalsStore()

const showDepositModal = ref(false)
const showWithdrawModal = ref(false)

const depositForm = ref({
  amount: 0,
  remark: ''
})

const withdrawForm = ref({
  amount: 0,
  reason: ''
})

// 获取当前目标
const goal = computed(() => {
  return store.getGoalById(route.params.id)
})

// 获取目标记录
const records = computed(() => {
  return store.getRecordsByGoalId(route.params.id).sort((a, b) => 
    new Date(b.recordedAt) - new Date(a.recordedAt)
  )
})

// 计算剩余金额
const remainingAmount = computed(() => {
  if (!goal.value) return 0
  return Math.max(0, goal.value.targetAmount - goal.value.currentAmount)
})

// 计算完成百分比
const progressPercent = computed(() => {
  if (!goal.value) return 0
  if (goal.value.isCompleted) return 100
  if (goal.value.targetAmount <= 0) return 0
  return Math.min(100, Math.round((goal.value.currentAmount / goal.value.targetAmount) * 100))
})

// 方法
const goBack = () => {
  router.push('/')
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

const addDeposit = () => {
  if (depositForm.value.amount <= 0) {
    alert('请输入有效的存款金额')
    return
  }
  
  store.addRecord({
    goalId: goal.value.id,
    amount: depositForm.value.amount,
    remark: depositForm.value.remark
  })
  
  // 重置表单并关闭模态框
  depositForm.value = { amount: 0, remark: '' }
  showDepositModal.value = false
}

const addWithdrawal = () => {
  if (withdrawForm.value.amount <= 0) {
    alert('请输入有效的取款金额')
    return
  }
  
  if (withdrawForm.value.amount > goal.value.currentAmount) {
    alert('取款金额不能超过当前余额')
    return
  }
  
  store.addRecord({
    goalId: goal.value.id,
    amount: -withdrawForm.value.amount,
    remark: withdrawForm.value.reason
  })
  
  // 重置表单并关闭模态框
  withdrawForm.value = { amount: 0, reason: '' }
  showWithdrawModal.value = false
}

// 生命周期
onMounted(() => {
  store.loadFromLocalStorage()
})
</script>

<style scoped>
.goal-detail-view {
  padding: 25px;
  max-width: 1000px;
  margin: 0 auto;
}

.goal-header {
  margin-bottom: 35px;
}

.back-button {
  background: none;
  border: none;
  color: #409eff;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 15px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #f0f0f0;
}

.goal-header h1 {
  margin: 0 0 15px 0;
  font-size: 32px;
}

.goal-meta {
  display: flex;
  gap: 20px;
  font-size: 16px;
  color: #666;
}

.category {
  background-color: #e0e0e0;
  padding: 6px 12px;
  border-radius: 16px;
}

.goal-progress {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 35px;
}

.amount-display {
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
}

.amount-display .label {
  display: block;
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.amount-display .value {
  display: block;
  font-size: 24px;
  font-weight: bold;
}

.separator {
  display: flex;
  align-items: center;
  font-size: 28px;
  font-weight: bold;
  color: #999;
}

.progress-percent {
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
  font-size: 20px;
  color: #333;
}

.actions-section {
  display: flex;
  gap: 20px;
  margin-bottom: 35px;
}

.action-button {
  flex: 1;
  padding: 20px;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.action-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.deposit {
  background-color: #42b983;
  color: white;
}

.withdraw {
  background-color: #ff6b6b;
  color: white;
}

.records-section h2 {
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 24px;
}

.no-records {
  text-align: center;
  padding: 50px;
  color: #999;
  font-size: 18px;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.record-info {
  display: flex;
  flex-direction: column;
}

.record-amount {
  font-size: 20px;
  font-weight: bold;
  color: #42b983;
}

.record-amount.negative {
  color: #ff6b6b;
}

.record-remark {
  font-size: 16px;
  color: #666;
  margin-top: 5px;
}

.record-date {
  font-size: 14px;
  color: #999;
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
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.record-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.record-form .form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 16px;
}

.record-form .form-group input {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.record-form .form-actions {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.record-form .form-actions button {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
}

.submit-btn {
  background-color: #409eff;
  color: white;
}

.not-found {
  text-align: center;
  padding: 60px 25px;
  font-size: 20px;
  color: #666;
}

@media (max-width: 768px) {
  .goal-detail-view {
    padding: 15px;
  }
  
  .amount-display {
    flex-direction: column;
    gap: 20px;
  }
  
  .actions-section {
    flex-direction: column;
  }
  
  .record-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .goal-meta {
    flex-direction: column;
    gap: 10px;
  }
}
</style>