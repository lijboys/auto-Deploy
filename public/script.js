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
const deployedProjectName = document.getElementById('deployed-project-name');
const deployedUuid = document.getElementById('deployed-uuid');
const deployTime = document.getElementById('deploy-time');
const errorMessage = document.getElementById('error-message');
const errorDetails = document.getElementById('error-details');

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
    localStorage.theme = 'dark';
  } else {
    icon.classList.remove('fa-sun-o', 'text-yellow-400');
    icon.classList.add('fa-moon-o');
    localStorage.theme = 'light';
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
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  document.getElementById('uuid').value = uuid;
  showNotification('成功', '已生成随机 UUID', 'success');
}

// 处理部署
function handleDeploy(e) {
  e.preventDefault();
  
  // 显示结果区域
  resultSection.classList.remove('hidden');
  resultSuccess.classList.add('hidden');
  resultError.classList.add('hidden');
  loadingIndicator.classList.remove('hidden');
  
  // 滚动到结果区域
  resultSection.scrollIntoView({ behavior: 'smooth' });
  
  // 获取表单数据
  const formData = new FormData(deployForm);
  const formValues = Object.fromEntries(formData.entries());
  
  // 验证必填字段
  if (!formValues['account-id'] || !formValues['api-token']) {
    showNotification('错误', '请填写 Cloudflare 账号 ID 和 API Token', 'error');
    loadingIndicator.classList.add('hidden');
    resultError.classList.remove('hidden');
    errorMessage.textContent = '缺少必要信息';
    errorDetails.textContent = '请填写 Cloudflare 账号 ID 和 API Token';
    return;
  }
  
  // 处理项目名称
  let projectName = formValues['project-name'];
  if (!projectName || projectName.trim() === '') {
    generateRandomProjectName();
    projectName = document.getElementById('project-name').value;
  }
  
  // 处理 UUID
  let uuid = formValues['uuid'];
  if (!uuid || uuid.trim() === '') {
    uuid = 'default-uuid-value'; // 默认 UUID
  }
  
  // 处理自定义域名
  let customDomain = formValues['custom-domain'];
  let projectUrl = customDomain ? `${customDomain}.workers.dev` : `${projectName}.workers.dev`;
  let fullUrl = `https://${projectUrl}/sub`;
  
  // 模拟部署过程
  setTimeout(() => {
    // 随机决定部署是否成功（实际应用中这里应该是真实的API调用）
    const isSuccess = Math.random() > 0.2; // 80% 的成功率
    
    if (isSuccess) {
      // 部署成功
      loadingIndicator.classList.add('hidden');
      resultSuccess.classList.remove('hidden');
      
      // 填充部署信息
      projectUrlInput.value = projectUrl;
      fullUrlInput.value = fullUrl;
      deployedProjectName.textContent = projectName;
      deployedUuid.textContent = uuid;
      deployTime.textContent = new Date().toLocaleString();
      
      showNotification('成功', 'EdgeTunnel 已成功部署到 Cloudflare Workers', 'success');
    } else {
      // 部署失败
      loadingIndicator.classList.add('hidden');
      resultError.classList.remove('hidden');
      
      // 随机错误信息
      const errors = [
        { message: '认证失败', details: 'Cloudflare API Token 无效或权限不足' },
        { message: '项目名称已存在', details: '请选择其他项目名称' },
        { message: '部署超时', details: '部署过程耗时过长，请稍后重试' },
        { message: '服务器错误', details: 'Cloudflare 服务器暂时不可用' }
      ];
      const randomError = errors[Math.floor(Math.random() * errors.length)];
      
      errorMessage.textContent = randomError.message;
      errorDetails.textContent = randomError.details;
      
      showNotification('错误', `部署失败: ${randomError.message}`, 'error');
    }
  }, 3000); // 模拟3秒的部署时间
}

// 复制到剪贴板
function copyToClipboard(element, message) {
  element.select();
  document.execCommand('copy');
  showNotification('成功', message, 'success');
}

// 显示/隐藏密码
function togglePasswordVisibility() {
  const passwordInput = document.getElementById('api-token');
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  showTokenBtn.textContent = type === 'password' ? '显示密码' : '隐藏密码';
}

// 显示通知
function showNotification(title, message, type = 'info') {
  const notificationTitle = document.getElementById('notification-title');
  const notificationMessage = document.getElementById('notification-message');
  const notificationIcon = document.getElementById('notification-icon');
  const notificationIconContainer = document.getElementById('notification-icon-container');
  
  // 设置通知内容
  notificationTitle.textContent = title;
  notificationMessage.textContent = message;
  
  // 设置通知图标和颜色
  notificationIcon.className = 'text-xl';
  notificationIconContainer.className = 'flex-shrink-0 pt-0.5';
  
  if (type === 'success') {
    notificationIcon.classList.add('fa-check-circle', 'text-green-500');
  } else if (type === 'error') {
    notificationIcon.classList.add('fa-exclamation-circle', 'text-red-500');
  } else if (type === 'warning') {
    notificationIcon.classList.add('fa-exclamation-triangle', 'text-yellow-500');
  } else {
    notificationIcon.classList.add('fa-info-circle', 'text-blue-500');
  }
  
  // 显示通知
  notification.classList.remove('translate-y-20', 'opacity-0');
  
  // 3秒后自动关闭
  setTimeout(hideNotification, 3000);
}

// 隐藏通知
function hideNotification() {
  notification.classList.add('translate-y-20', 'opacity-0');
}
    
