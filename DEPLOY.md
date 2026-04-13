# Claude Code 最佳实践课程 - 部署指南

## 部署完成

代码已推送到 GitHub：https://github.com/williiamwang/claude-code-course

## 部署到 Vercel（免费）

### 步骤 1：在 Vercel 导入项目
1. 访问 https://vercel.com 并登录
2. 点击 "Add New..." → "Project"
3. 选择 "GitHub" 并搜索 `claude-code-course`
4. 点击 "Import"

### 步骤 2：配置环境变量
在 Vercel 项目设置中添加：

| 变量名 | 值 |
|--------|-----|
| `MINIMAX_API_KEY` | 你的 MiniMax API Key |

### 步骤 3：部署
1. 点击 "Deploy"
2. 等待部署完成（约 1-2 分钟）
3. 获取访问 URL

## 本地运行

```bash
cd claude-code-course
npm install
npm run dev
```

访问 http://localhost:3000

## 功能说明

### 课程学习
- 首页显示 12 个学习阶段
- 点击每个阶段进入课程详情页

### AI 答疑
- 点击右上角 "💬 AI 答疑" 按钮
- 在聊天框输入问题
- AI 导师会回答课程相关问题

## 技术栈
- Next.js 14
- React 18
- Tailwind CSS
- MiniMax API (AI 答疑)
