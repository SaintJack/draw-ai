# 后端服务快速启动指南

## 1. 安装依赖

```bash
cd server
npm install
```

## 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置你的 LLM API Key：

```env
LLM_API_KEY=sk-your-openai-api-key-here
```

## 3. 启动服务

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm run build
npm start
```

## 4. 验证服务

打开浏览器访问：http://localhost:3000/health

应该看到：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 5. 测试 API

使用 curl 或 Postman 测试：

```bash
curl -X POST http://localhost:3000/api/v1/parse \
  -H "Content-Type: application/json" \
  -d '{
    "text": "画一个圆",
    "context": {
      "shapes": [],
      "recentActions": []
    }
  }'
```

## 注意事项

- 确保已配置 `LLM_API_KEY`
- 如果没有 API Key，服务会使用降级处理（关键词匹配）
- 默认端口：3000（可在 .env 中修改）
