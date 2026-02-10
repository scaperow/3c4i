'use client'

import React, { useState, forwardRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  PageLayout,
  Seal,
  CornerBracket,
  TOKENS,
  NeoButton,
  NeoInput,
  NeoSelect,
  NeoLabel,
  NeoRadioGroup,
  NeoRadioItem,
  NeoToast,
  NeoToastProvider,
  NeoToastViewport,
  PALETTE
} from '@/components/NeoChinese'
import { useTranslation, Trans } from 'react-i18next'
import * as Toast from '@radix-ui/react-toast'
import * as Form from '@radix-ui/react-form'
import * as Label from '@radix-ui/react-label'
import * as Select from '@radix-ui/react-select'
import { X, ChevronDown, ChevronUp, Check } from 'lucide-react'

// SelectItem component removed as NeoSelect is used

export default function BaziCalculatePage() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const themeColor = PALETTE.red
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    birthYear: '1990',
    birthMonth: '1',
    birthDay: '1',
    birthHour: '12',
    isLunar: false
  })
  const [toastOpen, setToastOpen] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Form validation is handled by Radix Form, so if we are here, data is valid
    // But we are using controlled state for non-native inputs (Select, Radio),
    // so we still use formData state.

    // Double check name just in case
    if (!formData.name) {
      return
    }

    const params = new URLSearchParams()
    params.set('name', formData.name)
    params.set('gender', formData.gender)
    params.set('year', formData.birthYear)
    params.set('month', formData.birthMonth)
    params.set('day', formData.birthDay)
    params.set('hour', formData.birthHour)
    params.set('isLunar', formData.isLunar.toString())

    router.push(`/bazi/result?${params.toString()}`)
  }

  const labelClass = 'text-white/60'
  const inputClass =
    'w-full bg-neo-surface border border-neo-border text-white px-4 py-3 focus:outline-none transition-colors hover:border-white/40'

  const isZh = i18n.language.startsWith('zh')

  return (
    <NeoToastProvider swipeDirection="right">
      <PageLayout themeColor={themeColor} logoText={t('bazi.seal')}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <Seal text={t('bazi.seal')} className="mb-6 text-2xl w-16 h-16" />
            <h1 className={`${TOKENS.type.h2} mb-4`}>
              <Trans
                i18nKey="bazi.calculate.title"
                components={[<span key="0" className="text-neo-red" />]}
              />
            </h1>
            <p className={TOKENS.type.body}>{t('bazi.calculate.subtitle')}</p>
          </div>

          <motion.div
            initial={TOKENS.motion.initial}
            animate={TOKENS.motion.animate}
            transition={TOKENS.motion.transition}
            className="relative bg-white/6 border border-white/20 p-8 md:p-12 rounded-2xl backdrop-blur-lg"
          >
            <CornerBracket color={themeColor} />

            <div className="grid gap-8">
              <Form.Root onSubmit={handleSubmit} className="grid gap-8">
                {/* Name & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Form.Field name="name">
                    <div className="flex items-baseline justify-between">
                      <Form.Label className={labelClass}>
                        {t('bazi.calculate.form.name')}
                      </Form.Label>
                      <Form.Message
                        className="text-xs text-neo-red font-mono opacity-80"
                        match="valueMissing"
                      >
                        {t('bazi.calculate.form.alertName') || 'Required'}
                      </Form.Message>
                    </div>
                    <Form.Control asChild>
                      <NeoInput
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t('bazi.calculate.form.namePlaceholder')}
                        themeColor={TOKENS.colors.accent}
                      />
                    </Form.Control>
                  </Form.Field>
                  <div>
                    <Label.Root className={labelClass}>
                      {t('bazi.calculate.form.gender')}
                    </Label.Root>
                    <NeoRadioGroup
                      className="grid grid-cols-2 gap-4"
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <NeoRadioItem value="male" themeColor={PALETTE.red}>
                        {t('bazi.calculate.form.male')}
                      </NeoRadioItem>
                      <NeoRadioItem value="female" themeColor={PALETTE.red}>
                        {t('bazi.calculate.form.female')}
                      </NeoRadioItem>
                    </NeoRadioGroup>
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <NeoLabel className={labelClass}>{t('bazi.calculate.form.birthDate')}</NeoLabel>
                  <div className="grid grid-cols-3 gap-4">
                    <NeoSelect
                      value={formData.birthYear}
                      onValueChange={(value) => setFormData({ ...formData, birthYear: value })}
                      themeColor={PALETTE.red}
                      placeholder={t('bazi.calculate.form.year')}
                      options={Array.from({ length: 131 }, (_, i) => 1900 + i)
                        .reverse()
                        .map((y) => ({ value: String(y), label: String(y) }))}
                    />

                    <NeoSelect
                      value={formData.birthMonth}
                      onValueChange={(value) => setFormData({ ...formData, birthMonth: value })}
                      themeColor={PALETTE.red}
                      placeholder={t('common.unit.monthSuffix')}
                      options={Array.from({ length: 12 }, (_, i) => i + 1).map((m) => ({
                        value: String(m),
                        label: `${m}${t('common.unit.monthSuffix')}`
                      }))}
                    />

                    <NeoSelect
                      value={formData.birthDay}
                      onValueChange={(value) => setFormData({ ...formData, birthDay: value })}
                      themeColor={PALETTE.red}
                      placeholder={t('common.unit.daySuffix')}
                      options={Array.from({ length: 31 }, (_, i) => i + 1).map((d) => ({
                        value: String(d),
                        label: `${d}${t('common.unit.daySuffix')}`
                      }))}
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <NeoLabel className={labelClass}>{t('bazi.calculate.form.birthTime')}</NeoLabel>
                  <NeoSelect
                    value={formData.birthHour}
                    onValueChange={(value) => setFormData({ ...formData, birthHour: value })}
                    themeColor={PALETTE.red}
                    placeholder="Hour"
                    options={Array.from({ length: 24 }, (_, i) => i).map((h) => {
                      const getDizhiKey = (hour: number) => {
                        if (hour >= 23 || hour < 1) return 'zi'
                        if (hour < 3) return 'chou'
                        if (hour < 5) return 'yin'
                        if (hour < 7) return 'mao'
                        if (hour < 9) return 'chen'
                        if (hour < 11) return 'si'
                        if (hour < 13) return 'wu'
                        if (hour < 15) return 'wei'
                        if (hour < 17) return 'shen'
                        if (hour < 19) return 'you'
                        if (hour < 21) return 'xu'
                        return 'hai'
                      }
                      const dizhiKey = getDizhiKey(h)
                      const dizhiText = t(`bazi.terms.dizhi.${dizhiKey}`)
                      return {
                        value: String(h),
                        label: `${t('common.format.timeRange', { start: h, end: h })} (${dizhiText}${t('common.unit.hourSuffix')})`
                      }
                    })}
                  />
                </div>

                <Form.Submit asChild>
                  <NeoButton
                    fullWidth
                    themeColor={PALETTE.red}
                    className="py-4 font-bold hover:bg-neo-red-hover mt-4"
                  >
                    {t('bazi.calculate.form.submit')}
                  </NeoButton>
                </Form.Submit>
              </Form.Root>
            </div>
          </motion.div>
        </div>
      </PageLayout>

      <NeoToast
        open={toastOpen}
        onOpenChange={setToastOpen}
        title={t('common.error') || 'Error'}
        description={t('bazi.calculate.form.alertName')}
        themeColor={themeColor}
      />
      <NeoToastViewport />
    </NeoToastProvider>
  )
}
