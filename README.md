以下是包含中英文部署教程的完整README文件，支持点击切换语言版本：

# EdgeTunnel 部署工具

一键部署 EdgeTunnel 到 Cloudflare Workers 的工具，支持亮色/暗色模式切换，提供友好的用户界面和完整的部署流程。

## 目录

- [中文教程](#中文教程)
- [English Tutorial](#english-tutorial)

## 中文教程

### 功能特点

- 亮色模式作为默认主题，用户可随时切换到暗色模式
- 完整的部署表单，包括基础配置和高级设置
- 随机生成项目名称和 UUID
- 部署过程模拟和结果展示
- 通知系统提供操作反馈
- 响应式设计，适配不同屏幕尺寸

### 技术栈

- HTML/CSS/JavaScript
- Tailwind CSS v3
- Font Awesome
- Cloudflare Workers

### 部署教程

#### 1. 注册 Cloudflare 账号

首先，你需要拥有一个 Cloudflare 账号。如果没有，请访问 [Cloudflare 注册页面](https://dash.cloudflare.com/sign-up) 注册。

#### 2. 安装 Wrangler CLI

Wrangler 是 Cloudflare Workers 的官方命令行工具，用于开发、测试和部署 Workers。使用 npm 全局安装：

```bash
npm install -g wrangler
```

安装完成后，验证安装是否成功：

```bash
wrangler --version
```

#### 3. 登录 Cloudflare

使用以下命令登录你的 Cloudflare 账号：

```bash
wrangler login
```

这将打开浏览器并要求你授权 Wrangler 访问你的 Cloudflare 账户。

### 4. 配置项目

#### 4.1 克隆项目

如果你还没有项目代码，请先克隆或下载项目到本地：

```bash
git clone https://github.com/your-repo/edgetunnel-deployer.git
cd edgetunnel-deployer
```

#### 4.2 配置 wrangler.toml

打开项目根目录下的 `wrangler.toml` 文件，配置你的 Cloudflare 账号信息：

```toml
name = "edgetunnel-deployer"
type = "javascript"
account_id = "你的 Cloudflare 账号 ID"
workers_dev = true
route = ""
zone_id = ""

[site]
bucket = "./public"
entry-point = "workers-site"
```

你可以通过以下命令获取你的账号 ID：

```bash
wrangler whoami
```

### 5. 本地开发与测试

#### 5.1 安装依赖

```bash
npm install
```

#### 5.2 本地运行

```bash
wrangler dev
```

这将启动一个本地开发服务器，你可以在浏览器中访问 `http://localhost:8787` 查看应用。

### 6. 部署到 Cloudflare Workers

#### 6.1 部署命令

使用以下命令将项目部署到 Cloudflare Workers：

```bash
wrangler publish
```

#### 6.2 部署成功

部署成功后，你将看到类似以下输出：

```
✨  Successfully published your script to
https://edgetunnel-deployer.your-account.workers.dev
```

访问该 URL 即可查看你的应用。

### 7. 自定义域名（可选）

如果你想使用自定义域名而不是 Workers 提供的默认域名，可以按照以下步骤配置：

1. 在 Cloudflare 控制台中添加你的域名
2. 配置 DNS 记录
3. 在 `wrangler.toml` 中设置自定义路由
4. 部署并验证

### 8. 故障排除

如果你在部署过程中遇到问题，可以参考以下常见问题：

1. **认证问题**：确保 `wrangler login` 命令已成功执行
2. **权限问题**：确保你的 API Token 具有足够的权限
3. **依赖问题**：确保所有依赖已正确安装
4. **代码问题**：检查控制台输出的错误信息

如果问题仍然存在，请查看 [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/) 或在社区寻求帮助。


## English Tutorial

### Features

- Light mode as default theme, users can switch to dark mode at any time
- Complete deployment form with basic and advanced settings
- Randomly generate project name and UUID
- Deployment process simulation and result display
- Notification system for operation feedback
- Responsive design for different screen sizes

### Tech Stack

- HTML/CSS/JavaScript
- Tailwind CSS v3
- Font Awesome
- Cloudflare Workers

### Deployment Tutorial

#### 1. Register a Cloudflare Account

First, you need to have a Cloudflare account. If not, please visit [Cloudflare Sign Up](https://dash.cloudflare.com/sign-up) to register.

#### 2. Install Wrangler CLI

Wrangler is the official command-line tool for Cloudflare Workers, used for developing, testing, and deploying Workers. Install globally using npm:

```bash
npm install -g wrangler
```

After installation, verify the installation:

```bash
wrangler --version
```

#### 3. Log in to Cloudflare

Log in to your Cloudflare account using:

```bash
wrangler login
```

This will open a browser and ask you to authorize Wrangler to access your Cloudflare account.

### 4. Configure the Project

#### 4.1 Clone the Project

If you don't have the project code yet, clone or download the project:

```bash
git clone https://github.com/your-repo/edgetunnel-deployer.git
cd edgetunnel-deployer
```

#### 4.2 Configure wrangler.toml

Open the `wrangler.toml` file in the project root directory and configure your Cloudflare account information:

```toml
name = "edgetunnel-deployer"
type = "javascript"
account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"
workers_dev = true
route = ""
zone_id = ""

[site]
bucket = "./public"
entry-point = "workers-site"
```

You can get your account ID using:

```bash
wrangler whoami
```

### 5. Local Development and Testing

#### 5.1 Install Dependencies

```bash
npm install
```

#### 5.2 Run Locally

```bash
wrangler dev
```

This will start a local development server. Visit `http://localhost:8787` in your browser to view the app.

### 6. Deploy to Cloudflare Workers

#### 6.1 Deployment Command

Deploy the project to Cloudflare Workers using:

```bash
wrangler publish
```

#### 6.2 Deployment Successful

After successful deployment, you will see output similar to:

```
✨  Successfully published your script to
https://edgetunnel-deployer.your-account.workers.dev
```

Visit this URL to view your application.

### 7. Custom Domain (Optional)

If you want to use a custom domain instead of the default Workers domain, follow these steps:

1. Add your domain in the Cloudflare dashboard
2. Configure DNS records
3. Set up custom routes in `wrangler.toml`
4. Deploy and verify

### 8. Troubleshooting

If you encounter issues during deployment, refer to these common problems:

1. **Authentication Issues**: Ensure `wrangler login` was executed successfully
2. **Permission Issues**: Ensure your API Token has sufficient permissions
3. **Dependency Issues**: Ensure all dependencies are installed correctly
4. **Code Issues**: Check console error messages

If the issue persists, consult the [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/) or seek help in the community.


## Usage

1. Open the deployment tool page
2. Enter your Cloudflare account ID and API Token
3. (Optional) Expand advanced settings to configure project name, UUID, etc.
4. Click the "Start Deployment" button
5. Wait for deployment to complete and view results
6. Copy the generated URL and share with others


## Contribution

If you want to contribute to this project, please follow these steps:

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
