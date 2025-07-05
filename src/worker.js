// src/worker.js
import { readFileSync } from 'fs';
import { join } from 'path';

// 读取静态资源
const html = readFileSync(join(process.cwd(), 'public', 'index.html'), 'utf8');
const css = readFileSync(join(process.cwd(), 'public', 'style.css'), 'utf8');
const script = readFileSync(join(process.cwd(), 'public', 'script.js'), 'utf8');

// 定义 MIME 类型
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// 处理请求
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // 静态资源路由
  if (path.endsWith('.css')) {
    return new Response(css, {
      headers: { 'Content-Type': MIME_TYPES['.css'] },
    });
  }

  if (path.endsWith('.js')) {
    return new Response(script, {
      headers: { 'Content-Type': MIME_TYPES['.js'] },
    });
  }

  // 所有其他路径返回 HTML
  return new Response(html, {
    headers: { 'Content-Type': MIME_TYPES['.html'] },
  });
}

// 监听 fetch 事件
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
