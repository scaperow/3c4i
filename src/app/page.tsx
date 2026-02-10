'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Wind, Layers, Cpu, ArrowUpRight, Compass, Sparkles, Brain } from 'lucide-react'
import { useTranslation, Trans } from 'react-i18next'
import * as Separator from '@radix-ui/react-separator'
import * as AspectRatio from '@radix-ui/react-aspect-ratio'
import {
  PageLayout,
  TOKENS,
  Seal,
  LatticePattern,
  CornerBracket,
  FeatureCard,
  NeoButton
} from '../components/NeoChinese'
import { NameConfigPanel, NameConfigValues } from './ainame/components/NameConfigPanel'
import styles from './page.module.css'

// -----------------------------------------------------------------------------
// COMPONENTS
// -----------------------------------------------------------------------------

const CompassDecoration = () => {
  const { t } = useTranslation()
  return (
  <AspectRatio.Root
    ratio={1}
    className="relative w-full max-w-[400px] mx-auto opacity-60 pointer-events-none select-none"
  >
    {/* Outer Ring */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      className="absolute inset-0 border border-dashed border-white/20 rounded-full"
    />
    {/* Middle Ring */}
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      className="absolute inset-[15%] border border-dotted border-white/20 rounded-full"
    />
    {/* Inner Ring */}
    <motion.div
      animate={{ rotate: 180 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      className="absolute inset-[30%] border border-white/10 rounded-full flex items-center justify-center"
    >
      <div className="w-2 h-2 bg-orange-500 rounded-full" />
    </motion.div>

    {/* Three Forces Markers */}
    <div className="absolute inset-0">
      {/* Tian (Heaven) - Top */}
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 text-white/20 font-serif text-xl">
        {t('landing.background.heaven')}
      </div>
      {/* Di (Earth) - Bottom Right */}
      <div className="absolute bottom-[20%] right-[15%] text-white/20 font-serif text-xl">{t('landing.background.earth')}</div>
      {/* Ren (Humanity) - Bottom Left */}
      <div className="absolute bottom-[20%] left-[15%] text-white/20 font-serif text-xl">{t('landing.background.humanity')}</div>
    </div>

    {/* Cross lines */}
    <div className="absolute inset-0 flex items-center justify-center">
      <Separator.Root className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <Separator.Root
        orientation="vertical"
        className="h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent absolute"
      />
    </div>
  </AspectRatio.Root>
  )
}

const AppCard = ({
  icon: Icon,
  concept,
  conceptCn,
  title,
  desc,
  link,
  delay,
  pattern = 'lattice',
  accent = 'bazi'
}: {
  icon: React.ElementType
  concept: string
  conceptCn: string
  title: string
  desc: string
  link: string
  delay: number
  pattern?: 'lattice' | 'dots' | 'waves'
  accent?: 'bazi' | 'ainame' | 'mbti'
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      initial={TOKENS.motion.initial}
      whileInView={TOKENS.motion.animate}
      viewport={{ once: true }}
      transition={{ ...TOKENS.motion.transition, delay }}
      className="h-full"
    >
      <a
        href={link}
        onClick={handleClick}
        className={`${styles.appCard} group relative block h-[400px] w-full overflow-hidden border border-white/10 bg-white/5 hover:border-white/25 transition-colors cursor-pointer`}
        data-accent={accent}
      >
      {/* Background Gradient */}
      <div
        className={`${styles.appCardBackground} absolute inset-0 transition-transform duration-[1.5s] group-hover:scale-105`}
      />

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
        {pattern === 'lattice' && <LatticePattern />}
        {pattern === 'dots' && <div className={`${styles.appCardPattern} ${styles.appCardDots}`} />}
        {pattern === 'waves' && <div className={`${styles.appCardPattern} ${styles.appCardWaves}`} />}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {/* Vertical Text Decoration */}
      <div
        className={`absolute top-6 right-6 writing-vertical-rl text-white/10 group-hover:text-white/20 transition-colors ${TOKENS.type.calligraphy} text-4xl tracking-[0.2em] h-full pointer-events-none select-none`}
      >
        {conceptCn}
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="mb-auto flex justify-between items-start">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 border border-white/10 bg-black/20 backdrop-blur-md text-xs font-mono uppercase tracking-widest text-white/60 group-hover:text-white group-hover:border-white/30 transition-all`}
          >
            <div
              className={`${styles.appCardDot} w-1.5 h-1.5 rounded-full transition-colors group-hover:bg-[var(--app-color)]`}
            />
            {concept}
          </div>
          <ArrowUpRight className="text-white/20 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all group-hover:text-white" />
        </div>

        <div className="relative z-10 pl-4 border-l-2 border-white/10 group-hover:border-[var(--app-color)] transition-all duration-500">
          <Icon className="w-10 h-10 text-white/80 mb-6 stroke-1 group-hover:text-white transition-colors" />
          <h3 className="text-2xl font-bold text-white mb-2 transition-colors font-serif group-hover:text-[var(--app-color)]">
            {title}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm group-hover:text-white/80 transition-colors line-clamp-2">
            {desc}
          </p>
        </div>
      </div>
    </a>
  </motion.div>
  )
}

const StatBlock = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col border-l border-white/10 pl-6 relative">
    <div className="absolute -left-[3px] top-0 h-full w-[5px] bg-orange-500 scale-y-0 transition-transform group-hover:scale-y-100 origin-top" />
    <span className={`${TOKENS.type.mono} text-orange-400 mb-1`}>{label}</span>
    <span className="text-3xl md:text-4xl font-light text-white font-serif">{value}</span>
  </div>
)

// -----------------------------------------------------------------------------
// MAIN PAGE
// -----------------------------------------------------------------------------

export default function AIBaziPortal() {
  const { t } = useTranslation()
  const router = useRouter()

  const [nameConfig, setNameConfig] = useState<NameConfigValues>({
    birthDate: '',
    birthTime: '',
    style: '',
    balance: 'auto',
    otherConfig: ''
  })

  const handleNameConfigChange = (key: keyof NameConfigValues, value: string) => {
    setNameConfig((prev) => ({ ...prev, [key]: value }))
  }

  const handleQuickStart = () => {
    const params = new URLSearchParams()
    if (nameConfig.birthDate) params.set('birthDate', nameConfig.birthDate)
    if (nameConfig.birthTime) params.set('birthTime', nameConfig.birthTime)
    if (nameConfig.style) params.set('style', nameConfig.style)
    if (nameConfig.balance) params.set('balance', nameConfig.balance)
    if (nameConfig.otherConfig) params.set('otherConfig', nameConfig.otherConfig)

    router.push(`/ainame?${params.toString()}`)
  }

  return (
    <PageLayout>
      {/* HERO SECTION */}
      <section className="min-h-[85vh] flex flex-col justify-center mb-32 relative">
        {/* Vertical Couplet Decoration (Left) */}
        {/* <div className="absolute left-0 top-1/4 hidden lg:flex flex-col gap-8 opacity-30 select-none pointer-events-none mix-blend-overlay">
          <div
            className={`writing-vertical-rl text-5xl ${TOKENS.type.calligraphy} tracking-[0.5em] text-white/20`}
          >
            {t('landing.hero.coupletLeft')}
          </div>
        </div> */}
        {/* Vertical Couplet Decoration (Right) */}
        {/* <div className="absolute right-0 top-1/3 hidden lg:flex flex-col gap-8 opacity-30 select-none pointer-events-none mix-blend-overlay">
          <div
            className={`writing-vertical-rl text-5xl ${TOKENS.type.calligraphy} tracking-[0.5em] text-white/20`}
          >
            {t('landing.hero.coupletRight')}
          </div>
        </div> */}

        <div className={TOKENS.grid}>
          {/* Typographic Hero */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'circOut' }}
            className="col-span-1 md:col-span-8 relative z-10"
          >
            <div className={`${TOKENS.type.mono} mb-4 text-orange-500 flex items-center gap-2`}>
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              {t('landing.hero.init')}
            </div>
            <h1 className={`${TOKENS.type.hero} font-serif relative`}>
              {t('landing.hero.three')}
              <Seal
                text={t('landing.hero.seal')}
                className="absolute -top-4 -left-12 w-12 h-12 rotate-[-12deg] opacity-80 hidden md:flex"
              />
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">
                {t('landing.hero.forces')}
              </span>
            </h1>
            <div className="mt-8 pl-6 border-l-4 border-orange-500">
              <p
                className={`text-3xl md:text-5xl text-white tracking-tight ${TOKENS.type.calligraphy} mb-2`}
              >
                {t('landing.hero.sancai')}
              </p>
              <p className="text-lg text-white/50 tracking-wide uppercase">
                {t('landing.hero.heavenEarthHumanity')}
              </p>
            </div>
          </motion.div>

          {/* Abstract Visual / Compass Decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="col-span-1 md:col-span-4 flex flex-col justify-center items-center relative"
          >
            <CompassDecoration />

            {/* Subtle statement overlay */}
            <div className="absolute bottom-0 right-0 max-w-xs text-right hidden md:block">
              <p className={`${TOKENS.type.mono} text-xs text-white/30`}>
                <Trans
                  i18nKey="landing.hero.desc"
                  components={[
                    <span key="0" className="text-orange-500" />,
                    <span key="1" className="text-orange-500" />
                  ]}
                />
              </p>
            </div>
          </motion.div>
        </div>

        {/* APPS SECTION (Integrated into Hero) */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* APP 1: BAZI (Heaven) */}
          <AppCard
            delay={0.1}
            concept={t('landing.apps.bazi.concept')}
            conceptCn={t('landing.apps.bazi.conceptCn')}
            title={t('landing.apps.bazi.title')}
            desc={t('landing.apps.bazi.desc')}
            link="/bazi"
            icon={Compass}
            pattern="lattice"
            accent="bazi"
          />

          {/* APP 2: AI NAME (Earth) */}
          <AppCard
            delay={0.2}
            concept={t('landing.apps.naming.concept')}
            conceptCn={t('landing.apps.naming.conceptCn')}
            title={t('landing.apps.naming.title')}
            desc={t('landing.apps.naming.desc')}
            link="/ainame"
            icon={Sparkles}
            pattern="waves"
            accent="ainame"
          />

          {/* APP 3: MBTI (Humanity) */}
          <AppCard
            delay={0.3}
            concept={t('landing.apps.mbti.concept')}
            conceptCn={t('landing.apps.mbti.conceptCn')}
            title={t('landing.apps.mbti.title')}
            desc={t('landing.apps.mbti.desc')}
            link="/mbti"
            icon={Brain}
            pattern="dots"
            accent="mbti"
          />
        </div>

        {/* Quick Start Config */}
        <div className="mt-12 flex flex-col items-center relative z-20">
          <NameConfigPanel
            values={nameConfig}
            onChange={handleNameConfigChange}
            defaultOpen={false}
          >
            <NeoButton
              variant="primary"
              onClick={handleQuickStart}
              className="w-full md:w-auto px-8 h-auto"
            >
              {t('landing.apps.naming.title')} <ArrowRight className="w-4 h-4 ml-2" />
            </NeoButton>
          </NameConfigPanel>
        </div>
      </section>

      {/* METHODOLOGY / 3C4I EXPLANATION */}
      <section
        id="methodology"
        className="mb-32 relative py-24 border-y border-white/10 bg-white/5 overflow-hidden"
      >
        {/* Background Elements */}
        <LatticePattern />
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none select-none hidden xl:block">
          <div className="text-[20rem] font-black leading-none text-white font-serif">3C</div>
        </div>
        <div className="absolute bottom-0 left-0 p-12 opacity-[0.03] pointer-events-none select-none hidden xl:block">
          <div className="text-[20rem] font-black leading-none text-white font-serif">4I</div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <CornerBracket />
            <h2 className={`${TOKENS.type.h2} mb-4 pt-8`}>
              <span className="text-orange-500">3C</span> × <span className="text-white">4I</span>
            </h2>
            <p className={`${TOKENS.type.mono} text-white/40 tracking-widest uppercase mb-8`}>
              {t('landing.methodology.subtitle')}
            </p>
            <Separator.Root
              orientation="vertical"
              className="w-px h-16 bg-gradient-to-b from-orange-500 to-transparent mx-auto"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* LEFT: 3C (Three Core Forces) */}
            <div className="relative">
              <h3 className="text-2xl font-serif text-orange-500 mb-12 flex items-center gap-4">
                <Seal text={t('landing.methodology.forces.seal')} />
                {t('landing.methodology.forces.title')}
              </h3>

              <div className="space-y-12">
                <div className="group">
                  <div className="flex items-baseline justify-between border-b border-white/10 pb-4 mb-2">
                    <span className="text-4xl font-serif text-white group-hover:text-orange-500 transition-colors">
                      {t('landing.methodology.forces.heaven.title')}
                    </span>
                    <span className="font-mono text-xs text-white/40">
                      {t('landing.methodology.forces.heaven.concept')}
                    </span>
                  </div>
                  <p className="text-white/60 text-lg">
                    {t('landing.methodology.forces.heaven.desc')}
                  </p>
                </div>

                <div className="group">
                  <div className="flex items-baseline justify-between border-b border-white/10 pb-4 mb-2">
                    <span className="text-4xl font-serif text-white group-hover:text-orange-500 transition-colors">
                      {t('landing.methodology.forces.earth.title')}
                    </span>
                    <span className="font-mono text-xs text-white/40">
                      {t('landing.methodology.forces.earth.concept')}
                    </span>
                  </div>
                  <p className="text-white/60 text-lg">
                    {t('landing.methodology.forces.earth.desc')}
                  </p>
                </div>

                <div className="group">
                  <div className="flex items-baseline justify-between border-b border-white/10 pb-4 mb-2">
                    <span className="text-4xl font-serif text-white group-hover:text-orange-500 transition-colors">
                      {t('landing.methodology.forces.humanity.title')}
                    </span>
                    <span className="font-mono text-xs text-white/40">
                      {t('landing.methodology.forces.humanity.concept')}
                    </span>
                  </div>
                  <p className="text-white/60 text-lg">
                    {t('landing.methodology.forces.humanity.desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: 4I (Intelligence) */}
            <div className="relative">
              <h3 className="text-2xl font-serif text-white mb-12 flex items-center gap-4">
                <div className="w-8 h-8 border border-white flex items-center justify-center font-serif text-sm">
                  {t('landing.methodology.intelligence.seal')}
                </div>
                {t('landing.methodology.intelligence.title')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    code: 'I1',
                    title: t('landing.methodology.intelligence.insight.title'),
                    desc: t('landing.methodology.intelligence.insight.desc')
                  },
                  {
                    code: 'I2',
                    title: t('landing.methodology.intelligence.interpretation.title'),
                    desc: t('landing.methodology.intelligence.interpretation.desc')
                  },
                  {
                    code: 'I3',
                    title: t('landing.methodology.intelligence.identity.title'),
                    desc: t('landing.methodology.intelligence.identity.desc')
                  },
                  {
                    code: 'I4',
                    title: t('landing.methodology.intelligence.ai.title'),
                    desc: t('landing.methodology.intelligence.ai.desc')
                  }
                ].map((item) => (
                  <div
                    key={item.code}
                    className="border border-white/10 p-6 hover:bg-white/5 transition-colors group"
                  >
                    <div className="text-orange-500 font-mono text-xs mb-3 flex items-center gap-2">
                      <span className="w-1 h-1 bg-orange-500 rounded-full" />
                      {item.title.toUpperCase()}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform">
                      {item.title}
                    </h4>
                    <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="mb-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
          <h2 className={TOKENS.type.h2}>{t('landing.features.title')}</h2>
          <p className={`${TOKENS.type.mono} mt-4 md:mt-0`}>{t('landing.features.scan')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          <FeatureCard
            delay={0.1}
            icon={Wind}
            title={t('landing.features.lunisolar.title')}
            desc={t('landing.features.lunisolar.desc')}
          />
          <FeatureCard
            delay={0.2}
            icon={Cpu}
            title={t('landing.features.neural.title')}
            desc={t('landing.features.neural.desc')}
          />
          <FeatureCard
            delay={0.3}
            icon={Layers}
            title={t('landing.features.crossDomain.title')}
            desc={t('landing.features.crossDomain.desc')}
          />
        </div>
      </section>
    </PageLayout>
  )
}
