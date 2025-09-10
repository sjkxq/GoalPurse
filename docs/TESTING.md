# GoalPurse 测试指南

## 测试框架介绍

GoalPurse 使用以下测试工具：

- [Vitest](https://vitest.dev/): 专为 Vite 设计的单元测试框架
- [Vue Test Utils](https://test-utils.vuejs.org/): Vue 组件测试工具
- [JSDOM](https://github.com/jsdom/jsdom): 用于在 Node.js 环境中模拟浏览器 DOM

## 运行测试

### 运行所有测试

```bash
pnpm test:run
```

### 交互式测试模式

```bash
pnpm test
```

### 查看测试覆盖率

```bash
pnpm test:coverage
```

## 测试文件结构

测试文件有两种放置方式：

1. 在组件或模块同级目录下，命名为 `[name].test.js`
2. 在项目根目录下创建 `tests` 目录，按功能模块组织测试文件

## 编写测试

### 组件测试

使用 Vue Test Utils 提供的 `mount` 或 `shallowMount` 函数来挂载组件进行测试：

```javascript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent, {
      props: {
        // 传递测试需要的 props
      }
    })
    
    // 断言组件渲染正确
    expect(wrapper.text()).toContain('期望的文本')
  })
})
```

### Store 测试

对于 Pinia store 的测试，需要创建一个测试专用的 Pinia 实例：

```javascript
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, it, expect } from 'vitest'
import { useMyStore } from '@/store/myStore'

describe('My Store', () => {
  beforeEach(() => {
    // 为每个测试创建一个新的 Pinia 实例
    setActivePinia(createPinia())
  })

  it('initializes correctly', () => {
    const store = useMyStore()
    // 测试 store 的初始状态
    expect(store.myState).toBe(initialValue)
  })
})
```

### Mocking

对于浏览器 API 或外部依赖，可以使用 Vitest 的 mocking 功能：

```javascript
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
```

## 测试最佳实践

1. **每个测试应该独立**：测试之间不应该有依赖关系
2. **使用描述性的测试名称**：测试名称应该清楚地描述正在测试的内容
3. **测试单一职责**：每个测试应该只测试一个功能点
4. **使用 beforeEach/afterEach**：用于设置和清理测试环境
5. **Mock 外部依赖**：确保测试的稳定性和可预测性

## 当前测试覆盖范围

目前项目包含以下测试：

1. `ProgressBar` 组件测试：
   - 进度百分比计算
   - 不同进度状态的样式类
   - 边界情况处理（0% 和 100%）

2. `goals` Store 测试：
   - Store 初始化
   - 添加、更新、删除目标
   - 添加记录并更新目标金额
   - 目标完成状态的自动更新
   - 从 localStorage 加载数据
   - Getters 计算

## 添加新测试

1. 为新组件或功能创建对应的测试文件，命名为 `[name].test.js`
2. 将测试文件放在与被测试文件相同的目录中
3. 使用 `describe` 和 `it` 组织测试结构
4. 使用 `expect` 进行断言
5. 运行测试确保新测试通过

## 故障排除

### 测试运行缓慢

如果测试运行缓慢，可以尝试：

1. 检查是否有异步操作未正确处理
2. 确保所有测试都是独立的，没有不必要的依赖
3. 使用 `vi.mock()` mock 掉耗时的外部依赖

### 测试失败

如果测试失败：

1. 检查错误信息和堆栈跟踪
2. 确认测试预期是否正确
3. 检查被测试的代码是否有问题
4. 确保所有依赖都被正确 mock