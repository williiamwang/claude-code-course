# 第四阶段：命令(Command)使用

本阶段将帮助你学会如何创建和使用自定义命令。

## 什么是命令？

命令（Commands）是 Claude Code 的核心扩展机制之一，通过 `/slash-command` 触发。它们是用户定义的提示模板，可以：
- 封装重复性的工作流
- 提供交互式引导
- 简化复杂操作

## 命令文件结构

### 基本结构

创建 `.claude/commands/<command-name>.md`：

```markdown
# 命令名称

## 触发条件
描述何时应该使用此命令

## 执行步骤
1. 第一步操作
2. 第二步操作
3. 第三步操作
```

### 实际示例：代码审查命令

创建 `.claude/commands/review.md`：

```markdown
# Code Review

## 触发条件
当用户需要进行代码审查时使用

## 前提条件
- 确保代码已提交到当前分支
- 确认没有未解决的编译错误

## 执行流程
1. 获取当前的 git 差异
2. 分析代码变更：
   - 检查代码风格
   - 检查潜在 bug
   - 检查安全漏洞
   - 检查性能问题
3. 输出审查报告，包含：
   - 总体评价
   - 发现的问题（按严重程度排序）
   - 改进建议
4. 如果发现问题，询问用户是否需要修复
```

## 命令中的交互式元素

使用 `AskUserQuestion` 工具实现交互：

```markdown
# 新建功能

## 触发条件
用户想要创建一个新的 Spring Boot 功能模块

## 执行流程
1. 询问功能名称
2. 询问功能描述
3. 询问是否需要：
   - REST API
   - 数据库实体
   - 单元测试
4. 生成相应的代码结构
```

### 交互式问题示例

```markdown
# 创建 API 端点

## 触发
用户想要创建新的 REST API 端点

## 交互流程
首先使用 AskUserQuestion 询问以下问题：

1. API 路径是什么？（如 /users）
2. HTTP 方法是什么？（GET/POST/PUT/DELETE）
3. 需要认证吗？（是/否）
4. 响应数据格式？（JSON/XML）

然后根据答案生成相应的 Controller 代码。
```

## 命令的最佳实践

### 1. 使用 ASCII 图表

在命令中包含架构图可以帮助 Claude 理解复杂结构：

```markdown
# 系统架构

## 整体架构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client   │ ──► │  Controller │ ──► │  Service   │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │    DAO     │
                                        └─────────────┘
```

## 执行流程
1. 客户端发送请求
2. Controller 接收并验证
3. Service 处理业务逻辑
4. DAO 与数据库交互
```

### 2. 包含 Gotchas 部分

```markdown
# 数据库迁移

## 触发
需要执行数据库迁移时使用

## Gotchas（常见陷阱）
⚠️ 始终先备份数据库再执行迁移
⚠️ 生产环境迁移需要先在测试环境验证
⚠️ 迁移脚本必须包含回滚逻辑

## 执行流程
...
```

### 3. 指定输出位置

```markdown
# 生成测试报告

## 输出位置
报告将写入 `test-results/report.md`

## 执行流程
1. 运行测试套件
2. 收集测试结果
3. 生成 HTML 报告
4. 在终端显示摘要
```

## 官方内置命令参考

| 命令 | 功能 | 使用场景 |
|------|------|----------|
| `/help` | 显示帮助 | 了解可用命令 |
| `/compact` | 压缩上下文 | 上下文超过 50% 时 |
| `/clear` | 清除上下文 | 切换新任务 |
| `/model` | 切换模型 | 选择合适的模型 |
| `/context` | 查看上下文 | 了解资源使用 |
| `/usage` | 查看使用量 | 了解配额限制 |
| `/resume` | 恢复会话 | 继续之前的工作 |
| `/doctor` | 诊断问题 | 排查配置问题 |

## 实践练习

### 练习 4.1：创建 Hello 命令

创建 `.claude/commands/hello.md`：

```markdown
# Hello

## 触发
用户想要打招呼时使用

## 执行
输出友好的中文问候语，例如：
"你好！我是 Claude，很高兴为你服务。今天有什么我可以帮助你的吗？"
```

测试：在 Claude Code 中输入 `/hello`

### 练习 4.2：创建 Java 项目初始化命令

创建 `.claude/commands/init-java.md`：

```markdown
# Init Java Project

## 触发
用户想要初始化一个新的 Java Spring Boot 项目

## 交互流程
使用 AskUserQuestion 询问：
1. 项目名称是什么？
2. 使用哪个 Spring Boot 版本？（2.x/3.x）
3. 需要哪些依赖？
   - Web (Spring Web)
   - Data JPA (Spring Data JPA)
   - MyBatis (MyBatis Plus)
   - Security (Spring Security)
4. 包名是什么？（默认：com.example）

## 生成文件
根据选择生成：
- pom.xml
- 主应用类
- application.yml
- Controller 示例
- Service 示例
- 对应的单元测试
```

### 练习 4.3：创建代码转换命令

创建 `.claude/commands/convert.md`：

```markdown
# Convert MyBatis

## 触发
用户想要将 MyBatis XML 方式转换为注解方式

## 前提条件
- 项目使用 MyBatis
- 已有 XML mapper 文件

## 执行流程
1. 扫描项目中的 XML mapper 文件
2. 对每个 mapper：
   a. 读取 XML 内容
   b. 分析 SQL 语句
   c. 生成对应的注解形式
   d. 创建新的 Mapper 接口
3. 询问用户是否删除旧的 XML 文件
4. 更新 package-info.java

## Gotchas
⚠️ 复杂的动态 SQL 可能不适合注解方式
⚠️ 确保转换后通过测试验证功能正常
```

## 进阶：命令编排代理

命令可以调用子代理，形成编排模式：

```markdown
# 完整功能开发

## 触发
用户想要开发一个完整的功能模块

## 工作流
1. 先使用 Plan 代理规划
2. 然后调用实现代理
3. 最后调用测试代理验证

## 流程
1. "请先使用 Plan 代理分析这个功能的实现方案"
2. "方案确定后，使用通用代理实现代码"
3. "最后运行测试确保功能正常"
```

## 下一步

进入 [第五阶段：子代理(Subagent)配置](../05-subagents/README.md) 学习如何创建和使用子代理。
