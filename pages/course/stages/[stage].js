import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const stageTitles = {
  '01-intro': '课程介绍与环境准备',
  '02-concepts': '理解核心概念',
  '03-memory': 'CLAUDE.md 内存系统',
  '04-commands': '命令使用',
  '05-subagents': '子代理配置',
  '06-skills': '技能开发',
  '07-hooks': '钩子系统',
  '08-mcp': 'MCP 服务器配置',
  '09-orchestration': '编排工作流',
  '10-settings': 'Settings 配置',
  '11-permissions': '权限与安全',
  '12-workflows': '团队协作',
};

const stageKeys = ['intro', 'concepts', 'memory', 'commands', 'subagents', 'skills', 'hooks', 'mcp', 'orchestration', 'settings', 'permissions', 'workflows'];

export default function CoursePage({ content, stageInfo }) {
  const title = stageTitles[stageInfo.id] || stageInfo.id;
  const stageNum = parseInt(stageInfo.id.split('-')[0]);

  const getStageId = (num) => `${String(num).padStart(2, '0')}-${stageKeys[num - 1]}`;

  const renderMarkdown = (md) => {
    let html = md
      .replace(/href="(\d+)-(\w+)\/README\.md"/g, 'href="/course/stages/$1-$2"')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
        if (url.endsWith('.md')) {
          return `<a href="${url.replace(/\/README\.md$/, '')}" style="color:#2997ff">${text}</a>`;
        }
        return `<a href="${url}" style="color:#2997ff" target="_blank" rel="noopener">${text}</a>`;
      })
      .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-semibold mt-10 mb-4" style="color:#f5f5f7">$1</h4>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-12 mb-5 font-title" style="color:#f5f5f7">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-14 mb-6 font-title" style="color:#f5f5f7">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-semibold mb-10 font-title" style="color:#f5f5f7">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#f5f5f7;font-weight:600">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-[#1d1d1f] text-[#e8e8ed] p-5 rounded-xl overflow-x-auto my-6 font-mono text-sm border" style="border-color:rgba(255,255,255,0.1)"><code>$2</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-[#2d2d2f] text-[#2997ff] px-2 py-0.5 rounded text-sm font-mono" style="border:1px solid rgba(255,255,255,0.08)">$1</code>')
      .replace(/^- (.*$)/gm, '<li class="ml-5 mb-3" style="color:#a1a1a6">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-5 mb-3 list-decimal" style="color:#a1a1a6">$1</li>')
      .replace(/\|(.*)\|/g, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        if (cells.some(c => c.includes('---'))) return '';
        return `<tr>${cells.map(c => `<td class="border p-3" style="border-color:rgba(255,255,255,0.1)">${c}</td>`).join('')}</tr>`;
      })
      .replace(/\n\n/g, '</p><p class="mb-5" style="color:#a1a1a6">')
      .replace(/\n/g, '<br/>');

    return `<div class="course-prose">${html}</div>`;
  };

  return (
    <div className="min-h-screen bg-noise gradient-subtle">
      {/* 导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-apple">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm font-medium transition hover:opacity-70" style={{ color: '#2997ff' }}>
              ← 返回
            </a>
            <span className="tag-apple">{String(stageNum).padStart(2, '0')}</span>
            <h1 className="text-base font-semibold font-title">{title}</h1>
          </div>
          <a href="/" className="text-sm" style={{ color: '#6e6e73' }}>课程目录</a>
        </div>
      </nav>

      {/* 课程内容 */}
      <main className="max-w-4xl mx-auto px-6 py-32">
        <article className="p-10 rounded-3xl border animate-fade-in-up"
                 style={{
                   background: 'linear-gradient(180deg, rgba(25,25,27,0.9) 0%, rgba(20,20,22,0.9) 100%)',
                   borderColor: 'rgba(255,255,255,0.08)',
                   boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
                 }}
                 dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />

        {/* 底部导航 */}
        <div className="flex justify-between mt-12 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {stageNum > 1 ? (
            <a href={`/course/stages/${getStageId(stageNum - 1)}`}
               className="text-sm font-medium transition hover:opacity-70" style={{ color: '#2997ff' }}>
              ← 上一课
            </a>
          ) : <div />}

          {stageNum < 12 && (
            <a href={`/course/stages/${getStageId(stageNum + 1)}`}
               className="text-sm font-medium transition hover:opacity-70" style={{ color: '#2997ff' }}>
              下一课 →
            </a>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getStaticPaths() {
  const stages = ['01-intro', '02-concepts', '03-memory', '04-commands', '05-subagents', '06-skills', '07-hooks', '08-mcp', '09-orchestration', '10-settings', '11-permissions', '12-workflows'];
  return { paths: stages.map(stage => ({ params: { stage } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const stage = params.stage;
  const filePath = path.join(process.cwd(), 'course', 'stages', stage, 'README.md');
  let content = '# 页面未找到';
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    content = matter(fileContent).content;
  } catch (e) { }
  return { props: { content, stageInfo: { id: stage } } };
}