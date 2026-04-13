# 第五阶段：子代理(Subagent)配置

本阶段将帮助你学会如何创建和配置子代理（Subagent）。

## 什么是子代理？

子代理是在**全新隔离上下文**中工作的 AI 角色。与命令不同：
- 拥有独立的上下文窗口
- 可以使用自定义工具集
- 可以配置不同的模型
- 可以预加载技能
- 拥有持久化身份

## 子代理文件结构

### 基础结构

创建 `.claude/agents/<agent-name>.md`：

```markdown
---
name: my-agent
description: 代理描述 - PROACTIVELY
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
permissionMode: acceptEdits
maxTurns: 20
---

# 代理角色描述

你是一个专业的...
```

### 完整配置示例

```markdown
---
name: code-reviewer
description: 当需要进行代码审查时调用此代理 - PROACTIVELY
tools: Read, Glob, Grep, Bash
model: sonnet
permissionMode: acceptEdits
maxTurns: 30
skills:
  - lint-checker
  - security-scanner
memory: project
hooks:
  PostToolUse:
    - hooks/review-notify.py
effort: high
color: blue
---

# 代码审查代理

你是一个资深的代码审查专家，负责审查代码质量。

## 审查标准

### 1. 代码风格
- 遵循项目编码规范
- 命名清晰规范
- 适当的注释

### 2. 潜在 Bug
- 空指针风险
- 资源泄漏
- 并发问题

### 3. 安全问题
- SQL 注入
- XSS 攻击
- 敏感信息泄露

### 4. 性能问题
- N+1 查询
- 不必要的循环
- 内存泄漏

## 输出格式

审查报告应包含：
1. **概述**: 代码变更摘要
2. **问题列表**: 按严重程度排序
   - 🔴 严重问题
   - 🟡 警告
   - 🔵 建议
3. **改进建议**
4. **总体评价**
```

## Frontmatter 字段详解

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | 字符串 | 唯一标识符，使用小写字母和连字符 |
| `description` | 字符串 | 触发条件，使用 "PROACTIVELY" 表示自动触发 |
| `tools` | 列表 | 允许使用的工具列表 |
| `disallowedTools` | 列表 | 禁止使用的工具 |
| `model` | 字符串 | 模型：`sonnet`、`opus`、`haiku` 或 `inherit` |
| `permissionMode` | 字符串 | 权限模式：`default`、`acceptEdits`、`auto`、`bypassPermissions`、`plan` |
| `maxTurns` | 整数 | 最大交互轮次 |
| `skills` | 列表 | 预加载的技能列表 |
| `mcpServers` | 列表 | MCP 服务器配置 |
| `hooks` | 对象 | 生命周期钩子 |
| `memory` | 字符串 | 持久化内存：`user`、`project`、`local` |
| `background` | 布尔 | 是否作为后台任务运行 |
| `effort` | 字符串 | 努力级别：`low`、`medium`、`high`、`max` |
| `isolation` | 字符串 | 隔离模式：`worktree` |
| `color` | 字符串 | 显示颜色 |

## 官方内置代理类型

| 代理类型 | 模型 | 工具 | 用途 |
|----------|------|------|------|
| `general-purpose` | 继承 | 全部 | 通用复杂任务（默认） |
| `Explore` | haiku | 只读 | 快速代码搜索和探索 |
| `Plan` | 继承 | 只读 | 计划模式前的调研 |
| `statusline-setup` | sonnet | 读/写 | 配置状态行 |
| `claude-code-guide` | haiku | 搜索/读取 | Claude Code 问答 |

## 如何调用子代理

### 基本调用

```python
# 使用 Agent 工具调用子代理
Agent(
    subagent_type="code-reviewer",
    description="审查刚提交的代码变更",
    prompt="请审查以下代码变更：\n${git_diff}"
)
```

### 带上下文的调用

```python
Agent(
    subagent_type="researcher",
    description="研究如何实现缓存功能",
    prompt="""研究项目中缓存的最佳实践：
1. 当前使用的缓存方案
2. Redis vs 本地缓存的选择
3. 实现方案建议
""",
    model="sonnet"
)
```

### 使用 worktree 隔离

```python
Agent(
    subagent_type="experiment",
    description="实验性重构",
    prompt="尝试重构某个模块",
    isolation="worktree"  # 在独立的 git worktree 中运行
)
```

