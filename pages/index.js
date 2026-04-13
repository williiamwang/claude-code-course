import { useState } from 'react';
import Link from 'next/link';

const courseStages = [
  { id: '01-intro', title: '课程介绍', description: 'Claude Code 基础与环境配置' },
  { id: '02-concepts', title: '核心概念', description: 'Command · Agent · Skill 三大机制' },
  { id: '03-memory', title: '内存系统', description: 'CLAUDE.md 持久化项目知识' },
  { id: '04-commands', title: '命令使用', description: '自定义命令工作流' },
  { id: '05-subagents', title: '子代理', description: '专业化 AI 代理配置' },
  { id: '06-skills', title: '技能开发', description: '可复用自动化能力' },
  { id: '07-hooks', title: '钩子系统', description: '事件驱动自动化' },
  { id: '08-mcp', title: 'MCP', description: '外部工具与服务连接' },
  { id: '09-orchestration', title: '编排工作流', description: 'Command → Agent → Skill' },
  { id: '10-settings', title: 'Settings', description: '60+ 配置选项详解' },
  { id: '11-permissions', title: '权限安全', description: '权限管理与安全配置' },
  { id: '12-workflows', title: '团队协作', description: '团队环境最佳实践' },
];

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

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
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || '服务暂不可用' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '发送失败，请重试' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen tech-grid" style={{ background: '#000' }}>
      {/* 顶部导航 */}
      <header className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(40px)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2997ff 0%, #0066cc 100%)' }}>
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <span className="text-lg font-medium tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Claude Code
            </span>
          </div>
          <button onClick={() => setShowChat(!showChat)} className="btn-apple">
            {showChat ? '关闭' : 'AI 答疑'}
          </button>
        </div>
      </header>

      {/* AI 浮窗 */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-[420px] rounded-2xl overflow-hidden border glow animate-fade-in-up" style={{ background: '#1c1c1c', borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse-glow" style={{ background: '#2997ff' }}>
                <span className="text-white text-sm">AI</span>
              </div>
              <div>
                <h3 className="text-sm font-medium">AI 导师</h3>
                <p className="text-xs" style={{ color: '#6e6e73' }}>课程相关问题解答</p>
              </div>
            </div>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">📚</div>
                <p className="text-sm" style={{ color: '#6e6e73' }}>有什么可以帮你的？</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`p-3 rounded-xl text-sm ${msg.role === 'user' ? 'ml-12' : 'mr-12'}`}
                   style={{ background: msg.role === 'user' ? '#2997ff' : '#262626', color: msg.role === 'user' ? 'white' : '#f5f5f7' }}>
                {msg.content}
              </div>
            ))}
            {loading && <div className="text-sm" style={{ color: '#6e6e73' }}>思考中...</div>}
          </div>
          <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                     placeholder="输入问题..." className="flex-1 px-4 py-3 rounded-xl text-sm border-0"
                     style={{ background: '#262626', color: '#f5f5f7' }} disabled={loading} />
              <button onClick={sendMessage} disabled={loading || !input.trim()} className="px-5 py-3 rounded-xl text-sm font-medium"
                      style={{ background: '#2997ff', color: 'white', opacity: loading || !input.trim() ? 0.5 : 1 }}>
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 主内容 */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* 杂志风大标题 */}
          <div className="text-center mb-20 animate-fade-in-up">
            <p className="text-sm font-medium tracking-[0.2em] uppercase mb-6" style={{ color: '#2997ff' }}>
              Best Practice Course
            </p>
            <h1 className="magazine-title text-5xl md:text-7xl mb-6 gradient-text">
              Claude Code
            </h1>
            <p className="text-xl md:text-2xl max-w-xl mx-auto" style={{ color: '#6e6e73' }}>
              12 阶段渐进式学习 · 从入门到生产环境
            </p>
          </div>

          {/* 课程卡片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {courseStages.map((stage, index) => (
              <Link key={stage.id} href={`/course/stages/${stage.id}`}
                    className="block p-6 rounded-2xl border card-glow animate-fade-in-up"
                    style={{
                      background: '#1c1c1c',
                      borderColor: 'rgba(255,255,255,0.08)',
                      animationDelay: `${index * 60}ms`
                    }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: 'rgba(41,151,255,0.15)', color: '#2997ff' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-medium">{stage.title}</h3>
                </div>
                <p className="text-sm" style={{ color: '#6e6e73' }}>{stage.description}</p>
              </Link>
            ))}
          </div>

          {/* 学习路径 */}
          <div className="text-center py-8 rounded-2xl border animate-fade-in-up delay-400"
               style={{ background: 'rgba(41,151,255,0.05)', borderColor: 'rgba(41,151,255,0.15)' }}>
            <p className="text-sm" style={{ color: '#6e6e73' }}>
              <span className="text-white">新手</span> 从第 1 阶段开始 ·
              <span className="text-white"> 中级</span> 跳转 2-3 阶段 ·
              <span className="text-white"> 高级</span> 直接查阅 10+ 阶段
            </p>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="text-center py-8 text-sm" style={{ color: '#6e6e73' }}>
        <p>Based on claude-code-best-practice · © 2026</p>
      </footer>
    </div>
  );
}