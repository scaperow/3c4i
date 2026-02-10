'use client'

import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  PageLayout,
  TOKENS,
  Seal,
  CornerBracket,
  NeoButton,
  NeoToast,
  NeoToastProvider,
  NeoToastViewport,
  NeoScrollArea,
  PALETTE
} from '@/components/NeoChinese'
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Sparkles,
  Heart,
  X,
  Image,
  FileText,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { generateNamesAction, type NameResult, type GenerationAnalysis } from '../actions'
import { NameConfigPanel, type NameConfigValues } from '../components/NameConfigPanel'
import * as Separator from '@radix-ui/react-separator'
import * as Dialog from '@radix-ui/react-dialog'

// 收藏数据的 localStorage key 生成
const generateStorageKey = (surname: string, gender: string) => {
  return `ainame_favorites_${surname}_${gender}`
}

const PDF_THEME = {
  text: '#555555',
  subtext: '#999999',
  bg: '#f8f8f8',
  border: '#dddddd'
}

// 格式化分析文本，高亮重要内容
const formatAnalysisText = (text: string) => {
  if (!text) return null

  // 使用不同的替换对象来避免HTML字符串问题
  const parseFormattedText = (str: string) => {
    const parts: (string | React.ReactNode)[] = []
    let remaining = str

    const patterns = [
      {
        regex: /^(金|木|水|火|土)/,
        render: (match: string) => <span className="text-orange-400 font-bold">{match}</span>
      },
      {
        regex: /^「([^」]+)」/,
        render: (match: string, content: string) => (
          <span className="text-orange-300 font-semibold">{match}</span>
        )
      },
      {
        regex: /^【([^】]+)】/,
        render: (match: string) => (
          <span className="bg-orange-500/20 text-orange-300 px-1.5 py-0.5">{match}</span>
        )
      },
      {
        regex: /^"([^"]+)"/,
        render: (match: string) => <span className="text-white/90 italic">{match}</span>
      }
    ]

    while (remaining.length > 0) {
      let matched = false

      for (const pattern of patterns) {
        const match = remaining.match(pattern.regex)
        if (match) {
          parts.push(pattern.render(match[0], match[1] || ''))
          remaining = remaining.slice(match[0].length)
          matched = true
          break
        }
      }

      if (!matched) {
        const nextSpecial = remaining.search(/金|木|水|火|土|「|【|"/)
        if (nextSpecial === -1) {
          parts.push(remaining)
          break
        } else {
          parts.push(remaining.slice(0, nextSpecial))
          remaining = remaining.slice(nextSpecial)
        }
      }
    }

    return parts
  }

  const sentences = text.split(/[。；]/).filter((s) => s.trim())

  return (
    <div className="space-y-2">
      {sentences.map((sentence, idx) => (
        <div key={idx} className="flex items-start gap-2">
          <span className="mt-2 w-1 h-1 bg-orange-500/60 flex-shrink-0" />
          <div className="text-white/80 leading-relaxed">
            {parseFormattedText(sentence.trim())}
            {idx < sentences.length - 1 && '。'}
          </div>
        </div>
      ))}
    </div>
  )
}

