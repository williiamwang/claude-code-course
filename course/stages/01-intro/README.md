# 第一阶段：课程介绍与环境准备

欢迎开始 Claude Code 最佳实践课程！本阶段将帮助你了解 Claude Code 是什么，以及如何配置开发环境。

## 什么是 Claude Code？

Claude Code 是 Anthropic 公司开发的 AI 编程助手，它不仅是一个代码补全工具，更是一个能够：
- 理解和分析整个代码库
- 执行复杂的开发任务
- 通过子代理(Subagents)、命令(Commands)、技能(Skills)进行扩展
- 与外部工具和服务集成(MCP)

## 环境要求

### 1. 安装 Claude Code

```bash
# 查看官方安装指南
claude --help

# 验证安装
claude --version
```

### 2. 基本配置

创建配置文件 `~/.claude/settings.json`：

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  }
}
```

**为什么配置这个？**
- 默认模式下每次危险操作都会提示权限确认
- 设置为 `bypassPermissions` 可以自动跳过权限提示，提升开发效率
- 项目本地配置可以覆盖全局设置

### 3. 理解你的项目结构

Claude Code 通过以下文件理解你的项目：

| 文件 | 作用 |
|------|------|
| `CLAUDE.md` | 项目级指令和规范 |
| `.claude/settings.json` | 项目配置 |
| `.claude/rules/` | 规则目录 |
| `.claude/commands/` | 自定义命令 |
| `.claude/agents/` | 子代理定义 |
| `.claude/skills/` | 技能定义 |

## 实践练习

### 练习 1.1：检查你的 Claude Code 环境

```bash
# 检查版本
claude --version

# 查看帮助
claude --help

# 进入交互模式
claude
```

### 练习 1.2：创建一个简单的 CLAUDE.md

在你的项目中创建 `CLAUDE.md` 文件：

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with this project.

## Project Overview

- Project name: My Project
- Language: Java
- Build tool: Maven
- Key dependencies: Spring Boot, MyBatis

## Development Commands

- Build: mvn clean package
- Run: mvn spring-boot:run
- Test: mvn test
```

## 核心概念快速预览

Claude Code 有三个核心扩展机制：

1. **命令(Commands)** - 通过 `/command` 触发的提示模板
2. **子代理(Subagents)** - 在独立上下文中执行任务的 AI 代理
3. **技能(Skills)** - 可配置、可预加载的自动化能力

> **提示**: 本课程基于 GitHub 项目 [claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice)，该项目的 `best-practice/` 目录包含了所有最佳实践的详细文档。

## 下一步

进入 [第二阶段：理解核心概念](../02-concepts/README.md) 学习 Claude Code 的核心架构。
