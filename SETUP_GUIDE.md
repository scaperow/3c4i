# Next.js + SSO + Cloudflare Workers 项目搭建完成

## ✅ 已完成的配置

### 1. Next.js 14 框架
- ✅ App Router 结构
- ✅ TypeScript 支持
- ✅ Tailwind CSS + Mantine UI
- ✅ 服务器已运行在 http://localhost:3000

### 2. NextAuth.js SSO 认证
- ✅ Auth0 提供商集成
- ✅ 自定义登录页面: `/auth/signin`
- ✅ 错误处理页面: `/auth/error`
- ✅ Session 管理和 JWT 配置

### 3. 三个应用页面
- ✅ `/bazi` - 大罗洞观（红色主题）
- ✅ `/mbti` - MBTI 性格测试（紫色主题）
- ✅ `/ainame` - 好名字 AI起名（橙色主题）
- ✅ `/launcher` - 应用启动器

### 4. Cloudflare Workers 部署配置
- ✅ `wrangler.toml` 配置文件
- ✅ 部署脚本命令

## 🔧 环境变量配置

请在项目根目录创建 `.env.local` 文件（已有 `.env.example` 模板）：

```bash
# NextAuth.js 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=你的密钥（运行 openssl rand -base64 32 生成）

# Auth0 配置（需要去 Auth0 官网注册并获取）
AUTH0_CLIENT_ID=你的Auth0客户端ID
AUTH0_CLIENT_SECRET=你的Auth0客户端密钥
AUTH0_ISSUER=https://你的域名.auth0.com

# Cloudflare Workers（部署时需要）
CF_API_TOKEN=你的Cloudflare API令牌
CF_ACCOUNT_ID=你的Cloudflare账户ID
```

## 🚀 使用步骤

### 1. 启动开发服务器
```bash
yarn dev
# 或
npm run dev
```

访问: http://localhost:3000

### 2. 配置 Auth0（可选，用于SSO登录）

1. 访问 [Auth0官网](https://auth0.com) 注册账号
2. 创建新应用（Application）
3. 在应用设置中：
   - 复制 `Client ID` 和 `Client Secret`
   - 设置 `Allowed Callback URLs`: `http://localhost:3000/api/auth/callback/auth0`
   - 设置 `Allowed Logout URLs`: `http://localhost:3000`
4. 将配置填入 `.env.local`

### 3. 部署到 Cloudflare Workers

```bash
# 登录 Cloudflare
yarn wrangler login

# 部署项目
yarn deploy

# 或开发模式
yarn cf-dev
```

## 📁 项目结构

```
aibazi/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 根布局（Mantine + Session）
│   ├── page.tsx             # 首页（重定向到 launcher）
│   ├── launcher/            # 应用启动器
│   ├── bazi/                # 大罗洞观
│   ├── mbti/                # MBTI测试
│   ├── ainame/              # AI起名
│   ├── auth/                # 认证页面
│   │   ├── signin/          # 登录页
│   │   └── error/           # 错误页
│   └── api/
│       └── auth/[...nextauth]/ # NextAuth API路由
├── auth.ts                  # NextAuth 配置
├── next.config.js           # Next.js 配置
├── wrangler.toml           # Cloudflare Workers 配置
├── .env.example            # 环境变量模板
└── package.json            # 依赖和脚本

src/                         # 原有的Vite项目（保留）
```

## 🎨 三个应用主题色

| 应用 | 路由 | 主色调 | 渐变背景 |
|------|------|--------|----------|
| 大罗洞观 | `/bazi` | 🔴 红色 | `from-slate-900 via-red-950 to-slate-900` |
| MBTI测试 | `/mbti` | 🟣 紫色 | `from-slate-900 via-purple-950 to-slate-900` |
| 好名字 | `/ainame` | 🟠 橙色 | `from-slate-900 via-orange-950 to-slate-900` |

## 🔐 SSO 登录流程

1. 用户访问需要认证的页面
2. 自动重定向到 `/auth/signin`
3. 选择 Auth0 登录
4. Auth0 处理认证（支持Google、GitHub等）
5. 回调到应用，建立 Session
6. 访问受保护的资源

## 📦 NPM 脚本

```bash
yarn dev          # 启动开发服务器
yarn build        # 构建生产版本
yarn start        # 启动生产服务器
yarn lint         # 代码检查
yarn type-check   # TypeScript类型检查
yarn deploy       # 部署到 Cloudflare
yarn cf-dev       # Cloudflare 本地开发
```

## 🌐 Cloudflare Pages 部署

如果想用 Cloudflare Pages 而非 Workers：

1. 在 Cloudflare Dashboard 创建 Pages 项目
2. 连接 GitHub 仓库
3. 构建设置：
   - 构建命令: `npm run build`
   - 输出目录: `.next`
   - Node 版本: `18` 或 `20`
4. 添加环境变量（同 `.env.local`）
5. 部署

## ⚙️ 中间件保护

`middleware.ts` 已配置，所有路由默认公开访问。

如需保护特定路由，修改：

```typescript
export const config = {
  matcher: [
    '/bazi/:path*',    // 保护大罗洞观
    '/mbti/:path*',    // 保护MBTI
    '/ainame/:path*',  // 保护AI起名
  ],
}
```

## 🎯 下一步

1. **配置 Auth0** - 获取真实的SSO凭据
2. **完善业务逻辑** - 将 `src/` 下的组件迁移到 Next.js
3. **API 开发** - 创建 `/app/api/` 下的服务端API
4. **数据库集成** - 连接数据库存储用户数据
5. **生产部署** - 部署到 Cloudflare Workers/Pages

## 🆘 常见问题

**Q: 如何生成 NEXTAUTH_SECRET？**
```bash
openssl rand -base64 32
```

**Q: Auth0 免费吗？**
A: 有免费额度，支持 7,000 MAU（月活用户）

**Q: Cloudflare Workers 有什么限制？**
A: 免费版每天 100,000 请求，付费版无限制

**Q: 如何切换其他SSO提供商？**
A: 修改 `auth.ts`，NextAuth 支持 Google、GitHub、Microsoft 等 50+ 提供商

## 📚 参考文档

- [Next.js 文档](https://nextjs.org/docs)
- [NextAuth.js 文档](https://next-auth.js.org)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers)
- [Mantine UI 文档](https://mantine.dev)
- [Auth0 文档](https://auth0.com/docs)

---

**项目已完成基础架构搭建，可以开始开发业务功能！** 🎉
