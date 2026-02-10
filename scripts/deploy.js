#!/usr/bin/env node
/**
 * 部署脚本 - 自动处理版本号、Git Tag 和 Cloudflare 部署
 * 用法: node scripts/deploy.js [message]
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取最新的 tag
function getLatestTag() {
  try {
    return execSync('git describe --tags --abbrev=0', { 
      encoding: 'utf8',
      cwd: process.cwd()
    }).trim();
  } catch (e) {
    return 'v0.0.0';
  }
}

// 生成下一个版本号（基于语义化版本）
function bumpVersion(latestTag) {
  const match = latestTag.match(/v?(\d+)\.(\d+)\.(\d+)/);
  if (!match) return 'v1.0.0';
  
  const [, major, minor, patch] = match;
  // 简单策略：patch + 1
  return `v${major}.${minor}.${parseInt(patch) + 1}`;
}

// 主部署流程
async function deploy() {
  const deployMessage = process.argv[2] || 'Deploy to Cloudflare';
  
  console.log('🚀 开始部署流程...\n');
  
  // 1. 检查是否有未提交的更改
  console.log('📋 检查 Git 状态...');
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    if (status) {
      console.log('⚠️  检测到未提交的更改，自动提交...');
      execSync('git add -A', { stdio: 'inherit' });
      execSync(`git commit -m "${deployMessage}"`, { stdio: 'inherit' });
      console.log('✅ 代码已提交\n');
    } else {
      console.log('✅ 没有未提交的更改\n');
    }
  } catch (e) {
    console.error('❌ Git 操作失败:', e.message);
    process.exit(1);
  }
  
  // 2. 生成版本号
  console.log('🏷️  生成版本号...');
  const latestTag = getLatestTag();
  const version = bumpVersion(latestTag);
  const fullVersion = `${version}+${new Date().toISOString().slice(0, 10)}`;
  console.log(`   当前版本: ${latestTag}`);
  console.log(`   新版本: ${version}\n`);
  
  // 3. 创建版本文件（用于网页显示）
  console.log('📝 创建版本文件...');
  const versionInfo = {
    version: version,
    fullVersion: fullVersion,
    buildTime: new Date().toISOString(),
    commit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
    branch: execSync('git branch --show-current', { encoding: 'utf8' }).trim()
  };
  
  const versionFilePath = path.join(process.cwd(), 'public', 'version.json');
  fs.writeFileSync(versionFilePath, JSON.stringify(versionInfo, null, 2));
  console.log(`   版本信息已保存到: ${versionFilePath}\n`);
  
  // 4. 设置环境变量供构建使用
  console.log('⚙️  设置构建环境变量...');
  process.env.NEXT_PUBLIC_APP_VERSION = version;
  process.env.NEXT_PUBLIC_BUILD_TIME = versionInfo.buildTime;
  process.env.NEXT_PUBLIC_GIT_COMMIT = versionInfo.commit;
  console.log(`   NEXT_PUBLIC_APP_VERSION=${version}\n`);
  
  // 5. 构建项目
  console.log('🔨 构建项目...');
  try {
    execSync('npm run build:worker', { stdio: 'inherit' });
    console.log('✅ 构建完成\n');
  } catch (e) {
    console.error('❌ 构建失败:', e.message);
    process.exit(1);
  }
  
  // 6. 部署到 Cloudflare
  console.log('☁️  部署到 Cloudflare...');
  try {
    execSync('wrangler pages deploy .vercel/output/static --project-name=aibazi-nextjs --branch=main', { 
      stdio: 'inherit'
    });
    console.log('✅ 部署完成\n');
  } catch (e) {
    console.error('❌ 部署失败:', e.message);
    process.exit(1);
  }
  
  // 7. 创建 Git Tag
  console.log('🏷️  创建 Git Tag...');
  try {
    execSync(`git tag -a ${version} -m "${deployMessage}"`, { stdio: 'inherit' });
    console.log(`✅ Tag 创建成功: ${version}\n`);
  } catch (e) {
    console.error('❌ 创建 Tag 失败:', e.message);
    process.exit(1);
  }
  
  // 8. 推送代码和 Tag
  console.log('📤 推送到远程仓库...');
  try {
    execSync('git push origin main', { stdio: 'inherit' });
    execSync('git push origin --tags', { stdio: 'inherit' });
    console.log('✅ 推送完成\n');
  } catch (e) {
    console.error('❌ 推送失败:', e.message);
    process.exit(1);
  }
  
  // 完成
  console.log('🎉 部署流程全部完成！');
  console.log('═══════════════════════════════════════');
  console.log(` 版本号: ${version}`);
  console.log(` 构建时间: ${versionInfo.buildTime}`);
  console.log(` Git Commit: ${versionInfo.commit.slice(0, 7)}`);
  console.log('═══════════════════════════════════════');
}

// 运行部署
deploy().catch(console.error);
