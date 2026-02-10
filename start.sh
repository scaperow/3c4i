#!/bin/bash

# 易卜科技 Next.js 项目启动脚本

echo "🚀 易卜科技 - Next.js + SSO + Cloudflare Workers"
echo "================================================"
echo ""

# 检查 Node.js 版本
echo "📦 检查 Node.js 版本..."
node_version=$(node -v)
echo "   Node.js: $node_version"
echo ""

# 检查环境变量文件
if [ ! -f .env.local ]; then
    echo "⚠️  未找到 .env.local 文件"
    echo "   从 .env.example 复制模板..."
    cp .env.example .env.local
    echo "   ✅ 已创建 .env.local"
    echo "   ⚠️  请编辑 .env.local 填写真实配置"
    echo ""
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📥 安装依赖..."
    yarn install
    echo ""
fi

# 启动开发服务器
echo "🎯 启动服务..."
echo ""
echo "📱 三个应用："
echo "   🔴 大罗洞观:  http://localhost:3000/bazi"
echo "   🟣 MBTI测试:  http://localhost:3000/mbti"
echo "   🟠 好名字:    http://localhost:3000/ainame"
echo ""
echo "🚀 应用启动器: http://localhost:3000/launcher"
echo "🔐 登录页面:   http://localhost:3000/auth/signin"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "================================================"
echo ""

yarn dev
