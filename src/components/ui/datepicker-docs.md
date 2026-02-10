# DatePicker 组件使用说明

## 概述
已成功将项目中的所有日期选择器从 Mantine DatePickerInput 替换为基于 React Day Picker 的自定义 DatePicker 组件。

## 特性
- 基于 Radix UI 和 React Day Picker
- 支持各应用的主题风格
- 200-300ms 过渡动画
- 支持键盘导航和屏幕阅读器
- 完整的 TypeScript 支持

## 使用方法

### 基础用法
```tsx
import { DatePicker } from '@/components/ui/date-picker'

<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  placeholder="选择日期"
/>
```

### MBTI 风格
```tsx
import { MDatePicker } from '@/components/ui/mbti-date-picker'

<MDatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  placeholder="MBTI 风格日期选择"
/>
```

### AINaming 风格
```tsx
import { DatePicker } from '@/components/ui/date-picker'

<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  ainame={true}
/>
```

## API

### DatePicker Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | Date \| null | undefined | 选中的日期 |
| onChange | (date: Date \| null) => void | undefined | 日期变更回调 |
| placeholder | string | "选择日期" | 占位符文本 |
| disabled | boolean | false | 是否禁用 |
| minDate | Date | undefined | 最小可选日期 |
| maxDate | Date | undefined | 最大可选日期 |
| className | string | undefined | CSS 类名 |
| style | React.CSSProperties | undefined | 内联样式 |
| ainame | boolean | false | 是否使用 AINaming 风格 |
| mbti | boolean | false | 是否使用 MBTI 风格 |

## 主题风格

### MBTI 风格特点
- 黑色背景 + #0066ff 主题色
- 200ms 过渡动画
- Helvetica Neue 字体
- 等宽数字显示
- 立体按钮阴影效果

### AINaming 风格特点
- 白色背景 + rgb(255, 204, 0) 主题色
- 250ms 过渡动画
- Helvetica Neue 字体
- 立体按钮设计
- Kusama 风格圆点装饰

## 无障碍性
- 支持键盘导航
- 语义化 HTML 结构
- 屏幕阅读器友好
- 支持 prefers-reduced-motion

## 浏览器支持
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 已替换的文件
- `app/ainame/page.tsx`
- `src/apps/ainame/AINamingIndex.tsx`
- `src/main.tsx` (移除 Mantine 日期样式导入)

## 依赖包
- `react-day-picker`
- `date-fns`
- `@radix-ui/react-slot`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`