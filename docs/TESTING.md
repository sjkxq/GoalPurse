# GoalPurse 测试文档

## 概述

本文档描述了 GoalPurse 项目的测试策略、测试环境配置和测试用例，确保项目质量和稳定性。

## 测试策略

### 单元测试

#### 组件测试
- 测试各个 Vue 组件的功能和渲染
- 验证组件的输入输出行为
- 检查组件的状态管理和事件处理

#### Store 测试
- 测试 Pinia Store 的状态管理功能
- 验证数据操作的正确性
- 检查数据持久化功能

#### 工具函数测试
- 测试项目中的工具函数和辅助方法
- 验证边界条件和异常处理

### 集成测试

#### 路由测试
- 测试 Vue Router 的导航功能
- 验证路由参数的传递和处理
- 检查路由守卫的功能

#### 数据流测试
- 测试完整的数据流，从组件到 Store 再到持久化
- 验证数据的一致性和完整性

### 端到端测试

#### 用户流程测试
- 测试用户的核心操作流程
- 验证完整的功能链路
- 检查用户体验和界面交互

## 测试环境配置

### 依赖项

项目使用以下测试相关依赖：

- Vitest：测试运行器
- Vue Test Utils：Vue 组件测试工具
- JSDOM：浏览器环境模拟

### 配置文件

#### vitest.config.js
```javascript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: ['@vue/test-utils']
    }
  }
})
```

## 运行测试

### 交互式测试模式
```bash
pnpm test
```

### 一次性运行所有测试
```bash
pnpm test:run
```

### 生成覆盖率报告
```bash
pnpm test:coverage
```

## 测试用例

### ProgressBar 组件测试

#### 测试点
- 进度条正确显示进度百分比
- 进度条颜色根据进度变化
- 边界值处理（0% 和 100%）
- 无效输入处理

#### 测试代码
```javascript
import { mount } from '@vue/test-utils'
import ProgressBar from '../src/components/ProgressBar.vue'

describe('ProgressBar.vue', () => {
  it('renders progress correctly', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        progress: 50
      }
    })
    expect(wrapper.find('.progress').attributes('style')).toContain('width: 50%')
  })

  it('clamps progress between 0 and 100', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        progress: 150
      }
    })
    expect(wrapper.find('.progress').attributes('style')).toContain('width: 100%')
  })
})
```

### Goals Store 测试

#### 测试点
- 目标添加功能
- 目标更新功能
- 目标删除功能
- 数据持久化功能

#### 测试代码
```javascript
import { createPinia, setActivePinia } from 'pinia'
import { useGoalsStore } from '../src/store/goals'

describe('Goals Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds a goal', () => {
    const store = useGoalsStore()
    const goal = {
      title: 'Test Goal',
      description: 'Test Description',
      target: 100,
      current: 0,
      unit: 'points'
    }
    
    store.addGoal(goal)
    expect(store.goals).toHaveLength(1)
    expect(store.goals[0]).toMatchObject(goal)
  })

  it('updates goal progress', () => {
    const store = useGoalsStore()
    const goal = {
      title: 'Test Goal',
      description: 'Test Description',
      target: 100,
      current: 0,
      unit: 'points'
    }
    
    store.addGoal(goal)
    const goalId = store.goals[0].id
    store.updateGoalProgress(goalId, 50)
    
    expect(store.goals[0].current).toBe(50)
  })
})
```

## 测试最佳实践

### 测试结构
- 每个测试文件对应一个组件或模块
- 使用清晰的测试描述
- 遵循 AAA 模式（Arrange, Act, Assert）

### 测试数据
- 使用真实但简化的测试数据
- 避免在测试间共享状态
- 为每个测试准备独立的测试环境

### 测试覆盖
- 优先测试核心功能
- 覆盖边界条件和异常情况
- 定期检查和更新测试用例

## 持续集成

### 自动化测试
- 每次提交触发自动化测试
- 测试结果反馈到代码仓库
- 阻止失败的构建进入生产环境

### 测试报告
- 生成详细的测试报告
- 跟踪测试覆盖率趋势
- 提供可视化的测试结果展示

## 故障排除

### 常见问题

#### 测试环境问题
- 确保所有测试依赖已正确安装
- 检查 vitest.config.js 配置是否正确
- 验证 JSDOM 环境是否正常工作

#### 组件测试问题
- 确保正确模拟组件依赖
- 检查异步操作的处理
- 验证事件监听和触发机制

#### Store 测试问题
- 确保每次测试前重置 Pinia 状态
- 验证 localStorage 模拟是否正常工作
- 检查异步操作的测试处理