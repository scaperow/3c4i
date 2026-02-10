'use client'

import React, { useState, Suspense } from 'react'
import {
  PageLayout,
  FeatureSection,
  TOKENS,
  PALETTE,
  Seal,
  CornerBracket,
  NeoButton,
  NeoInput,
  NeoSelect,
  NeoLabel,
  NeoRadioGroup,
  NeoRadioItem,
  NeoToast,
  NeoToastProvider,
  NeoToastViewport,
  NeoSeparator
} from '@/components/NeoChinese'
import { Calendar, TrendingUp, Sparkles, Shield, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation, Trans } from 'react-i18next'
import * as Form from '@radix-ui/react-form'

const BackgroundDecoration = React.memo(() => {
  const { t } = useTranslation()
  const particles = React.useMemo(() => {
    const tianganKeys = ['jia', 'yi', 'bing', 'ding', 'wu', 'ji', 'geng', 'xin', 'ren', 'gui']
    const dizhiKeys = ['zi', 'chou', 'yin', 'mao', 'chen', 'si', 'wu_fire', 'wei', 'shen', 'you', 'xu', 'hai']

    const chars = [
      ...tianganKeys.map(k => t(`bazi.terms.tiangan.${k}`)),
      ...dizhiKeys.map(k => t(`bazi.terms.dizhi.${k}`))
    ]

    return chars.map((char, i) => ({
      char,
      duration: 12 + ((i * 7) % 10),
      delay: i * 1.5,
      left: `${5 + ((i * 13) % 90)}%`,
      top: `${10 + ((i * 17) % 80)}%`,
      x: Math.sin(i) * 60
    }))
  }, [t])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-[1]">
      <div className="absolute top-1/2 right-[-15%] -translate-y-1/2 opacity-[0.08]">
        {/* Grid Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[1200px] h-[1200px]">
            <div
              className="absolute inset-0 block"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06) 1px, transparent 1px, transparent 40px)',
                backgroundSize: '40px 40px'
              }}
            />
            <div
              className="absolute inset-0 block"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06) 1px, transparent 1px, transparent 40px)',
                backgroundSize: '40px 40px'
              }}
            />
          </div>
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="w-[1200px] h-[1200px] border-[2px] border-dashed border-white rounded-full"
        >
          <div className="absolute inset-6 border border-white/20 rounded-full" />
          <div className="absolute inset-16 border border-white/20 rounded-full" />
          {['qian', 'dui', 'li', 'zhen', 'xun', 'kan', 'gen', 'kun'].map((key, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-full h-px"
              style={{ transform: `translate(-50%, -50%) rotate(${i * 45}deg)` }}
            >
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-5xl font-serif text-white/30 rotate-90">
                {t(`bazi.terms.bagua.${key}`)}
              </div>
            </div>
          ))}
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-24 w-[1400px] h-[1400px] border border-white/10 rounded-full"
        />
      </div>

      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: [0, 0.15, 0], y: -120, x: p.x }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear'
            }}
            className="absolute text-7xl font-calligraphy text-white"
            style={{
              left: p.left,
              top: p.top,
              filter: 'blur(1.5px)'
            }}
          >
            {p.char}
          </motion.div>
        ))}
      </div>

      <div
        className="absolute top-[-10%] right-[-10%] w-[1400px] h-[1400px] blur-3xl mix-blend-screen"
        style={{ background: `radial-gradient(circle, ${PALETTE.red}14 0%, transparent 60%)` }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[1200px] h-[1200px] blur-3xl mix-blend-screen"
        style={{ background: `radial-gradient(circle, ${PALETTE.red}0F 0%, transparent 60%)` }}
      />
    </div>
  )
})

function BaziForm({ themeColor }: { themeColor: string }) {
  const { t } = useTranslation()
  const router = useRouter()

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

  const handleCalculate = () => {
    if (!formData.name) {
      setToastOpen(true)
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

  const features = [
    {
      title: t('bazi.landing.features.chart.title'),
      desc: t('bazi.landing.features.chart.desc'),
      icon: Calendar
    },
    {
      title: t('bazi.landing.features.luck.title'),
      desc: t('bazi.landing.features.luck.desc'),
      icon: TrendingUp
    },
    {
      title: t('bazi.landing.features.ai.title'),
      desc: t('bazi.landing.features.ai.desc'),
      icon: Sparkles
    }
  ]

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] flex flex-col justify-center mb-24 pt-12">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Content */}
          <motion.div
            initial={TOKENS.motion.initial}
            animate={TOKENS.motion.animate}
            transition={TOKENS.motion.transition}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-4 mb-8">
              <Seal
                text={t('bazi.seal')}
                color={themeColor}
                className="w-12 h-12 md:w-16 md:h-16 text-2xl md:text-3xl"
              />
              <NeoSeparator className="h-px w-20" themeColor={themeColor} />
              <span className={`${TOKENS.type.mono} opacity-60`} style={{ color: themeColor }}>
                {t('bazi.landing.subtitle')}
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`${TOKENS.type.hero} mb-8 text-white tracking-wide drop-shadow-2xl font-chinese`}
            >
              <Trans
                i18nKey="bazi.landing.heroTitle"
                components={[
                  <span
                    key="0"
                    style={{
                      color: themeColor,
                      textShadow: `0 0 20px ${themeColor}80, 0 0 40px ${themeColor}40`
                    }}
                    className="relative inline-block"
                  />
                ]}
              />
            </motion.h1>

            <p className={`${TOKENS.type.body} mb-12 whitespace-pre-line text-white/60`}>
              {t('bazi.landing.heroDesc')}
            </p>

            <div className="hidden lg:block">
              <div className="flex items-center gap-4 text-xs font-mono text-white/30 uppercase tracking-widest">
                <Shield className="w-4 h-4" />
                <span>{t('landing.secure')}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...TOKENS.motion.transition, delay: 0.2 }}
            className="lg:col-span-7 relative z-10"
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 text-white/20">
                <CornerBracket />
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 rotate-90 text-white/20">
                <CornerBracket />
              </div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 -rotate-90 text-white/20">
                <CornerBracket />
              </div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 rotate-180 text-white/20">
                <CornerBracket />
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 md:p-12 relative z-10 isolate">
                <Form.Root
                  className="space-y-8"
                  onSubmit={(event) => {
                    event.preventDefault()
                    handleCalculate()
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name Input */}
                    <Form.Field name="name" className="col-span-1 md:col-span-2 space-y-3">
                      <NeoLabel className={labelClass}>{t('bazi.form.name')}</NeoLabel>
                      <Form.Control asChild>
                        <NeoInput
                          placeholder={t('bazi.form.namePlaceholder')}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-neo-red focus:ring-neo-red"
                          required
                        />
                      </Form.Control>
                      <Form.Message className="text-sm mt-1" match="valueMissing" style={{ color: themeColor }}>
                        {t('bazi.form.required')}
                      </Form.Message>
                    </Form.Field>

                    {/* Gender Select */}
                    <div className="space-y-3">
                      <NeoLabel className={labelClass}>{t('bazi.form.gender')}</NeoLabel>
                      <NeoRadioGroup
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                        className="flex gap-4"
                      >
                        <NeoRadioItem
                          value="male"
                          themeColor={themeColor}
                          className="text-white"
                        >
                          {t('bazi.form.male')}
                        </NeoRadioItem>
                        <NeoRadioItem
                          value="female"
                          themeColor={themeColor}
                          className="text-white"
                        >
                          {t('bazi.form.female')}
                        </NeoRadioItem>
                      </NeoRadioGroup>
                    </div>

                    {/* Calendar Type */}
                    <div className="space-y-3">
                      <NeoLabel className={labelClass}>{t('bazi.form.calendar')}</NeoLabel>
                      <NeoRadioGroup
                        value={formData.isLunar ? 'lunar' : 'solar'}
                        onValueChange={(value) =>
                          setFormData({ ...formData, isLunar: value === 'lunar' })
                        }
                        className="flex gap-4"
                      >
                        <NeoRadioItem
                          value="solar"
                          themeColor={themeColor}
                          className="text-white"
                        >
                          {t('bazi.form.solar')}
                        </NeoRadioItem>
                        <NeoRadioItem
                          value="lunar"
                          themeColor={themeColor}
                          className="text-white"
                        >
                          {t('bazi.form.lunar')}
                        </NeoRadioItem>
                      </NeoRadioGroup>
                    </div>

                    {/* Date Selection */}
                    <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <NeoLabel className={labelClass}>{t('bazi.form.year')}</NeoLabel>
                        <NeoSelect
                          value={formData.birthYear}
                          onValueChange={(value) => setFormData({ ...formData, birthYear: value })}
                          options={Array.from({ length: 100 }, (_, i) => {
                            const year = 2024 - i
                            return { value: year.toString(), label: `${year}${t('common.unit.yearSuffix')}` }
                          })}
                          placeholder={t('bazi.form.year')}
                          themeColor={themeColor}
                        />
                      </div>
                      <div className="space-y-2">
                        <NeoLabel className={labelClass}>{t('bazi.form.month')}</NeoLabel>
                        <NeoSelect
                          value={formData.birthMonth}
                          onValueChange={(value) => setFormData({ ...formData, birthMonth: value })}
                          options={Array.from({ length: 12 }, (_, i) => {
                            const month = i + 1
                            return { value: month.toString(), label: `${month}${t('common.unit.monthSuffix')}` }
                          })}
                          placeholder={t('bazi.form.month')}
                          themeColor={themeColor}
                        />
                      </div>
                      <div className="space-y-2">
                        <NeoLabel className={labelClass}>{t('bazi.form.day')}</NeoLabel>
                        <NeoSelect
                          value={formData.birthDay}
                          onValueChange={(value) => setFormData({ ...formData, birthDay: value })}
                          options={Array.from({ length: 31 }, (_, i) => {
                            const day = i + 1
                            return { value: day.toString(), label: `${day}${t('common.unit.daySuffix')}` }
                          })}
                          placeholder={t('bazi.form.day')}
                          themeColor={themeColor}
                        />
                      </div>
                    </div>

                    {/* Hour Selection */}
                    <div className="col-span-1 md:col-span-2 space-y-3">
                      <NeoLabel className={labelClass}>{t('bazi.form.time')}</NeoLabel>
                      <NeoSelect
                        value={formData.birthHour}
                        onValueChange={(value) => setFormData({ ...formData, birthHour: value })}
                        options={Array.from({ length: 24 }, (_, i) => {
                          const hour = i
                          return {
                            value: hour.toString(),
                            label: t('common.format.timeRange', {
                              start: hour.toString().padStart(2, '0'),
                              end: (hour + 1).toString().padStart(2, '0')
                            })
                          }
                        })}
                        placeholder={t('bazi.form.time')}
                        themeColor={themeColor}
                      />
                    </div>
                  </div>

                  <NeoSeparator className="my-8 bg-white/10" />

                  <NeoButton
                    type="submit"
                    variant="primary"
                    className="w-full h-14 text-lg font-bold tracking-widest relative overflow-hidden group"
                    style={{
                      backgroundColor: themeColor,
                      borderColor: themeColor
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" style={{ color: 'white' }} />
                      {t('bazi.form.submit')}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </NeoButton>
                </Form.Root>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <FeatureSection
        title={
          <Trans
            i18nKey="bazi.landing.features.title"
            components={[<span key="0" className="text-white" />]}
          />
        }
        subtitle={t('bazi.landing.features.subtitle')}
        features={features}
        themeColor={themeColor}
      />

      <NeoToastViewport />
      <NeoToast
        open={toastOpen}
        onOpenChange={setToastOpen}
        title={t('bazi.toast.error.title')}
        description={t('bazi.toast.error.desc')}
        themeColor={themeColor}
      />
    </>
  )
}

export default function BaziPage() {
  const themeColor = PALETTE.red // Red Theme
  const { t } = useTranslation()

  return (
    <NeoToastProvider swipeDirection="right">
      <PageLayout themeColor={themeColor} logoText={t('bazi.seal')}>
        <BackgroundDecoration />
        <Suspense fallback={<div className="min-h-screen bg-neo-black">{t('common.loading')}</div>}>
          <BaziForm themeColor={themeColor} />
        </Suspense>
      </PageLayout>
    </NeoToastProvider>
  )
}
