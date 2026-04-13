export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // 构建系统提示
  const systemPrompt = `你是 Claude Code 学习课程的 AI 导师。你的任务是帮助用户理解课程内容并回答他们的问题。

## 课程内容
用户正在学习 Claude Code 最佳实践课程，课程包含以下阶段：
1. 课程介绍与环境准备
2. 理解核心概念 (Command, Agent, Skill)
3. CLAUDE.md 内存系统
4. 命令(Command)使用
5. 子代理(Subagent)配置
6. 技能(Skill)开发
7. Hooks钩子系统
8. MCP服务器配置
9. 编排工作流
10. Settings配置详解
11. 权限与安全
12. 团队协作与工作流

## 当前上下文
${context || '用户在学习课程，但没有指定具体章节'}

## 回答要求
1. 使用中文回答
2. 解释要清晰简洁，结合课程内容
3. 如果用户问的是课程相关问题，给出具体的答案或指导
4. 如果问题超出课程范围，礼貌地说明这是课程导师，只能回答课程相关问题
5. 可以举例说明，帮助用户理解`;

  // 使用兼容 Anthropic 的 MiniMax API
  const apiKey = process.env.MINIMAX_API_KEY || process.env.ANTHROPIC_API_KEY;
  const baseURL = process.env.ANTHROPIC_BASE_URL || 'https://api.minimaxi.com/anthropic';
  const model = process.env.ANTHROPIC_MODEL || 'MiniMax-M2.5';

  try {
    const response = await fetch(`${baseURL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Minimax API Error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || '抱歉，无法生成回答';
    res.status(200).json({ reply });
  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ error: 'AI服务调用失败: ' + error.message });
  }
}
