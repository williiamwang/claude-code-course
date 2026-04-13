# 第三阶段：CLAUDE.md 内存系统

本阶段将帮助你理解如何使用 CLAUDE.md 和其他内存机制来持久化项目知识。

## 什么是 CLAUDE.md？

CLAUDE.md 是 Claude Code 的核心内存文件，它提供了：
- 项目级指令和规范
- 开发命令和构建脚本
- 团队协作约定
- 编码规范和最佳实践

**关键原则**：每个 CLAUDE.md 文件应保持在 **200 行以内**，确保 Claude 能够可靠地遵循指令。

## CLAUDE.md 查找位置

Claude Code 会按以下顺序查找 CLAUDE.md：

```
1. 当前目录的 CLAUDE.md
2. 父目录的 CLAUDE.md (逐级向上)
3. ~/.claude/rules/ 目录下的规则文件
4. ~/.claude/projects/<project>/memory/ 目录
```

### 多层 CLAUDE.md 策略

对于大型项目（monorepo），使用多层 CLAUDE.md：

```
/ CLAUDE.md (根目录 - 顶层规则)
├── frontend/ CLAUDE.md (前端规则)
├── backend/ CLAUDE.md (后端规则)
└── shared/ CLAUDE.md (共享规则)
```

## CLAUDE.md 最佳实践

### 结构示例

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with this project.

## 项目概览
- 项目名称：企业管理系统
- 技术栈：Java Spring Boot + Vue.js
- 构建工具：Maven
- 数据库：MySQL

## 关键约束
- 必须使用中文注释
- 遵循阿里巴巴 Java 开发规范
- 单元测试覆盖率 > 70%

## 开发命令
- 启动：`mvn spring-boot:run`
- 构建：`mvn clean package -DskipTests`
- 测试：`mvn test`
- 部署：`./deploy.sh production`

## 编码规范
1. Controller 层禁止直接返回实体，必须使用 VO
2. Service 层必须添加事务注解
3. DAO 层使用 MyBatis 注解方式

## Git 工作流
- 每个功能单独一个分支
- PR 必须包含单元测试
- 合并前必须 Code Review
```

### 重要标签技巧

使用 `<important if="...">` 标签防止规则被忽略：

```markdown
<important if="file contains Spring Boot annotation">
确保所有 Controller 类添加 @RestController 注解
</important>
```

## Rules 目录（规则目录）

当 CLAUDE.md 变得过长时，使用 `.claude/rules/` 目录组织：

```
.claude/rules/
├── coding-standards.md    # 编码规范
├── git-workflow.md        # Git 工作流
├── api-design.md          # API 设计规范
└── testing.md             # 测试规范
```

## Auto Memory（自动记忆）

Claude Code 的自动记忆系统会自动保存：
- 用户信息（角色、偏好）
- 项目上下文
- 反馈和经验

记忆位置：`~/.claude/projects/<project>/memory/`

### 记忆类型

| 类型 | 作用域 | 用途 |
|------|--------|------|
| `user` | 全局用户 | 用户偏好、角色信息 |
| `project` | 项目级 | 项目规范、团队约定 |
| `local` | 本地 | 特定工作区配置 |

## 实践练习

### 练习 3.1：为你的项目创建 CLAUDE.md

在你的 Java 项目根目录创建 `CLAUDE.md`：

```markdown
# CLAUDE.md

## 项目信息
- 项目名称：My Project
- 框架：Spring Boot
- 版本：3.x

## 构建命令
- 编译：mvn clean compile
- 测试：mvn test
- 打包：mvn clean package

## 代码规范
- 包名：com.example.*
- 使用 Lombok 简化代码
- REST API 规范：RESTful Design
```

### 练习 3.2：使用 rules 目录

创建 `.claude/rules/coding.md`：

```markdown
# 编码规范

## Java 命名
- 类名：UpperCamelCase
- 方法名：lowerCamelCase
- 常量：UPPER_SNAKE_CASE

## 日志规范
- 使用 SLF4J
- 生产环境使用 warn 级别
- 异常日志要包含堆栈信息
```

### 练习 3.3：验证记忆功能

1. 告诉 Claude 你的角色："我是一个 Java 开发者"
2. 结束会话后重新开始
3. 问 Claude："我是什么角色？"

## 常见问题

### Q：CLAUDE.md 规则被忽略怎么办？

A：检查以下几点：
1. 文件是否在正确的位置
2. 是否使用了 `<important>` 标签
3. 规则是否过于冗长
4. 是否需要使用 rules 目录分解

### Q：多个 CLAUDE.md 如何加载？

A：遵循"祖先优先"原则，最近的父目录 CLAUDE.md 覆盖祖先的规则。

### Q：CLAUDE.md 和 settings.json 的区别？

A：
- `CLAUDE.md`：自然语言指令
- `settings.json`：配置项和行为控制

## 下一步

进入 [第四阶段：命令(Command)使用](../04-commands/README.md) 学习如何创建和使用自定义命令。
