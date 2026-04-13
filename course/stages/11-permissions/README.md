# 第十一阶段：权限与安全

本阶段将帮助你理解 Claude Code 的权限系统和安全配置。

## 权限模式

| 模式 | 描述 |
|------|------|
| `default` | 默认模式，每次危险操作提示 |
| `auto` | 自动模式，Claude 决定是否安全 |
| `bypassPermissions` | 绕过所有权限提示 |
| `plan` | 仅允许计划操作 |
| `acceptEdits` | 接受编辑操作 |

## 配置权限

### 全局配置

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  }
}
```

### 项目配置

```json
// .claude/settings.local.json
{
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": ["Bash(mvn *)", "Read(/src/**)"],
    "deny": ["Bash(rm *)"]
  }
}
```

## 安全最佳实践

1. **使用通配符限制命令**
2. **使用沙箱隔离**
3. **使用 Hooks 进行审计**
4. **定期审查权限配置**

## 下一步

进入 [第十二阶段：团队协作与工作流](../12-workflows/README.md) 学习团队协作最佳实践。
