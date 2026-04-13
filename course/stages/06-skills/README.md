# 第六阶段：技能(Skill)开发

本阶段将帮助你学会如何创建和使用技能（Skills）。

## 什么是技能？

技能是 Claude Code 最强大的扩展机制之一，具有以下特点：
- **可配置**: 通过 YAML frontmatter 定义元数据
- **可预加载**: 可以预加载到子代理上下文
- **可发现**: 支持自动发现
- **可组合**: 支持上下文分叉（fork）

## 技能与命令/代理的区别

| 特性 | Command | Agent | Skill |
|------|---------|-------|-------|
| 上下文 | 继承当前 | 全新隔离 | 可配置 |
| 触发方式 | `/command` | `Agent()` 调用 | `Skill` 工具调用 |
| 预加载 | 否 | 通过 skills 字段 | 是 |
| 自动发现 | 否 | 否 | 是 |
| 上下文分叉 | 否 | 否 | 是 |
| 持久化 | 文件形式 | 文件形式 | 文件形式 |

## 技能文件结构

### 基础结构

创建 `.claude/skills/<skill-name>/SKILL.md`：

```markdown
---
name: skill-name
description: 何时触发此技能
argument-hint: [参数提示]
allowed-tools: Read, Write, Edit
model: sonnet
context: fork
agent: general-purpose
---

# 技能描述

你是...

## 执行步骤
1. ...
2. ...
```

### 完整配置示例

```markdown
---
name: java-generator
description: 当需要生成 Java 代码时使用
argument-hint: [类名]
allowed-tools: Read, Write, Edit, Bash, Glob
model: sonnet
context: fork
agent: general-purpose
user-invocable: true
disable-model-invocation: false
hooks:
  PreToolUse:
    - hooks/code-validate.py
---

# Java 代码生成器

你是一个专业的 Java 开发者，负责生成高质量的 Java 代码。

## 生成规范

### 类结构
```java
public class ${className} {
    
    private static final Logger logger = LoggerFactory.getLogger(${className}.class);
    
    // 字段
    
    // 构造函数
    
    // 方法
}
```

### 命名规范
- 类名：UpperCamelCase
- 方法名：lowerCamelCase
- 常量：UPPER_SNAKE_CASE

### 日志规范
- 使用 Lombok @Slf4j
- 使用占位符而非字符串拼接
```

## Frontmatter 字段详解

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | 字符串 | 显示名称和 `/slash-command`（默认取目录名） |
| `description` | 字符串 | 触发条件，用于自动发现 |
| `argument-hint` | 字符串 | 自动完成提示 |
| `disable-model-invocation` | 布尔 | 设为 true 阻止自动触发 |
| `user-invocable` | 布尔 | 设为 false 从 `/` 菜单隐藏 |
| `allowed-tools` | 列表 | 技能激活时允许的工具 |
| `model` | 字符串 | 技能使用的模型 |
| `context` | 字符串 | 设为 `fork` 在独立子代理中运行 |
| `agent` | 字符串 | `context: fork` 时使用的代理类型 |
| `hooks` | 对象 | 技能的生命周期钩子 |

## 如何调用技能

### 基本调用

```python
# 通过 Skill 工具调用
Skill(skill="java-generator", args="UserService")
```

### 预加载到代理

```yaml
# 在代理中预加载技能
---
name: implementer
description: 实现代码 - PROACTIVELY
skills:
  - java-generator
  - test-generator
  - spring-expert
---
```

## 技能的最佳实践

### 1. 使用子文件夹组织

```
.claude/skills/
├── java/
│   ├── SKILL.md
│   ├── references/
│   │   └── coding-standards.md
│   └── examples/
│       └── sample-class.java
├── spring/
│   ├── SKILL.md
│   └── templates/
│       └── controller.java
└── testing/
    ├── SKILL.md
    └── fixtures/
        └── mock-data.json
```

### 2. 使用 `!` 注入动态输出

```markdown
---
name: project-status
description: 查看项目状态
---

# 项目状态

当前项目信息：
- 分支: `!git branch --show-current`
- 最后提交: `!git log -1 --oneline`
- 文件变更: `!git status --short`
```

