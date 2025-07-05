// Cloudflare Worker 后端处理脚本
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 只处理 POST 请求
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const requestData = await request.json()
    const { accountId, apiToken, config } = requestData

    // 验证输入
    if (!accountId || !apiToken) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 生成随机 Worker 名称
    const workerName = `edgetunnel-${generateRandomString(8)}`
    
    // 从 GitHub 获取 Edgetunnel 代码
    const edgetunnelCode = await fetchEdgetunnelCode()
    
    // 在 Cloudflare 上创建 Worker
    const createResponse = await createCloudflareWorker(accountId, apiToken, workerName, edgetunnelCode, config)
    
    if (!createResponse.success) {
      return new Response(JSON.stringify({ error: createResponse.errors[0].message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 构建访问 URL
    const workerDomain = `${workerName}.your-subdomain.workers.dev`
    let accessPath = ''
    
    if (config.key) {
      accessPath = config.key
    } else if (config.uuid) {
      // 取第一个 UUID
      const firstUuid = config.uuid.split(',')[0].trim()
      accessPath = firstUuid
    }
    
    const workerUrl = `https://${workerDomain}/${accessPath}`

    // 返回成功响应
    return new Response(JSON.stringify({
      success: true,
      workerName,
      workerDomain,
      workerUrl,
      config
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  }
}

// 从 GitHub 获取 Edgetunnel 代码
async function fetchEdgetunnelCode() {
  const response = await fetch('https://raw.githubusercontent.com/cmliu/edgetunnel/main/worker.js')
  if (!response.ok) {
    throw new Error('Failed to fetch Edgetunnel code from GitHub')
  }
  return await response.text()
}

// 在 Cloudflare 上创建 Worker
async function createCloudflareWorker(accountId, apiToken, workerName, script, config) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}`
  
  // 构建环境变量
  const envVars = {}
  if (config.uuid) envVars.UUID = config.uuid
  if (config.key) envVars.KEY = config.key
  if (config.proxyip) envVars.PROXYIP = config.proxyip
  if (config.socks5) envVars.SOCKS5 = config.socks5
  if (config.add) envVars.ADD = config.add
  if (config.addapi) envVars.ADDAPI = config.addapi
  if (config.subname) envVars.SUBNAME = config.subname
  
  const payload = {
    script,
    bindings: Object.entries(envVars).map(([name, value]) => ({
      type: 'plain_text',
      name,
      text: value
    }))
  }
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  
  return await response.json()
}

// 生成随机字符串
function generateRandomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
