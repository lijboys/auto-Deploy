// Pages 部署接口处理函数
export async function onRequest(context) {
  const { request } = context;
  const { accountId, apiToken, projectName, scriptContent } = await request.json();
  const CF_API_BASE = 'https://api.cloudflare.com/client/v4';
  
  try {
    // 验证参数
    if (!accountId || !apiToken || !projectName) {
      return new Response(JSON.stringify({
        success: false,
        error: '账号 ID、API Token 和项目名称不能为空'
      }), { status: 400 });
    }
    
    // 调用 Cloudflare API 创建 Workers 脚本（Pages 部署实际仍通过 Workers API 实现）
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
    const pagesUrl = `${projectName}.pages.dev`;
    
    return new Response(JSON.stringify({
      success: true,
      message: '部署成功',
      data: {
        projectName,
        url: `https://${pagesUrl}`,
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
