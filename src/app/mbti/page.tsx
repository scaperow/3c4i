'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import {
  PageLayout,
  FeatureSection,
  TOKENS,
  Seal,
  CornerBracket,
  NeoButton,
  NeoSeparator,
  NeoRadioGroup,
  NeoRadioCard,
  NeoProgress,
  PALETTE
} from '@/components/NeoChinese'
import { Brain, TrendingUp, Users, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { PersonalityMarquee } from './components/PersonalityMarquee'

interface Question {
  title: string
  selections: Array<{
    text: string
    aiPrompt: string
  }>
}

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

const BackgroundDecoration = React.memo(({ themeColor }: { themeColor: string }) => {
  const particles = React.useMemo(() => {
    return ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'].map((char, i) => ({
      char,
      duration: 12 + ((i * 7) % 10),
      delay: i * 1.2,
      left: 5 + ((i * 13) % 90),
      top: 10 + ((i * 17) % 80),
      x: Math.sin(i) * 60
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-[1]">
      <div className="absolute top-1/2 right-[-15%] -translate-y-1/2 opacity-[0.08]">
        {/* Grid Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[1100px] h-[1100px]">
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
          transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
          className="w-[1100px] h-[1100px] border-[2px] border-dashed border-white rounded-full"
        >
          <div className="absolute inset-6 border border-white/20 rounded-full" />
          <div className="absolute inset-16 border border-white/20 rounded-full" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-24 w-[1300px] h-[1300px] border border-white/10 rounded-full"
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
            className="absolute text-7xl font-serif text-white"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              filter: 'blur(1.5px)',
              color: themeColor
            }}
          >
            {p.char}
          </motion.div>
        ))}
      </div>
      <div
        className="absolute top-[-10%] right-[-10%] w-[1400px] h-[1400px] blur-3xl mix-blend-screen"
        style={{
          background: `radial-gradient(circle, ${themeColor} 0%, transparent 60%)`,
          opacity: 0.1
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[1200px] h-[1200px] blur-3xl mix-blend-screen"
        style={{
          background: `radial-gradient(circle, ${themeColor} 0%, transparent 60%)`,
          opacity: 0.08
        }}
      />
    </div>
  )
})

function MBTIForm({
  themeColor,
  isTesting,
  testMode,
  onTestingChange,
  onTestModeSelect
}: {
  themeColor: string
  isTesting: boolean
  onTestingChange: (v: boolean) => void
  testMode: 'quick' | 'full' | null
  onTestModeSelect: (mode: 'quick' | 'full') => void
}) {
  const { t, i18n } = useTranslation()
  const router = useRouter()

  // Test Logic State
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isTestCompleted, setIsTestCompleted] = useState(false)
  const [testResultData, setTestResultData] = useState<string | null>(null)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)

  // Restore state from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('mbti_quiz_state')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.testMode) {
            setCurrentQuestion(parsed.currentQuestion || 0)
            setAnswers(parsed.answers || [])
            setSelectedOption(parsed.selectedOption)
            setIsTestCompleted(parsed.isTestCompleted || false)
            setTestResultData(parsed.testResultData || null)
            onTestModeSelect(parsed.testMode)
          }
        } catch (e) {
          console.error('Failed to restore quiz state', e)
        }
      }
    }
  }, [])

  // Save state to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && questions.length > 0) {
      const state = {
        testMode,
        currentQuestion,
        answers,
        selectedOption,
        isTestCompleted,
        testResultData
      }
      sessionStorage.setItem('mbti_quiz_state', JSON.stringify(state))
    }
  }, [questions, testMode, currentQuestion, answers, selectedOption, isTestCompleted, testResultData])

  // Load questions based on test mode and language
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoadingQuestions(true)
      try {
        const language = i18n.language || 'zh-CN'
        const filename = testMode === 'quick' ? 'quick-questions.json' : 'full-questions.json'
        const response = await fetch(`/mbti/${filename}`)
        const data = await response.json()

        // Map language code to file key
        const langKey = language === 'en' ? 'en' : language === 'zh-TW' ? 'zh-TW' : 'zh-CN'

        setQuestions(data[langKey] || data['zh-CN'] || [])
      } catch (error) {
        console.error('Failed to load questions:', error)
        setQuestions([])
      } finally {
        setIsLoadingQuestions(false)
      }
    }

    if (testMode) {
      loadQuestions()
    }
  }, [testMode, i18n.language])

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex

    // Auto-advance to next question or submit
    if (currentQuestion < questions.length - 1) {

      // Move to next question with a small delay for visual feedback
      setTimeout(() => {
        setAnswers(newAnswers)
        setCurrentQuestion(currentQuestion + 1)
        // Restore the selected option for the next question if it exists in answers
        if (newAnswers[currentQuestion + 1] !== undefined) {
          setSelectedOption(newAnswers[currentQuestion + 1])
        } else {
          setSelectedOption(null)
        }
      }, 300)
    } else {
      // Show completion screen instead of auto-redirect
      const scores = calculateScores(newAnswers)
      const type = determineType(scores)
      const testResult: TestResult = { type, scores, answers: newAnswers }
      // Store raw JSON string in sessionStorage, no URL encoding needed
      const resultData = JSON.stringify(testResult)
      setTimeout(() => {
        setAnswers(newAnswers)
        setTestResultData(resultData)
        setIsTestCompleted(true)
      }, 300)
    }
  }

  const calculateScores = (answers: number[]) => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    answers.forEach((answerIndex, questionIndex) => {
      if (questionIndex % 2 === 0) {
        if (answerIndex === 0) questionIndex % 4 === 0 ? scores.E++ : scores.S++
        else questionIndex % 4 === 0 ? scores.I++ : scores.N++
      } else {
        if (answerIndex === 0) questionIndex % 4 === 1 ? scores.T++ : scores.J++
        else questionIndex % 4 === 1 ? scores.F++ : scores.P++
      }
    })
    return scores
  }

  const determineType = (scores: any) => {
    return (
      (scores.E > scores.I ? 'E' : 'I') +
      (scores.S > scores.N ? 'S' : 'N') +
      (scores.T > scores.F ? 'T' : 'F') +
      (scores.J > scores.P ? 'J' : 'P')
    )
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      // Set the selected option for the next question if it exists in answers
      if (answers[currentQuestion + 1] !== undefined) {
        setSelectedOption(answers[currentQuestion + 1])
      } else {
        setSelectedOption(null)
      }
    } else {
      // Show completion screen instead of auto-redirect
      const scores = calculateScores(answers)
      const type = determineType(scores)
      const testResult: TestResult = { type, scores, answers }
      // Store raw JSON string in sessionStorage, no URL encoding needed
      const resultData = JSON.stringify(testResult)
      setTestResultData(resultData)
      setIsTestCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      // Display the previously selected answer for this question
      if (answers[currentQuestion - 1] !== undefined) {
        setSelectedOption(answers[currentQuestion - 1])
      } else {
        setSelectedOption(null)
      }
    }
  }

  const clearQuizState = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('mbti_quiz_state')
    }
    setAnswers([])
    setCurrentQuestion(0)
    setSelectedOption(null)
    setIsTestCompleted(false)
    setTestResultData(null)
  }

  const handleRestart = () => {
    if (window.confirm(t('common.restartConfirm'))) {
      clearQuizState()
    }
  }

  const handleStartTest = (mode: 'quick' | 'full') => {
    if (isTestCompleted) {
      clearQuizState()
    } else if (testMode && testMode !== mode && answers.length > 0) {
      if (window.confirm(t('common.restartConfirm'))) {
        clearQuizState()
      } else {
        return
      }
    }
    onTestModeSelect(mode)
  }

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0

  return (
    <div className="lg:col-span-6 lg:col-start-7">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...TOKENS.motion.transition, delay: 0.2 }}
      >
        <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-8 md:p-10 shadow-2xl shadow-black/40 rounded-2xl z-10 isolate min-h-[400px]">
          <CornerBracket color={themeColor} />

          {!isTesting ? (
            // Start Card Content or Test Mode Selector
            <div className="h-full flex flex-col justify-center">
              <div className="mb-8 relative">
                <div className="pb-6">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    {t('mbti.testMode.title')}
                  </h3>
                  <p className="text-xs text-white/40 font-mono uppercase tracking-wider">
                    // SELECT.TEST.MODE
                  </p>
                </div>
                <NeoSeparator className="absolute bottom-0 left-0 w-full h-px bg-white/5" />
              </div>

              <div className="space-y-4 mb-8">
                {/* Quick Test Option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartTest('quick')}
                  className="w-full p-4 bg-gradient-to-r  rounded-lg transition-all text-left bg-black/20 border-0 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">
                        {t('mbti.testMode.quick')}
                      </h4>
                      <p className="text-sm text-white/60">{t('mbti.testMode.quickDesc')}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-orange-400" />
                  </div>
                </motion.button>

                {/* Full Test Option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartTest('full')}
                  className="w-full p-4 bg-gradient-to-r  rounded-lg transition-all text-left bg-black/20 border-0 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">
                        {t('mbti.testMode.full')}
                      </h4>
                      <p className="text-sm text-white/60">{t('mbti.testMode.fullDesc')}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-orange-400" />
                  </div>
                </motion.button>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 -mx-8 md:-mx-10 px-8 md:px-10">
                <PersonalityMarquee />
              </div>
            </div>
          ) : isLoadingQuestions ? (
            // Test Loading
            <div className="h-full flex flex-col justify-center items-center">
              <div className="text-center">
                <div className="inline-block">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full mb-4"
                  />
                </div>
                <p className="text-white/60">{t('common.loading')}</p>
              </div>
            </div>
          ) : questions.length === 0 ? (
            // No questions loaded
            <div className="h-full flex flex-col justify-center items-center">
              <p className="text-white/60">{t('mbti.test.error')}</p>
            </div>
          ) : isTestCompleted && testResultData ? (
            // Completion Screen
            <div className="h-full flex flex-col justify-center items-center text-center py-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                  <div className="text-4xl text-green-400">✓</div>
                </div>
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-3">{t('mbti.testMode.testCompleted')}</h3>
              <p className="text-white/60 mb-8 max-w-sm leading-relaxed">
                {t('mbti.testMode.testCompletedDesc')}
              </p>

              <div className="flex gap-4">
                <NeoButton
                  variant="ghost"
                  onClick={() => {
                    // Do not clear state here, just hide test
                    onTestingChange(false)
                  }}
                  className="px-6 py-2 text-white/60 hover:text-white"
                >
                  {t('common.back')}
                </NeoButton>
                <NeoButton
                  onClick={() => {
                    // Pass result data in URL to ensure result page can load it
                    if (testResultData) {
                      const encodedResult = encodeURIComponent(testResultData)
                      router.push(`/mbti/result?result=${encodedResult}`)
                    } else {
                      router.push('/mbti/result')
                    }
                  }}
                  themeColor={themeColor}
                  className="px-8 py-2 font-medium"
                >
                  {t('mbti.test.viewResult')}
                </NeoButton>
              </div>
            </div>
          ) : (
            // Test Form Content
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <NeoButton
                  variant="ghost"
                  onClick={() => {
                    // Do not clear state, just go back to landing
                    onTestingChange(false)
                  }}
                  className="px-2 text-white/60 hover:text-white"
                >
                  <ArrowLeft size={16} className="mr-2" /> {t('common.back')}
                </NeoButton>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-white/60">
                    {currentQuestion + 1} / {questions.length}
                  </span>
                  <NeoButton
                    variant="ghost"
                    onClick={handleRestart}
                    className="px-2 text-white/60 hover:text-white"
                    title={t('common.restart')}
                  >
                    <RotateCcw size={16} />
                  </NeoButton>
                </div>
              </div>

              <NeoProgress value={progress} themeColor={themeColor} className="mb-8" />

              <h3 className="text-xl font-bold text-white mb-6 min-h-[3.5rem] flex items-center">
                {questions[currentQuestion]?.title}
              </h3>

              <NeoRadioGroup
                key={currentQuestion}
                value={selectedOption !== null ? String(selectedOption) : undefined}
                onValueChange={(v) => handleAnswer(parseInt(v))}
                className="flex flex-col gap-4"
              >
                {questions[currentQuestion]?.selections.map((sel, idx) => (
                  <NeoRadioCard
                    key={`${currentQuestion}-${idx}`}
                    value={String(idx)}
                    label={sel.text}
                    themeColor={themeColor}
                  />
                ))}
              </NeoRadioGroup>

              <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                <NeoButton
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`px-4 py-2 text-white transition-opacity ${currentQuestion === 0 ? 'opacity-0 pointer-events-none' : 'opacity-60 hover:opacity-100'}`}
                >
                  {t('common.prev')}
                </NeoButton>
                {/* Show "Next" button when browsing previous answers or when current question is answered */}
                {answers[currentQuestion] !== undefined && (
                  <NeoButton
                    onClick={handleNext}
                    themeColor={themeColor}
                    className="px-8 py-2 font-medium transition-all hover:brightness-110"
                  >
                    {currentQuestion === questions.length - 1
                      ? t('common.submit')
                      : t('common.next')}
                  </NeoButton>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export default function MBTIPage() {
  const { t } = useTranslation()

  // Dynamic theme color state
  const [themeColor, setThemeColor] = useState(PALETTE.black)
  const [isTesting, setIsTesting] = useState(false)
  const [testMode, setTestMode] = useState<'quick' | 'full' | null>(null)
  const hueRef = useRef(210) // Start at blue (approximate)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    // Stop animation if testing
    if (isTesting) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const animate = () => {
      // Increment hue. Speed depends on frame rate.
      // 0.2 degrees per frame ~ 12 degrees per second -> 30 seconds for full cycle.
      hueRef.current = (hueRef.current + 0.2) % 360
      setThemeColor(hslToHex(hueRef.current, 70, 50)) // 70% Saturation, 50% Lightness matches standard vivid colors
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isTesting])

  const features = [
    {
      title: t('mbti.features.scientific.title'),
      desc: t('mbti.features.scientific.desc'),
      icon: Brain
    },
    {
      title: t('mbti.features.analysis.title'),
      desc: t('mbti.features.analysis.desc'),
      icon: TrendingUp
    },
    {
      title: t('mbti.features.career.title'),
      desc: t('mbti.features.career.desc'),
      icon: Users
    }
  ]

  return (
    <PageLayout themeColor={themeColor} logoText={t('mbti.hero.seal')}>
      <Suspense fallback={<div className="min-h-screen bg-neo-black">{t('common.loading')}</div>}>
        <section className="relative min-h-[80vh] flex flex-col justify-center mb-24 pt-12">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column (Hero) */}
            <motion.div
              initial={TOKENS.motion.initial}
              animate={TOKENS.motion.animate}
              transition={TOKENS.motion.transition}
              className="lg:col-span-5"
            >
              <div className="flex items-center gap-4 mb-8">
                <Seal
                  text={t('mbti.hero.seal')}
                  color={themeColor}
                  className="w-12 h-12 md:w-16 md:h-16 text-2xl md:text-3xl"
                />
                <NeoSeparator className="h-px w-20" themeColor={themeColor} />
                <span className={`${TOKENS.type.mono} text-white/60`}>
                  {t('mbti.hero.subtitle')}
                </span>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`${TOKENS.type.hero} mb-8 text-white tracking-wide drop-shadow-2xl font-chinese`}
              >
                {t('mbti.hero.title1')}
                <br />
                <span
                  style={{
                    color: themeColor,
                    textShadow: `0 0 20px ${themeColor}80, 0 0 40px ${themeColor}40`
                  }}
                  className="relative inline-block"
                >
                  {t('mbti.hero.title2')}
                </span>
              </motion.h1>
              <p className={`${TOKENS.type.body} mb-12 whitespace-pre-line text-white/60`}>
                {t('mbti.hero.desc')}
              </p>
            </motion.div>

            {/* Right Column (Dynamic) */}
            <MBTIForm
              themeColor={themeColor}
              isTesting={isTesting}
              onTestingChange={setIsTesting}
              testMode={testMode}
              onTestModeSelect={(mode) => {
                setTestMode(mode)
                setIsTesting(true)
              }}
            />
          </div>
        </section>

        <FeatureSection
          title={t('mbti.features.sectionTitle')}
          subtitle={t('mbti.features.sectionSubtitle')}
          themeColor={themeColor}
          features={features}
        />
      </Suspense>
    </PageLayout>
  )
}
