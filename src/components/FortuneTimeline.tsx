import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Calendar, Clock, Sun, Moon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { TOKENS, CornerBracket } from './NeoChinese'
import { BaziCalculator } from '../lib/bazi-calculator'
import * as Separator from '@radix-ui/react-separator'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import * as RadioGroup from '@radix-ui/react-radio-group'

const TimelineScrollArea = ({ children }: { children: React.ReactNode }) => (
  <ScrollArea.Root className="w-full overflow-hidden rounded-md" type="hover">
    <ScrollArea.Viewport className="w-full pb-3">
      <div className="flex flex-row gap-2 min-w-max px-1">{children}</div>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar
      orientation="horizontal"
      className="flex select-none touch-none p-0.5 bg-white/5 transition-colors duration-[160ms] ease-out hover:bg-white/10 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col rounded-full mb-1"
    >
      <ScrollArea.Thumb className="flex-1 bg-white/20 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
)

interface FortuneTimelineProps {
  calculator: BaziCalculator
  dayun: Array<{
    age: number
    tiangan: string
    dizhi: string
    wuxing: string
    shishen: string
    nayin: string
    zhangsheng: string
  }>
  liunianFull: Array<{
    year: number
    tiangan: string
    dizhi: string
    wuxing: string
    shishen: string
    nayin: string
    zhangsheng: string
  }>
}

