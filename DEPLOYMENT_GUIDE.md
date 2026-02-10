# Cloudflare Workers 部署指南

## 项目概述
这是一个基于 Next.js 的智能命理门户应用，现已配置为支持 Cloudflare Workers 部署。

## 部署前准备

### 1. 环境要求
- Node.js 18.17.0+
- npm 或 yarn
- Cloudflare 账户

### 2. 安装依赖
```bash
npm install
```

### 3. 构建项目
```bash
npm run build
```

## 部署选项

### 选项 1: Cloudflare Workers (当前配置)

1. **安装 Wrangler CLI**
```bash
npm install -g wrangler
```

2. **登录 Cloudflare**
```bash
wrangler login
```

3. **配置项目**
编辑 `wrangler.toml` 文件：
```toml
name = "your-project-name"
main = "_worker.js"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]
```

4. **部署**
```bash
wrangler deploy
```

### 选项 2: Cloudflare Pages (推荐)

1. **连接 GitHub/GitLab 仓库**
   - 登录 Cloudflare Dashboard
   - 进入 Pages 页面
   - 点击 "Connect to Git"

2. **构建配置**
   - 构建命令: `npm run build`
   - 输出目录: `.next`
   - 环境变量:
     ```
     NODE_VERSION: 18.17.0
     NEXTAUTH_URL: https://your-domain.pages.dev
     NEXTAUTH_SECRET: your-secret-key
     ```

3. **自动部署**
   - 每次推送到主分支都会自动部署

### 选项 3: 本地测试 Workers

1. **本地开发**
```bash
npm run dev
```

2. **Workers 模拟**
```bash
wrangler dev
```

## 环境变量配置

### 必需变量
```env
NEXTAUTH_URL=https://your-domain.workers.dev
NEXTAUTH_SECRET=your-secret-key
```

### 可选变量
```env
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_ISSUER=https://your-domain.auth0.com
```

## 功能限制

在 Cloudflare Workers 上部署时，以下功能可能受限：
- 文件系统访问
- 某些 Node.js 模块
- 长时间运行的进程
- 大文件上传

## 性能优化

### 1. 启用缓存
```toml
[env.production]
cache_ttl = 3600
```

### 2. 使用 KV 存储
```toml
[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"
```

### 3. 启用 D1 数据库
```toml
[[d1_databases]]
binding = "DB"
database_name = "your-database"
database_id = "your-database-id"
```

## 监控和调试

### 1. 查看日志
```bash
wrangler tail
```

### 2. 性能分析
- Cloudflare Dashboard → Workers & Pages → 你的项目 → Analytics

### 3. 错误追踪
- 查看 Workers 日志
- 使用 Sentry 等错误监控服务

## 常见问题

### 1. 构建失败
- 检查 Node.js 版本
- 确保所有依赖安装正确
- 检查 TypeScript 错误

### 2. 部署失败
- 检查 wrangler.toml 配置
- 验证环境变量
- 查看 Cloudflare 状态页面

### 3. 性能问题
- 启用缓存
- 优化图片大小
- 使用 CDN

## 更新和维护

### 1. 更新依赖
```bash
npm update
```

### 2. 重新部署
```bash
npm run build
wrangler deploy
```

### 3. 回滚
在 Cloudflare Dashboard 中可以查看部署历史并回滚到之前的版本。

## 支持

如有问题，请检查：
- Cloudflare 文档: https://developers.cloudflare.com/
- Next.js 文档: https://nextjs.org/docs/
- 项目 GitHub Issues