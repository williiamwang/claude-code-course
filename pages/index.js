import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const courseStages = [
  { id: '01-intro', title: '课程介绍', description: '了解 Claude Code 和开发环境配置' },
  { id: '02-concepts', title: '核心概念', description: 'Command、Agent、Skill 三大核心机制' },
  { id: '03-memory', title: '内存系统', description: 'CLAUDE.md 持久化项目知识' },
  { id: '04-commands', title: '命令使用', description: '创建自定义命令简化工作流' },
  { id: '05-subagents', title: '子代理配置', description: '创建专业化 AI 代理' },
  { id: '06-skills', title: '技能开发', description: '开发可复用自动化能力' },
  { id: '07-hooks', title: '钩子系统', description: '事件驱动的自动化处理' },
  { id: '08-mcp', title: 'MCP 配置', description: '连接外部工具和服务' },
  { id: '09-orchestration', title: '编排工作流', description: '组合 Command→Agent→Skill' },
  { id: '10-settings', title: 'Settings 配置', description: '60+ 配置选项详解' },
  { id: '11-permissions', title: '权限与安全', description: '权限管理和安全配置' },
  { id: '12-workflows', title: '团队协作', description: '团队环境最佳实践' },
];

export default function Home() {
  const router = useRouter();
  const [activeStage, setActiveStage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const stage = router.asPath.match(/stages\/(.*?)$/)?.[1];
    if (stage) setActiveStage(stage);
  }, [router.asPath]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context: '' })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || '抱歉，服务暂时不可用' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '发送失败，请重试' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f7 100%)' }}>
      {/* 顶部导航 - Apple 风格 */}
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Claude Code 课程
          </h1>
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
            style={{ background: '#0071e3', color: 'white' }}
          >
            {showChat ? '关闭' : 'AI 答疑'}
          </button>
        </div>
      </header>

      {/* AI 答疑面板 - Apple 风格 */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-96 rounded-2xl overflow-hidden shadow-lg border"
             style={{ background: 'white', borderColor: '#e8e8ed', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <div className="px-6 py-4" style={{ background: '#f5f5f7' }}>
            <h3 className="font-semibold text-sm">AI 导师</h3>
            <p className="text-xs" style={{ color: '#86868b' }}>回答课程相关问题</p>
          </div>
          <div className="h-72 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">📚</p>
                <p className="text-sm" style={{ color: '#86868b' }}>有什么可以帮你的？</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`p-3 rounded-xl text-sm ${msg.role === 'user' ? 'ml-8' : 'mr-8'}`}
                   style={{ background: msg.role === 'user' ? '#0071e3' : '#f5f5f7', color: msg.role === 'user' ? 'white' : '#1d1d1f' }}>
                {msg.content}
              </div>
            ))}
            {loading && <div className="text-sm" style={{ color: '#86868b' }}>思考中...</div>}
          </div>
          <div className="p-4 border-t" style={{ borderColor: '#e8e8ed' }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="输入问题..."
                className="flex-1 px-4 py-2 rounded-full text-sm border-0"
                style={{ background: '#f5f5f7' }}
                disabled={loading}
              />
              <button onClick={sendMessage} disabled={loading || !input.trim()}
                      className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{ background: '#0071e3', color: 'white', opacity: loading || !input.trim() ? 0.5 : 1 }}>
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 主内容区 */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* 标题区 */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Claude Code 最佳实践
          </h2>
          <p className="text-lg" style={{ color: '#86868b', maxWidth: '500px', margin: '0 auto' }}>
            12 阶段渐进式学习，从基础到生产环境
          </p>
        </div>

        {/* 课程网格 - Apple 风格卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {courseStages.map((stage, index) => (
            <Link
              key={stage.id}
              href={`/course/stages/${stage.id}`}
              className="block p-6 rounded-2xl border card-hover animate-fade-in-up"
              style={{
                background: 'white',
                borderColor: '#e8e8ed',
                animationDelay: `${index * 80}ms`
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium px-2 py-1 rounded"
                      style={{ background: '#f5f5f7', color: '#86868b' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-medium text-base">{stage.title}</h3>
              </div>
              <p className="text-sm" style={{ color: '#86868b' }}>{stage.description}</p>
            </Link>
          ))}
        </div>

        {/* 学习指南 - Apple 风格 */}
        <div className="text-center py-8 rounded-2xl animate-fade-in-up delay-400"
             style={{ background: 'white', border: '1px solid #e8e8ed' }}>
          <h3 className="font-medium mb-4">学习路径</h3>
          <div className="flex justify-center gap-8 text-sm" style={{ color: '#86868b' }}>
            <span>新手：从第 1 阶段开始</span>
            <span>中级：跳转第 2-3 阶段</span>
            <span>高级：直接查阅第 10+ 阶段</span>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="text-center py-8 text-sm" style={{ color: '#86868b' }}>
        <p>基于 claude-code-best-practice 项目</p>
      </footer>
    </div>
  );
}