# 第二阶段：理解核心概念

本阶段将帮助你理解 Claude Code 的核心架构和三个主要扩展机制。

## Claude Code 核心架构

Claude Code 采用 **Agentic Engineering（代理工程）** 范式，核心思想是：

```
用户需求 → Command(命令) → Agent(代理) → Skill(技能) → 执行结果
```

### 核心三角：Command / Agent / Skill

| 组件 | 触发方式 | 上下文 | 用途 |
|------|----------|--------|------|
| **Command** | `/slash-command` | 继承当前上下文 | 工作流编排、简单任务 |
| **Agent** | 调用 `Agent()` | 全新隔离上下文 | 复杂任务、专门研究 |
| **Skill** | 调用 `Skill` 工具 | 可配置 | 自动化、可复用能力 |

## 1. 命令 (Commands)

### 什么是命令？

命令是用户可以通过 `/` 触发的提示模板。它们被注入到现有上下文中，用于：
- 简化重复性的工作流
- 封装复杂的操作步骤
- 提供交互式引导

### 命令文件结构

创建 `.claude/commands/my-command.md`：

```markdown
# 我的命令

## 触发条件
当用户想要执行某个重复性任务时使用

## 执行步骤
1. 首先检查当前项目状态
2. 询问用户具体需求
3. 执行相应操作
4. 返回执行结果
```

### 官方内置命令

| 命令 | 功能 |
|------|------|
| `/help` | 显示帮助信息 |
| `/compact` | 压缩上下文 |
| `/clear` | 清除上下文 |
| `/model` | 切换模型 |
| `/context` | 查看上下文使用 |
| `/resume` | 恢复之前的会话 |
| `/mcp` | 管理 MCP 服务器 |

## 2. 子代理 (Subagents)

### 什么是子代理？

子代理是在**全新隔离上下文**中工作的 AI 角色。它有：
- 独立的上下文窗口
- 自定义工具集
- 可配置的模型
- 持久化身份

### 子代理文件结构

创建 `.claude/agents/my-agent.md`：

```markdown
---
name: my-agent
description: 当需要执行特定任务时调用此代理 - PROACTIVELY
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
permissionMode: acceptEdits
maxTurns: 20
skills:
  - my-skill
memory: project
---

# 代理角色描述

你是一个专业的代码审查专家，负责...

## 工作流程
1. 接收任务描述
2. 分析代码
3. 提供改进建议
```

### 官方内置代理类型

| 代理类型 | 模型 | 工具 | 用途 |
|----------|------|------|------|
| `general-purpose` | 继承 | 全部 | 通用复杂任务 |
| `Explore` | haiku | 只读 | 快速代码搜索 |
| `Plan` | 继承 | 只读 | 计划模式研究 |
| `claude-code-guide` | haiku | 搜索/读取 | Claude Code 问答 |

## 3. 技能 (Skills)

### 什么是技能？

技能是**可配置、可预加载**的自动化能力。与命令和代理不同：
- 可以通过 YAML frontmatter 配置元数据
- 可以预加载到代理上下文中
- 支持自动发现
- 支持上下文分叉（fork）

### 技能文件结构

创建 `.claude/skills/my-skill/SKILL.md`：

```markdown
---
name: my-skill
description: 当用户需要执行某个自动化任务时使用
argument-hint: [参数提示]
allowed-tools: Read, Write, Edit
model: sonnet
context: fork
agent: general-purpose
hooks:
  PreToolUse:
    - hooks/my-hook.py
---

# 技能描述

你是一个自动化助手，负责...

## 执行步骤
1. 接收参数
2. 执行操作
3. 返回结果
```

## 关键区别对比

| 特性 | Command | Agent | Skill |
|------|---------|-------|-------|
| 上下文 | 继承当前 | 全新隔离 | 可配置 |
| 触发方式 | `/command` | `Agent()` 调用 | `Skill` 工具 |
| 预加载 | 否 | 通过 skills 字段 | 是 |
| 持久化 | 文件形式 | 文件形式 | 文件形式 |

## 编排工作流模式

最佳实践推荐的工作流模式：

```
用户输入 → Command (入口) → Agent (执行) → Skill (具体操作)
```

示例：天气查询系统
- `/weather-orchestrator` (Command) → 询问用户选择
- `weather-agent` (Agent) → 调用天气 API
- `weather-fetcher` / `weather-svg-creator` (Skills) → 获取数据/生成图片

## 实践练习

### 练习 2.1：创建一个命令

在项目中创建 `.claude/commands/hello.md`：

```markdown
# Hello Command

## 触发
用户想要打招呼时使用

## 执行
输出友好的问候语，询问有什么可以帮助的
```

然后在 Claude Code 中运行 `/hello`

### 练习 2.2：创建一个简单代理

在项目中创建 `.claude/agents/researcher.md`：

```markdown
---
name: researcher
description: 当需要研究代码时调用此代理 - PROACTIVELY
tools: Glob, Grep, Read
model: sonnet
---

# 研究代理

你是一个代码研究员，负责分析代码库结构。
```

### 练习 2.3：创建一个技能

创建 `.claude/skills/greeting/SKILL.md`：

```markdown
---
name: greeting
description: 当需要生成问候语时使用
---

# 问候技能

根据用户输入生成合适的问候语。
```

## 下一步

进入 [第三阶段：CLAUDE.md 内存系统](../03-memory/README.md) 学习如何持久化项目知识。
