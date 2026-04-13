# 第九阶段：编排工作流

本阶段将帮助你学会如何将命令、代理和技能组合成完整的工作流。

## 编排模式：Command → Agent → Skill

这是推荐的最佳实践模式：

```
用户输入
    ↓
Command (入口点) - 接收输入，编排流程
    ↓
Agent (执行者) - 在隔离上下文中执行任务
    ↓  
Skill (工具) - 具体操作实现
```

## 示例：天气查询系统

### 1. Command（入口）

`.claude/commands/weather.md`:
```markdown
# 天气查询

## 触发
用户查询天气时使用

## 交互
1. 询问选择摄氏度还是华氏度
2. 调用 weather-agent
3. 调用 weather-svg-creator
```

### 2. Agent（执行）

`.claude/agents/weather-agent.md`:
```yaml
---
name: weather-agent
description: 获取天气数据 - PROACTIVELY
skills:
  - weather-fetcher
model: sonnet
---
```

### 3. Skill（操作）

`.claude/skills/weather-fetcher/SKILL.md`:
```yaml
---
name: weather-fetcher
description: 从 API 获取天气数据
---

# 天气数据获取
```

## 工作流最佳实践

1. **保持简单**：先用 vanilla Claude，必要时才添加工作流
2. **专业化**：为特定功能创建专门的代理/技能
3. **可组合**：设计可重用的技能组件
4. **可测试**：每个技能都应该可以独立测试

## 下一步

进入 [第十阶段：Settings配置详解](../10-settings/README.md) 学习如何配置 settings.json。
