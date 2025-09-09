import { defineStore } from 'pinia'

export const useGoalsStore = defineStore('goals', {
  state: () => ({
    goals: [],
    records: []
  }),
  
  getters: {
    getGoalById: (state) => (id) => {
      return state.goals.find(goal => goal.id === id)
    },
    
    getRecordsByGoalId: (state) => (goalId) => {
      return state.records.filter(record => record.goalId === goalId)
    },
    
    getTotalTargetAmount: (state) => {
      return state.goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
    },
    
    getTotalSavedAmount: (state) => {
      return state.goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
    },
    
    getCompletionRate: (state) => {
      const totalTarget = state.goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
      const totalSaved = state.goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
      return totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0
    }
  },
  
  actions: {
    addGoal(goal) {
      this.goals.push({
        ...goal,
        id: Date.now().toString(),
        currentAmount: 0,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      this.saveToLocalStorage()
    },
    
    updateGoal(id, updates) {
      const goal = this.goals.find(goal => goal.id === id)
      if (goal) {
        Object.assign(goal, updates, { updatedAt: new Date() })
        this.saveToLocalStorage()
      }
    },
    
    deleteGoal(id) {
      this.goals = this.goals.filter(goal => goal.id !== id)
      // 同时删除相关记录
      this.records = this.records.filter(record => record.goalId !== id)
      this.saveToLocalStorage()
    },
    
    addRecord(record) {
      this.records.push({
        ...record,
        id: Date.now().toString(),
        recordedAt: new Date()
      })
      
      // 更新目标的当前金额
      const goal = this.goals.find(g => g.id === record.goalId)
      if (goal) {
        goal.currentAmount += record.amount
        goal.updatedAt = new Date()
        // 检查是否已完成
        if (goal.currentAmount >= goal.targetAmount) {
          goal.isCompleted = true
        }
      }
      
      this.saveToLocalStorage()
    },
    
    deleteRecord(id) {
      const record = this.records.find(r => r.id === id)
      if (record) {
        // 更新目标金额
        const goal = this.goals.find(g => g.id === record.goalId)
        if (goal) {
          goal.currentAmount -= record.amount
          goal.isCompleted = goal.currentAmount >= goal.targetAmount
          goal.updatedAt = new Date()
        }
        
        // 删除记录
        this.records = this.records.filter(r => r.id !== id)
        this.saveToLocalStorage()
      }
    },
    
    loadFromLocalStorage() {
      const goalsData = localStorage.getItem('goalpurse-goals')
      const recordsData = localStorage.getItem('goalpurse-records')
      
      if (goalsData) {
        this.goals = JSON.parse(goalsData).map(goal => ({
          ...goal,
          createdAt: new Date(goal.createdAt),
          updatedAt: new Date(goal.updatedAt),
          deadline: goal.deadline ? new Date(goal.deadline) : null
        }))
      }
      
      if (recordsData) {
        this.records = JSON.parse(recordsData).map(record => ({
          ...record,
          recordedAt: new Date(record.recordedAt)
        }))
      }
    },
    
    saveToLocalStorage() {
      localStorage.setItem('goalpurse-goals', JSON.stringify(this.goals))
      localStorage.setItem('goalpurse-records', JSON.stringify(this.records))
    }
  }
})