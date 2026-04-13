import { useState } from 'react';
import Link from 'next/link';

const courseStages = [
  { id: '01-intro', title: '课程介绍', desc: 'Claude Code 基础与环境配置' },
  { id: '02-concepts', title: '核心概念', desc: 'Command · Agent · Skill 机制' },
  { id: '03-memory', title: '内存系统', desc: 'CLAUDE.md 持久化知识' },
  { id: '04-commands', title: '命令使用', desc: '自定义命令工作流' },
  { id: '05-subagents', title: '子代理', desc: '专业化 AI 代理配置' },
  { id: '06-skills', title: '技能开发', desc: '可复用自动化能力' },
  { id: '07-hooks', title: '钩子系统', desc: '事件驱动自动化' },
  { id: '08-mcp', title: 'MCP', desc: '外部工具与服务连接' },
  { id: '09-orchestration', title: '编排工作流', desc: 'Command → Agent → Skill' },
  { id: '10-settings', title: 'Settings', desc: '60+ 配置选项详解' },
  { id: '11-permissions', title: '权限安全', desc: '权限管理与安全配置' },
  { id: '12-workflows', title: '团队协作', desc: '团队环境最佳实践' },
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
    <div className="min-h-screen bg-noise gradient-subtle">
      {/* 导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-apple">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #2997ff 0%, #0066cc 100%)' }}>
              <span className="text-white font-semibold text-xs">CC</span>
            </div>
            <span className="text-base font-semibold tracking-tight font-title">Claude Code</span>
          </div>
          <button onClick={() => setShowChat(!showChat)} className="btn-apple">
            {showChat ? '关闭' : 'AI 答疑'}
          </button>
        </div>
      </nav>

      {/* AI 浮窗 - Apple 风格 */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-[400px] rounded-2xl overflow-hidden animate-fade-in-up"
             style={{
               background: 'linear-gradient(180deg, rgba(30,30,30,0.95) 0%, rgba(20,20,20,0.95) 100%)',
               border: '1px solid rgba(255,255,255,0.1)',
               boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 100px rgba(41,151,255,0.1)'
             }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center animate-glow-pulse"
                   style={{ background: 'linear-gradient(135deg, #2997ff 0%, #0066cc 100%)' }}>
                <span className="text-white text-xs font-medium">AI</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold">AI 导师</h3>
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
                   style={{
                     background: msg.role === 'user' ? 'linear-gradient(135deg, #2997ff 0%, #0066cc 100%)' : 'rgba(45,45,47,0.8)',
                     color: msg.role === 'user' ? 'white' : '#f5f5f7'
                   }}>
                {msg.content}
              </div>
            ))}
            {loading && <div className="text-sm" style={{ color: '#6e6e73' }}>思考中...</div>}
          </div>
          <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                     placeholder="输入问题..." className="flex-1 px-4 py-3 rounded-xl text-sm border-0"
                     style={{ background: 'rgba(45,45,47,0.8)', color: '#f5f5f7' }} disabled={loading} />
              <button onClick={sendMessage} disabled={loading || !input.trim()} className="btn-apple px-5">
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 主内容 */}
      <main className="pt-36 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* 大标题区 */}
          <div className="text-center mb-24 animate-fade-in-up">
            <p className="text-sm font-medium tracking-[0.3em] uppercase mb-8" style={{ color: '#2997ff' }}>
              Best Practice
            </p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-semibold mb-6 tracking-tight font-title"
                style={{ background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.6) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Claude Code
            </h1>
            <p className="text-xl md:text-2xl font-light" style={{ color: '#6e6e73', maxWidth: '480px', margin: '0 auto' }}>
              12 阶段渐进式学习体系
            </p>
          </div>

          {/* 课程网格 - Apple 卡片风格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {courseStages.map((stage, index) => (
              <Link key={stage.id} href={`/course/stages/${stage.id}`}
                    className="block p-7 card-apple animate-fade-in-up"
                    style={{ animationDelay: `${index * 75}ms` }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="tag-apple">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="text-base font-semibold">{stage.title}</h3>
                </div>
                <p className="text-sm font-light" style={{ color: '#6e6e73' }}>{stage.desc}</p>
              </Link>
            ))}
          </div>

          {/* 学习路径 */}
          <div className="text-center py-8 rounded-2xl border animate-fade-in-up delay-450"
               style={{
                 background: 'linear-gradient(180deg, rgba(41,151,255,0.05) 0%, transparent 100%)',
                 borderColor: 'rgba(41,151,255,0.15)'
               }}>
            <p className="text-sm" style={{ color: '#6e6e73' }}>
              <span style={{ color: '#f5f5f7' }}>新手</span> 从第 1 阶段开始 ·
              <span style={{ color: '#f5f5f7' }}> 中级</span> 跳转 2-3 阶段 ·
              <span style={{ color: '#f5f5f7' }}> 高级</span> 直接查阅 10+ 阶段
            </p>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="text-center py-10 text-sm" style={{ color: '#6e6e73' }}>
        <p>Based on claude-code-best-practice · © 2026</p>
      </footer>
    </div>
  );
}