// 名字卡片组件
const NameCard = ({
  fullName,
  givenName,
  pinyin,
  meaning,
  charAnalysis,
  origin,
  index,
  themeColor,
  isFavorited,
  onToggleFavorite
}: NameResult & {
  index: number
  themeColor: string
  isFavorited: boolean
  onToggleFavorite: () => void
}) => {
  const { t } = useTranslation()
  const displayName = fullName || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.5) + 0.2, duration: 0.4 }}
      className="group relative h-full"
    >
      <div className="h-full relative bg-gradient-to-br from-white/8 via-white/4 to-white/2 backdrop-blur-xl border border-white/10 -2xl p-6 transition-all duration-500 hover:border-orange-500/30 hover:bg-white/10 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-orange-500/10">
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        <CornerBracket color={themeColor} />

        {/* 收藏按钮 */}
        <NeoButton
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite()
          }}
          className={`absolute top-4 right-4 p-2  transition-all duration-300 ${
            isFavorited
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/60'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
        </NeoButton>

        {/* Name */}
        <div className="mb-6 mt-2 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 blur-2xl bg-orange-500/10  scale-150" />
            <h3 className="relative text-4xl md:text-5xl font-serif text-white mb-2 tracking-widest drop-shadow-lg">
              {displayName}
            </h3>
          </div>
          {pinyin && (
            <p className="text-white/50 text-sm font-mono mb-2 tracking-wider">{pinyin}</p>
          )}
          <Separator.Root
            className="w-10 h-0.5 mx-auto  shadow-lg shadow-orange-500/30"
            style={{ backgroundColor: themeColor }}
          />
        </div>

        {/* Meaning */}
        <p
          className="text-white/60 leading-relaxed text-sm mb-4 text-center line-clamp-3"
          dangerouslySetInnerHTML={{ __html: meaning }}
        ></p>

        {/* Action */}
        <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <NeoButton
                variant="ghost"
                className="flex items-center gap-2 px-0 py-0 h-auto hover:bg-transparent text-sm"
                style={{ color: themeColor }}
              >
                {t('ainame.result.details')} <ArrowLeft className="w-3 h-3 rotate-180" />
              </NeoButton>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/20 bg-gradient-to-br from-zinc-900/95 via-zinc-900/90 to-zinc-800/90 backdrop-blur-xl -2xl p-6 shadow-2xl shadow-black/50 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg font-bold text-white flex items-center gap-2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-orange-500/30 blur-lg " />
                        <Seal text="名" color={themeColor} className="relative w-8 h-8 text-xs" />
                      </div>
                      {t('ainame.result.detailsTitle', { name: displayName })}
                    </Dialog.Title>
                    <Dialog.Close className="text-white/50 hover:text-white transition-colors p-1 hover:bg-white/10 ">
                      <X className="w-5 h-5" />
                    </Dialog.Close>
                  </div>

                  <Separator.Root className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <div className="py-4 text-center">
                    <div className="relative inline-block mb-2">
                      <div className="absolute inset-0 blur-2xl bg-orange-500/15  scale-150" />
                      <h2 className="relative text-5xl font-serif text-white drop-shadow-lg">
                        {displayName}
                      </h2>
                    </div>
                    {pinyin && (
                      <p className="text-white/50 text-sm font-mono mb-4 tracking-wider">
                        {pinyin}
                      </p>
                    )}

                    {charAnalysis && charAnalysis.length > 0 && (
                      <div className="mb-6 flex justify-center gap-3">
                        {charAnalysis.map((ca, idx) => (
                          <div
                            key={idx}
                            className="text-center px-4 py-3 bg-gradient-to-br from-white/8 to-white/4  border border-white/15 hover:border-orange-500/30 transition-colors"
                          >
                            <div className="text-2xl font-serif text-white mb-1">{ca.char}</div>
                            <div className="text-xs text-orange-400 font-mono font-bold">
                              {ca.wuxing}
                            </div>
                            <div className="text-xs text-white/60 mt-1">{ca.meaning}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-left bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-sm  p-5 border border-white/15">
                      <h4 className="text-xs font-mono text-orange-400/80 uppercase mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 " />
                        {t('ainame.result.meaningAnalysis')}
                      </h4>
                      <NeoScrollArea
                        className="h-[180px] w-full pr-4"
                        type="hover"
                        viewportClassName="w-full h-full"
                      >
                        <p className="text-white/80 leading-relaxed text-sm whitespace-pre-line mb-4">
                          {meaning}
                        </p>
                        {origin && (
                          <div className="pt-4 border-t border-white/15">
                            <h5 className="text-xs font-mono text-orange-400/80 uppercase mb-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-orange-500 " />
                              {t('ainame.result.origin')}
                            </h5>
                            <p className="text-white/70 text-sm italic">{origin}</p>
                          </div>
                        )}
                      </NeoScrollArea>
                    </div>
                  </div>

                  <Separator.Root className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                  <div className="flex justify-between gap-3 pt-2">
                    <button
                      onClick={onToggleFavorite}
                      className={`flex items-center gap-2 px-4 py-2  transition-all ${
                        isFavorited
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                      {isFavorited ? t('ainame.result.favorited') : t('ainame.result.fav')}
                    </button>
                    <Dialog.Close asChild>
                      <NeoButton
                        variant="secondary"
                        className="px-5 py-2.5 hover:bg-white/10 transition-colors"
                      >
                        {t('common.close')}
                      </NeoButton>
                    </Dialog.Close>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </motion.div>
  )
}

