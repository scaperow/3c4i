# 3C4I Portal

Three Core Forces × Intelligence - 融合东方智慧与现代科技的智能门户

## 项目简介

3C4I 是一个融合东方智慧与现代科技的全栈应用平台，提供以下核心功能：

- **大罗洞观** - 精准八字排盘，分析大运流年，AI智能解读
- **MBTI 测试** - 92道题目科学测评，深度剖析你的性格类型  
- **好名字** - 融合传统文化与AI，为宝宝起寓意美好的名字

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 组件**: Mantine, Tailwind CSS, DaisyUI
- **样式方案**: CSS-in-JS, Tailwind CSS
- **状态管理**: React Context
- **字体**: Inter, Poppins, Noto Sans SC, Space Grotesk
- **部署**: Cloudflare Workers

## 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 根布局
│   ├── page.tsx          # 首页
│   ├── launcher/         # 应用启动器
│   ├── bazi/            # 八字应用
│   ├── mbti/            # MBTI测试
│   └── ainame/          # 智能取名
├── src/                  # 源代码
├── public/               # 静态资源
├── .gitignore           # Git忽略文件
├── package.json         # 项目配置
├── tailwind.config.js   # Tailwind配置
└── next.config.js       # Next.js配置
```

## 核心理念

### 3C - Three Core Forces (三才)
- **C1 - Time (天)**: 出生时间与命理结构
- **C2 - Nature (地)**: 性格、环境与基础条件  
- **C3 - Self (人)**: 意识、选择与成长路径

### 4I - Intelligence (智能)
- **Insight**: 洞察你的性格与天赋
- **Interpretation**: 解释命运结构，而非迷信
- **Identity**: 构建名字与身份认同
- **Intelligence**: AI 驱动的人生模型

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系我们

- 网站: [https://3c4i.com](https://3c4i.com)
- 邮箱: contact@3c4i.com

---

© 2026 3C4I Team. Three Core Forces × Intelligence
