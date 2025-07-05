在Cloudflare上部署此工具的方法
步骤1：创建新的Cloudflare Worker
登录您的Cloudflare账户

在左侧导航栏中选择"Workers & Pages"

点击"创建应用程序"按钮

选择"创建Worker"

步骤2：配置Worker
在Worker编辑器中，将上面的完整HTML代码复制粘贴到代码区域

修改以下配置（如果需要）：

预设域名列表

默认背景图片

部署流程的细节

点击"保存并部署"按钮

步骤3：设置自定义域名（可选）
在Worker设置中，选择"触发器"标签

在"自定义域名"部分，添加您自己的域名

按照提示配置DNS记录

步骤4：访问部署工具
部署完成后，您可以通过以下方式访问工具：

Cloudflare提供的默认workers.dev子域名

您配置的自定义域名

工具使用说明
输入Cloudflare凭证：

账户ID：您的Cloudflare账户ID

API Token：具有Workers编辑权限的API Token

配置高级选项：

项目名称：自定义Worker名称（带随机生成功能）

UUID：用于连接的身份验证（带随机生成功能）

自定义域名：从列表中选择或使用默认

背景图片URL：自定义部署后页面的背景

代理设置：选择PROXYIP或SOCKS5

其他配置：ADD、ADDAPI和订阅器名称

部署过程：

点击"一键部署到Cloudflare Worker"

查看实时部署状态

部署完成后获取访问链接

结果使用：

访问链接格式为：域名/UUID

该链接可用于配置代理客户端

这个工具提供了完整的Edgetunnel部署体验，让用户无需命令行操作即可在Cloudflare上部署定制化的Edgetunnel服务。
