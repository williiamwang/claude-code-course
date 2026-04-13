# 第十阶段：Settings配置详解

本阶段将帮助你深入理解 `settings.json` 的各种配置选项。

## settings.json 概述

Claude Code 提供了 60+ 配置选项和 170+ 环境变量，分为以下类别：
- 核心配置
- 权限配置
- 权限模式
- Hooks 配置
- 显示/UX
- 计划目录
- MCP 服务器
- 模型配置
- 输出样式
- 沙箱

## 配置层级

1. **Managed** (MDM/Registry): 组织强制配置，无法覆盖
2. **命令行参数**: 单次会话覆盖
3. **settings.local.json**: 个人项目配置（git 忽略）
4. **settings.json**: 团队共享配置
5. **~/.claude/settings.json**: 全局个人默认

## 常用配置示例

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  },
  "display": {
    "spinnerVerbs": ["Building", "Coding", "Testing"],
    "ansiColor": true
  },
  "plans": {
    "directory": ".claude/plans"
  }
}
```

## 详细配置项

### 权限配置

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions",
    "allow": ["Bash(mvn *)", "Read(/src/**)"],
    "deny": ["Bash(rm -rf)", "Write(/prod/**)"]
  }
}
```

### 模型配置

```json
{
  "model": {
    "default": "sonnet",
    "preferences": {
      "default": "claude-sonnet-4-6",
      "reasoning": "claude-opus-4-6"
    }
  }
}
```

### 计划目录

```json
{
  "plans": {
    "directory": ".claude/plans"
  }
}
```

## 下一步

进入 [第十一阶段：权限与安全](../11-permissions/README.md) 学习权限管理。
