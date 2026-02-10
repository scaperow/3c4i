'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  IconArrowLeft,
  IconBrain,
  IconStar,
  IconBriefcase,
  IconUsers,
  IconChartBar,
  IconShare,
  IconRotateClockwise,
  IconX
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import * as Separator from '@radix-ui/react-separator'
import { clsx } from 'clsx'
import {
  PageLayout,
  Seal,
  CornerBracket,
  TOKENS,
  PALETTE,
  NeoButton,
  NeoToast,
  NeoToastProvider,
  NeoToastViewport
} from '@/components/NeoChinese'
import { motion } from 'framer-motion'
import { PersonalityImage } from '../components/PersonalityImage'

// NeoChinese inspired design system
const PRIMARY_COLOR = PALETTE.red // NeoChinese Red
const SECONDARY_COLOR = PALETTE.white
const ACCENT_COLOR = PALETTE.black
const BACKGROUND_COLOR = PALETTE.black

interface TestResult {
  type: string
  scores: {
    E: number
    I: number
    S: number
    N: number
    T: number
    F: number
    J: number
    P: number
  }
  answers: number[]
}

interface MBTIAnalysis {
  type: string
  title: string
  description: string
  strengths: string[]
  weaknesses: string[]
  careers: string[]
  workplace: string
  relationships: string
  aiAnalysis: {
    score: number
    insights: string[]
    recommendations: string[]
  }
}

const TYPE_SCORES: Record<string, number> = {
  INTJ: 92,
  INTP: 88,
  ENTJ: 95,
  ENTP: 85,
  INFJ: 90,
  INFP: 83,
  ENFJ: 89,
  ENFP: 86,
  ISTJ: 88,
  ISFJ: 90,
  ESTJ: 92,
  ESFJ: 94,
  ISTP: 85,
  ISFP: 82,
  ESTP: 86,
  ESFP: 84
}

