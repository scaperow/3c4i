#!/bin/bash

# Cloudflare Workers 部署脚本

echo "🚀 开始部署到 Cloudflare Workers..."

# 1. 构建项目
echo "📦 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 2. 检查 wrangler 是否已安装
if ! command -v wrangler &> /dev/null; then
    echo "📥 安装 Wrangler CLI..."
    npm install -g wrangler
fi

# 3. 登录 Cloudflare（如果需要）
echo "🔐 检查 Cloudflare 登录状态..."
wrangler whoami > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "请登录 Cloudflare:"
    wrangler login
fi

# 4. 部署
echo "☁️ 部署到 Cloudflare Workers..."
wrangler deploy

if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    echo "🌐 访问你的应用: https://aibazi-nextjs.your-subdomain.workers.dev"
else
    echo "❌ 部署失败"
    exit 1
fi