#!/bin/bash

# 生辰八字排盘系统 - React 19 迁移版快速启动脚本

echo "🎉 生辰八字排盘系统 - React 19 迁移版"
echo "======================================"
echo ""

# 检查 Node.js 版本
echo "✅ 检查 Node.js 版本..."
node --version
npm --version

# 清除旧依赖（可选）
# rm -rf node_modules package-lock.json

echo ""
echo "📦 安装依赖中... (这可能需要 1-2 分钟)"
npm install

echo ""
echo "🚀 启动开发服务器... (Vite 开发模式)"
echo "📍 访问: http://localhost:5173"
echo ""
echo "💡 按 Ctrl+C 停止服务器"
echo ""

npm run dev