function MBTIResultContent() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [result, setResult] = useState<TestResult | null>(null)
  const [analysis, setAnalysis] = useState<MBTIAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [toastOpen, setToastOpen] = useState(false)

  useEffect(() => {
    const loadResult = async () => {
      let finalResult: TestResult | null = null

      // 1. Try loading from sessionStorage (preferred method to avoid long URLs)
      if (typeof window !== 'undefined') {
        try {
          const savedState = sessionStorage.getItem('mbti_quiz_state')
          if (savedState) {
            const parsedState = JSON.parse(savedState)
            if (parsedState.testResultData) {
              // Handle both old URL-encoded format and new raw JSON format
              try {
                // First try parsing as raw JSON (new format)
                finalResult = JSON.parse(parsedState.testResultData)
              } catch (jsonError) {
                // If that fails, try URL-decoding first (old format)
                try {
                  finalResult = JSON.parse(decodeURIComponent(parsedState.testResultData))
                } catch (urlError) {
                  console.error('Failed to parse testResultData in both formats:', { jsonError, urlError })
                }
              }
            }
          }
        } catch (e) {
          console.error('Error reading session storage:', e)
        }
      }

      // 2. Fallback to URL parameter
      if (!finalResult) {
        const resultParam = searchParams?.get('result')
        if (resultParam) {
          try {
            finalResult = JSON.parse(decodeURIComponent(resultParam))
          } catch (error) {
            console.error('Error parsing result parameter:', error)
          }
        }
      }

      if (finalResult) {
        setResult(finalResult)

        // Clear old format data to prevent future issues
        if (typeof window !== 'undefined') {
          try {
            const savedState = sessionStorage.getItem('mbti_quiz_state')
            if (savedState) {
              const parsedState = JSON.parse(savedState)
              if (parsedState.testResultData && parsedState.testResultData.includes('%')) {
                // This is old URL-encoded format, clear it
                sessionStorage.removeItem('mbti_quiz_state')
                console.log('Cleared old URL-encoded format data')
              }
            }
          } catch (e) {
            console.error('Error checking/clearing old format:', e)
          }
        }

        // Get analysis for the determined type
        const typeKey = finalResult.type
        const typeData = t(`mbti.types.${typeKey}`, { returnObjects: true }) as any

        if (typeData && typeData.title) {
          const score = TYPE_SCORES[typeKey] || 85

          setAnalysis({
            type: typeKey,
            title: typeData.title,
            description: typeData.description,
            strengths: typeData.strengths,
            weaknesses: typeData.weaknesses,
            careers: typeData.careers,
            workplace: typeData.workplace,
            relationships: typeData.relationships,
            aiAnalysis: {
              score: score,
              insights: typeData.aiAnalysis.insights,
              recommendations: typeData.aiAnalysis.recommendations
            }
          })
        }
        setIsLoading(false)
      } else {
        // No result found, redirect to test
        console.error('No valid result data found in sessionStorage or URL parameters')
        router.push('/mbti')
      }
    }

    loadResult()
  }, [searchParams, router, t])

  const handleRetest = () => {
    // Clear saved state to start fresh
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('mbti_quiz_state')
    }
    router.push('/mbti')
  }

  const handleShare = () => {
    if (analysis) {
      const shareText = t('mbti.resultPage.shareText', {
        type: analysis.type,
        title: analysis.title,
        description: analysis.description
      })

      if (navigator.share) {
        navigator.share({
          title: t('mbti.resultPage.share'),
          text: shareText
        })
      } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(shareText)
        setToastOpen(true)
      }
    }
  }

  if (isLoading) {
    return (
      <PageLayout themeColor={PRIMARY_COLOR} logoText={t('mbti.hero.seal')}>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <IconBrain size={64} color={PRIMARY_COLOR} className="mb-4 animate-pulse" />
          <div className={TOKENS.type.h3}>{t('mbti.resultPage.analyzing')}</div>
        </div>
      </PageLayout>
    )
  }

  if (!result || !analysis) {
    return (
      <PageLayout themeColor={PRIMARY_COLOR} logoText={t('mbti.hero.seal')}>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <div className={TOKENS.type.h3}>{t('mbti.resultPage.error.title')}</div>
          <NeoButton
            onClick={() => router.push('/mbti')}
            className="mt-4 px-6 py-2 rounded-sm font-mono uppercase tracking-wider"
          >
            {t('mbti.resultPage.error.home')}
          </NeoButton>
        </div>
      </PageLayout>
    )
  }

  return (
    <NeoToastProvider swipeDirection="right">
      <PageLayout themeColor={PRIMARY_COLOR} logoText={t('mbti.hero.seal')}>
        <div className="max-w-5xl mx-auto py-12 px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <NeoButton
              variant="ghost"
              onClick={() => router.push('/mbti')}
              className="flex items-center gap-2 px-0 py-0 h-auto hover:bg-transparent"
            >
              <IconArrowLeft size={20} />
              <span className={TOKENS.type.mono}>{t('mbti.resultPage.back')}</span>
            </NeoButton>

            <div className="flex gap-4">
              <NeoButton
                variant="outline"
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-sm"
              >
                <IconShare size={16} />
                <span className={TOKENS.type.mono}>{t('mbti.resultPage.share')}</span>
              </NeoButton>
              <NeoButton
                variant="outline"
                onClick={handleRetest}
                className="flex items-center gap-2 px-4 py-2 rounded-sm"
              >
                <IconRotateClockwise size={16} />
                <span className={TOKENS.type.mono}>{t('mbti.resultPage.retest')}</span>
              </NeoButton>
            </div>
          </div>

          {/* Main Result Card */}
          <div className="relative bg-neo-surface border border-neo-border p-8 md:p-12 text-center mb-12 overflow-hidden">
            <CornerBracket color={PRIMARY_COLOR} />

            <div className="mb-8 flex flex-col items-center">
              <PersonalityImage type={analysis.type} className="w-48 h-48 mb-8 drop-shadow-[0_0_30px_rgba(235,68,50,0.3)]" />

              <span className="inline-block bg-neo-red text-white px-6 py-2 rounded-full text-xl font-bold mb-6">
                {analysis.type}
              </span>

              <h1 className={`${TOKENS.type.hero} text-white mb-6 text-4xl md:text-7xl`}>
                {analysis.title}
              </h1>

              <p className={`${TOKENS.type.body} max-w-2xl mx-auto`}>{analysis.description}</p>
            </div>

            <Separator.Root className="h-px w-full bg-white/10 my-8" />

            <div className="flex items-center justify-center gap-4">
              <IconBrain size={24} color={PRIMARY_COLOR} />
              <span className="text-white/60">{t('mbti.resultPage.aiScore')}</span>
              <span className="text-2xl font-bold text-neo-red">{analysis.aiAnalysis.score}%</span>
            </div>
          </div>

          {/* Detailed Analysis Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Strengths */}
            <div className="bg-neo-surface border border-neo-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <IconStar size={24} color={PRIMARY_COLOR} />
                <h3 className={TOKENS.type.h3}>{t('mbti.resultPage.strengths')}</h3>
              </div>
              <ul className="space-y-3">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-white/80">
                    <span className="text-neo-red mt-1.5">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Development Areas */}
            <div className="bg-neo-surface border border-neo-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <IconChartBar size={24} color={PRIMARY_COLOR} />
                <h3 className={TOKENS.type.h3}>{t('mbti.resultPage.recommendations')}</h3>
              </div>
              <ul className="space-y-3">
                {analysis.aiAnalysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-white/80">
                    <span className="text-neo-red mt-1.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Career & Workplace */}
          <div className="bg-neo-surface border border-neo-border p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <IconBriefcase size={24} color={PRIMARY_COLOR} />
              <h3 className={TOKENS.type.h3}>{t('mbti.resultPage.career')}</h3>
            </div>

            <div className="mb-8">
              <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-sm text-white/60">
                {t('mbti.resultPage.suitableCareers')}
              </h4>
              <div className="flex flex-wrap gap-3">
                {analysis.careers.map((career, index) => (
                  <span
                    key={index}
                    className="border border-neo-red text-neo-red px-4 py-1 rounded-full text-sm font-medium uppercase"
                  >
                    {career}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2 uppercase tracking-wider text-sm text-white/60">
                {t('mbti.resultPage.workplace')}
              </h4>
              <div className={TOKENS.type.body}>{analysis.workplace}</div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-neo-surface border border-neo-border p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <IconBrain size={24} color={PRIMARY_COLOR} />
              <h3 className={TOKENS.type.h3}>{t('mbti.resultPage.aiInsights')}</h3>
            </div>

            <div className="space-y-4">
              {analysis.aiAnalysis.insights.map((insight, index) => (
                <div
                  key={index}
                  className="p-4 bg-neo-red/10 border-l-4 border-neo-red rounded-r-md"
                >
                  <div className="text-white/80 leading-relaxed">{insight}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Relationships */}
          <div className="bg-neo-surface border border-neo-border p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <IconUsers size={24} color={PRIMARY_COLOR} />
              <h3 className={TOKENS.type.h3}>{t('mbti.resultPage.relationships')}</h3>
            </div>

            <div className={TOKENS.type.body}>{analysis.relationships}</div>
          </div>

          {/* Action Buttons */}
          <div className="text-center pb-12">
            <NeoButton
              variant="primary"
              onClick={() => router.push('/mbti')}
              className="bg-neo-red text-white px-12 py-4 rounded-sm hover:bg-red-600 transition-colors font-bold uppercase tracking-widest text-lg h-auto"
            >
              {t('mbti.resultPage.error.home')}
            </NeoButton>
          </div>
        </div>
      </PageLayout>

      <NeoToast
        open={toastOpen}
        onOpenChange={setToastOpen}
        title={t('mbti.resultPage.shareTitle')}
        description={t('mbti.resultPage.shareSuccess')}
        themeColor={PRIMARY_COLOR}
      />
      <NeoToastViewport />
    </NeoToastProvider>
  )
}

export default function MBTIResultPage() {
  const { t } = useTranslation()
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neo-black flex items-center justify-center text-white">
          {t('common.loading')}
        </div>
      }
    >
      <MBTIResultContent />
    </Suspense>
  )
}
