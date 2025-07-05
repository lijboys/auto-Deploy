addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // 处理 API 请求
  if (url.pathname.startsWith('/api/')) {
    return handleApiRequest(request)
  }
  
  // 处理静态资源
  return handleStaticRequest(request)
}

async function handleApiRequest(request) {
  // 这里是 API 处理逻辑
  // 在实际应用中，这里会处理部署相关的 API 调用
  
  // 模拟 API 响应
  return new Response(JSON.stringify({
    status: 'success',
    message: 'API 请求已处理'
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}

async function handleStaticRequest(request) {
  const url = new URL(request.url)
  let path = url.pathname
  
  // 处理根路径
  if (path === '/') {
    path = '/index.html'
  }
  
  // 根据文件扩展名设置 MIME 类型
  const mimeType = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  }
  
  const ext = path.match(/\.[^/.]+$/)?.[0] || ''
  const contentType = mimeType[ext] || 'text/plain'
  
  try {
    // 从静态资源读取文件
    // 注意：在实际的 Cloudflare Workers 环境中，这里需要使用正确的静态资源处理方法
    const asset = await fetch(`https://static.your-worker.dev${path}`)
    
    if (asset.status === 404) {
      return new Response('Not Found', { status: 404 })
    }
    
    // 设置正确的 MIME 类型
    const headers = new Headers(asset.headers)
    headers.set('Content-Type', contentType)
    
    return new Response(asset.body, {
      status: asset.status,
      headers
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}
    
