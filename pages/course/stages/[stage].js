import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function CoursePage({ content, title, stageInfo }) {
  // 简单的 Markdown 渲染
  const renderMarkdown = (md, stageId) => {
    // 课程阶段标题映射
    const stageTitles = {
      '01-intro': '课程介绍与环境准备',
      '02-concepts': '理解核心概念',
      '03-memory': 'CLAUDE.md 内存系统',
      '04-commands': '命令(Command)使用',
      '05-subagents': '子代理(Subagent)配置',
      '06-skills': '技能(Skill)开发',
      '07-hooks': 'Hooks钩子系统',
      '08-mcp': 'MCP服务器配置',
      '09-orchestration': '编排工作流',
      '10-settings': 'Settings配置详解',
      '11-permissions': '权限与安全',
      '12-workflows': '团队协作与工作流',
    };

    // 修复链接：移除 README.md 后缀，添加 .html 或保持干净路径
    let html = md
      // 修复相对路径链接
      .replace(/href="\.\/([^"]+)\.md"/g, 'href="/course/stages/$1"')
      .replace(/href="\.\.\/([^"]+)\.md"/g, (match, p1) => {
        // 解析相对路径
        const currentNum = parseInt(stageId.split('-')[0]);
        const targetNum = parseInt(p1.split('-')[0]);
        const diff = targetNum - currentNum;
        if (diff === 1) {
          return `href="/course/stages/${p1}"`;
        }
        return `href="/course/stages/${p1}"`;
      })
      .replace(/href="(\d+)-(\w+)\/README\.md"/g, 'href="/course/stages/$1-$2"')
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
      // 链接 - 通用修复
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
        // 如果是相对路径，修复它
        if (url.endsWith('.md')) {
          const fixedUrl = url.replace(/\/README\.md$/, '').replace(/^\.\.\/(\d+)-/, '/course/stages/$1-');
          return `<a href="${fixedUrl}" class="text-blue-600 hover:underline">${text}</a>`;
        }
        return `<a href="${url}" class="text-blue-600 hover:underline" target="_blank" rel="noopener">${text}</a>`;
      })
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

  // 课程阶段标题映射
  const getStageTitle = (stageId) => {
    const titles = {
      '01-intro': '课程介绍与环境准备',
      '02-concepts': '理解核心概念',
      '03-memory': 'CLAUDE.md 内存系统',
      '04-commands': '命令(Command)使用',
      '05-subagents': '子代理(Subagent)配置',
      '06-skills': '技能(Skill)开发',
      '07-hooks': 'Hooks钩子系统',
      '08-mcp': 'MCP服务器配置',
      '09-orchestration': '编排工作流',
      '10-settings': 'Settings配置详解',
      '11-permissions': '权限与安全',
      '12-workflows': '团队协作与工作流',
    };
    return titles[stageId] || stageId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="text-lg hover:text-blue-200">← 返回首页</a>
            <h1 className="text-xl font-bold">{getStageTitle(stageInfo.id)}</h1>
          </div>
          <a href="/course" className="text-white hover:text-blue-200">课程目录</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <article dangerouslySetInnerHTML={{ __html: renderMarkdown(content, stageInfo.id) }} />
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
