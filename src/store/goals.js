import { defineStore } from 'pinia'

/**
 * GoalPurse 应用的状态管理存储
 * 管理所有目标和进度记录数据
 * 提供数据的增删改查操作以及本地存储功能
 */
export const useGoalsStore = defineStore('goals', {
  /**
   * 状态初始化
   * @returns {Object} 包含目标数组和记录数组的初始状态
   */
  state: () => ({
    /**
     * 目标数组
     * @type {Array<Object>}
     */
    goals: [],
    /**
     * 记录数组
     * @type {Array<Object>}
     */
    records: []
  }),
  
  /**
   * 计算属性
   */
  getters: {
    /**
     * 根据ID获取目标
     * @param {Object} state - 当前状态
     * @returns {Function} 接收目标ID并返回对应目标的函数
     */
    getGoalById: (state) => (id) => {
      return state.goals.find(goal => goal.id === id)
    },
    
    /**
     * 根据目标ID获取相关记录
     * @param {Object} state - 当前状态
     * @returns {Function} 接收目标ID并返回相关记录数组的函数
     */
    getRecordsByGoalId: (state) => (goalId) => {
      return state.records.filter(record => record.goalId === goalId)
    },
    
    /**
     * 计算所有目标的总目标金额
     * @param {Object} state - 当前状态
     * @returns {number} 所有目标的目标金额总和
     */
    getTotalTargetAmount: (state) => {
      return state.goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
    },
    
    /**
     * 计算所有目标的当前金额总和
     * @param {Object} state - 当前状态
     * @returns {number} 所有目标的当前金额总和
     */
    getTotalSavedAmount: (state) => {
      return state.goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
    },
    
    /**
     * 计算整体完成率
     * @param {Object} state - 当前状态
     * @returns {number} 完成率百分比
     */
    getCompletionRate: (state) => {
      const totalTarget = state.goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
      const totalSaved = state.goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
      return totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0
    }
  },
  
  /**
   * 操作方法
   */
  actions: {
    /**
     * 添加新目标
     * @param {Object} goal - 目标对象
     * @param {string} goal.name - 目标名称
     * @param {string} goal.description - 目标描述
     * @param {number} goal.targetAmount - 目标金额
     * @param {string} goal.category - 目标分类
     * @param {Date} [goal.deadline] - 截止日期
     */
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
    
    /**
     * 更新目标信息
     * @param {string} id - 目标ID
     * @param {Object} updates - 更新内容对象
     */
    updateGoal(id, updates) {
      const goal = this.goals.find(goal => goal.id === id)
      if (goal) {
        Object.assign(goal, updates, { updatedAt: new Date() })
        this.saveToLocalStorage()
      }
    },
    
    /**
     * 删除目标
     * @param {string} id - 目标ID
     */
    deleteGoal(id) {
      this.goals = this.goals.filter(goal => goal.id !== id)
      // 同时删除相关记录
      this.records = this.records.filter(record => record.goalId !== id)
      this.saveToLocalStorage()
    },
    
    /**
     * 添加进度记录
     * @param {Object} record - 记录对象
     * @param {string} record.goalId - 关联的目标ID
     * @param {number} record.amount - 记录金额
     * @param {string} record.description - 记录描述
     */
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
    
    /**
     * 删除进度记录
     * @param {string} id - 记录ID
     */
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
    
    /**
     * 从本地存储加载数据
     */
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
    
    /**
     * 保存数据到本地存储
     */
    saveToLocalStorage() {
      localStorage.setItem('goalpurse-goals', JSON.stringify(this.goals))
      localStorage.setItem('goalpurse-records', JSON.stringify(this.records))
    }
  }
})