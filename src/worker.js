// Workers 入口文件，处理 API 请求与前端页面
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const CF_API_BASE = 'https://api.cloudflare.com/client/v4';

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 处理 API 请求
  if (path.startsWith('/api/')) {
    return handleApiRequest(request);
  }
  
  // 返回前端页面
  return new Response(getFrontendHTML(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

async function handleApiRequest(request) {
  const url = new URL(request.url);
  const route = url.pathname.replace('/api/', '');
  const { accountId, apiToken, projectName, scriptContent } = await request.json();
  
  // Workers 部署接口
  if (route === 'workers/deploy') {
    try {
      // 验证参数
      if (!accountId || !apiToken || !projectName) {
        throw new Error('账号 ID、API Token 和项目名称不能为空');
      }
      
      // 调用 Cloudflare API 创建 Workers 脚本
      const deployRes = await fetch(`${CF_API_BASE}/accounts/${accountId}/workers/scripts/${projectName}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/javascript'
        },
        body: scriptContent
      });
      
      if (!deployRes.ok) {
        const error = await deployRes.json();
        throw new Error(error.errors?.[0]?.message || '部署失败，请检查参数');
      }
      
      const deployment = await deployRes.json();
      const workersUrl = `${projectName}.workers.dev`;
      return new Response(JSON.stringify({
        success: true,
        message: '部署成功',
        data: {
          projectName,
          url: `https://${workersUrl}`,
          id: deployment.result.id,
          deployTime: new Date().toLocaleString(),
          dashboardUrl: `https://dash.cloudflare.com/?to=/:account/${accountId}/workers/scripts/${projectName}`
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // 未知接口
  return new Response(JSON.stringify({ error: '接口不存在' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}

function getFrontendHTML() {
  // 读取 public/index.html 内容（实际需通过文件系统读取，此处简化为返回固定内容）
  // 实际项目中应使用 fs 模块读取本地文件
  return fetch('public/index.html').then(res => res.text());
}
