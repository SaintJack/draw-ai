# 项目搭建指南

## 阶段一：项目准备与搭建

本文档说明如何完成阶段一的所有任务。

### 任务 1.1：项目初始化 ✅

已完成：
- ✅ 创建 React Native 项目结构
- ✅ 配置 TypeScript
- ✅ 初始化 Git 仓库（.gitignore）
- ✅ 配置代码规范（ESLint、Prettier）
- ✅ 创建项目目录结构

### 任务 1.2：依赖安装与配置

#### 安装依赖

```bash
# 安装 npm 依赖
npm install

# iOS 依赖（如果支持 iOS）
cd ios && pod install && cd ..
```

#### 配置 Android 开发环境

1. 确保已安装：
   - Android Studio
   - Java JDK 11+
   - Android SDK (API Level 21+)

2. 配置环境变量：
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

#### 测试开发环境

```bash
# 启动 Metro bundler
npm start

# 在另一个终端运行 Android
npm run android
```

### 任务 1.3：基础架构搭建 ✅

已完成：
- ✅ 配置路由（React Navigation）
- ✅ 创建基础页面结构（DrawingScreen、GalleryScreen、SettingsScreen）
- ✅ 配置状态管理（Zustand Store）
- ✅ 创建工具函数目录结构
- ✅ 编写基础组件模板

## 项目结构

```
draw-ai/
├── src/
│   ├── components/          # React 组件
│   │   └── common/           # 通用组件
│   ├── screens/              # 页面组件
│   │   ├── DrawingScreen.tsx
│   │   ├── GalleryScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/           # 导航配置
│   │   └── AppNavigator.tsx
│   ├── store/                # 状态管理
│   │   └── drawingStore.ts
│   ├── models/               # 数据模型
│   │   ├── Shape.ts
│   │   ├── Drawing.ts
│   │   └── History.ts
│   ├── services/             # 业务服务
│   │   └── aiService.ts
│   ├── utils/                # 工具函数
│   │   └── helpers.ts
│   └── App.tsx               # 应用入口
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
└── index.js
```

## 下一步

1. 运行 `npm install` 安装所有依赖
2. 运行 `npm start` 启动 Metro bundler
3. 运行 `npm run android` 启动 Android 应用
4. 验证应用可以正常运行

## 里程碑 1

✅ **项目搭建完成，可运行基础应用**

验证标准：
- [ ] 应用可以正常启动
- [ ] 路由导航正常工作
- [ ] 三个页面（画布、作品集、设置）可以正常切换
- [ ] 代码规范检查通过（`npm run lint`）
- [ ] TypeScript 类型检查通过（`npm run type-check`）
