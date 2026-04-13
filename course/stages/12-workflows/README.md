# 第十二阶段：团队协作与工作流

本阶段将帮助你理解如何在团队环境中使用 Claude Code。

## 团队协作最佳实践

### 1. 共享配置

- 使用 `.claude/settings.json` 存储团队配置
- 使用 `.claude/rules/` 存储团队规范
- 使用 `.claude/commands/` 存储共享命令

### 2. 代理分工

```
.claude/agents/
├── backend-dev.md      # 后端开发代理
├── frontend-dev.md     # 前端开发代理
├── reviewer.md         # 代码审查代理
├── tester.md           # 测试代理
└── researcher.md       # 研究代理
```

### 3. 工作流示例

#### 代码审查工作流

```markdown
# /code-review 命令

1. 获取当前分支变更
2. 调用 reviewer 代理
3. 输出审查报告
4. 询问是否需要修复
```

#### 功能开发工作流

```markdown
# /implement 命令

1. 使用 Plan 代理设计方案
2. 确认方案后开始实现
3. 运行测试
4. 生成文档
```

## 高级功能

### Agent Teams

使用多个代理并行工作：

```bash
claude --agent "agent1 & agent2 & agent3"
```

### Git Worktrees

为每个代理创建独立分支：

```bash
git worktree add ../feature-branch branch
```

### 定时任务

```bash
/cloop 5m /check-build
/schedule "0 9 * * *" /daily-report
```

## 课程总结

通过本课程，你已经学会了：

1. ✅ Claude Code 基础概念
2. ✅ CLAUDE.md 内存系统
3. ✅ 命令(Command)使用
4. ✅ 子代理(Subagent)配置
5. ✅ 技能(Skill)开发
6. ✅ Hooks 钩子系统
7. ✅ MCP 服务器配置
8. ✅ 编排工作流
9. ✅ Settings 配置
10. ✅ 权限与安全
11. ✅ 团队协作

## 继续学习

- [官方文档](https://code.claude.com/docs)
- [最佳实践库](https://github.com/shanraisshan/claude-code-best-practice)
- [官方博客](https://claude.com/blog)

## 常见问题

### Q: 从哪里开始？

A: 从本课程的第一阶段开始，按顺序学习基础概念。

### Q: 需要配置所有内容吗？

A: 不需要。从基础配置开始，根据需要逐步添加。

### Q: 如何验证学习效果？

A: 在实际项目中使用这些最佳实践，从简单的命令和 CLAUDE.md 开始。
