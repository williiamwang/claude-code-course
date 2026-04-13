# 第七阶段：Hooks钩子系统

本阶段将帮助你理解和使用 Claude Code 的钩子系统来实现自动化。

## 什么是 Hooks？

Hooks 是用户定义的处理器，在特定事件发生时执行：
- 工具使用前后
- 用户提交提示后
- 会话开始/结束
- 代理启动/停止

## Hooks 事件类型

| 事件 | 触发时机 | 常见用途 |
|------|----------|----------|
| `PreToolUse` | 工具执行前 | 验证、阻止、日志 |
| `PostToolUse` | 工具执行后 | 格式化、通知 |
| `UserPromptSubmit` | 用户提交提示后 | 预处理、日志 |
| `Notification` | 通知事件 | 声音提醒 |
| `Stop` | 对话停止后 | 总结、清理 |
| `SubagentStart` | 子代理启动 | 记录、通知 |
| `SubagentStop` | 子代理停止 | 结果汇总 |
| `PreCompact` | 压缩上下文前 | 总结 |
| `SessionStart` | 会话开始 | 初始化 |
| `SessionEnd` | 会话结束 | 清理 |
| `Setup` | 初始化时 | 配置 |
| `PermissionRequest` | 权限请求 | 自动批准 |
| `TeammateIdle` | 队友空闲 | 通知 |
| `TaskCompleted` | 任务完成 | 通知 |
| `ConfigChange` | 配置变更 | 响应 |

## Hooks 配置位置

```
.claude/hooks/
├── scripts/
│   └── hooks.py          # 主处理器
├── config/
│   ├── hooks-config.json    # 团队配置
│   └── hooks-config.local.json  # 个人配置
└── sounds/               # 声音文件
```

## hooks-config.json 结构

```json
{
  "PreToolUse": [
    {
      "matcher": "Bash.*",
      "hooks": [
        {
          "type": "command",
          "command": "python scripts/pre-bash.py"
        }
      ]
    }
  ],
  "PostToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "command", 
          "command": "python scripts/post-write.py"
        }
      ]
    }
  ]
}
```

## Hooks 类型

### 1. Command Hook

```json
{
  "type": "command",
  "command": "python scripts/my-hook.py"
}
```

### 2. HTTP Hook

```json
{
  "type": "http",
  "url": "https://webhook.example.com/notify",
  "method": "POST"
}
```

### 3. Prompt Hook

```json
{
  "type": "prompt",
  "prompt": "你是一个代码质量检查员..."
}
```

### 4. Agent Hook

```json
{
  "type": "agent",
  "agent": "review-agent"
}
```

## 实践练习

### 练习 7.1：创建 PostToolUse 钩子

创建 `.claude/hooks/scripts/post-format.py`：

```python
#!/usr/bin/env python3
"""自动格式化代码"""

import sys
import subprocess

def main():
    # 读取事件数据
    event_data = sys.stdin.read()
    
    # 获取文件路径
    # 实际实现中需要解析 event_data
    
    print("Checking code format...")
    
    # 可以调用 formatter
    # subprocess.run(["black", "file.py"])
    
    return 0

if __name__ == "__main__":
    exit(main())
```

### 练习 7.2：创建通知钩子

```json
// .claude/hooks/config/hooks-config.json
{
  "TaskCompleted": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "echo '任务完成' && powershell -c '[System.Media.SystemSounds]::Exclamation.Play()'"
        }
      ]
    }
  ]
}
```

### 练习 7.3：创建权限自动批准钩子

```json
// .claude/hooks/config/hooks-config.json
{
  "PermissionRequest": [
    {
      "matcher": "Bash(mvn test)",
      "hooks": [
        {
          "type": "agent",
          "agent": "auto-approver"
        }
      ]
    }
  ]
}
```

## 最佳实践

1. **使用 Hooks 自动格式化代码**
2. **使用 Hooks 进行安全检查**
3. **使用 Hooks 发送通知**
4. **使用 Hooks 记录操作日志**

## 下一步

进入 [第八阶段：MCP服务器配置](../08-mcp/README.md) 学习如何配置 MCP 服务器。
