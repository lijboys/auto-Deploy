// public/script.js
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
  document.documentElement.classList.remove('dark');
  
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
  advancedToggle.addEventListener('click', toggleAdvancedSettings);
  
  // 代理设置互斥
  proxyIpInput.addEventListener('input', () => {
    if (proxyIpInput.value.trim() !== '') {
      socks5Input.value = '';
    }
  });
  
  socks5Input.addEventListener('input', () => {
    if (socks5Input.value.trim() !== '') {
      proxyIpInput.value = '';
    }
  });
  
  // 表单提交
  deployForm.addEventListener('submit', handleDeploy);
  
  // 部署另一个
  deployAnother.addEventListener('click', () => {
    resultSection.classList.add('hidden');
    deployForm.reset();
    document.getElementById('project-name').value = 'cloud-';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // 复制 URL
  copyUrlBtn.addEventListener('click', () => copyToClipboard(projectUrlInput, '项目域名已复制'));
  copyFullUrlBtn.addEventListener('click', () => copyToClipboard(fullUrlInput, '完整链接已复制'));
  
  // 显示/隐藏密码
  showTokenBtn.addEventListener('click', togglePasswordVisibility);
  
  // 关闭通知
  closeNotificationBtn.addEventListener('click', hideNotification);
  
  // 主题切换
  themeToggle.addEventListener('click', toggleDarkMode);
});

// 切换暗色模式
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  
  // 更新主题图标
  const icon = themeToggle.querySelector('i');
  if (document.documentElement.classList.contains('dark')) {
    icon.classList.remove('fa-moon-o');
    icon.classList.add('fa-sun-o', 'text-yellow-400');
  } else {
    icon.classList.remove('fa-sun-o', 'text-yellow-400');
    icon.classList.add('fa-moon-o');
  }
}

// 高级设置切换
function toggleAdvancedSettings() {
  if (advancedFields.classList.contains('hidden')) {
    advancedFields.classList.remove('hidden');
    advancedToggle.innerHTML = '<i class="fa fa-chevron-up mr-1"></i> 收起';
  } else {
    advancedFields.classList.add('hidden');
    advancedToggle.innerHTML = '<i class="fa fa-chevron-down mr-1"></i> 展开';
  }
}

// 生成随机项目名称
function generateRandomProjectName() {
  const date = new Date();
  const random = Math.floor(10000 + Math.random() * 90000);
  const projectName = `cloud-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${random}`;
  document.getElementById('project-name').value = projectName;
  showNotification('成功', '已生成随机项目名称', 'success');
}

// 生成随机 UUID
function generateRandomUuid() {
  // 使用浏览器内置的 crypto API 生成 UUID
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  
  // 格式化 UUID
  array[6] = (array[6] & 0x0f) | 0x40; // version 4
  array[8] = (array[8] & 0x3f) | 0x80; // variant 10
  
  const uuid = Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
  const formattedUuid = `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20)}`;
  
  document.getElementById('uuid').value = formattedUuid;
  showNotification('成功', '已生成随机 UUID', 'success');
}

// 处理部署
function handleDeploy(e) {
  e.preventDefault();
  
  // 显示结果区域和加载中
  resultSection.classList.remove('hidden');
  resultSuccess.classList.add('hidden');
  resultError.classList.add('hidden');
  loadingIndicator.classList.remove('hidden');
  
  // 滚动到结果区域
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  // 模拟部署过程
  setTimeout(() => {
    try {
      // 获取表单数据
      const formData = new FormData(deployForm);
      const accountId = formData.get('account-id');
      const apiToken = formData.get('api-token');
      const projectName = formData.get('project-name') || 'edgetunnel-' + Math.floor(Math.random() * 10000);
      const uuid = formData.get('uuid') || generateRandomUuid();
      const proxyIp = formData.get('proxy-ip');
      const socks5 = formData.get('socks5');
      const add = formData.get('add');
      const addApi = formData.get('add-api');
      const subName = formData.get('sub-name');
      const customDomain = formData.get('custom-domain') || projectName;
      
      // 验证表单
      if (!accountId || !apiToken) {
        throw new Error('Cloudflare 账号 ID 和 API Token 是必需的');
      }
      
      // 这里只是模拟部署，实际应该发送请求到后端API
      // 模拟成功部署
      const projectUrl = `https://${customDomain}.workers.dev`;
      const fullUrl = `${projectUrl}/${uuid}`;
      
      // 更新结果
      document.getElementById('project-url').value = projectUrl;
      document.getElementById('full-url').value = fullUrl;
      document.getElementById('deployed-project-name').textContent = projectName;
      document.getElementById('deployed-uuid').textContent = uuid;
      document.getElementById('deploy-time').textContent = new Date().toLocaleString();
      
      // 隐藏加载中，显示成功
      loadingIndicator.classList.add('hidden');
      resultSuccess.classList.remove('hidden');
      
      showNotification('部署成功', 'EdgeTunnel 已成功部署到 Cloudflare Workers', 'success');
    } catch (error) {
      // 隐藏加载中，显示错误
      loadingIndicator.classList.add('hidden');
      resultError.classList.remove('hidden');
      
      // 更新错误信息
      document.getElementById('error-message').textContent = error.message || '部署过程中发生错误';
      document.getElementById('error-details').textContent = error.stack || '没有详细错误信息';
      
      showNotification('部署失败', error.message || '部署过程中发生错误', 'error');
    }
  }, 3000); // 模拟3秒部署时间
}

// 复制到剪贴板
function copyToClipboard(element, message) {
  element.select();
  document.execCommand('copy');
  showNotification('复制成功', message, 'success');
}

// 切换密码可见性
function togglePasswordVisibility() {
  const passwordInput = document.getElementById('api-token');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    showTokenBtn.textContent = '隐藏密码';
  } else {
    passwordInput.type = 'password';
    showTokenBtn.textContent = '显示密码';
  }
}

// 显示通知
function showNotification(title, message, type = 'info') {
  const notificationTitle = document.getElementById('notification-title');
  const notificationMessage = document.getElementById('notification-message');
  const notificationIcon = document.getElementById('notification-icon');
  
  notificationTitle.textContent = title;
  notificationMessage.textContent = message;
  
  // 设置图标和颜色
  if (type === 'success') {
    notificationIcon.className = 'fa fa-check-circle text-green-500 text-xl';
  } else if (type === 'error') {
    notificationIcon.className = 'fa fa-exclamation-circle text-red-500 text-xl';
  } else if (type === 'warning') {
    notificationIcon.className = 'fa fa-exclamation-triangle text-yellow-500 text-xl';
  } else {
    notificationIcon.className = 'fa fa-info-circle text-blue-500 text-xl';
  }
  
  // 显示通知
  notification.classList.remove('translate-y-20', 'opacity-0');
  
  // 3秒后自动隐藏
  setTimeout(hideNotification, 3000);
}

// 隐藏通知
function hideNotification() {
  notification.classList.add('translate-y-20', 'opacity-0');
}
