# Claude Code 最佳实践课程

一个交互式的 Claude Code 学习课程网站，包含：

- 📚 12 个阶段的学习课程
- 💬 AI 导师答疑功能

## 本地开发

```bash
npm install
npm run dev
```

## 部署

### 方式一：Vercel（推荐）

1. 推送代码到 GitHub：
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/williiamwang/claude-code-course.git
git push -u origin main
```

2. 访问 https://vercel.com 登录并导入项目

3. 在 Vercel 项目设置中添加环境变量：
   - `MINIMAX_API_KEY`: 你的 MiniMax API Key

### 方式二：GitHub Pages

使用 `gh-pages` 包部署静态页面。

## AI 答疑

AI 答疑使用 MiniMax API，需要设置环境变量 `MINIMAX_API_KEY`。

## 课程结构

```
course/stages/
├── 01-intro/          # 课程介绍与环境准备
├── 02-concepts/       # 核心概念
├── 03-memory/         # CLAUDE.md 内存系统
├── 04-commands/       # 命令使用
├── 05-subagents/       # 子代理配置
├── 06-skills/         # 技能开发
├── 07-hooks/          # Hooks 钩子
├── 08-mcp/            # MCP 服务器
├── 09-orchestration/  # 编排工作流
├── 10-settings/      # Settings 配置
├── 11-permissions/    # 权限与安全
└── 12-workflows/      # 团队协作
```
