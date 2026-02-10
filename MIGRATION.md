# 生辰八字排盘系统 - React 19 迁移版

本项目已从 Vue 3 + Taro 多端框架迁移到 **React 19** + **Vite** 的现代 Web 应用。

## 🎯 迁移完成内容

### ✅ 核心功能迁移
- **主页面 (Home)**: 生日选择（农历/公历）、性别选择、表单验证
- **排盘展示 (Showup)**: 三大标签页
  - **排盘 (Pillars)**: 八字排盘、十神、天干地支、神煞、空亡、纳音
  - **运势 (Fortune)**: 大运、流年、流月、流日选择及展示
  - **解析 (AI)**: 智能 AI 分析（五行、性格、运势等 10 个维度）
- **个人中心 (Profile)**: 导航菜单
- **在线客服 (Customer)**: 聊天界面，消息持久化到 localStorage
- **订单记录 (Order)**: 订单列表、订单详情、支付状态

### ✅ 技术栈升级
- **框架**: Vue 3 → **React 19**
- **构建工具**: Taro → **Vite 5**
- **UI 框架**: NutUI → **Mantine 8** (现代美观UI库)
- **动画**: 自定义 CSS → **Framer Motion 10** (流畅过渡动画)
- **路由**: Taro 导航 → **React Router v6** (声明式路由)
- **样式**: Stylus → **Tailwind CSS** + **Mantine 主题**
- **状态管理**: Vue Pinia → **React Hooks** (useState, useCallback, useMemo)
- **类型**: TypeScript (保持)

### ✅ 移除内容
- 所有 Taro 多端插件和配置
- Vue SFC (.vue) 文件
- NutUI 组件库依赖
- 小程序/支付宝/抖音等多端适配代码
- 旧的 Webpack 和 Babel Taro 配置

---

## 🚀 快速开始

### 环境要求
- **Node.js**: >= 16.x
- **npm**: >= 8.x

### 安装与运行

```bash
# 安装依赖
npm install

# 开发模式 (Vite 热更新)
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

开发服务器启动后，访问 `http://localhost:5173` (Vite 默认端口)。

---

## 📁 项目结构

```
src/
├── main.tsx              # React 应用入口
├── App.tsx               # 路由配置
├── app.css               # 全局样式
├── pages/
│   ├── Home.tsx          # 主页 (生日/性别选择)
│   ├── Showup.tsx        # 排盘展示主页面
│   ├── Profile.tsx       # 个人中心
│   ├── Customer.tsx      # 在线客服
│   ├── Order.tsx         # 订单记录
│   ├── logo_hero.png     # 品牌 Logo
│   └── components/
│       ├── Pillars.tsx   # 八字排盘展示
│       ├── Fortune.tsx   # 运势选择及展示
│       ├── AI.tsx        # AI 智能解析
│       └── Casher.tsx    # 支付弹窗
├── hooks/
│   ├── useAppState.ts    # 八字数据 Hook (替代 useAppData.ts)
│   └── useOrderState.ts  # 订单数据 Hook (替代 useOrder.ts)
├── lib/
│   └── lunisolar/        # 农历转换库 (保持不变)
├── composables/          # 旧 Vue composables (已迁移到 hooks/)
└── types/
    └── index.ts          # TypeScript 类型定义
```

---

## 🎨 UI 设计特点

### Mantine 组件库
- **现代化 UI**: 简洁、一致的设计语言
- **深色主题支持**: 自动响应系统主题
- **无障碍**: WCAG 2.1 AA 级别支持
- **按需加载**: Tree-shaking 友好

### Framer Motion 动画
- **页面加载**: 淡入 + 滑动入场
- **交互反馈**: 按钮按下、鼠标悬停缩放
- **列表动画**: 依次错序展现
- **模态框**: 弹簧动画进出

### Tailwind CSS 样式
- 响应式设计，移动端友好
- 深色模式支持
- 与 Mantine 主题无缝集成

---

## 🔄 API & localStorage 用法

### localStorage (聊天消息持久化)
```typescript
// 保存消息
localStorage.setItem('chatMessages', JSON.stringify(messages))

// 读取消息
const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]')
```

### HTTP 请求 (axios)
```typescript
// 获取订单列表
const { data } = await axios.get('/order')

// 创建订单
const { data } = await axios.post('/order', orderData)

// AI 分析接口
const { data } = await axios.post(url, payload, { headers })
```

---

## 🔧 关键迁移要点

