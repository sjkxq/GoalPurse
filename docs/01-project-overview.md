# GoalPurse 项目概述

## 项目简介

GoalPurse 是一个基于 Vue.js 的个人目标管理应用，旨在帮助用户设定、追踪和完成个人目标。该应用提供了直观的界面和可视化的进度跟踪功能，让用户能够更好地管理自己的目标。

## 核心功能

- 目标创建与管理
- 进度跟踪与可视化
- 数据本地存储与加密
- 响应式设计，支持多设备使用

## 技术架构

### 前端技术栈

- Vue 3：用于构建用户界面的渐进式框架
- Vue Router：实现单页面应用路由管理
- Pinia：Vue 的轻量级状态管理库
- Vite：现代化的前端构建工具
- CryptoJS：用于数据加密

### 移动端技术栈

- Capacitor：用于将 Web 应用打包为原生移动应用的跨平台解决方案
- Android SDK：用于构建 Android 应用

## 项目结构

```
GoalPurse/
├── src/                     # Vue.js 源代码
│   ├── components/          # 可复用组件
│   ├── router/              # 路由配置
│   ├── store/               # 状态管理
│   ├── views/               # 页面视图
│   ├── App.vue              # 根组件
│   ├── main.js              # 应用入口
│   └── style.css            # 全局样式
├── android/                 # Android 项目目录
├── docs/                    # 项目文档
├── dist/                    # 构建输出目录
├── package.json             # 项目依赖和脚本配置
└── vite.config.js           # Vite 构建配置
```

## 构建与部署

### Web 版本构建

```bash
# 开发环境运行
pnpm dev

# 生产环境构建
pnpm build

# 预览构建结果
pnpm preview
```

### 移动端 APK 构建

```bash
# 构建 Android APK
pnpm build:apk
```

详细构建说明请参考 [构建 APK 说明](./building-apk.md) 文档。