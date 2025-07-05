// Cloudflare Workers 部署脚本 - 支持网页直接部署

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// 处理所有请求
async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname
  
  // 处理 API 请求
  if (path.startsWith('/api/')) {
    return handleApiRequest(request)
  }
  
  // 处理静态资源请求
  return handleStaticRequest(path, request)
}

// 处理 API 请求
async function handleApiRequest(request) {
  const url = new URL(request.url)
  const route = url.pathname.replace('/api/', '')
  
  // 模拟部署 API
  if (route === 'deploy') {
    try {
      // 实际项目中，这里会调用 Cloudflare API 进行部署
      const body = await request.json()
      
      // 模拟部署过程
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // 生成随机项目名称和 UUID
      const projectName = body.projectName || `cloud-${Date.now()}`
      const uuid = body.uuid || generateUuid()
      
      // 返回部署结果
      return new Response(JSON.stringify({
        success: true,
        projectUrl: `${projectName}.workers.dev`,
        fullUrl: `https://${projectName}.workers.dev`,
        projectName,
        uuid,
        deployTime: new Date().toLocaleString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: '部署失败',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
  
  // 未知 API 路由
  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 处理静态资源请求
function handleStaticRequest(path, request) {
  // 根路径返回主页面
  if (path === '/' || path === '/index.html') {
    return new Response(getIndexHtml(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  }
  
  // 处理 CSS
  if (path.endsWith('.css')) {
    return new Response(getStyleCss(), {
      headers: { 'Content-Type': 'text/css; charset=utf-8' }
    })
  }
  
  // 处理 JavaScript
  if (path.endsWith('.js')) {
    return new Response(getScriptJs(), {
      headers: { 'Content-Type': 'application/javascript; charset=utf-8' }
    })
  }
  
  // 404 错误
  return new Response('Not Found', { status: 404 })
}

// 生成随机 UUID
function generateUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 返回 HTML 内容
function getIndexHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EdgeTunnel部署工具</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
  <script>
    // 配置Tailwind自定义颜色
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: '#165DFF',
            secondary: '#0FC6C2',
            accent: '#722ED1',
            dark: {
              primary: '#2D5BFF',
              background: '#121212',
              card: '#1E1E1E',
              text: '#E0E0E0'
            }
          },
          fontFamily: {
            inter: ['Inter', 'sans-serif'],
          },
        },
      }
    }
  </script>
</head>
<body class="font-inter bg-gray-50 text-gray-800 dark:bg-dark-background dark:text-dark-text transition-colors duration-300">
  <!-- 导航栏 -->
  <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white dark:bg-dark-card shadow-md">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <i class="fa fa-cloud text-primary text-2xl"></i>
        <h1 class="text-xl font-bold">EdgeTunnel部署工具</h1>
      </div>
      <button id="theme-toggle" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-primary/30 transition-colors">
        <i class="fa fa-moon-o text-xl dark:text-yellow-400 dark:fa-sun-o"></i>
      </button>
    </div>
  </nav>

  <!-- 主内容区 -->
  <main class="container mx-auto px-4 pt-24 pb-16">
    <!-- 介绍卡片 -->
    <section class="mb-8 bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 transform hover:scale-[1.01] transition-transform">
      <h2 class="text-2xl font-bold mb-4 text-primary">一键部署 EdgeTunnel 到 Cloudflare Workers</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        这个工具可以帮助你快速在 Cloudflare Workers 上部署 EdgeTunnel 项目。只需提供你的 Cloudflare 账号信息和相关配置，即可一键完成部署。
      </p>
      <div class="flex flex-wrap gap-4 mb-4">
        <div class="flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full text-sm">
          <i class="fa fa-bolt text-blue-500 mr-2"></i>
          <span>快速部署</span>
        </div>
        <div class="flex items-center bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-sm">
          <i class="fa fa-shield text-green-500 mr-2"></i>
          <span>安全可靠</span>
        </div>
        <div class="flex items-center bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full text-sm">
          <i class="fa fa-sliders text-purple-500 mr-2"></i>
          <span>自定义配置</span>
        </div>
      </div>
    </section>

    <!-- 部署表单 -->
    <section class="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 mb-8">
      <h2 class="text-xl font-bold mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
        <i class="fa fa-cog text-primary mr-2"></i>
        Cloudflare 配置
      </h2>
      
      <form id="deploy-form" class="space-y-6">
        <!-- Cloudflare 认证信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="account-id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cloudflare 账号 ID</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                <i class="fa fa-user-circle-o"></i>
              </span>
              <input type="text" id="account-id" name="account-id" required
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="请输入你的 Cloudflare 账号 ID">
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              可以在 Cloudflare 控制台的账户概览页面找到
            </p>
          </div>
          
          <div>
            <label for="api-token" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cloudflare API Token</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                <i class="fa fa-key"></i>
              </span>
              <input type="password" id="api-token" name="api-token" required
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="请输入你的 Cloudflare API Token">
            </div>
            <div class="flex items-center mt-1">
              <button type="button" id="show-token" class="text-xs text-primary hover:underline">
                显示密码
              </button>
              <p class="ml-auto text-xs text-gray-500 dark:text-gray-400">
                需要具有 Workers KV 和 Workers Scripts 权限
              </p>
            </div>
          </div>
        </div>
        
        <!-- 高级设置 -->
        <div id="advanced-settings" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-gray-700 dark:text-gray-300">
              <i class="fa fa-sliders text-primary mr-2"></i>
              高级设置
            </h3>
            <button type="button" id="toggle-advanced" class="text-sm text-primary hover:underline">
              <i class="fa fa-chevron-down mr-1"></i> 展开
            </button>
          </div>
          
          <div id="advanced-fields" class="hidden space-y-6">
            <!-- 项目名称 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="project-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">项目名称</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <i class="fa fa-tag"></i>
                  </span>
                  <input type="text" id="project-name" name="project-name" value="cloud-"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="项目名称">
                  <button type="button" id="random-project-name" class="absolute inset-y-0 right-0 flex items-center pr-3 text-primary hover:text-primary/80">
                    <i class="fa fa-random"></i>
                  </button>
                </div>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Cloudflare Workers 的项目名称
                </p>
              </div>
              
              <!-- UUID -->
              <div>
                <label for="uuid" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">UUID</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <i class="fa fa-id-card-o"></i>
                  </span>
                  <input type="text" id="uuid" name="uuid"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="UUID (留空则使用默认值)">
                  <button type="button" id="random-uuid" class="absolute inset-y-0 right-0 flex items-center pr-3 text-primary hover:text-primary/80">
                    <i class="fa fa-random"></i>
                  </button>
                </div>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  用于 EdgeTunnel 的 UUID
                </p>
              </div>
            </div>
            
            <!-- PROXYIP / SOCKS5 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="proxy-ip" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PROXYIP</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <i class="fa fa-server"></i>
                  </span>
                  <input type="text" id="proxy-ip" name="proxy-ip"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="代理服务器 IP (留空则使用默认值)">
                </div>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  代理服务器地址，与 SOCKS5 二选一
                </p>
              </div>
              
              <div>
                <label for="socks5" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SOCKS5</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <i class="fa fa-socks"></i>
                  </span>
                  <input type="text" id="socks5" name="socks5"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="SOCKS5 服务器 (留空则使用默认值)">
                </div>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  SOCKS5 服务器地址，与 PROXYIP 二选一
                </p>
              </div>
            </div>
            
            <!-- ADD / ADDAPI -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="add" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ADD</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <i class="fa fa-link"></i>
                  </span>
                  <input type="text" id="add" name="add"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="ADD (留空则使用默认值)">
                </div>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  EdgeTunnel 的 ADD 变量
                </p>
              </div>
              
              <div>
                <label for="add-api" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ADDAPI</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <i class="fa fa-code"></i>
                  </span>
                  <input type="text" id="add-api" name="add-api"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="ADDAPI (留空则使用默认值)">
                </div>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  EdgeTunnel 的 ADDAPI 变量
                </p>
              </div>
            </div>
            
            <!-- 订阅器名称 -->
            <div>
              <label for="sub-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">订阅器名称</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                  <i class="fa fa-bookmark"></i>
                </span>
                <input type="text" id="sub-name" name="sub-name"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="订阅器名称 (留空则使用默认值)">
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                EdgeTunnel 的 SUBNAME 变量
              </p>
            </div>
            
            <!-- 自定义域名 -->
            <div>
              <label for="custom-domain" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">自定义域名</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                  <i class="fa fa-globe"></i>
                </span>
                <input type="text" id="custom-domain" name="custom-domain"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="自定义域名前缀 (留空则使用默认域名)">
                <span class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400" id="domain-suffix">
                  .workers.dev
                </span>
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                只需要输入前缀，系统会自动添加 .workers.dev 后缀
              </p>
            </div>
          </div>
        </div>
        
        <!-- 部署按钮 -->
        <div class="flex justify-center">
          <button type="submit" id="deploy-btn" class="group relative bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 flex items-center">
            <span class="relative z-10 flex items-center">
              <i class="fa fa-rocket mr-2 group-hover:animate-bounce"></i>
              开始部署
            </span>
            <span class="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></span>
          </button>
        </div>
      </form>
    </section>
    
    <!-- 部署结果 -->
    <section id="result-section" class="hidden bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 mb-8">
      <h2 class="text-xl font-bold mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
        <i class="fa fa-check-circle text-green-500 mr-2"></i>
        部署结果
      </h2>
      
      <div id="loading-indicator" class="py-8 flex flex-col items-center justify-center">
        <div class="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">正在部署中，请稍候...</p>
      </div>
      
      <div id="result-success" class="hidden">
        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
          <div class="flex items-start">
            <div class="flex-shrink-0 pt-0.5">
              <i class="fa fa-check-circle text-green-500 text-xl"></i>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800 dark:text-green-300">部署成功</h3>
              <div class="mt-2 text-sm text-green-700 dark:text-green-400">
                <p>EdgeTunnel 已成功部署到 Cloudflare Workers。</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">项目域名</h3>
            <div class="relative">
              <input type="text" id="project-url" readonly
                class="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="部署后显示项目域名">
              <button type="button" id="copy-url" class="absolute inset-y-0 right-0 flex items-center pr-3 text-primary hover:text-primary/80">
                <i class="fa fa-copy"></i>
              </button>
            </div>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">完整访问链接</h3>
            <div class="relative">
              <input type="text" id="full-url" readonly
                class="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="部署后显示完整链接">
              <button type="button" id="copy-full-url" class="absolute inset-y-0 right-0 flex items-center pr-3 text-primary hover:text-primary/80">
                <i class="fa fa-copy"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">部署信息</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">项目名称</td>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-200" id="deployed-project-name">-</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">UUID</td>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-200" id="deployed-uuid">-</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">部署时间</td>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-200" id="deploy-time">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div id="result-error" class="hidden">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
          <div class="flex items-start">
            <div class="flex-shrink-0 pt-0.5">
              <i class="fa fa-exclamation-circle text-red-500 text-xl"></i>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-300">部署失败</h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-400">
                <p>EdgeTunnel 部署到 Cloudflare Workers 失败。</p>
                <p id="error-message" class="mt-1 font-medium"></p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">错误详情</h3>
          <pre id="error-details" class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm font-mono text-gray-700 dark:text-gray-300 overflow-x-auto"></pre>
        </div>
      </div>
      
      <div class="mt-8 flex justify-center">
        <button id="deploy-another" class="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors">
          <i class="fa fa-plus-circle mr-2"></i>
          部署新项目
        </button>
      </div>
    </section>
  </main>

  <!-- 页脚 -->
  <footer class="bg-gray-100 dark:bg-dark-card py-6 border-t border-gray-200 dark:border-gray-800">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <div class="flex items-center">
            <i class="fa fa-cloud text-primary text-xl mr-2"></i>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">EdgeTunnel部署工具</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            快速部署 EdgeTunnel 到 Cloudflare Workers
          </p>
        </div>
        
        <div class="flex space-x-4">
          <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
            <i class="fa fa-github text-xl"></i>
          </a>
          <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
            <i class="fa fa-question-circle text-xl"></i>
          </a>
          <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
            <i class="fa fa-envelope text-xl"></i>
          </a>
        </div>
      </div>
      
      <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          © 2025 EdgeTunnel部署工具 | 由 <a href="#" class="text-primary hover:underline">CloudTools</a> 提供支持
        </p>
      </div>
    </div>
  </footer>

  <!-- 通知组件 -->
  <div id="notification" class="fixed bottom-4 right-4 bg-white dark:bg-dark-card shadow-lg rounded-lg p-4 transform translate-y-20 opacity-0 transition-all duration-300 z-50 max-w-sm">
    <div class="flex items-start">
      <div class="flex-shrink-0" id="notification-icon-container">
        <i class="fa fa-check-circle text-green-500 text-xl" id="notification-icon"></i>
      </div>
      <div class="ml-3 flex-1">
        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100" id="notification-title">通知标题</h3>
        <div class="mt-1 text-sm text-gray-600 dark:text-gray-400" id="notification-message">
          通知内容将显示在这里...
        </div>
      </div>
      <button type="button" id="close-notification" class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        <i class="fa fa-times"></i>
      </button>
    </div>
  </div>

  <script>
    // DOM 元素
    const themeToggle = document.getElementById('theme-toggle');
    const navbar = document.getElementById('navbar');
    const advancedToggle = document.getElementById('toggle-advanced');
    const advancedFields = document.getElementById('advanced-fields');
    const deployForm = document.getElementById('deploy-form');
    const resultSection = document.getElementById('result-section');
    const loadingIndicator = document.getElementById('loading-indicator');
    const resultSuccess = document.getElementById('result-success');
    const resultError = document.getElementById('result-error');
    const deployBtn = document.getElementById('deploy-btn');
    const deployAnother = document.getElementById('deploy-another');
    const randomProjectNameBtn = document.getElementById('random-project-name');
    const randomUuidBtn = document.getElementById('random-uuid');
    const proxyIpInput = document.getElementById('proxy-ip');
    const socks5Input = document.getElementById('socks5');
    const copyUrlBtn = document.getElementById('copy-url');
    const copyFullUrlBtn = document.getElementById('copy-full-url');
    const showTokenBtn = document.getElementById('show-token');
    const notification = document.getElementById('notification');
    const closeNotificationBtn = document.getElementById('close-notification');
    const projectUrlInput = document.getElementById('project-url');
    const fullUrlInput = document.getElementById('full-url');
    
    // 初始化
    document.addEventListener('DOMContentLoaded', () => {
      // 亮色模式作为默认
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeToggle.querySelector('i').classList.remove('fa-moon-o');
        themeToggle.querySelector('i').classList.add('fa-sun-o', 'text-yellow-400');
      } else {
        document.documentElement.classList.remove('dark');
        themeToggle.querySelector('i').classList.remove('fa-sun-o', 'text-yellow-400');
        themeToggle.querySelector('i').classList.add('fa-moon-o');
      }
      
      // 导航栏滚动效果
      window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
          navbar.classList.add('shadow-md');
        } else {
          navbar.classList.remove('shadow-md');
        }
      });
      
      // 随机生成项目名称
      randomProjectNameBtn.addEventListener('click', generateRandomProjectName);
      
      // 随机生成 UUID
      randomUuidBtn.addEventListener('click', generateRandomUuid);
      
      // 高级设置切换
      advancedToggle.addEventListener('click', toggle
