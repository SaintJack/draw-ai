# 儿童简笔画 AI 画图 APP

> **"孩子用嘴说，也能一起画画的简笔画应用"**

一款专为 4-8 岁儿童设计的智能简笔画应用，通过自然语言描述即可生成可编辑的简笔画图形，让儿童无需掌握绘画技巧也能完成创作。

## 📱 项目简介

当前儿童绘画类应用主要分为两类：
- **纯手绘类**：对低龄儿童操作要求较高，容易产生挫败感
- **AI 生成图片类**：结果不可编辑，儿童参与感弱，更多是"看图而非画图"

本项目结合 **儿童自然语言表达能力** 与 **简笔画低精度、高容错** 的特点，打造一款：
- 让儿童用语音或文字描述想法
- AI 将语言转换为可编辑的图形结构
- 支持局部修改、手动绘制、撤销重做
- 增强儿童表达欲与创造参与感

## ✨ 核心功能

### 🎨 自然语言绘画
- **语音输入**：支持语音识别，儿童可以直接说话描述
- **文字输入**：支持简单文字输入作为备选
- **智能解析**：AI 将自然语言转换为结构化绘图指令
- **模糊理解**：支持不完整句子、重复、停顿、模糊指代（"这个""那个"）

### 🖼️ 画布功能
- **基础图形**：圆、椭圆、直线、折线、矩形、点
- **简笔画风格**：线条轻微随机抖动，无复杂颜色与阴影
- **无限画布**：支持自适应画布或无限画布
- **手动绘制**：支持手指/鼠标手动绘制
- **图形操作**：拖动、缩放、删除单个图形

### 🔄 编辑功能
- **局部修改**：支持"这个再大一点"、"换成圆的"等自然语言修改
- **撤销/重做**：支持至少 20 步操作历史
- **图形引用**：AI 能引用"最近操作/最近图形"

### 💾 作品管理
- **本地保存**：作品自动保存到本地数据库
- **作品集**：查看、管理所有作品
- **导出分享**：导出 PNG/JPG 格式，支持分享到社交平台

### 🎭 动画与反馈
- **绘制动画**：显示"画出来"的过程动画
- **即时反馈**：操作响应时间 < 500ms
- **动效提示**：新图形出现时有轻微动效

## 🛠️ 技术栈

### 前端（React Native）
- **框架**：React Native 0.72+ with TypeScript
- **UI 库**：React Native Paper
- **状态管理**：Zustand
- **导航**：React Navigation
- **绘图引擎**：react-native-svg
- **语音识别**：@react-native-voice/voice
- **本地存储**：SQLite (react-native-sqlite-storage) + AsyncStorage
- **网络请求**：Axios

### 后端（Node.js）
- **框架**：Express.js
- **语言**：TypeScript
- **AI 服务**：大语言模型 API（受限 Prompt）

### 开发工具
- **包管理**：npm / yarn
- **构建工具**：React Native CLI
- **代码规范**：ESLint + Prettier

## 📁 项目结构

```
draw-ai/
├── docs/                          # 文档目录
│   ├── 儿童简笔画_ai_画图_app_需求说明书.md
│   └── 技术设计文档.md
├── src/                           # React Native 源代码
│   ├── components/                # React 组件
│   │   ├── Canvas/                # 画布组件
│   │   ├── VoiceInput/            # 语音输入组件
│   │   ├── Toolbar/               # 工具栏组件
│   │   └── Gallery/               # 作品集组件
│   ├── screens/                   # 页面组件
│   │   ├── DrawingScreen.tsx
│   │   ├── GalleryScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/                  # 业务服务
│   │   ├── aiService.ts           # AI 解析服务
│   │   ├── storageService.ts      # 存储服务
│   │   └── voiceService.ts        # 语音识别服务
│   ├── store/                     # 状态管理（Zustand）
│   │   ├── drawingStore.ts
│   │   ├── historyStore.ts
│   │   └── voiceStore.ts
│   ├── models/                    # 数据模型
│   │   ├── Shape.ts
│   │   ├── Drawing.ts
│   │   └── History.ts
│   ├── utils/                     # 工具函数
│   │   ├── drawingEngine.ts
│   │   └── permissions.ts
│   └── navigation/               # 导航配置
│       └── AppNavigator.tsx
├── server/                        # Node.js 后端（可选但推荐）
│   ├── src/
│   │   ├── routes/                 # API 路由
│   │   │   └── ai.routes.ts
│   │   ├── services/              # 业务服务
│   │   │   └── llmService.ts
│   │   └── app.ts                 # Express 应用
│   └── package.json
├── android/                       # Android 原生代码
├── ios/                           # iOS 原生代码（可选）
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 快速开始

### 环境要求

- **Node.js**：18.0 或更高版本
- **npm** 或 **yarn**：最新版本
- **Android Studio**：最新版本（用于 Android 开发）
- **Java JDK**：11 或更高版本
- **Android SDK**：API Level 21+ (Android 5.0+)

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd draw-ai
   ```

