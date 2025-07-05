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
