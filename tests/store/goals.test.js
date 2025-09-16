import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { useGoalsStore } from '../../src/store/goals.js'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Goals Store', () => {
  beforeEach(() => {
    // 创建新的 Pinia 实例并设置为活跃实例
    setActivePinia(createPinia())
    
    // 清空 localStorage
    localStorage.clear()
  })

  it('initializes with empty goals and records', () => {
    const store = useGoalsStore()
    expect(store.goals).toEqual([])
    expect(store.records).toEqual([])
  })

  it('adds a new goal', () => {
    const store = useGoalsStore()
    const goalData = {
      name: 'Test Goal',
      targetAmount: 1000,
      category: 'Test',
      deadline: new Date('2023-12-31')
    }

    store.addGoal(goalData)

    expect(store.goals).toHaveLength(1)
    const goal = store.goals[0]
    expect(goal.name).toBe('Test Goal')
    expect(goal.targetAmount).toBe(1000)
    expect(goal.category).toBe('Test')
    expect(goal.currentAmount).toBe(0)
    expect(goal.isCompleted).toBe(false)
    expect(goal.id).toBeTruthy()
    expect(goal.createdAt).toBeInstanceOf(Date)
    expect(goal.updatedAt).toBeInstanceOf(Date)
  })

  it('updates a goal', () => {
    const store = useGoalsStore()
    const goalData = {
      name: 'Test Goal',
      targetAmount: 1000,
      category: 'Test'
    }

    store.addGoal(goalData)
    const goalId = store.goals[0].id
    
    const updateTime = new Date()
    store.updateGoal(goalId, {
      name: 'Updated Goal',
      targetAmount: 2000
    })

    const updatedGoal = store.goals[0]
    expect(updatedGoal.name).toBe('Updated Goal')
    expect(updatedGoal.targetAmount).toBe(2000)
    expect(updatedGoal.updatedAt).toBeInstanceOf(Date)
  })

  it('deletes a goal', () => {
    const store = useGoalsStore()
    const goalData = { name: 'Test Goal', targetAmount: 1000, category: 'Test' }

    store.addGoal(goalData)
    const goalId = store.goals[0].id
    
    store.deleteGoal(goalId)

    expect(store.goals).toHaveLength(0)
  })

  it('adds a record and updates goal amount', () => {
    const store = useGoalsStore()
    const goalData = { name: 'Test Goal', targetAmount: 1000, category: 'Test' }
    
    store.addGoal(goalData)
    const goalId = store.goals[0].id
    
    const recordData = {
      goalId: goalId,
      amount: 100,
      remark: 'Test deposit'
    }
    
    store.addRecord(recordData)
    
    expect(store.records).toHaveLength(1)
    const record = store.records[0]
    expect(record.goalId).toBe(goalId)
    expect(record.amount).toBe(100)
    expect(record.remark).toBe('Test deposit')
    expect(record.id).toBeTruthy()
    expect(record.recordedAt).toBeInstanceOf(Date)
    
    // 检查目标金额是否更新
    const goal = store.goals[0]
    expect(goal.currentAmount).toBe(100)
  })

  it('marks goal as completed when target is reached', () => {
    const store = useGoalsStore()
    const goalData = { name: 'Test Goal', targetAmount: 100, category: 'Test' }
    
    store.addGoal(goalData)
    const goalId = store.goals[0].id
    
    const recordData = {
      goalId: goalId,
      amount: 100
    }
    
    store.addRecord(recordData)
    
    const goal = store.goals[0]
    expect(goal.currentAmount).toBe(100)
    expect(goal.isCompleted).toBe(true)
  })

  it('loads data from localStorage', () => {
    // 准备测试数据
    const testGoals = [{
      id: '1',
      name: 'Test Goal',
      targetAmount: 1000,
      currentAmount: 500,
      category: 'Test',
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deadline: new Date().toISOString()
    }]
    
    const testRecords = [{
      id: '1',
      goalId: '1',
      amount: 100,
      remark: 'Test record',
      recordedAt: new Date().toISOString()
    }]
    
    localStorage.setItem('goalpurse-goals', JSON.stringify(testGoals))
    localStorage.setItem('goalpurse-records', JSON.stringify(testRecords))
    
    // 创建新的 store 实例并加载数据
    const store = useGoalsStore()
    store.loadFromLocalStorage()
    
    expect(store.goals).toHaveLength(1)
    expect(store.goals[0].name).toBe('Test Goal')
    expect(store.goals[0].createdAt).toBeInstanceOf(Date)
    
    expect(store.records).toHaveLength(1)
    expect(store.records[0].remark).toBe('Test record')
    expect(store.records[0].recordedAt).toBeInstanceOf(Date)
  })

  it('calculates getters correctly', () => {
    const store = useGoalsStore()
    
    // 使用store的方法添加目标，更贴近真实使用场景
    store.addGoal({ 
      name: 'Goal 1', 
      targetAmount: 1000, 
      category: 'Test'
    })
    
    store.addGoal({ 
      name: 'Goal 2', 
      targetAmount: 2000, 
      category: 'Test'
    })
    
    // 添加记录来增加目标金额
    const goal1Id = store.goals[0].id
    const goal2Id = store.goals[1].id
    
    store.addRecord({ goalId: goal1Id, amount: 500 })
    store.addRecord({ goalId: goal2Id, amount: 1000 })
    
    // 测试 getGoalById
    const goal = store.getGoalById(goal1Id)
    expect(goal.name).toBe('Goal 1')
    
    // 测试 getTotalTargetAmount getter
    expect(store.getTotalTargetAmount).toBe(3000)
    
    // 测试 getTotalSavedAmount getter
    expect(store.getTotalSavedAmount).toBe(1500)
    
    // 测试 getCompletionRate getter
    expect(store.getCompletionRate).toBe(50)
  })

  it('deletes a goal and its associated records', () => {
    const store = useGoalsStore()
    const goalData = { name: 'Test Goal', targetAmount: 1000, category: 'Test' }

    store.addGoal(goalData)
    const goalId = store.goals[0].id
    
    // 添加一些记录
    store.addRecord({ goalId, amount: 100, remark: 'Record 1' })
    store.addRecord({ goalId, amount: 200, remark: 'Record 2' })
    
    expect(store.goals).toHaveLength(1)
    expect(store.records).toHaveLength(2)
    
    // 删除目标
    store.deleteGoal(goalId)
    
    expect(store.goals).toHaveLength(0)
    expect(store.records).toHaveLength(0)
  })

  it('deletes a record and updates goal amount', () => {
    const store = useGoalsStore()
    const goalData = { name: 'Test Goal', targetAmount: 1000, category: 'Test' }

    store.addGoal(goalData)
    const goalId = store.goals[0].id
    
    // 添加记录并保存ID
    store.addRecord({ goalId, amount: 100, remark: 'Record 1' })
    const firstRecordId = store.records[0].id
    
    // 添加一个小延迟以确保ID不同
    return new Promise(resolve => {
      setTimeout(() => {
        store.addRecord({ goalId, amount: 200, remark: 'Record 2' })
        const secondRecordId = store.records[1].id
        
        expect(store.goals[0].currentAmount).toBe(300)
        expect(store.records).toHaveLength(2)
        
        // 删除第一条记录
        store.deleteRecord(firstRecordId)
        
        expect(store.goals[0].currentAmount).toBe(200)
        expect(store.records).toHaveLength(1)
        
        // 确保删除的是正确的记录
        expect(store.records.find(r => r.id === firstRecordId)).toBeUndefined()
        expect(store.records.find(r => r.id === secondRecordId)).toBeDefined()
        
        resolve()
      }, 1)
    })
  })
})