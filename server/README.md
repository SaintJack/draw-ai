# Draw AI Server

AI 解析服务后端，负责将自然语言转换为绘图指令。

## 快速开始

### 安装依赖

```bash
cd server
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置你的 LLM API Key：

```env
LLM_API_KEY=your_api_key_here
```

### 运行开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动。

### 构建生产版本

```bash
npm run build
npm start
```

## API 文档

### POST /api/v1/parse

解析自然语言为绘图指令。

**请求体**：
```json
{
  "text": "画一个圆",
  "context": {
    "shapes": [],
    "recentActions": []
  }
}
```

**响应**：
```json
{
  "action": "add",
  "shape": {
    "type": "circle",
    "properties": {
      "radius": 50
    }
  }
}
```

### GET /health

健康检查接口。

**响应**：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 环境变量

- `PORT`: 服务器端口（默认：3000）
- `NODE_ENV`: 环境模式（development/production）
- `LLM_API_URL`: LLM API 地址
- `LLM_API_KEY`: LLM API 密钥
- `LLM_MODEL`: LLM 模型名称（默认：gpt-3.5-turbo）

## 项目结构

```
server/
├── src/
│   ├── app.ts              # Express 应用入口
│   ├── routes/             # 路由
│   │   └── ai.routes.ts    # AI 解析路由
│   ├── services/           # 业务服务
│   │   └── llmService.ts   # LLM 服务
│   └── middleware/         # 中间件
│       └── validation.ts   # 请求验证
├── dist/                   # 编译输出
├── package.json
└── tsconfig.json
```
