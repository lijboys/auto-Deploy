# EdgeTunnel 部署工具
                                                   
<div style="text-align: center;">
中文  English
</div>

一键部署 EdgeTunnel 到 Cloudflare Workers 的工具，支持亮色/暗色模式切换，提供友好的用户界面和完整的部署流程。

## 功能特点

- 亮色模式作为默认主题，用户可随时切换到暗色模式
- 完整的部署表单，包括基础配置和高级设置
- 随机生成项目名称和 UUID
- 部署过程模拟和结果展示
- 通知系统提供操作反馈
- 响应式设计，适配不同屏幕尺寸

## 技术栈

- HTML/CSS/JavaScript
- Tailwind CSS v3
- Font Awesome
- Cloudflare Workers

## 部署教程

### 1. 注册 Cloudflare 账号

首先，你需要拥有一个 Cloudflare 账号。如果没有，请访问 [Cloudflare 注册页面](https://dash.cloudflare.com/sign-up) 注册。

### 2. 安装 Wrangler CLI

Wrangler 是 Cloudflare Workers 的官方命令行工具，用于开发、测试和部署 Workers。使用 npm 全局安装：

```bash
npm install -g wrangler
```

安装完成后，验证安装是否成功：

```bash
wrangler --version
```

### 3. 登录 Cloudflare

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

## 使用方法

1. 打开部署工具页面
2. 输入你的 Cloudflare 账号 ID 和 API Token
3. （可选）展开高级设置，配置项目名称、UUID 等参数
4. 点击"开始部署"按钮
5. 等待部署完成，查看部署结果
6. 复制生成的 URL 并分享给他人使用

## 贡献

如果你想为这个项目做出贡献，请遵循以下步骤：

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/your-feature`)
3. 提交你的更改 (`git commit -m 'Add some feature'`)
4. 将你的更改推送到分支 (`git push origin feature/your-feature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证。有关详细信息，请参阅 [LICENSE](LICENSE) 文件。
