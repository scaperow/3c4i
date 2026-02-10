# Neo-Chinese Components 使用指南

## 概述

Neo-Chinese Components 是一套基于 **Radix UI** 和 **Tailwind CSS** 的现代化 React 组件库，专为 NeoChinese 设计系统开发。所有组件都集成了统一的主题颜色和设计 Token，确保整个应用保持一致的视觉风格。

## 核心设计原则

1. **Radix UI First** - 所有组件都基于 Radix UI 原语，确保无障碍性和跨浏览器兼容性
2. **主题一致性** - 统一的 `themeColor` prop 支持全局颜色切换
3. **类型安全** - 完整的 TypeScript 类型定义
4. **灵活可扩展** - 支持所有原生 Radix UI props

## 已实现的组件

### 1. NeoButton

基于原生 `<button>` 元素的增强组件。

```tsx
import { NeoButton } from '@/components/NeoChinese'

// 基本用法
<NeoButton themeColor="#EA580C">Click me</NeoButton>

// 变体
<NeoButton variant="outline" themeColor="#EA580C">Outline</NeoButton>
<NeoButton variant="ghost" themeColor="#EA580C">Ghost</NeoButton>

// 禁用状态
<NeoButton disabled themeColor="#EA580C">Disabled</NeoButton>

// 自定义样式
<NeoButton 
  className="px-8 py-4 text-lg"
  themeColor="#EA580C"
>
  Large Button
</NeoButton>
```

**Props：**
- `variant?: 'default' | 'outline' | 'ghost'` - 按钮风格
- `themeColor?: string` - 主题颜色
- `className?: string` - 额外的 Tailwind 类名
- 支持所有原生 `<button>` 属性

---

### 2. NeoInput

基于 Radix UI 的文本输入框组件。

```tsx
import { NeoInput } from '@/components/NeoChinese'

// 基本用法
<NeoInput 
  type="text"
  placeholder="输入文本..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  themeColor="#EA580C"
/>

// Date 类型
<NeoInput type="date" themeColor="#EA580C" />

// Time 类型
<NeoInput type="time" themeColor="#EA580C" />

// 变体
<NeoInput variant="default" themeColor="#EA580C" /> {/* 完整边框 */}
<NeoInput variant="ghost" themeColor="#EA580C" />   {/* 无边框 */}
<NeoInput variant="flushed" themeColor="#EA580C" /> {/* 仅底部边框 */}
```

**Props：**
- `type?: string` - 输入框类型 (text, date, time, email 等)
- `variant?: 'default' | 'ghost' | 'flushed'` - 样式变体
- `themeColor?: string` - 焦点时的边框颜色
- `placeholder?: string` - 占位符文本
- 支持所有原生 `<input>` 属性

---

### 3. NeoSelect

基于 Radix UI Select 的下拉选择组件。

```tsx
import { NeoSelect } from '@/components/NeoChinese'

const options = [
  { value: 'opt1', label: '选项 1' },
  { value: 'opt2', label: '选项 2' },
  { value: 'opt3', label: '选项 3' }
]

<NeoSelect
  value={selected}
  onValueChange={setSelected}
  placeholder="选择一个选项..."
  options={options}
  themeColor="#EA580C"
/>
```

**Props：**
- `value?: string` - 当前选中值
- `onValueChange?: (value: string) => void` - 值变化回调
- `placeholder?: string` - 占位符文本
- `options: Array<{ value: string; label: string }>` - 选项列表
- `themeColor?: string` - 主题颜色

---

### 4. NeoCheckbox

基于 Radix UI Checkbox 的复选框组件。

```tsx
import { NeoCheckbox } from '@/components/NeoChinese'

// 带标签的复选框
<NeoCheckbox
  checked={isChecked}
  onCheckedChange={setIsChecked}
  label="我已阅读条款"
  themeColor="#EA580C"
/>

// 默认选中
<NeoCheckbox defaultChecked label="启用功能" />

// 禁用状态
<NeoCheckbox disabled label="禁用选项" />
```

**Props：**
- `checked?: boolean | 'indeterminate'` - 检查状态
- `onCheckedChange?: (checked: boolean | 'indeterminate') => void` - 状态变化回调
- `label?: string` - 标签文本
- `themeColor?: string` - 选中时的颜色
- `disabled?: boolean` - 是否禁用

---

### 5. NeoTextarea

基于原生 `<textarea>` 的增强文本区域组件。

