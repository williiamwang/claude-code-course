import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function CoursePage({ content, title, stageInfo }) {
  // 简单的 Markdown 渲染
  const renderMarkdown = (md) => {
    let html = md
      // 标题
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-6">$1</h1>')
      // 粗体和斜体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 代码块
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-red-600">$1</code>')
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      // 列表
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
      // 表格（简单处理）
      .replace(/\|(.*)\|/g, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        if (cells.some(c => c.includes('---'))) return '';
        return `<tr>${cells.map(c => `<td class="border px-3 py-2">${c}</td>`).join('')}</tr>`;
      })
      // 段落
      .replace(/\n\n/g, '</p><p class="my-4">')
      // 换行
      .replace(/\n/g, '<br/>');

    return `<div class="prose max-w-none">${html}</div>`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="text-lg hover:text-blue-200">← 返回首页</a>
            <h1 className="text-xl font-bold">{stageInfo.title}</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <article dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
        </div>

        {/* 底部导航 */}
        <div className="flex justify-between mt-8">
          <a href="/" className="text-blue-600 hover:underline">← 返回课程目录</a>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const stages = [
    '01-intro', '02-concepts', '03-memory', '04-commands', '05-subagents',
    '06-skills', '07-hooks', '08-mcp', '09-orchestration', '10-settings',
    '11-permissions', '12-workflows'
  ];

  const paths = stages.map(stage => ({
    params: { stage }
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const stage = params.stage;
  const filePath = path.join(process.cwd(), 'course', 'stages', stage, 'README.md');

  let content = '';
  let title = '课程';
  let description = '';

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content: md } = matter(fileContent);
    content = md;
    title = data.title || stage;
    description = data.description || '';
  } catch (e) {
    content = '# 页面未找到\n\n请返回首页选择课程。';
  }

  const stageInfo = {
    id: stage,
    title: title,
    description: description
  };

  return { props: { content, title, stageInfo } };
}
