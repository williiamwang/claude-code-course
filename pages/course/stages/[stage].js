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

export default function CoursePage({ content, stageInfo }) {
  const title = stageTitles[stageInfo.id] || stageInfo.id;
  const stageNum = parseInt(stageInfo.id.split('-')[0]);
  const prevStage = stageNum > 1 ? `${String(stageNum - 1).padStart(2, '0')}-${stageNum === 2 ? 'concepts' : stageNum === 3 ? 'memory' : stageNum === 4 ? 'commands' : stageNum === 5 ? 'subagents' : stageNum === 6 ? 'skills' : stageNum === 7 ? 'hooks' : stageNum === 8 ? 'mcp' : stageNum === 9 ? 'orchestration' : stageNum === 10 ? 'settings' : stageNum === 11 ? 'permissions' : 'workflows'}` : null;
  const nextStage = stageNum < 12 ? `${String(stageNum + 1).padStart(2, '0')}-${stageNum === 1 ? 'concepts' : stageNum === 2 ? 'memory' : stageNum === 3 ? 'commands' : stageNum === 4 ? 'subagents' : stageNum === 5 ? 'skills' : stageNum === 6 ? 'hooks' : stageNum === 7 ? 'mcp' : stageNum === 8 ? 'orchestration' : stageNum === 9 ? 'settings' : stageNum === 10 ? 'permissions' : 'workflows'}` : null;

  const getNextStageName = (num) => {
    const names = ['', 'concepts', 'memory', 'commands', 'subagents', 'skills', 'hooks', 'mcp', 'orchestration', 'settings', 'permissions', 'workflows'];
    return names[num] || '';
  };

  const renderMarkdown = (md, stageId) => {
    let html = md
      .replace(/href="\.\/([^"]+)\.md"/g, 'href="/course/stages/$1"')
      .replace(/href="(\d+)-(\w+)\/README\.md"/g, 'href="/course/stages/$1-$2"')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
        if (url.endsWith('.md')) {
          const fixedUrl = url.replace(/\/README\.md$/, '').replace(/^\.\.\/(\d+)-/, '/course/stages/$1-');
          return `<a href="${fixedUrl}" class="text-blue-600 hover:underline">${text}</a>`;
        }
        return `<a href="${url}" class="text-blue-600 hover:underline" target="_blank" rel="noopener">${text}</a>`;
      })
      .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-semibold mt-8 mb-3">$1</h4>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-10 mb-4">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-12 mb-5">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-semibold mb-8">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto my-6 font-mono text-sm"><code>$2</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-sm">$1</code>')
      .replace(/^- (.*$)/gm, '<li class="ml-5 mb-2 text-gray-600">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-5 mb-2 list-decimal text-gray-600">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-5 text-gray-600 leading-relaxed">')
      .replace(/\n/g, '<br/>');

    return `<div class="prose max-w-none">${html}</div>`;
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f7 100%)' }}>
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm font-medium hover:opacity-70 transition" style={{ color: '#0071e3' }}>
              ← 返回
            </a>
            <span className="text-sm px-3 py-1 rounded" style={{ background: '#f5f5f7', color: '#86868b' }}>
              {String(stageNum).padStart(2, '0')}
            </span>
            <h1 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {title}
            </h1>
          </div>
          <a href="/" className="text-sm" style={{ color: '#86868b' }}>课程目录</a>
        </div>
      </header>

      {/* 课程内容 */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-white rounded-2xl p-10 shadow-sm border"
                 style={{ borderColor: '#e8e8ed' }}
                 dangerouslySetInnerHTML={{ __html: renderMarkdown(content, stageInfo.id) }} />

        {/* 底部导航 */}
        <div className="flex justify-between mt-10 pt-8 border-t" style={{ borderColor: '#e8e8ed' }}>
          {prevStage ? (
            <a href={`/course/stages/${String(stageNum - 1).padStart(2, '0')}-${getNextStageName(stageNum - 1)}`}
               className="text-sm font-medium hover:opacity-70 transition"
               style={{ color: '#0071e3' }}>
              ← 上一课
            </a>
          ) : <div />}

          {nextStage && (
            <a href={`/course/stages/${String(stageNum + 1).padStart(2, '0')}-${getNextStageName(stageNum + 1)}`}
               className="text-sm font-medium hover:opacity-70 transition"
               style={{ color: '#0071e3' }}>
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