2. **安装依赖**
   ```bash
   # 安装前端依赖
   npm install
   # 或
   yarn install

   # 安装后端依赖（如果使用 Node.js 后端）
   cd server
   npm install
   cd ..
   ```

3. **配置环境变量**
   
   创建 `.env` 文件（前端）：
   ```env
   API_BASE_URL=http://localhost:3000/api
   ```
   
   创建 `server/.env` 文件（后端）：
   ```env
   LLM_API_URL=https://api.openai.com/v1/chat/completions
   LLM_API_KEY=your_api_key_here
   PORT=3000
   ```

4. **启动 Metro  bundler**
   ```bash
   npm start
   # 或
   yarn start
   ```

5. **运行 Android 应用**
   ```bash
   npm run android
   # 或
   yarn android
   ```

### 首次运行

1. 确保 Android 模拟器已启动，或连接了 Android 设备
2. 运行 `npm run android`
3. 应用会自动安装并启动
4. 首次使用需要授予录音权限

## 📖 开发指南

### 开发模式

```bash
# 启动 Metro bundler（开发服务器）
npm start

# 在另一个终端运行 Android
npm run android

# 或运行 iOS（需要 macOS）
npm run ios
```

### 代码规范

项目使用 ESLint 和 Prettier 进行代码格式化：

```bash
# 检查代码规范
npm run lint

# 自动修复
npm run lint:fix

# 格式化代码
npm run format
```

### 测试

```bash
# 运行单元测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage
```

### 调试

- **React Native Debugger**：推荐使用 [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- **Chrome DevTools**：在 Metro bundler 运行时，按 `j` 打开调试器
- **Flipper**：使用 Facebook Flipper 进行网络和日志调试

## 🏗️ 构建与部署

### Android 构建

#### 开发版本（Debug）
```bash
npm run android
```

#### 发布版本（Release APK）
```bash
npm run android:release
# 输出：android/app/build/outputs/apk/release/app-release.apk
```

#### Google Play 版本（AAB）
```bash
npm run android:bundle
# 输出：android/app/build/outputs/bundle/release/app-release.aab
```

### 配置签名

1. 生成签名密钥：
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore keystore.jks -alias drawai -keyalg RSA -keysize 2048 -validity 10000
   ```

2. 配置 `android/gradle.properties`：
   ```properties
   MYAPP_RELEASE_STORE_FILE=keystore.jks
   MYAPP_RELEASE_KEY_ALIAS=drawai
   MYAPP_RELEASE_STORE_PASSWORD=your_store_password
   MYAPP_RELEASE_KEY_PASSWORD=your_key_password
   ```

### 后端部署

后端服务可以部署到：
- **云服务**：AWS、Azure、Google Cloud
- **容器化**：Docker + Kubernetes
- **Serverless**：Vercel、Netlify Functions

示例 Dockerfile：
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server/src/app.js"]
```

## 📚 文档

- [需求说明书](./docs/儿童简笔画_ai_画图_app_需求说明书.md)
- [技术设计文档](./docs/技术设计文档.md)

## 🎯 核心设计原则

1. **先画出来，再慢慢改**：避免因理解不准打断体验
2. **局部修改优先于整体重画**
3. **允许不准确、不过度纠正**
4. **AI 不直接画像素，只生成绘图意图**
5. **孩子永远是创作者，AI 是帮手**

## 🔒 安全与隐私

- **儿童隐私保护**：不采集儿童个人敏感信息
- **本地优先**：数据优先存储在本地设备
- **受限 AI**：所有语言解析仅用于绘画，不开放自由聊天
- **权限最小化**：仅申请必要权限（录音、存储）

## 📊 性能指标

- **首次出图**：< 2 秒
- **修改操作**：< 500ms
- **启动时间**：< 2 秒
- **内存占用**：< 200MB

## 🗺️ 版本规划

### V1.0（MVP）
- ✅ 基础画布
- ✅ 5 种图形（圆、椭圆、直线、折线、矩形、点）
- ✅ 语言绘制 + 局部修改
- ✅ 保存导出

### V1.5（计划中）
- 语音输入优化
- 更多儿童语义理解
- 简单主题（人物/动物）

### V2.0（计划中）
- 儿童作品集
- 家长控制台
- 向教学图/原理图模式扩展

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

## 📝 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 👥 团队

- **产品设计**：基于儿童绘画教育需求
- **技术开发**：React Native + Node.js 技术栈
- **AI 算法**：大语言模型集成

## 📮 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](../../issues)
- 发送邮件：[your-email@example.com]

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和设计师！

---

**让每个孩子都能用语言创造属于自己的画作** 🎨✨