## 子代理的最佳实践

### 1. 专业化优于通用化

❌ 避免创建通用代理：
```markdown
# 错误示例
name: general-helper
description: 通用帮助代理
```

✅ 正确做法：
```markdown
# 正确示例 - 专业化代理
name: backend-expert
description: 处理后端开发任务 - PROACTIVELY

name: frontend-expert  
description: 处理前端开发任务 - PROACTIVELY
```

### 2. 预加载相关技能

```markdown
---
name: implementation-agent
description: 实现代码功能 - PROACTIVELY
skills:
  - code-generator
  - test-generator
  - documentation-generator
---
```

### 3. 使用内存持久化身份

```markdown
---
name: senior-reviewer
description: 代码审查代理
memory: project
---

# 你是一个资深代码审查专家

你对这个项目有深入了解，知道：
- 团队的编码规范
- 现有的技术债务
- 架构决策历史
```

### 4. 使用颜色区分

```markdown
---
name: research-agent
description: 研究任务
color: cyan

name: implement-agent
description: 实现任务
color: green

name: review-agent
description: 审查任务
color: orange
---
```

## 实践练习

### 练习 5.1：创建代码搜索代理

创建 `.claude/agents/searcher.md`：

```markdown
---
name: searcher
description: 当需要搜索代码时调用此代理 - PROACTIVELY
tools: Glob, Grep, Read
model: haiku
color: cyan
---

# 代码搜索代理

你是一个代码搜索专家，负责在代码库中查找相关信息。

## 搜索策略

1. **精确搜索**: 使用 Grep 搜索特定字符串
2. **模式搜索**: 使用 Glob 搜索文件模式
3. **结构搜索**: 搜索类、方法、函数定义

## 输出格式

对每个搜索结果：
- 文件路径和行号
- 上下文代码片段
- 简要说明

## 技巧

- 使用正则表达式进行精确匹配
- 先用 Glob 缩小文件范围
- 结合 Read 工具查看完整上下文
```

### 练习 5.2：创建 Java 后端代理

创建 `.claude/agents/java-backend.md`：

```markdown
---
name: java-backend
description: 处理 Java 后端开发任务 - PROACTIVELY
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
permissionMode: acceptEdits
skills:
  - java-linter
  - spring-expert
color: green
---

# Java 后端开发代理

你是一个专业的 Java 后端开发者，熟悉 Spring Boot 框架。

## 技术栈

- Java 17+
- Spring Boot 3.x
- Spring Data JPA / MyBatis
- Maven / Gradle

## 开发规范

### Controller 层
- 使用 @RestController
- 返回统一的 API 响应格式
- 添加 Swagger 注解

### Service 层
- 使用 @Service 注解
- 添加 @Transactional
- 使用接口+实现类

### DAO 层
- 使用 Repository 接口
- 遵循命名规范

## 常用命令

- 编译：mvn clean compile
- 测试：mvn test
- 运行：mvn spring-boot:run
```

### 练习 5.3：创建研究代理

创建 `.claude/agents/researcher.md`：

```markdown
---
name: researcher
description: 需要研究新技术或方案时调用 - PROACTIVELY
tools: Read, WebFetch, WebSearch, Glob, Grep
model: sonnet
color: purple
maxTurns: 50
effort: high
---

# 研究代理

你是一个技术研究专家，负责调研新技术和最佳实践。

## 研究流程

1. **明确研究目标**
   - 理解要解决的问题
   - 确定研究范围

2. **信息收集**
   - 查阅官方文档
   - 搜索技术博客
   - 查看 GitHub 趋势

3. **分析对比**
   - 优缺点分析
   - 性能对比
   - 社区活跃度

4. **总结建议**
   - 推荐方案
   - 实现建议
   - 参考资源

## 输出格式

生成研究报告，包含：
- 研究背景
- 方案对比表
- 推荐方案
- 实施建议
- 参考链接
```

## 进阶：代理编排

使用 Agent Teams 进行并行任务处理：

```markdown
# 并行代码审查

工作流程：
1. 启动 searcher 代理搜索相关代码
2. 启动 reviewer 代理进行审查
3. 启动 linter 代理检查代码风格
4. 汇总所有结果
```

## 下一步

进入 [第六阶段：技能(Skill)开发](../06-skills/README.md) 学习如何创建可复用的技能。
