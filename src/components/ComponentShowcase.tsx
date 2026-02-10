'use client'

import React, { useState } from 'react'
import {
  NeoButton,
  NeoInput,
  NeoSelect,
  NeoCheckbox,
  NeoTextarea,
  NeoLabel,
  NeoDialog,
  FeatureCard,
  PALETTE
} from './NeoChinese'
import { Settings, Heart, Zap } from 'lucide-react'

/**
 * ComponentShowcase - 演示所有 Neo* Radix UI 组件的使用
 * 该文件展示了如何在项目中统一使用主题化的 Radix UI 组件
 */
export const ComponentShowcase = () => {
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [isChecked, setIsChecked] = useState<boolean | 'indeterminate'>(false)
  const [textareaValue, setTextareaValue] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const themeColor = PALETTE.orange

  const selectOptions = [
    { value: 'option1', label: '选项 1' },
    { value: 'option2', label: '选项 2' },
    { value: 'option3', label: '选项 3' },
    { value: 'option4', label: '选项 4' }
  ]

  return (
    <div className="space-y-12 p-8">
      {/* Input Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">NeoInput Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <NeoLabel required hint="支持 date, time, text 等类型">
              Default Input
            </NeoLabel>
            <NeoInput
              type="text"
              placeholder="输入文本..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              themeColor={themeColor}
              className="mt-2"
            />
          </div>
          <div>
            <NeoLabel>Date Input</NeoLabel>
            <NeoInput type="date" themeColor={themeColor} className="mt-2" />
          </div>
          <div>
            <NeoLabel>Ghost Variant</NeoLabel>
            <NeoInput
              type="text"
              variant="ghost"
              placeholder="Ghost style"
              themeColor={themeColor}
              className="mt-2"
            />
          </div>
          <div>
            <NeoLabel>Flushed Variant</NeoLabel>
            <NeoInput
              type="text"
              variant="flushed"
              placeholder="Bottom border only"
              themeColor={themeColor}
              className="mt-2"
            />
          </div>
        </div>
      </section>

      {/* Select Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">NeoSelect Component</h2>
        <div className="max-w-md">
          <NeoLabel required>选择选项</NeoLabel>
          <NeoSelect
            value={selectValue}
            onValueChange={setSelectValue}
            placeholder="选择一个选项..."
            options={selectOptions}
            themeColor={themeColor}
          />
        </div>
      </section>

      {/* Checkbox Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">NeoCheckbox Component</h2>
        <div className="space-y-3">
          <NeoCheckbox
            checked={isChecked}
            onCheckedChange={setIsChecked}
            label="我已阅读并同意条款"
            themeColor={themeColor}
          />
          <NeoCheckbox
            label="启用高级功能"
            defaultChecked
            themeColor={themeColor}
          />
          <NeoCheckbox
            label="接收通知"
            disabled
            themeColor={themeColor}
          />
        </div>
      </section>

      {/* Textarea Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">NeoTextarea Component</h2>
        <div className="max-w-2xl">
          <NeoLabel hint="支持多行输入，限制 500 字符">
            详细说明
          </NeoLabel>
          <NeoTextarea
            placeholder="输入详细说明..."
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            themeColor={themeColor}
            className="mt-2 min-h-[120px] resize-none"
            maxLength={500}
          />
          <p className="text-xs text-white/40 mt-2 text-right">
            {textareaValue.length} / 500
          </p>
        </div>
      </section>

      {/* Button Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">NeoButton Variants</h2>
        <div className="flex flex-wrap gap-4">
          <NeoButton themeColor={themeColor}>Default</NeoButton>
          <NeoButton variant="outline" themeColor={themeColor}>
            Outline
          </NeoButton>
          <NeoButton variant="ghost" themeColor={themeColor}>
            Ghost
          </NeoButton>
          <NeoButton disabled themeColor={themeColor}>
            Disabled
          </NeoButton>
        </div>
      </section>

      {/* Dialog Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">NeoDialog Component</h2>
        <NeoDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          trigger={<NeoButton themeColor={themeColor}>打开对话框</NeoButton>}
          title="对话框标题"
          description="这是一个使用 Radix UI Dialog 的示例"
          themeColor={themeColor}
        >
          <div className="space-y-4">
            <p className="text-white/80">
              对话框内容可以包含任何 React 组件，包括表单、输入框等。
            </p>
            <div className="flex gap-2 justify-end">
              <NeoButton variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </NeoButton>
              <NeoButton themeColor={themeColor} onClick={() => setDialogOpen(false)}>
                确认
              </NeoButton>
            </div>
          </div>
        </NeoDialog>
      </section>

      {/* Feature Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">FeatureCard Component</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Zap}
            title="高性能"
            desc="使用 Radix UI 原始组件库，保证最佳性能"
            delay={0}
            themeColor={themeColor}
          />
          <FeatureCard
            icon={Settings}
            title="可定制"
            desc="统一的主题颜色配置，轻松更换全局样式"
            delay={0.1}
            themeColor={themeColor}
          />
          <FeatureCard
            icon={Heart}
            title="易用"
            desc="简洁的 API 设计，快速集成到项目中"
            delay={0.2}
            themeColor={themeColor}
          />
        </div>
      </section>

      {/* 使用指南 */}
      <section className="space-y-4 bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white">使用指南</h2>
        <div className="space-y-3 text-white/80 text-sm">
          <p>
            <strong className="text-white">1. 导入组件：</strong>
            <br />
            {`import { NeoButton, NeoInput, NeoSelect, ... } from '@/components/NeoChinese'`}
          </p>
          <p>
            <strong className="text-white">2. 设置主题颜色：</strong>
            <br />
            {`const themeColor = '#EA580C' // 或任何其他颜色`}
          </p>
          <p>
            <strong className="text-white">3. 传入 themeColor prop：</strong>
            <br />
            {`<NeoButton themeColor={themeColor}>Click me</NeoButton>`}
          </p>
          <p>
            <strong className="text-white">4. 支持所有 Radix UI 原生 props：</strong>
            <br />
            所有 Neo* 组件都支持对应 Radix UI 组件的所有 props，确保完全兼容性。
          </p>
        </div>
      </section>
    </div>
  )
}