### 3. 包含 Gotchas 部分

```markdown
# 数据库迁移技能

## Gotchas（常见陷阱）

⚠️ 迁移前务必备份数据库
⚠️ 生产环境迁移需要 DBA 审批
⚠️ 每次迁移必须是可逆的
⚠️ 大表迁移需要选择低峰期
```

### 4. 描述字段是触发器而非摘要

```markdown
# 错误示例
description: "生成 Java 代码"

# 正确示例 - 描述触发条件
description: "当用户需要创建新的 Java 类、接口或枚举时使用"
```

## 技能类型模式

### 1. 代理技能模式

预加载到代理，通过 `skills:` 字段：

```yaml
# agent 定义
skills:
  - weather-fetcher
```

```yaml
# skill 定义
name: weather-fetcher
description: 从 Open-Meteo API 获取天气数据
```

### 2. 独立技能模式

通过 `Skill` 工具调用：

```markdown
# 独立技能
---
name: svg-creator
description: 创建 SVG 图像
context: fork
agent: general-purpose
---

# SVG 创建器
```

## 实践练习

### 练习 6.1：创建 Java 类生成技能

创建 `.claude/skills/java-class/SKILL.md`：

```markdown
---
name: java-class
description: 当需要创建新的 Java 类时使用
argument-hint: [类名]
allowed-tools: Read, Write, Edit
model: sonnet
---

# Java 类生成器

根据类名生成符合规范的 Java 类。

## 生成模板

```java
package ${package};

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ${className} 实体类
 *
 * @author Your Name
 * @since ${date}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ${className} {
    
    // 字段定义
    
}
```

## 使用方式

1. 用户提供类名和字段列表
2. 生成对应的 Java 类
3. 输出文件路径
```

### 练习 6.2：创建 API 文档生成技能

创建 `.claude/skills/api-doc/SKILL.md`：

```markdown
---
name: api-doc
description: 当需要为 REST API 生成文档时使用
argument-hint: [controller类名]
allowed-tools: Read, Write, Glob, Grep
model: sonnet
---

# API 文档生成器

为 Spring Controller 生成 API 文档。

## 输出格式

生成 Markdown 格式的 API 文档，包含：
- API 端点路径
- HTTP 方法
- 请求参数
- 响应格式
- 示例请求/响应

## 示例

### 用户接口

#### 创建用户

**请求**
```
POST /api/users
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com"
}
```

**响应**
```json
{
  "id": 1,
  "name": "张三",
  "email": "zhangsan@example.com",
  "createdAt": "2024-01-01T00:00:00Z"
}
```
```

### 练习 6.3：创建代码审查技能

创建 `.claude/skills/code-review/SKILL.md`：

```markdown
---
name: code-review
description: 当需要进行代码审查时使用
argument-hint: [文件路径]
allowed-tools: Read, Glob, Grep
model: sonnet
context: fork
agent: general-purpose
---

# 代码审查技能

对指定代码进行审查并提供改进建议。

## 审查维度

1. **代码风格**
   - 命名规范
   - 代码格式
   - 注释质量

2. **代码质量**
   - 复杂度
   - 重复代码
   - 潜在的 null 指针

3. **安全性**
   - SQL 注入
   - XSS 漏洞
   - 敏感信息泄露

4. **性能**
   - N+1 查询
   - 不必要的对象创建

## 输出格式

```markdown
## 审查报告: ${file}

### 概述
...

### 问题列表
| 严重程度 | 位置 | 问题描述 | 建议修复 |
|----------|------|----------|----------|
| 🔴 高    |      |          |          |
| 🟡 中    |      |          |          |
| 🔵 低    |      |          |          |

### 总体评价
...
```
```

## 进阶：技能组合

使用技能组合实现复杂工作流：

```yaml
# 编排工作流
# Command → Agent → Skill
---
name: full-stack-feature
description: 开发完整功能
context: fork

# 1. 先创建后端代码
# 2. 然后创建前端代码
# 3. 最后生成测试
```

## 下一步

进入 [第七阶段：Hooks钩子系统](../07-hooks/README.md) 学习如何配置钩子来实现自动化。
