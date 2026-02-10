'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
import { BaziCalculator } from '@/lib/bazi-calculator'
import {
  PageLayout,
  Seal,
  CornerBracket,
  TOKENS,
  PALETTE,
  FeatureSection,
  NeoButton,
  NeoScrollArea
} from '@/components/NeoChinese'
import { FortuneTimeline } from '@/components/FortuneTimeline'
import * as Separator from '@radix-ui/react-separator'
import { Calendar, Activity, Heart, Briefcase, Shield, TrendingUp } from 'lucide-react'

function BaziResultContent() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [analysis, setAnalysis] = useState<any>(null)
  const [calculator, setCalculator] = useState<BaziCalculator | null>(null)

  const [error, setError] = useState<string | null>(null)

  // Get params
  const name = searchParams?.get('name') || t('common.defaultUser')
  const gender = searchParams?.get('gender') || 'male'
  const birthYear = parseInt(searchParams?.get('year') || '1990')
  const birthMonth = parseInt(searchParams?.get('month') || '1')
  const birthDay = parseInt(searchParams?.get('day') || '1')
  const birthHour = parseInt(searchParams?.get('hour') || '12')
  const isLunar = searchParams?.get('isLunar') === 'true'

  // Helper for translating terms
  const tr = (category: string, value: string) => {
    if (!value || value === '-') return '-'
    // If value is a translation key (e.g. from structured analysis), translate it
    // But here value is Chinese character from calculator.
    // Check if translation exists
    const key = `bazi.terms.${category}.${value}`
    const translated = t(key)
    return translated !== key ? translated : value
  }

  useEffect(() => {
    try {
      const calc = new BaziCalculator(birthYear, birthMonth, birthDay, birthHour, gender, isLunar)
      const result = calc.getFullAnalysis()
      setAnalysis(result)
      setCalculator(calc)
    } catch (e) {
      console.error(e)
      setError(t('bazi.toast.error.desc'))
    }
  }, [birthYear, birthMonth, birthDay, birthHour, gender, isLunar])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="text-neo-red text-xl">{t('bazi.toast.error.title')}</div>
        <div className="text-white/60">{error}</div>
        <NeoButton onClick={() => router.push('/bazi')} variant="outline">
          {t('bazi.newCalculation')}
        </NeoButton>
      </div>
    )
  }

  if (!analysis || !calculator) return null

  const pillarKeys = ['year', 'month', 'day', 'hour']
  // const pillarLabels = { year: '年柱', month: '月柱', day: '日柱', hour: '时柱' } // Removed hardcoded

  return (
    <div className="space-y-24">
      {/* Header */}
      <div className="text-center">
        <Seal text={t('bazi.resultSeal')} className="mb-6 text-2xl w-16 h-16" />
        <h1 className={`${TOKENS.type.h2} mb-4`}>
          <Trans
            i18nKey="bazi.resultTitleStyled"
            components={[<span key="0" className="text-neo-red" />]}
          />
        </h1>
        <p className={TOKENS.type.body}>
          {t('bazi.analysisFor', { name })} {t('common.separator.middleDot')}{' '}
          {gender === 'male' ? t('common.male') : t('common.female')}{' '}
          {t('common.separator.middleDot')} {birthYear}
          {t('common.separator.dot')}
          {birthMonth}
          {t('common.separator.dot')}
          {birthDay} {birthHour}:00
        </p>
      </div>

      {/* Main Chart Table */}
      <NeoScrollArea
        className="w-full"
        type="hover"
        orientation="horizontal"
        viewportClassName="w-full overflow-x-auto pb-4"
      >
        <div className="min-w-[800px] bg-neo-surface-hover rounded-lg border border-neo-border p-6">
          {/* Header Row */}
          <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr] gap-4 mb-4 text-center pb-4 relative">
            <div className="text-white/40 font-mono text-sm flex items-center justify-center">
              {t('bazi.pillars')}
            </div>
            {pillarKeys.map((key) => (
              <div key={key} className="flex flex-col items-center">
                <span className="text-neo-red font-serif text-lg font-bold">
                  {t(`bazi.pillars.${key}`)}
                </span>
                <span className="text-white/30 text-xs uppercase tracking-widest">{key}</span>
              </div>
            ))}
            <Separator.Root className="absolute bottom-0 left-0 w-full h-px bg-neo-border" />
          </div>

          {/* Main Star Row */}
          <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr] gap-4 mb-6 text-center items-center">
            <div className="text-white/60 font-medium text-sm">{t('bazi.mainStar')}</div>
            {pillarKeys.map((key) => (
              <div key={key} className="text-white/80 text-sm">
                {tr('shishen', analysis.pillars[key].mainStar)}
              </div>
            ))}
          </div>

          {/* Tiangan Row */}
          <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr] gap-4 mb-6 text-center items-center">
            <div className="text-white/60 font-medium text-sm">{t('bazi.tiangan')}</div>
            {pillarKeys.map((key) => (
              <div
                key={key}
                className={`text-2xl font-bold ${key === 'day' ? 'text-neo-red' : 'text-neo-gold'}`}
              >
                {tr('tiangan', analysis.pillars[key].tiangan)}
              </div>
            ))}
          </div>

          {/* Dizhi Row */}
          <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr] gap-4 mb-6 text-center items-center">
            <div className="text-white/60 font-medium text-sm">{t('bazi.dizhi')}</div>
            {pillarKeys.map((key) => (
              <div
                key={key}
                className={`text-2xl font-bold ${
                  analysis.kongwang.includes(analysis.pillars[key].dizhi)
                    ? 'text-white/40' // 空亡 styling
                    : key === 'day'
                      ? 'text-neo-red'
                      : 'text-neo-green'
                }`}
              >
                {tr('dizhi', analysis.pillars[key].dizhi)}
                {analysis.kongwang.includes(analysis.pillars[key].dizhi) && (
                  <span className="absolute -mt-3 ml-1 text-[10px] text-white/30 border border-white/20 px-0.5 rounded">
                    {t('bazi.voidBadge')}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Canggan Row */}
          <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr] gap-4 mb-6 text-center items-start">
            <div className="text-white/60 font-medium text-sm pt-1">{t('bazi.hiddenStems')}</div>
            {pillarKeys.map((key) => (
              <div key={key} className="flex flex-col gap-1 items-center">
                {analysis.pillars[key].canggan.map((cg: any, idx: number) => (
                  <div key={idx} className="flex gap-2 text-xs text-white/60">
                    <span className="text-white/80 w-4">{tr('tiangan', cg.tiangan)}</span>
                    <span className="text-white/40 scale-90">{tr('shishen', cg.shishen)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Nayin Row */}
          <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr] gap-4 mb-6 text-center items-center">
            <div className="text-white/60 font-medium text-sm">{t('bazi.nayin')}</div>
            {pillarKeys.map((key) => (
              <div key={key} className="text-white/80 text-sm">
                {tr('nayin', analysis.pillars[key].nayin)}
              </div>
            ))}
          </div>

          {/* Xingyun Row */}
          <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr] gap-4 mb-6 text-center items-center">
            <div className="text-white/60 font-medium text-sm">{t('bazi.xingyun')}</div>
            {pillarKeys.map((key) => (
              <div key={key} className="text-white/80 text-sm">
                {tr('zhangsheng', analysis.pillars[key].xingyun)}
              </div>
            ))}
          </div>

          {/* Shensha Row */}
          <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr] gap-4 mb-6 text-center items-start">
            <div className="text-white/60 font-medium text-sm pt-1">{t('bazi.shensha')}</div>
            {pillarKeys.map((key) => (
              <div key={key} className="flex flex-col gap-1 items-center">
                {analysis.pillars[key].shensha && analysis.pillars[key].shensha.length > 0 ? (
                  analysis.pillars[key].shensha.map((s: string, i: number) => (
                    <span key={i} className="text-white/80 text-sm">
                      {tr('shensha', s)}
                    </span>
                  ))
                ) : (
                  <span className="text-white/20">-</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </NeoScrollArea>

      {/* Detailed Analysis Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Five Elements & Ten Gods */}
        <div className="relative bg-neo-black border border-neo-border p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-neo-red/10 text-neo-red">
              <Activity size={24} />
            </div>
            <div>
              <h3 className={TOKENS.type.h3}>{t('bazi.coreAnalysis')}</h3>
              <p className="text-xs text-white/40 font-mono uppercase">{t('bazi.fiveElements')}</p>
            </div>
          </div>
          <div className="space-y-4 text-white/80 leading-relaxed font-serif">
            <p>{t(`bazi.analysis.mingju.wuxingTrait.${analysis.analysis.mingju.wuxingTrait}`)}</p>
            <p>
              {analysis.analysis.wuxing.balance
                .map((item: string) => t(`bazi.analysis.wuxing.balance.${item}`))
                .join(' ')}{' '}
              {analysis.analysis.wuxing.interactions
                .map((item: string) => t(`bazi.analysis.wuxing.interaction.${item}`))
                .join(' ')}
            </p>
            <p>
              {analysis.analysis.shishen.patterns
                .map((item: string) => t(`bazi.analysis.shishen.pattern.${item}`))
                .join(' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Fortune Timeline */}
      <div className="relative bg-neo-black border border-neo-border p-8 overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 bg-neo-red/10 text-neo-red">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className={TOKENS.type.h3}>{t('bazi.timeline')}</h3>
            <p className="text-xs text-white/40 font-mono uppercase">
              {t('bazi.timelineSubtitle')}
            </p>
          </div>
        </div>

        <FortuneTimeline
          calculator={calculator}
          dayun={analysis.dayun}
          liunianFull={analysis.liunian}
        />
      </div>

      {/* AI Interpretation Section */}
      <FeatureSection
        title={t('bazi.aiInterpretation')}
        subtitle={t('bazi.aiSubtitle')}
        themeColor={TOKENS.colors.accent}
        features={[
          {
            title: t('bazi.careerWealth'),
            desc: analysis.analysis.career
              .map((item: string) => t(`bazi.analysis.career.${item}`))
              .join(' '),
            icon: Briefcase
          },
          {
            title: t('bazi.relationships'),
            desc: `${t('bazi.analysis.marriage.spouse', {
              zodiac: t(`bazi.terms.dizhi.${analysis.pillars.day.dizhi}`)
            })} ${t(`bazi.analysis.marriage.stability.${analysis.analysis.marriage.stability}`)}`,
            icon: Heart
          },
          {
            title: t('bazi.health'),
            desc: t(`bazi.analysis.health.${analysis.analysis.health}`),
            icon: Shield
          }
        ]}
      />

      <div className="flex justify-center pt-12">
        <NeoButton
          variant="outline"
          onClick={() => router.push('/bazi')}
          className="px-8 py-3"
        >
          {t('bazi.newCalculation')}
        </NeoButton>
      </div>
    </div>
  )
}

export default function BaziResultPage() {
  const { t } = useTranslation()
  return (
    <PageLayout themeColor={TOKENS.colors.accent} logoText={t('bazi.resultSeal')}>
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center text-neo-red font-mono animate-pulse">
            {t('bazi.calculatingText')}
          </div>
        }
      >
        <BaziResultContent />
      </Suspense>
    </PageLayout>
  )
}