```tsx
import { NeoTextarea } from '@/components/NeoChinese'

// 基本用法
<NeoTextarea
  placeholder="输入多行文本..."
  value={text}
  onChange={(e) => setText(e.target.value)}
  themeColor="#EA580C"
  className="min-h-[120px]"
/>

// 带字数限制
<NeoTextarea
  maxLength={500}
  placeholder="最多 500 字符"
  themeColor="#EA580C"
/>

// 不可调整大小
<NeoTextarea
  className="resize-none"
  themeColor="#EA580C"
/>
```

**Props：**
- `variant?: 'default' | 'ghost' | 'flushed'` - 样式变体
- `themeColor?: string` - 焦点时的边框颜色
- `maxLength?: number` - 最大字符数
- `placeholder?: string` - 占位符文本
- 支持所有原生 `<textarea>` 属性

---

### 6. NeoLabel

基于 Radix UI Label 的标签组件。

```tsx
import { NeoLabel } from '@/components/NeoChinese'

// 基本标签
<NeoLabel>用户名</NeoLabel>

// 必填标记
<NeoLabel required>邮箱地址</NeoLabel>

// 带提示
<NeoLabel 
  required 
  hint="至少 8 个字符"
>
  密码
</NeoLabel>

// 关联输入框
<NeoLabel htmlFor="email">电子邮件</NeoLabel>
<NeoInput id="email" type="email" />
```

**Props：**
- `required?: boolean` - 显示红色 * 标记
- `hint?: string` - 下方提示文本
- `children?: React.ReactNode` - 标签内容
- 支持所有原生 `<label>` 属性

---

### 7. NeoDialog

基于 Radix UI Dialog 的模态对话框组件。

```tsx
import { NeoDialog, NeoButton } from '@/components/NeoChinese'
import { useState } from 'react'

const [open, setOpen] = useState(false)

<NeoDialog
  open={open}
  onOpenChange={setOpen}
  trigger={<NeoButton>打开对话框</NeoButton>}
  title="对话框标题"
  description="对话框描述文本"
  themeColor="#EA580C"
>
  <div>
    {/* 对话框内容 */}
    <p>对话框正文内容</p>
  </div>
</NeoDialog>
```

**Props：**
- `open?: boolean` - 对话框打开状态
- `onOpenChange?: (open: boolean) => void` - 状态变化回调
- `trigger?: React.ReactNode` - 触发按钮
- `title?: string` - 标题
- `description?: string` - 描述
- `themeColor?: string` - 主题颜色
- `children?: React.ReactNode` - 对话框内容

---

## 设计 Token

所有组件使用统一的设计 Token，定义在 `NeoChinese.tsx` 的 `TOKENS` 对象中：

```tsx
export const TOKENS = {
  colors: {
    bg: 'bg-[#050505]',              // 背景色
    surface: 'bg-[#111111]',         // 表面色
    surfaceHover: 'hover:bg-[#1A1A1A]', // 悬停色
    textPrimary: 'text-[#F5F5F7]',   // 主文本
    textSecondary: 'text-[#888888]', // 次要文本
    accent: 'text-[#EB4432]',        // 强调色
    accentBg: 'bg-[#EB4432]',        // 强调背景
    border: 'border-[#222222]'       // 边框色
  },
  // ... 更多 token
}
```

## 全局主题切换

所有 Neo* 组件都支持 `themeColor` prop，便于实现全局主题切换：

```tsx
// 定义主题
const themes = {
  primary: '#EA580C',
  secondary: '#007AFF',
  accent: '#FF9500'
}

// 在组件中使用
<NeoButton themeColor={themes.primary}>Primary</NeoButton>
<NeoButton themeColor={themes.secondary}>Secondary</NeoButton>
<NeoButton themeColor={themes.accent}>Accent</NeoButton>
```

## 最佳实践

### 1. 统一主题颜色

```tsx
// ✅ 推荐：定义常量
const THEME_COLOR = '#EA580C'

<NeoButton themeColor={THEME_COLOR}>Button</NeoButton>
<NeoInput themeColor={THEME_COLOR} />

// ❌ 避免：硬编码颜色字符串
<NeoButton themeColor="#EA580C">Button</NeoButton>
```

### 2. 使用 NeoLabel 关联输入框

```tsx
// ✅ 推荐
<NeoLabel htmlFor="username">用户名</NeoLabel>
<NeoInput id="username" />

// ❌ 避免
<label>用户名</label>
<NeoInput />
```

