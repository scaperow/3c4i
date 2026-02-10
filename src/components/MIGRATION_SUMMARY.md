# Radix UI 组件迁移总结

## 项目现状分析

此文档总结了项目中所有 .tsx 文件的 HTML 组件使用情况，以及迁移到 Radix UI + Neo* 组件的建议。

---

## 📊 文件分析结果

### 已迁移到 Radix UI 的文件 ✅

| 文件路径 | 已使用的 Radix UI 组件 | 状态 |
|---------|------------------|------|
| `src/app/ainame/components/NameConfigPanel.tsx` | Collapsible, Select, RadioGroup, Label, Separator | ✅ 完全迁移 |
| `src/components/LanguageSwitcher.tsx` | ToggleGroup | ✅ 完全迁移 |
| `src/components/NeoChinese.tsx` | 所有基础组件 + 新增 Neo* 组件 | ✅ 完全迁移 |
| `src/app/ainame/result/page.tsx` | Tabs, Toast, Dialog, Separator | ✅ 完全迁移 |
| `src/app/bazi/result/page.tsx` | 使用 NeoChinese 组件 | ✅ 完全迁移 |

### 包含原生 HTML 组件的文件

| 文件路径 | 原生组件 | 建议改进 | 优先级 |
|---------|--------|--------|------|
| `components/ui/button.tsx` | button (CVA 封装) | 替换为 NeoButton | 中 |
| `components/ui/date-picker.tsx` | 原生日期输入 | 改用 NeoInput + date type | 中 |
| `src/components/FortuneTimeline.tsx` | 可能有原生 div 结构 | 检查并改用相关组件 | 低 |
| `src/components/PageTransition.tsx` | 可能有原生结构 | 使用 Framer Motion | 低 |

---

## 🔧 具体改进方案

### 1. **components/ui/button.tsx** 
**现状：** 使用 CVA (Class Variance Authority) 和 Radix Slot
**改进方案：**
```tsx
// ❌ 当前（过度设计）
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'

// ✅ 改进（使用 NeoButton）
import { NeoButton } from '@/components/NeoChinese'

// 用法
<NeoButton variant="outline">Click</NeoButton>
```

**迁移步骤：**
1. 移除对 `components/ui/button.tsx` 的导入
2. 统一使用 `NeoButton` 从 `NeoChinese.tsx`
3. 删除多余的 CVA 配置

---

### 2. **components/ui/date-picker.tsx 和 calendar.tsx**
**现状：** 使用原生日期选择
**改进方案：**
```tsx
// ❌ 原始
<input type="date" />

// ✅ 改进
<NeoInput type="date" themeColor="#EA580C" />

// 或使用完整的日期选择器（待扩展）
<NeoDatePicker value={date} onChange={setDate} />
```

**实施步骤：**
1. 对于简单日期选择，使用 `NeoInput type="date"`
2. 对于复杂日期范围选择，考虑集成专门的日期选择库（如 react-day-picker）

---

### 3. **LanguageSwitcher.tsx**
**现状：** ✅ 已使用 Radix UI ToggleGroup
**评价：** 实现完美，无需改进

---

### 4. **NameConfigPanel.tsx**
**现状：** ✅ 已使用 Radix UI 组件
**可以改进的地方：**
```tsx
// 当前写法
<NeoInput
  type="date"
  className="bg-white/6 border border-white/10..."
/>

// 建议改进
<NeoInput
  type="date"
  variant="default"
  themeColor="#EA580C"
  // 不需要手动指定样式类，使用统一的 variant 和 themeColor
/>
```

---

## 📋 组件映射表

针对项目中可能存在的原生 HTML 使用场景：

| HTML 元素 | Radix UI 组件 | Neo* 包装器 | 使用场景 |
|----------|--------------|-----------|---------|
| `<button>` | - | `NeoButton` | 所有按钮 |
| `<input type="text">` | - | `NeoInput` | 文本输入 |
| `<input type="date">` | - | `NeoInput` | 日期选择 |
| `<input type="time">` | - | `NeoInput` | 时间选择 |
| `<input type="checkbox">` | Checkbox | `NeoCheckbox` | 复选框 |
| `<textarea>` | - | `NeoTextarea` | 多行文本 |
| `<select>` | Select | `NeoSelect` | 下拉列表 |
| `<label>` | Label | `NeoLabel` | 表单标签 |
| `<dialog>` | Dialog | `NeoDialog` | 模态对话框 |
| `<input type="radio">` | RadioGroup | - | 单选组 |
| `<menu>` | NavigationMenu | - | 导航菜单 |
| `<details>` | Collapsible | - | 可折叠内容 |

