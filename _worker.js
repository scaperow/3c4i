import { handleRequest } from '@cloudflare/next-on-pages'

export default {
  async fetch(request, env, ctx) {
    try {
      // Handle static assets
      const url = new URL(request.url)
      
      // Serve static files from public directory
      if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/static/')) {
        return fetch(request)
      }
      
      // Handle API routes
      if (url.pathname.startsWith('/api/')) {
        // For now, return a simple response for API routes
        return new Response(JSON.stringify({ message: 'API not implemented in Workers' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      // Handle main application
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>3C4I Portal - 智能命理门户</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #050505;
              color: #fff;
              margin: 0;
              padding: 40px;
              text-align: center;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 40px;
              border: 1px solid #222;
              border-radius: 8px;
              background: #111;
            }
            h1 { color: #EB4432; }
            .links { margin-top: 30px; }
            .links a {
              display: inline-block;
              margin: 10px;
              padding: 12px 24px;
              background: #EB4432;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-weight: 500;
            }
            .links a:hover { background: #D43D2D; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>3C4I Portal</h1>
            <p>智能命理门户 - 融合东方智慧与现代科技</p>
            <div class="links">
              <a href="/bazi">智能八字</a>
              <a href="/mbti">MBTI测试</a>
              <a href="/ainame">AI起名</a>
            </div>
            <p style="margin-top: 30px; color: #888; font-size: 14px;">
              部署在 Cloudflare Workers 上<br>
              完整功能请使用本地开发环境
            </p>
          </div>
        </body>
        </html>
      `, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      })
    } catch (error) {
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}