### 3. 组件组合

```tsx
// ✅ 推荐：使用 NeoLabel + NeoInput 组合
<div className="space-y-2">
  <NeoLabel required>邮箱</NeoLabel>
  <NeoInput type="email" placeholder="user@example.com" />
</div>

// ❌ 避免：混合原生和 Neo* 组件
<label>邮箱</label>
<NeoInput type="email" />
```

### 4. 表单布局

```tsx
// ✅ 推荐：使用 Grid 布局
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <NeoLabel>姓名</NeoLabel>
    <NeoInput />
  </div>
  <div>
    <NeoLabel>年龄</NeoLabel>
    <NeoInput type="number" />
  </div>
</div>
```

## 迁移指南

### 从原生 HTML 到 Neo* 组件

**Before（使用原生 HTML）：**
```tsx
<input 
  type="text"
  placeholder="输入..."
  className="border border-gray-300 rounded px-4 py-2"
/>
```

**After（使用 NeoInput）：**
```tsx
<NeoInput
  type="text"
  placeholder="输入..."
  themeColor="#EA580C"
/>
```

### 批量替换清单

| HTML 元素 | Neo* 组件 | 说明 |
|----------|---------|------|
| `<button>` | NeoButton | 支持多种变体 |
| `<input>` | NeoInput | 支持 date, time 等类型 |
| `<textarea>` | NeoTextarea | 支持字数限制 |
| `<select>` | NeoSelect | Radix UI Select，更易定制 |
| `<input type="checkbox">` | NeoCheckbox | 支持标签和自定义样式 |
| `<label>` | NeoLabel | 支持必填和提示 |
| `<dialog>` | NeoDialog | Radix UI Dialog，支持嵌套内容 |

## 文件清单

已实现 Neo* 组件的文件：

1. **src/components/NeoChinese.tsx** - 核心组件库
   - NeoButton (✅)
   - NeoInput (✅)
   - NeoSelect (✅)
   - NeoCheckbox (✅)
   - NeoTextarea (✅)
   - NeoLabel (✅)
   - NeoDialog (✅)
   - FeatureCard (✅)
   - PageLayout (✅)
   - 其他装饰组件 (Seal, CornerBracket, LatticePattern)

2. **src/components/ComponentShowcase.tsx** - 组件展示和文档

3. **src/app/ainame/components/NameConfigPanel.tsx** - 已使用 Radix UI (Label, Collapsible, RadioGroup)

## 常见问题

### Q: 如何添加新的 Neo* 组件？

A: 按照以下步骤：
1. 在 `NeoChinese.tsx` 中创建新组件
2. 使用 `React.forwardRef` 支持 ref 转发
3. 继承对应 Radix UI 组件的所有 props
4. 添加 `themeColor` 和其他 Neo* 特有的 props
5. 在 `ComponentShowcase.tsx` 中添加使用示例

### Q: 如何自定义组件样式？

A: 使用 `className` prop 添加额外的 Tailwind 类：
```tsx
<NeoButton 
  className="px-8 py-4 text-lg font-bold"
  themeColor="#EA580C"
>
  Custom Button
</NeoButton>
```

### Q: 支持黑暗模式吗？

A: 所有组件都采用暗色设计，不需要额外配置。如需支持浅色主题，可以：
1. 使用 CSS 变量覆盖默认颜色
2. 创建 `NeoLight` 主题变体

### Q: 如何处理表单验证？

A: Neo* 组件支持所有原生 HTML 属性，可以使用 `required`, `pattern` 等：
```tsx
<NeoInput
  type="email"
  required
  pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
  themeColor="#EA580C"
/>
```

## 性能优化

所有 Neo* 组件都：
- ✅ 使用 `React.forwardRef` 支持 ref
- ✅ 使用 `displayName` 便于调试
- ✅ 避免不必要的 re-render
- ✅ 支持 Code Splitting

## 无障碍性

基于 Radix UI，所有组件都符合：
- ✅ WCAG 2.1 Level AA
- ✅ ARIA 最佳实践
- ✅ 键盘导航支持
- ✅ 屏幕阅读器友好

## 相关资源

- [Radix UI 官网](https://www.radix-ui.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [NeoChinese 设计系统](./NeoChinese.tsx)
- [组件展示页面](./ComponentShowcase.tsx)

---

**最后更新：** 2026-02-04
**维护者：** 3C4I Labs
