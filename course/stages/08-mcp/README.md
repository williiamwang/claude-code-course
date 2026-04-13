# 第八阶段：MCP服务器配置

本阶段将帮助你理解如何配置 MCP 服务器以扩展 Claude Code 的能力。

## 什么是 MCP？

MCP (Model Context Protocol) 是模型上下文协议，允许 Claude Code 连接外部工具、数据库和 API。

## MCP 配置位置

- 项目级：`.mcp.json`
- 全局级：`~/.mcp.json`

## 常用 MCP 服务器

| 服务器 | 用途 |
|--------|------|
| `filesystem` | 文件系统操作 |
| `puppeteer` | 浏览器自动化 |
| `playwright` | Web 测试自动化 |
| `chrome-devtools` | Chrome 开发者工具 |
| `sqlite` | SQLite 数据库 |

## 配置示例

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/directory"]
    }
  }
}
```

## 下一步

进入 [第九阶段：编排工作流](../09-orchestration/README.md) 学习如何组合使用命令、代理和技能。