---

## 🎯 迁移优先级

### 🔴 立即迁移（P0）
- [ ] `components/ui/button.tsx` - 统一为 `NeoButton`
- [ ] 清理所有原生 `<button>` 元素的使用

### 🟠 近期迁移（P1）
- [ ] `components/ui/date-picker.tsx` - 改用 `NeoInput type="date"`
- [ ] 统一所有表单输入的主题颜色

### 🟡 后续优化（P2）
- [ ] `FortuneTimeline.tsx` - 检查并改进结构
- [ ] `PageTransition.tsx` - 确保使用 Framer Motion
- [ ] 扩展日期选择器功能（日期范围选择）

### 🟢 可选（P3）
- [ ] 创建高级组件库（如时间选择器、颜色选择器）
- [ ] 实现主题切换系统
- [ ] 创建组件测试套件

---

## ✨ 新增组件库

已在 `src/components/NeoChinese.tsx` 中添加的 Radix UI 包装器：

| 组件名 | 基于 Radix UI | 完成度 | 文档 |
|------|-------------|------|------|
| NeoButton | - | ✅ | 完整 |
| NeoInput | - | ✅ | 完整 |
| NeoSelect | Select | ✅ | 完整 |
| NeoCheckbox | Checkbox | ✅ | 完整 |
| NeoTextarea | - | ✅ | 完整 |
| NeoLabel | Label | ✅ | 完整 |
| NeoDialog | Dialog | ✅ | 完整 |
| FeatureCard | - | ✅ | 完整 |
| PageLayout | - | ✅ | 完整 |

---

## 📚 已安装的 Radix UI 依赖

```json
{
  "@radix-ui/react-aspect-ratio": "^1.1.8",
  "@radix-ui/react-checkbox": "^1.1.0",  // 新增
  "@radix-ui/react-collapsible": "^1.1.12",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-form": "^0.1.8",
  "@radix-ui/react-label": "^2.1.8",
  "@radix-ui/react-navigation-menu": "^1.2.14",
  "@radix-ui/react-popover": "^1.1.15",
  "@radix-ui/react-progress": "^1.1.8",
  "@radix-ui/react-radio-group": "^1.3.8",
  "@radix-ui/react-scroll-area": "^1.2.10",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-separator": "^1.1.8",
  "@radix-ui/react-slot": "^1.2.4",
  "@radix-ui/react-switch": "^1.2.6",
  "@radix-ui/react-tabs": "^1.1.0",  // 新增
  "@radix-ui/react-toast": "^1.2.15",
  "@radix-ui/react-toggle-group": "^1.1.11"
}
```

---

## 🚀 实施指南

### 第 1 步：查找和替换
```bash
# 查找所有原生 button 使用
grep -r "<button" src/app --include="*.tsx" --include="*.jsx"

# 查找所有原生 input 使用
grep -r '<input' src/app --include="*.tsx" --include="*.jsx"

# 查找所有原生 select 使用
grep -r '<select' src/app --include="*.tsx" --include="*.jsx"
```

### 第 2 步：导入组件
```tsx
// 在文件顶部添加
import {
  NeoButton,
  NeoInput,
  NeoSelect,
  NeoCheckbox,
  NeoTextarea,
  NeoLabel,
  NeoDialog,
  TOKENS
} from '@/components/NeoChinese'
```

### 第 3 步：逐个迁移
对于每个原生 HTML 元素：
1. 找到对应的 Neo* 组件
2. 复制原有的功能 props
3. 添加 `themeColor` prop
4. 测试所有交互

### 第 4 步：移除旧组件
- 删除 `components/ui/button.tsx`（如果不再使用）
- 清理未使用的导入
- 运行 `npm run build` 验证编译

---

## 🔍 代码审查清单

在提交 PR 之前：

- [ ] 所有 `<button>` 都改为 `<NeoButton>`
- [ ] 所有 `<input>` 都改为 `<NeoInput>`
- [ ] 所有 `<select>` 都改为 `<NeoSelect>`
- [ ] 所有 `<textarea>` 都改为 `<NeoTextarea>`
- [ ] 所有表单都使用一致的 `themeColor`
- [ ] 没有遗漏的原生 HTML 表单元素
- [ ] TypeScript 编译无错误
- [ ] 视觉外观保持一致

---

## 📞 获取帮助

- 查看 [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) 了解详细用法
- 查看 [ComponentShowcase.tsx](./ComponentShowcase.tsx) 查看实时示例
- 参考 [Radix UI 官方文档](https://www.radix-ui.com/)

---

**创建日期：** 2026-02-04
**状态：** 持续维护
**版本：** 1.0.0