export const FortuneTimeline: React.FC<FortuneTimelineProps> = ({
  calculator,
  dayun,
  liunianFull
}) => {
  const { t } = useTranslation()
  const [selectedDayunIndex, setSelectedDayunIndex] = useState<number | null>(null)
  const [selectedLiunianYear, setSelectedLiunianYear] = useState<number | null>(null)
  const [selectedLiuyueIndex, setSelectedLiuyueIndex] = useState<number | null>(null)
  const [selectedLiuriIndex, setSelectedLiuriIndex] = useState<number | null>(null)

  const [liuyueList, setLiuyueList] = useState<any[]>([])
  const [liuriList, setLiuriList] = useState<any[]>([])
  const [liushiList, setLiushiList] = useState<any[]>([])

  const birthYear = calculator.getBirthYear()

  // Helper for translating terms
  const tr = (category: string, value: string) => {
    if (!value || value === '-') return '-'
    const key = `bazi.terms.${category}.${value}`
    const translated = t(key)
    return translated !== key ? translated : value
  }

  // Helper to get years for a specific Dayun
  const getDayunYears = (dayunIndex: number) => {
    const startAge = dayun[dayunIndex].age
    const startYear = birthYear + startAge
    // Filter 10 years from the full liunian list
    return liunianFull.filter((ln) => ln.year >= startYear && ln.year < startYear + 10)
  }

  // Handle Dayun Selection
  const handleDayunClick = (index: number) => {
    if (selectedDayunIndex === index) {
      // Deselect if clicking same
      // setSelectedDayunIndex(null)
      // Actually better to keep it open or allow switching
      return
    }
    setSelectedDayunIndex(index)
    setSelectedLiunianYear(null)
    setSelectedLiuyueIndex(null)
    setSelectedLiuriIndex(null)
    setLiuyueList([])
    setLiuriList([])
    setLiushiList([])
  }

  // Handle Liunian Selection
  const handleLiunianClick = (year: number) => {
    if (selectedLiunianYear === year) return
    setSelectedLiunianYear(year)
    setSelectedLiuyueIndex(null)
    setSelectedLiuriIndex(null)
    setLiuriList([])
    setLiushiList([])

    // Generate Liuyue
    const months = calculator.getLiuYue(year)
    setLiuyueList(months)
  }

  // Handle Liuyue Selection
  const handleLiuyueClick = (monthIndex: number, year: number) => {
    if (selectedLiuyueIndex === monthIndex) return
    setSelectedLiuyueIndex(monthIndex)
    setSelectedLiuriIndex(null)
    setLiushiList([])

    // Generate Liuri
    // Note: getLiuRi takes year and monthIndex (1-12)
    // The monthIndex from the list is 1-12 or 13?
    // Let's check getLiuYue return: month is 1..12
    // getLiuRi takes (year, monthIndex). monthIndex corresponds to term index or month number?
    // In bazi-calculator.ts:
    // getLiuRi(year, monthIndex)
    // if (monthIndex === 10) ... Zi Month
    // if (monthIndex === 11) ... Chou Month
    // wait, getLiuYue returns month: i+1.
    // getLiuYue loop: termIndices = [2, 4... 22].
    // i=0 -> month=1 (Yin, term 2)
    // i=9 -> month=10 (Hai, term 20)
    // i=10 -> month=11 (Zi, term 22)
    // last one: month=12 (Chou, term 0 next year)
    // But getLiuRi implementation:
    // if monthIndex === 10 (Zi)
    // if monthIndex === 11 (Chou)
    // else startTerm = monthIndex * 2 + 2
    // This logic seems based on 0-indexed month?
    // If input is 1 (Yin), startTerm = 1*2+2 = 4 (Mao?) No.
    // Yin is term 2.
    // If monthIndex is 0 (Yin): startTerm = 0*2+2 = 2. Correct.
    // So getLiuRi expects 0-indexed month (0=Yin, 1=Mao ... 10=Zi, 11=Chou).
    // But getLiuYue returns month 1..12.
    // So pass month - 1.

    // Wait, let's double check getLiuRi logic in bazi-calculator.ts
    // monthIndex 10 -> Zi -> Term 22. Correct (10*2+2 = 22).
    // monthIndex 11 -> Chou -> Term 0 next year.
    // else -> monthIndex * 2 + 2.
    // So 0 -> Term 2 (Yin). Correct.
    // So getLiuRi expects 0..11.
    // getLiuYue returns 1..12.
    // So pass month.month - 1.

    const months = liuyueList
    const selectedMonth = months.find((m) => m.month === monthIndex)
    if (selectedMonth) {
      // Check if this month crosses year boundary (e.g. Chou month is partly next year)
      // But getLiuRi handles the year boundary logic internally based on monthIndex.
      // However, for Chou month (12), getLiuRi expects 11.
      // And it uses year+1 for calculations.
      // So we just pass the base year of the Liunian.

      const data = calculator.getLiuRi(year, monthIndex - 1)
      setLiuriList(data)
    }
  }

  // Handle Liuri Selection
  const handleLiuriClick = (dayIndex: number, dayStem: string) => {
    if (selectedLiuriIndex === dayIndex) return
    setSelectedLiuriIndex(dayIndex)

    // Generate Liushi
    const hours = calculator.getLiuShi(dayStem)
    setLiushiList(hours)
  }

  const ColumnHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
    <div className="flex items-center gap-2 mb-4 text-white/40 text-sm font-medium uppercase tracking-wider">
      <Icon className="w-4 h-4" />
      {title}
    </div>
  )

  const TimelineRadioItem = React.forwardRef<
    HTMLButtonElement,
    {
      value: string
      title: string
      subtitle: string
      detail?: string
      subDetail?: string
    } & React.ComponentPropsWithoutRef<typeof RadioGroup.Item>
  >(({ value, title, subtitle, detail, subDetail, ...props }, ref) => (
    <RadioGroup.Item
      ref={ref}
      value={value}
      className={`
        relative p-4 border cursor-pointer transition-all duration-300 min-w-[160px] flex-shrink-0 text-left rounded-sm
        data-[state=unchecked]:border-white/10 data-[state=unchecked]:hover:border-white/30 data-[state=unchecked]:hover:bg-white/5
        focus:outline-none focus-visible:ring-1 focus-visible:ring-white/50
      `}
      style={{
        // We use inline style for checked state border color to match TOKENS dynamically
        borderColor: undefined // Will be overridden by data-state logic if we use classes, but here we might need dynamic style
      }}
      {...props}
    >
      {/* Dynamic border and bg for checked state using CSS variables or inline styles conditionally?
          Radix doesn't pass 'checked' state to style easily.
          We can use the data-state attribute in CSS-in-JS or just style tag.
          Or simply rely on the className with JIT interpolation if TOKENS is constant.
      */}
      <div
        className={`absolute inset-0 border pointer-events-none transition-colors duration-300 ${
          // Fallback if dynamic class doesn't work, but let's try to use style on this overlay
          ''
        }`}
        style={{
          borderColor: TOKENS.colors.accent,
          opacity: 'var(--opacity, 0)'
        }}
      />
      <style jsx>{`
        button[data-state='checked'] {
          background-color: ${TOKENS.colors.accent}1A; /* 10% opacity approx */
          border-color: ${TOKENS.colors.accent};
        }
      `}</style>

      <RadioGroup.Indicator className="absolute top-0 right-0">
        <CornerBracket color={TOKENS.colors.accent} />
      </RadioGroup.Indicator>

      <div className="flex flex-col gap-1">
        <div className="text-lg font-serif font-bold text-white/80 data-[state=checked]:text-white">
          {title}
        </div>
        <div className="text-xs text-white/40 font-mono uppercase">{subtitle}</div>
        {(detail || subDetail) && (
          <div className="mt-2 flex flex-col gap-2">
            <Separator.Root className="h-px w-full bg-white/5" />
            <div className="flex justify-between text-xs text-white/60">
              <span>{detail}</span>
              <span>{subDetail}</span>
            </div>
          </div>
        )}
      </div>
    </RadioGroup.Item>
  ))
  TimelineRadioItem.displayName = 'TimelineRadioItem'

  const TimelineDisplayItem = ({
    title,
    subtitle,
    detail,
    subDetail
  }: {
    title: string
    subtitle: string
    detail?: string
    subDetail?: string
  }) => (
    <div className="relative p-4 border border-white/10 min-w-[160px] flex-shrink-0 text-left rounded-sm bg-transparent">
      <div className="flex flex-col gap-1">
        <div className="text-lg font-serif font-bold text-white/80">{title}</div>
        <div className="text-xs text-white/40 font-mono uppercase">{subtitle}</div>
        {(detail || subDetail) && (
          <div className="mt-2 flex flex-col gap-2">
            <Separator.Root className="h-px w-full bg-white/5" />
            <div className="flex justify-between text-xs text-white/60">
              <span>{detail}</span>
              <span>{subDetail}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="w-full flex flex-col gap-8 pb-8">
      {/* Section 1: Dayun (大运) */}
      <div className="w-full flex flex-col gap-2">
        <ColumnHeader title={t('bazi.timelineHeaders.tenYear')} icon={Calendar} />
        <RadioGroup.Root
          value={selectedDayunIndex !== null ? String(selectedDayunIndex) : ''}
          onValueChange={(val) => handleDayunClick(parseInt(val))}
          className="w-full"
        >
          <TimelineScrollArea>
            {dayun.map((dy, idx) => (
              <TimelineRadioItem
                key={idx}
                value={String(idx)}
                title={`${tr('tiangan', dy.tiangan)}${tr('dizhi', dy.dizhi)}${t('bazi.timelineUnits.luck')}`}
                subtitle={`${dy.age} - ${dy.age + 9} ${t('bazi.timelineUnits.age')}`}
                detail={tr('shishen', dy.shishen)}
                subDetail={tr('zhangsheng', dy.zhangsheng)}
              />
            ))}
          </TimelineScrollArea>
        </RadioGroup.Root>
      </div>

      {/* Section 2: Liunian (流年) */}
      <AnimatePresence>
        {selectedDayunIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col gap-2"
          >
            <ColumnHeader title={t('bazi.timelineHeaders.yearly')} icon={Sun} />
            <RadioGroup.Root
              value={selectedLiunianYear !== null ? String(selectedLiunianYear) : ''}
              onValueChange={(val) => handleLiunianClick(parseInt(val))}
              className="w-full"
            >
              <TimelineScrollArea>
                {getDayunYears(selectedDayunIndex).map((ln) => (
                  <TimelineRadioItem
                    key={ln.year}
                    value={String(ln.year)}
                    title={`${tr('tiangan', ln.tiangan)}${tr('dizhi', ln.dizhi)}${t('common.unit.yearSuffix')}`}
                    subtitle={`${ln.year}`}
                    detail={tr('shishen', ln.shishen)}
                    subDetail={tr('zhangsheng', ln.zhangsheng)}
                  />
                ))}
              </TimelineScrollArea>
            </RadioGroup.Root>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 3: Liuyue (流月) */}
      <AnimatePresence>
        {selectedLiunianYear !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col gap-2"
          >
            <ColumnHeader title={t('bazi.timelineHeaders.monthly')} icon={Moon} />
            <RadioGroup.Root
              value={selectedLiuyueIndex !== null ? String(selectedLiuyueIndex) : ''}
              onValueChange={(val) => handleLiuyueClick(parseInt(val), selectedLiunianYear!)}
              className="w-full"
            >
              <TimelineScrollArea>
                {liuyueList.map((ly) => (
                  <TimelineRadioItem
                    key={ly.month}
                    value={String(ly.month)}
                    title={`${tr('tiangan', ly.tiangan)}${tr('dizhi', ly.dizhi)}${t('common.unit.monthSuffix')}`}
                    subtitle={tr('jieqi', ly.name)} // Solar term name
                    detail={tr('shishen', ly.shishen)}
                    subDetail={ly.startDate}
                  />
                ))}
              </TimelineScrollArea>
            </RadioGroup.Root>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 4: Liuri (流日) */}
      <AnimatePresence>
        {selectedLiuyueIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col gap-2"
          >
            <ColumnHeader title={t('bazi.timelineHeaders.daily')} icon={Sun} />
            <RadioGroup.Root
              value={selectedLiuriIndex !== null ? String(selectedLiuriIndex) : ''}
              onValueChange={(val) => {
                // We need to find the dayStem corresponding to this index to call handleLiuriClick correctly
                // The original handleLiuriClick took (index, stem)
                // We can find the stem from liuriList[index]
                const idx = parseInt(val)
                const day = liuriList[idx]
                if (day) {
                  handleLiuriClick(idx, day.tiangan)
                }
              }}
              className="w-full"
            >
              <TimelineScrollArea>
                {liuriList.map((lr, idx) => (
                  <TimelineRadioItem
                    key={idx}
                    value={String(idx)}
                    title={`${tr('tiangan', lr.tiangan)}${tr('dizhi', lr.dizhi)}${t('common.unit.daySuffix')}`}
                    subtitle={lr.date}
                    detail={tr('shishen', lr.shishen)}
                  />
                ))}
              </TimelineScrollArea>
            </RadioGroup.Root>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 5: Liushi (流时) */}
      <AnimatePresence>
        {selectedLiuriIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col gap-2"
          >
            <ColumnHeader title={t('bazi.timelineHeaders.hourly')} icon={Clock} />
            <TimelineScrollArea>
              {liushiList.map((ls, idx) => (
                <TimelineDisplayItem
                  key={idx}
                  title={`${tr('tiangan', ls.tiangan)}${tr('dizhi', ls.dizhi)}${t('common.unit.hourSuffix')}`}
                  subtitle={ls.timeRange}
                  detail={tr('shishen', ls.shishen)}
                />
              ))}
            </TimelineScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