### 1. 状态管理：Vue Ref → React Hooks
```typescript
// Vue 3 (composables/useAppData.ts)
const selectedGender = ref<number | null>(null)
const updateGender = (gender: number | null) => {
  selectedGender.value = gender
}

// React (hooks/useAppState.ts)
const [selectedGender, setSelectedGender] = useState<number | null>(null)
const updateGender = useCallback((gender: number | null) => {
  setSelectedGender(gender)
}, [])
```

### 2. 导航：Taro.navigateTo() → React Router
```typescript
// Vue + Taro
Taro.navigateTo({ url: '/pages/showup/index' })

// React + React Router
const navigate = useNavigate()
navigate('/showup')
```

### 3. 通知：NutUI Toast → Mantine Notifications
```typescript
// Vue + NutUI
openToast('请选择生日')

// React + Mantine
notifications.show({
  title: '错误',
  message: '请选择生日',
  color: 'red'
})
```

### 4. 日期选择：NutUI DatePicker → Mantine DatePickerInput
```typescript
// Vue: <nut-date-picker v-model="birthday" />

// React:
<DatePickerInput
  value={selectedDate}
  onChange={setSelectedDate}
  minDate={new Date(year - 120, 0, 1)}
  maxDate={new Date()}
/>
```

---

## ⚙️ 环境变量

创建 `.env` 或 `.env.local` 配置 API 端点和 AI 服务：

```bash
# API 基础地址
VITE_API_BASE_URL=http://localhost:3000

# AI 分析服务 (抖音云雪球)
REACT_APP_TT_BOAT_URL=https://api.example.com/chat
REACT_APP_TT_BOAT_NAME=gpt-4
REACT_APP_TT_BOAT_AUTH=your-auth-token
```

> **注**: Vite 使用 `VITE_` 前缀，Webpack 使用 `REACT_APP_` 前缀。脚本中统一使用 `REACT_APP_`。

---

## 🧪 测试

### 单元测试 (可选配置)
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
npm run test
```

### 浏览器兼容性
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📦 依赖清单

### 核心依赖
| 包 | 版本 | 用途 |
|---|------|------|
| react | ^19.0.0 | UI 框架 |
| react-dom | ^19.0.0 | DOM 渲染 |
| react-router-dom | ^6.x | 路由管理 |
| @mantine/core | ^8.0.0 | UI 组件库 |
| @mantine/hooks | ^8.0.0 | 工具 Hook |
| framer-motion | ^10.0.0 | 动画库 |
| axios | ^1.7.7 | HTTP 请求 |
| lunisolar | 自定义 | 农历转换 |
| shiren-calendar | ^0.6.7 | 八字排盘核心库 |

### 开发依赖
| 包 | 版本 | 用途 |
|---|------|------|
| vite | ^5.4.10 | 构建工具 |
| @vitejs/plugin-react | ^4.0.0 | React JSX 支持 |
| typescript | ^5.1.0 | 类型检查 |
| @typescript-eslint/* | ^6.2.0 | 代码规范 |
| eslint | ^8.12.0 | 代码检查 |
| tailwindcss | ^3.4.14 | CSS 框架 |

---

## 🛠 故障排除

### Issue: "Cannot find module 'react'"
```bash
# 解决: 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### Issue: Vite 热更新不工作
```bash
# 检查 vite.config.ts React 插件是否正确配置
# 重启开发服务器
npm run dev
```

### Issue: 日期选择器不显示
```bash
# 确保 @mantine/dates 已安装
npm install @mantine/dates
```

---

## 📝 后续改进方向

- [ ] 添加单元测试 (Vitest + React Testing Library)
- [ ] 集成 Redux Toolkit 管理复杂状态
- [ ] 支持国际化 (i18next)
- [ ] 暗黑模式完整适配
- [ ] PWA 离线支持
- [ ] 性能优化 (代码分割、虚拟滚动)
- [ ] 实现真实支付接口集成

---

## 📄 许可证

MIT License

---

## 👨‍💻 开发者指南

### 添加新页面
1. 在 `src/pages/` 中创建新组件 `NewPage.tsx`
2. 在 `src/App.tsx` 中添加路由:
   ```typescript
   <Route path="/new-page" element={<NewPage />} />
   ```
3. 使用 React Router 导航:
   ```typescript
   navigate('/new-page')
   ```

### 添加新 Hook
1. 在 `src/hooks/` 中创建 `useNewHook.ts`
2. 遵循 React Hooks 规则 (纯函数、依赖数组)
3. 导出供页面组件使用

### 样式规范
- 优先使用 Mantine 组件 (`@mantine/core`)
- 补充 Tailwind 工具类 (响应式、间距)
- 避免内联样式，使用 CSS modules 或 CSS-in-JS

---

**最后更新**: 2026年1月18日 | **迁移完成度**: ✅ 100%
