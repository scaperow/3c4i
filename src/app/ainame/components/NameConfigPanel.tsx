'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, ChevronUp, ChevronDown, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as Select from '@radix-ui/react-select'
import * as Separator from '@radix-ui/react-separator'
import { NeoButton, NeoInput, NeoLabel, NeoRadioGroup, NeoRadioCard } from '@/components/NeoChinese'

export interface NameConfigValues {
  birthDate: string
  birthTime: string
  style: string
  balance: string
  otherConfig: string
}

interface NameConfigPanelProps {
  values: NameConfigValues
  onChange: (key: keyof NameConfigValues, value: string) => void
  children?: React.ReactNode
  defaultOpen?: boolean
  themeColor?: string
}

export function NameConfigPanel({
  values,
  onChange,
  children,
  defaultOpen = false,
  themeColor
}: NameConfigPanelProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // 风格选项及对应的示例名字
  const styleOptions = [
    { value: 'literary', id: 'literary' },
    { value: 'chinese', id: 'chinese' },
    { value: 'minimalist', id: 'minimalist' },
    { value: 'modern', id: 'modern' },
    { value: 'nature', id: 'nature' }
  ]
  const balances = ['auto', 'metal', 'wood', 'water', 'fire', 'earth']

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full max-w-2xl mx-auto relative"
    >
      {/* Toggle Button */}
      <div className="flex justify-center mb-4">
        <Collapsible.Trigger asChild>
          <NeoButton
            variant="ghost"
            className="flex items-center gap-2 px-6 py-2 bg-white/6 backdrop-blur-lg border border-white/10 rounded-full text-sm text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-lg shadow-black/20 group h-auto normal-case tracking-normal relative z-10"
          >
            <Settings className="w-4 h-4" />
            <span>{t('ainame.result.config.title')}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </NeoButton>
        </Collapsible.Trigger>
      </div>

      <AnimatePresence>
        {isOpen && (
          <Collapsible.Content forceMount asChild>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-visible"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl text-left mb-8 shadow-2xl shadow-black/40 relative z-10 isolate flex flex-col">
                <div className="flex flex-col gap-6 mb-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Birth Date */}
                    <div className="flex flex-1 items-center gap-1">
                      <NeoLabel className="text-white/60 whitespace-nowrap">
                        {t('ainame.result.config.birth_date')}
                      </NeoLabel>
                      <NeoInput
                        type="date"
                        value={values.birthDate}
                        onChange={(e) => onChange('birthDate', e.target.value)}
                        className="flex-1 bg-white/12 backdrop-blur-sm border border-white/25 text-white text-sm px-4 py-3 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/50 transition-all [color-scheme:dark]"
                        themeColor="rgb(234 88 12)"
                      />
                    </div>

                    {/* Birth Time */}
                    <div className="flex flex-1 items-center gap-1">
                      <NeoLabel className="text-white/60 whitespace-nowrap">
                        {t('ainame.result.config.birth_time')}
                      </NeoLabel>
                      <NeoInput
                        type="time"
                        value={values.birthTime}
                        onChange={(e) => onChange('birthTime', e.target.value)}
                        className="flex-1 bg-white/12 backdrop-blur-sm border border-white/25 text-white text-sm px-4 py-3  focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/50 transition-all [color-scheme:dark]"
                        themeColor="rgb(234 88 12)"
                      />
                    </div>
                  </div>

                  {/* Style */}
                  <div className="w-full">
                    <NeoLabel className="text-white/60">{t('ainame.result.config.style')}</NeoLabel>
                    <NeoRadioGroup
                      className="flex flex-col gap-2"
                      value={values.style}
                      onValueChange={(value) => onChange('style', value)}
                    >
                      {styleOptions.map((styleOption) => (
                        <NeoRadioCard
                          key={styleOption.value}
                          value={styleOption.value}
                          showIndicator={false}
                          themeColor="rgb(249 115 22)" // orange-500
                          className={`bg-black/5 w-full px-4 py-3 border  transition-all focus:outline-none focus:ring-1 focus:ring-orange-500/50 ${
                            values.style === styleOption.value
                              ? 'shadow-lg shadow-orange-500/10'
                              : 'hover:border-white/30 hover:bg-white/12'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-medium ${values.style === styleOption.value ? 'text-orange-400' : 'text-white/85'}`}
                            >
                              {t(`ainame.styles.${styleOption.value}`)}
                            </span>
                            {values.style === styleOption.value && (
                              <Check className="w-4 h-4 text-orange-500" />
                            )}
                          </div>
                          <p className="mt-1 text-xs text-white/40 font-mono">
                            {t('ainame.result.examplePrefix')}{t(`ainame.examples.${styleOption.id}.boy`)} / {t(`ainame.examples.${styleOption.id}.girl`)}
                          </p>
                        </NeoRadioCard>
                      ))}
                    </NeoRadioGroup>
                  </div>
                </div>

                {/* Other Config */}
                <div className="mb-6 flex flex-1 flex-col">
                  <div>
                    <NeoLabel className="text-white/60">{t('ainame.result.config.other')}</NeoLabel>
                  </div>
                  <NeoInput
                    value={values.otherConfig}
                    onChange={(e) => onChange('otherConfig', e.target.value)}
                    placeholder={t('ainame.result.config.placeholder_other')}
                    className="w-inherit flex-1 bg-white/12 backdrop-blur-sm border border-white/25 text-white/90 text-sm px-4 py-3  focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-white/35 resize-none overflow-hidden"
                    themeColor="rgb(234 88 12)"
                    maxLength={200}
                  />
                </div>

                {/* Action Buttons (Footer) */}
                {children && (
                  <>
                    <Separator.Root className="h-px  bg-white/5 mb-4" />
                    <div className="flex justify-end">{children}</div>
                  </>
                )}
              </div>
            </motion.div>
          </Collapsible.Content>
        )}
      </AnimatePresence>
    </Collapsible.Root>
  )
}