// 收藏面板组件
const FavoritesPanel = ({
  favorites,
  onRemove,
  onClear,
  onSaveImage,
  onSavePDF,
  isExpanded,
  onToggleExpand
}: {
  favorites: NameResult[]
  onRemove: (fullName: string) => void
  onClear: () => void
  onSaveImage: () => void
  onSavePDF: () => void
  isExpanded: boolean
  onToggleExpand: () => void
}) => {
  const { t } = useTranslation()
  const favoritesRef = useRef<HTMLDivElement>(null)

  if (favorites.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-[9999]"
    >
      <div className="bg-gradient-to-br from-zinc-900/95 via-zinc-900/90 to-zinc-800/90 backdrop-blur-xl border border-orange-500/30 -2xl shadow-2xl shadow-black/50 overflow-hidden">
        <button
          onClick={onToggleExpand}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 ">
              <Heart className="w-4 h-4 text-red-400 fill-current" />
            </div>
            <span className="text-white font-bold">{t('ainame.result.myFavorites')}</span>
            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs  font-mono">
              {favorites.length}
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-white/50" />
          ) : (
            <ChevronUp className="w-5 h-5 text-white/50" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div ref={favoritesRef} className="p-4 pt-0 max-w-md">
                <div className="grid grid-cols-2 gap-2 mb-4 max-h-[200px] overflow-y-auto">
                  {favorites.map((name) => (
                    <div
                      key={name.fullName}
                      className="relative group flex items-center justify-between p-3 bg-white/5 hover:bg-white/10  border border-white/10 transition-colors"
                    >
                      <div>
                        <div className="text-lg font-serif text-white">{name.fullName}</div>
                        <div className="text-xs text-white/40 font-mono">{name.pinyin}</div>
                      </div>
                      <button
                        onClick={() => onRemove(name.fullName)}
                        className="opacity-0 group-hover:opacity-100 p-1  hover:bg-red-500/20 transition-all"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-3 border-t border-white/10">
                  <button
                    onClick={onSaveImage}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400  transition-colors text-sm"
                  >
                    <Image className="w-4 h-4" />
                    {t('ainame.result.saveImage')}
                  </button>
                  <button
                    onClick={onSavePDF}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400  transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    {t('ainame.result.savePdf')}
                  </button>
                  <button
                    onClick={onClear}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400  transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function ResultContent() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const themeColor = PALETTE.orange

  const surname = searchParams?.get('surname') || ''
  const gender = searchParams?.get('gender') || 'boy'
  const birthDateParam = searchParams?.get('birthDate') || ''
  const birthTimeParam = searchParams?.get('birthTime') || ''
  const nameStructure = searchParams?.get('nameStructure') || undefined
  const styleParam = searchParams?.get('style') || undefined
  const balanceParam = searchParams?.get('balance') || 'auto'
  const otherConfigParam = searchParams?.get('otherConfig') || ''

  const [names, setNames] = useState<NameResult[]>([])
  const [analysis, setAnalysis] = useState<GenerationAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<NameResult[]>([])
  const [favoritesExpanded, setFavoritesExpanded] = useState(true)

  const [selectedStyle, setSelectedStyle] = useState(styleParam || '')
  const [selectedBalance, setSelectedBalance] = useState(balanceParam)
  const [otherConfig, setOtherConfig] = useState(otherConfigParam)
  const [birthDate, setBirthDate] = useState(birthDateParam)
  const [birthTime, setBirthTime] = useState(birthTimeParam)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const storageKey = generateStorageKey(surname, gender)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        setFavorites(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load favorites:', e)
    }
  }, [storageKey])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(favorites))
    } catch (e) {
      console.error('Failed to save favorites:', e)
    }
  }, [favorites, storageKey])

  const toggleFavorite = useCallback((name: NameResult) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.fullName === name.fullName)
      if (exists) {
        return prev.filter((f) => f.fullName !== name.fullName)
      } else {
        return [...prev, name]
      }
    })
  }, [])

  const removeFavorite = useCallback((fullName: string) => {
    setFavorites((prev) => prev.filter((f) => f.fullName !== fullName))
  }, [])

  const clearFavorites = useCallback(() => {
    setFavorites([])
    setToastMessage(t('ainame.result.clearedFavorites'))
    setToastOpen(true)
  }, [t])

  const saveAsImage = useCallback(async () => {
    if (favorites.length === 0) return

    try {
      const html2canvas = (await import('html2canvas')).default

      const tempDiv = document.createElement('div')
      tempDiv.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        background: ${PALETTE.black};
        padding: 40px;
        min-width: 600px;
        font-family: "Noto Serif SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", serif;
      `

      tempDiv.innerHTML = `
        <div style="color: white;">
          <h1 style="font-size: 24px; margin-bottom: 8px; color: ${PALETTE.orange}; font-family: inherit;">${t('ainame.result.pdfTitle')}</h1>
          <p style="font-size: 14px; color: ${PALETTE.subtext}; margin-bottom: 24px; font-family: inherit;">${t('ainame.result.pdfSubtitle', { surname })}</p>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
            ${favorites
              .map(
                (n) => `
              <div style="background: rgba(255,255,255,0.05); padding: 20px; border: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 28px; margin-bottom: 8px; font-family: inherit;">${n.fullName}</div>
                <div style="font-size: 12px; color: ${PALETTE.subtext}; margin-bottom: 8px; font-family: monospace;">${n.pinyin}</div>
                <div style="font-size: 13px; color: ${PALETTE.grayLight}; line-height: 1.5; font-family: inherit;">${n.meaning?.replace(/<[^>]*>/g, '')}</div>
              </div>
            `
              )
              .join('')}
          </div>
          <p style="font-size: 11px; color: ${PALETTE.gray}; margin-top: 24px; text-align: center; font-family: inherit;">${t('common.generatedBy')}</p>
        </div>
      `

      document.body.appendChild(tempDiv)

      // Wait for fonts to load
      await document.fonts.ready

      const canvas = await html2canvas(tempDiv, {
        backgroundColor: PALETTE.black,
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        onclone: (clonedDoc: Document) => {
          const clonedDiv = clonedDoc.body.querySelector('div')
          if (clonedDiv) {
            clonedDiv.style.fontFamily =
              '"Noto Serif SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", serif'
          }
        }
      } as any)

      document.body.removeChild(tempDiv)

      const link = document.createElement('a')
      link.download = `${surname}_names_${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()

      setToastMessage(t('ainame.result.imageSaved'))
      setToastOpen(true)
    } catch (e) {
      console.error('Failed to save image:', e)
      setToastMessage(t('ainame.result.imageSaveFailed') + ': ' + (e instanceof Error ? e.message : t('common.unknownError')))
      setToastOpen(true)
    }
  }, [favorites, surname])

  const saveAsPDF = useCallback(async () => {
    if (favorites.length === 0) return

    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      // Create a styled HTML element for rendering
      const tempDiv = document.createElement('div')
      tempDiv.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        background: ${PALETTE.white};
        padding: 40px;
        width: 595px;
        font-family: "Noto Serif SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", serif;
      `

      tempDiv.innerHTML = `
        <div style="font-family: 'Noto Serif SC', serif; color: ${PDF_THEME.text}; line-height: 1.6;">
          <h1 style="font-size: 28px; margin-bottom: 8px; color: ${PALETTE.orange}; text-align: center;">${t('ainame.result.pdfTitle')}</h1>
          <p style="font-size: 12px; color: ${PDF_THEME.subtext}; margin-top: 8px;">${gender === 'boy' ? t('ainame.result.boyBaby') : t('ainame.result.girlBaby')} · ${t('ainame.result.countNames', { count: favorites.length })}</p>
          <div style="margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            ${favorites
              .map(
                (n) => `
              <div style="background: ${PDF_THEME.bg}; padding: 20px; border-left: 4px solid ${PALETTE.orange};">
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 4px;">${n.fullName}</div>
                <div style="font-size: 14px; color: ${PDF_THEME.subtext}; margin-bottom: 12px; font-family: monospace;">${n.pinyin}</div>
                <div style="margin-bottom: 12px;">
                  ${
                    n.charAnalysis
                      ? n.charAnalysis
                          .map(
                            (c) =>
                              `<span style="display: inline-block; margin-right: 8px; font-size: 12px;"><span style="color: ${PALETTE.orange}; font-weight: bold;">${c.char}</span> [${c.wuxing}]</span>`
                          )
                          .join('')
                      : ''
                  }
                </div>
                <div style="font-size: 13px; color: ${PDF_THEME.text}; line-height: 1.8; font-family: inherit;">${n.meaning?.replace(/<[^>]*>/g, '')}</div>
              </div>
            `
              )
              .join('')}
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid ${PDF_THEME.border}; text-align: center;">
            <p style="font-size: 10px; color: ${PDF_THEME.subtext};">${t('common.generatedBy')} · ${new Date().toLocaleDateString('zh-CN')}</p>
          </div>
        </div>
      `

      document.body.appendChild(tempDiv)

      // Wait for fonts to load
      await document.fonts.ready

      const canvas = await html2canvas(tempDiv, {
        backgroundColor: PALETTE.white,
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true
      } as any)

      document.body.removeChild(tempDiv)

      // Create PDF from canvas
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      // Handle multiple pages if content is long
      const pageHeight = (pdfHeight * imgWidth) / pdfWidth
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', imgX, position * ratio, imgWidth * ratio, imgHeight * ratio)
        heightLeft -= pageHeight
      }

      pdf.save(`${surname}_names_${Date.now()}.pdf`)

      setToastMessage(t('ainame.result.pdfSaved'))
      setToastOpen(true)
    } catch (e) {
      console.error('Failed to save PDF:', e)
      setToastMessage(t('ainame.result.pdfSaveFailed') + ': ' + (e instanceof Error ? e.message : t('common.unknownError')))
      setToastOpen(true)
    }
  }, [favorites, surname, gender])

  const handleConfigChange = (key: keyof NameConfigValues, value: string) => {
    switch (key) {
      case 'birthDate':
        setBirthDate(value)
        break
      case 'birthTime':
        setBirthTime(value)
        break
      case 'style':
        setSelectedStyle(value)
        break
      case 'balance':
        setSelectedBalance(value)
        break
      case 'otherConfig':
        setOtherConfig(value)
        break
    }
  }

  const handleRegenerate = async () => {
    setLoading(true)
    try {
      const response = await generateNamesAction({
        surname: surname || '李',
        gender,
        nameStructure,
        birthDate: birthDate || undefined,
        birthTime: birthTime || undefined,
        style: selectedStyle || undefined,
        balance: selectedBalance,
        otherConfig: otherConfig || undefined
      })
      setNames(response.names)
      setAnalysis(response.analysis)
    } catch (error) {
      console.error('Failed to regenerate names:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchNames = async () => {
      setLoading(true)
      try {
        const response = await generateNamesAction({
          surname: surname || '李',
          gender,
          nameStructure,
          birthDate: birthDateParam || undefined,
          birthTime: birthTimeParam || undefined,
          style: styleParam || undefined,
          balance: balanceParam,
          otherConfig: otherConfigParam || undefined
        })
        setNames(response.names)
        setAnalysis(response.analysis)
      } catch (error) {
        console.error('Failed to generate names:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNames()
  }, [
    surname,
    gender,
    nameStructure,
    birthDateParam,
    birthTimeParam,
    styleParam,
    balanceParam,
    otherConfigParam
  ])

  const BackgroundDecoration = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-[0]">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px]"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(234,88,12,0.15) 0%, transparent 60%)'
        }}
      />

      <div className="absolute top-[10%] left-[-5%] opacity-[0.03]">
        <div className="text-[24rem] font-calligraphy text-white leading-none rotate-12">名</div>
      </div>

      <div className="absolute bottom-[5%] right-[-5%] opacity-[0.03]">
        <div className="text-[20rem] font-calligraphy text-white leading-none -rotate-12">運</div>
      </div>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 60%)' }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-[400px]"
        style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 100%)'
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1  bg-orange-500/30"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3
          }}
        />
      ))}
    </div>
  )

  return (
    <NeoToastProvider swipeDirection="right">
      <PageLayout themeColor={themeColor} logoText={t('ainame.hero.seal')}>
        <BackgroundDecoration />

        <div className="relative z-10 pt-12 pb-24">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.div
              initial={TOKENS.motion.initial}
              animate={TOKENS.motion.animate}
              transition={TOKENS.motion.transition}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/30 blur-xl scale-150" />
                  <Seal
                    text={t('ainame.hero.seal')}
                    color={themeColor}
                    className="relative w-14 h-14"
                  />
                </div>
                <Separator.Root className="h-px w-20 bg-gradient-to-r from-orange-500/50 to-transparent" />
                <span className={`${TOKENS.type.mono} opacity-80`} style={{ color: themeColor }}>
                  {t('ainame.result.aiGeneratedResults')}
                </span>
              </div>

              <h1 className={`${TOKENS.type.h2} text-white mb-6 drop-shadow-lg`}>
                {t('ainame.result.title')}
              </h1>

              <p className={`${TOKENS.type.body} max-w-2xl mx-auto text-white/60`}>
                {t('ainame.result.subtitle', {
                  surname: surname || '...',
                  gender:
                    gender === 'boy' ? t('ainame.form.gender.boy') : t('ainame.form.gender.girl')
                })}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 relative z-20"
            >
              <div className="p-1 from-orange-500/20 via-white/5 to-orange-500/20">
                <NameConfigPanel
                  values={{
                    birthDate,
                    birthTime,
                    style: selectedStyle,
                    balance: selectedBalance,
                    otherConfig
                  }}
                  onChange={handleConfigChange}
                  themeColor={PALETTE.orange}
                >
                  <div className="flex gap-3">
                    <NeoButton
                      onClick={handleRegenerate}
                      disabled={loading}
                      themeColor={PALETTE.orange}
                      className="flex items-center gap-2 px-6 py-2.5 font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      {t('ainame.result.regenerate')}
                    </NeoButton>
                  </div>
                </NameConfigPanel>
              </div>
            </motion.div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-4" />
              <p className="text-white/60 font-mono tracking-widest">{t('common.processing')}...</p>
            </div>
          ) : (
            <>
              {analysis && (analysis.bazi_analysis || analysis.wuxing_suggestion) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-12 p-6 md:p-8 rounded-xl bg-gradient-to-br from-orange-500/10 via-white/5 to-transparent backdrop-blur-lg border border-orange-500/20 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 blur-2xl" />

                  <div className="relative flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-500/20 ">
                      <Sparkles className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{t('ainame.result.analysisTitle')}</h3>
                      <p className="text-white/40 text-xs font-mono">{t('ainame.result.destinyAnalysis')}</p>
                    </div>
                  </div>
                  <div className="relative rounded-xl grid md:grid-cols-2 gap-4 text-sm">
                    {analysis.surname_info && (
                      <div className="p-4 bg-white/5 hover:bg-white/8  border border-white/5 transition-colors">
                        <h4 className="text-xs text-orange-400/80 font-mono uppercase mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-orange-500 " />
                          {t('ainame.result.tabs.surname')}
                        </h4>
                        {formatAnalysisText(analysis.surname_info)}
                      </div>
                    )}
                    {analysis.bazi_analysis && (
                      <div className="p-4 bg-white/5 hover:bg-white/8  border border-white/5 transition-colors">
                        <h4 className="text-xs text-orange-400/80 font-mono uppercase mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-orange-500 " />
                          {t('ainame.result.tabs.bazi')}
                        </h4>
                        {formatAnalysisText(analysis.bazi_analysis)}
                      </div>
                    )}
                    {analysis.wuxing_summary && (
                      <div className="p-4 bg-white/5 hover:bg-white/8  border border-white/5 transition-colors">
                        <h4 className="text-xs text-orange-400/80 font-mono uppercase mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-orange-500 " />
                          {t('ainame.result.tabs.wuxing')}
                        </h4>
                        {formatAnalysisText(analysis.wuxing_summary)}
                      </div>
                    )}
                    {analysis.wuxing_suggestion && (
                      <div className="p-4 bg-white/5 hover:bg-white/8  border border-white/5 transition-colors">
                        <h4 className="text-xs text-orange-400/80 font-mono uppercase mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-orange-500 " />
                          {t('ainame.result.tabs.advice')}
                        </h4>
                        {formatAnalysisText(analysis.wuxing_suggestion)}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="flex items-center gap-4 mb-6 px-4 md:px-0">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="text-white/40 text-sm font-mono uppercase tracking-widest">
                  {t('ainame.result.recommendedNames')} · {names.length}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
                {names.map((n, i) => (
                  <NameCard
                    key={n.fullName + i}
                    {...n}
                    index={i}
                    themeColor={themeColor}
                    isFavorited={favorites.some((f) => f.fullName === n.fullName)}
                    onToggleFavorite={() => toggleFavorite(n)}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 text-center"
              >
                <p className="text-white/40 text-sm mb-4">{t('ainame.result.unsatisfied')}</p>
                <NeoButton
                  onClick={handleRegenerate}
                  disabled={loading}
                  variant="outline"
                  className="flex items-center gap-2 mx-auto px-8 py-3"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {t('ainame.result.regenerateBatch')}
                </NeoButton>
              </motion.div>
            </>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-16 flex justify-center gap-6"
          >
            <NeoButton
              variant="outline"
              onClick={() => router.push('/ainame')}
              className="flex items-center gap-2 px-8 py-4 text-sm font-bold"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t('common.back')}
            </NeoButton>

            <NeoButton
              onClick={() => {
                if (favorites.length > 0) {
                  setFavoritesExpanded(true)
                } else {
                  setToastMessage(t('ainame.result.pleaseFavorite'))
                  setToastOpen(true)
                }
              }}
              themeColor={themeColor}
              className="flex items-center gap-2 px-8 py-4 text-sm font-bold"
            >
              <Heart className="w-4 h-4" />
              {t('ainame.result.viewFavorites')} ({favorites.length})
            </NeoButton>
          </motion.div>
        </div>

        <FavoritesPanel
          favorites={favorites}
          onRemove={removeFavorite}
          onClear={clearFavorites}
          onSaveImage={saveAsImage}
          onSavePDF={saveAsPDF}
          isExpanded={favoritesExpanded}
          onToggleExpand={() => setFavoritesExpanded(!favoritesExpanded)}
        />
      </PageLayout>

      <NeoToast
        open={toastOpen}
        onOpenChange={setToastOpen}
        title={t('common.tip')}
        description={toastMessage}
        themeColor={themeColor}
      />
      <NeoToastViewport />
    </NeoToastProvider>
  )
}

export default function AINameResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neo-black" />}>
      <ResultContent />
    </Suspense>
  )
}
