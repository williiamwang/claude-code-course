import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const courseStages = [
  { id: '01-intro', title: '课程介绍与环境准备', description: '了解 Claude Code 和开发环境配置' },
  { id: '02-concepts', title: '理解核心概念', description: 'Command、Agent、Skill 三大核心机制' },
  { id: '03-memory', title: 'CLAUDE.md 内存系统', description: '持久化项目知识和规范' },
  { id: '04-commands', title: '命令(Command)使用', description: '创建自定义命令简化工作流' },
  { id: '05-subagents', title: '子代理(Subagent)配置', description: '创建专业化 AI 代理' },
  { id: '06-skills', title: '技能(Skill)开发', description: '开发可复用自动化能力' },
  { id: '07-hooks', title: 'Hooks钩子系统', description: '事件驱动的自动化处理' },
  { id: '08-mcp', title: 'MCP服务器配置', description: '连接外部工具和服务' },
  { id: '09-orchestration', title: '编排工作流', description: '组合 Command→Agent→Skill' },
  { id: '10-settings', title: 'Settings配置详解', description: '60+ 配置选项详解' },
  { id: '11-permissions', title: '权限与安全', description: '权限管理和安全配置' },
  { id: '12-workflows', title: '团队协作与工作流', description: '团队环境最佳实践' },
];

export default function Home() {
  const router = useRouter();
  const [activeStage, setActiveStage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // 检查当前浏览的章节
  useEffect(() => {
    const stage = router.asPath.match(/stages\/(.*?)\//)?.[1];
    if (stage) {
      setActiveStage(stage);
    }
  }, [router.asPath]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // 添加用户消息
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: activeStage ? `用户正在学习第 ${activeStage.split('-')[0]} 阶段课程` : ''
        })
      });

      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，AI服务暂时不可用，请稍后重试。' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '发送失败，请重试。' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Claude Code 最佳实践课程</h1>
          <button
            onClick={() => setShowChat(!showChat)}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            {showChat ? '关闭答疑' : '💬 AI 答疑'}
          </button>
        </div>
      </nav>

      {/* AI 答疑面板 */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3 rounded-t-xl">
            <h3 className="font-semibold">AI 导师答疑</h3>
            <p className="text-xs opacity-80">回答课程相关问题</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <p className="text-4xl mb-2">📚</p>
                <p>你好！我是 AI 导师</p>
                <p className="text-sm">有什么课程问题可以问我</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`${msg.role === 'user' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-100'} max-w-[85%] rounded-lg p-3`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
            {loading && (
              <div className="mr-auto bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-500">正在思考中...</p>
              </div>
            )}
          </div>

          <div className="p-3 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入问题..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700 transition"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 课程目录 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">课程目录</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseStages.map((stage, index) => (
              <Link
                key={stage.id}
                href={`/course/stages/${stage.id}/README.md`}
                className={`block p-4 rounded-lg border transition hover:shadow-md ${
                  activeStage === stage.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-semibold text-gray-800">{stage.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{stage.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* 学习指南 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">学习指南</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>新手</strong>：从第一阶段开始，按顺序学习</li>
            <li>✅ <strong>中级用户</strong>：直接跳转到第二、三阶段</li>
            <li>✅ <strong>高级用户</strong>：查阅第四阶段的生产环境配置</li>
          </ul>
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <p className="text-sm text-gray-600">
              💡 <strong>提示</strong>：学习过程中有任何问题，点击右上角"AI答疑"按钮向我提问！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
