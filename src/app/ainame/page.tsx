'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  PageLayout,
  FeatureSection,
  TOKENS,
  PALETTE,
  Seal,
  CornerBracket,
  NeoButton,
  NeoInput,
  NeoRadioGroup,
  NeoRadioItem,
  NeoToast,
  NeoToastProvider,
  NeoToastViewport
} from '@/components/NeoChinese'
import { Sparkles, BookOpen, Scale, ArrowRight, Plus, X, GripHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import { NameConfigPanel } from './components/NameConfigPanel'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DropAnimation,
  useDroppable
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SlotItem {
  id: string
  type: 'fixed' | 'empty' | 'surname'
  value: string
}

interface SlotCardProps {
  item: SlotItem
  containerId: 'surname' | 'name'
  isActive?: boolean
  onRemove?: (id: string) => void
  onChange?: (id: string, value: string) => void
  isOverlay?: boolean
  isEditing?: boolean
  onEditChange?: (isEditing: boolean) => void
  style?: React.CSSProperties
  attributes?: any
  listeners?: any
  wrapperRef?: (node: HTMLElement | null) => void
  isDragging?: boolean
}

function SlotCard({
  item,
  containerId,
  isActive = false,
  onRemove,
  onChange,
  isOverlay = false,
  isEditing = false,
  onEditChange,
  style = {},
  attributes,
  listeners,
  wrapperRef,
  isDragging
}: SlotCardProps) {
  const { t } = useTranslation()
  const [localIsEditing, setLocalIsEditing] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  const [inputValue, setInputValue] = useState(item.value)

  // Use prop if provided, otherwise local state
  const effectiveIsEditing = onEditChange ? isEditing : localIsEditing
  const setEffectiveIsEditing = onEditChange ? onEditChange : setLocalIsEditing

  // Sync inputValue with item.value when item changes
  React.useEffect(() => {
    if (!isComposing) {
      setInputValue(item.value)
    }
  }, [item.value])

  // Determine styles based on container and item type
  // Light mode uses darker/solid colors, Dark mode uses lighter/transparent colors
  let borderColorLight = 'rgba(0,0,0,0.18)'
  let borderColorDark = 'rgba(255,255,255,0.18)'
  let bgColorLight = 'rgba(0,0,0,0.05)'
  let bgColorDark = 'rgba(255,255,255,0.08)'
  let textColor = 'text-gray-800 dark:text-white'
  let label = ''
  let labelColor = 'text-gray-600 dark:text-white/60'

  if (containerId === 'surname') {
    borderColorLight = 'rgba(234, 88, 12, 0.65)' // orange-500/65
    borderColorDark = 'rgba(234, 88, 12, 0.55)' // orange-500/55
    bgColorLight = 'rgba(234, 88, 12, 0.12)' // orange-500/12
    bgColorDark = 'rgba(234, 88, 12, 0.18)' // orange-500/18
    textColor = 'text-orange-600 dark:text-orange-300'
    label = t('ainame.structure.surname')
    labelColor = 'text-orange-600/80 dark:text-orange-300/80'
  } else {
    // Name container
    if (item.type === 'fixed') {
      borderColorLight = 'rgba(34, 197, 94, 0.65)' // green-500/65
      borderColorDark = 'rgba(34, 197, 94, 0.55)' // green-500/55
      bgColorLight = 'rgba(34, 197, 94, 0.12)' // green-500/12
      bgColorDark = 'rgba(34, 197, 94, 0.18)' // green-500/18
      textColor = 'text-emerald-600 dark:text-emerald-300'
    } else {
      // empty
      borderColorLight = 'rgba(0,0,0,0.2)'
      borderColorDark = 'rgba(255,255,255,0.2)'
      bgColorLight = 'rgba(0,0,0,0.05)'
      bgColorDark = 'rgba(255,255,255,0.08)'
      textColor = 'text-gray-700 dark:text-white/70'
    }
    label = t('ainame.structure.given_name')
  }

  const isEmpty = item.type === 'empty' && containerId === 'name'

  // If it's an overlay, force opacity to 1 and add shadow
  if (isOverlay) {
    style.opacity = 1
    Object.assign(style, {
      boxShadow:
        '0 0 0 1px rgba(255,255,255,0.4), 0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(234, 88, 12, 0.3)',
      cursor: 'grabbing',
      transform: 'scale(1.1)',
      zIndex: 9999
    })

    // Make background more opaque and ensure text contrast
    if (containerId === 'surname') {
      bgColorLight = 'rgba(234, 88, 12, 0.9)'
      bgColorDark = 'rgba(234, 88, 12, 0.9)'
      textColor = 'text-white'
      labelColor = 'text-white/80'
    } else {
      if (item.type === 'fixed') {
        bgColorLight = 'rgba(34, 197, 94, 0.9)'
        bgColorDark = 'rgba(34, 197, 94, 0.9)'
        textColor = 'text-white'
      } else {
        bgColorLight = 'rgba(40, 40, 40, 0.95)'
        bgColorDark = 'rgba(40, 40, 40, 0.95)'
        textColor = 'text-white'
      }
      labelColor = 'text-white/80'
    }
  }

  const singleChar = (value: string) => {
    if (!value) return ''
    // Match CJK Unified Ideographs (covers both Simplified and Traditional)
    const chinese = value.match(/[\u4e00-\u9fff]/)
    if (chinese?.[0]) return chinese[0]
    return ''
  }

  return (
    <div
      ref={wrapperRef}
      style={style}
      {...attributes}
      className={`flex-shrink-0 w-16 h-24 border flex flex-col items-center justify-center relative group  overflow-hidden transition-colors ${
        isOverlay ? 'z-50' : ''
      }`}
    >
      <div
        className="absolute inset-0 pointer-events-none slot-card-bg"
        style={
          {
            '--bg-light': bgColorLight,
            '--bg-dark': bgColorDark,
            '--border-light': borderColorLight,
            '--border-dark': borderColorDark,
            backgroundColor: bgColorDark,
            borderColor: borderColorDark,
            borderWidth: '1px',
            borderStyle: isEmpty ? 'dashed' : 'solid'
          } as React.CSSProperties
        }
      />
      {/* Label */}
      {!effectiveIsEditing && (
        <span
          className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-wider whitespace-nowrap z-10"
          style={{ color: labelColor }}
        >
          {label}
        </span>
      )}
      {/* Input or Display */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pt-3">
        {effectiveIsEditing || (isActive && !isDragging) ? (
          <NeoInput
            variant="ghost"
            autoFocus
            className={`w-full h-full text-center text-3xl font-serif ${textColor} bg-transparent border-none focus:ring-0 p-0`}
            value={inputValue}
            placeholder={isEmpty ? '?' : ''}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(e) => {
              setIsComposing(false)
              // Update local value but don't commit to parent yet
              // This allows user to see what they typed before validation/submit
              const val = (e.target as HTMLInputElement).value
              setInputValue(val)
            }}
            onPaste={(e) => {
              e.stopPropagation()
              e.preventDefault()
              const text = e.clipboardData.getData('text/plain')
              if (text) {
                const val = singleChar(text)
                setInputValue(val)
                onChange?.(item.id, val)
              }
            }}
            onChange={(e) => {
              const newValue = e.target.value
              setInputValue(newValue)
            }}
            onBlur={(e) => {
              if (!isComposing) {
                const val = singleChar(inputValue)
                setInputValue(val)
                onChange?.(item.id, val)
              }
              setEffectiveIsEditing(false)
            }}
            onKeyDown={(e) => {
              // Stop propagation to prevent dnd-kit from intercepting keystrokes
              e.stopPropagation()
              if (e.key === 'Enter' && !isComposing) {
                const val = singleChar(inputValue)
                setInputValue(val)
                onChange?.(item.id, val)
                setEffectiveIsEditing(false)
              }
            }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            onClick={() => !isDragging && setEffectiveIsEditing(true)}
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
          >
            {item.value ? (
              <span className={`text-3xl font-serif ${textColor}`}>{item.value}</span>
            ) : (
              <span className={`text-3xl font-serif ${textColor} opacity-20 select-none`}>?</span>
            )}
          </div>
        )}
      </div>
      {/* Delete Button (Generic for all items if constraint met) */}
      {onRemove && !effectiveIsEditing && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(item.id)
          }}
          className="absolute top-1 right-1 justify-center items-center flex rounded-full w-4 h-4 p-0 block border-0 bg-red-500/50 text-white/50 hover:text-white hover:bg-red-500/80 opacity-0 group-hover:opacity-100 transition-all z-30 shadow-md"
        >
          <X className="w-3 h-3" />
        </button>
      )}{' '}
      {/* Drag Handle */}
      <div
        {...listeners}
        className="absolute bottom-1 left-1/2 -translate-x-1/2  text-white/25 group-hover:text-white/45 transition-colors z-20 cursor-grab active:cursor-grabbing p-2 hover:bg-white/8 rounded touch-none"
      >
        <GripHorizontal className="w-3 h-3" />
      </div>
    </div>
  )
}

interface SortableSlotProps {
  item: SlotItem
  containerId: 'surname' | 'name'
  isActive?: boolean
  onRemove?: (id: string) => void
  onChange?: (id: string, value: string) => void
  isOverlay?: boolean
}

function SortableSlot({
  item,
  containerId,
  isActive = false,
  onRemove,
  onChange,
  isOverlay = false
}: SortableSlotProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: {
      type: 'SlotItem',
      item,
      containerId
    },
    disabled: isEditing
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    // Disable transition animation for instant positioning after drop
    transition: isDragging ? transition : undefined,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : 'auto'
  }

  return (
    <SlotCard
      item={item}
      containerId={containerId}
      isActive={isActive}
      onRemove={onRemove}
      onChange={onChange}
      isOverlay={isOverlay}
      isEditing={isEditing}
      onEditChange={setIsEditing}
      style={style}
      attributes={attributes}
      listeners={listeners}
      wrapperRef={setNodeRef}
      isDragging={isDragging}
    />
  )
}

const BackgroundDecoration = React.memo(() => {
  const particles = React.useMemo(() => {
    return ['一', '丨', '丿', '丶', '亅', '氵', '扌', '亻', '口', '木', '女', '王', '石', '言'].map(
      (char, i) => ({
        char,
        duration: 12 + ((i * 7) % 10),
        delay: i * 1.2,
        left: 5 + ((i * 13) % 90),
        top: 10 + ((i * 17) % 80)
      })
    )
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-[1]">
      <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 opacity-[0.08]">
        <div className="relative w-[1000px] h-[1000px]">
          <div
            className="absolute inset-0  block"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06) 1px, transparent 1px, transparent 40px)',
              backgroundSize: '40px 40px'
            }}
          />
          <div
            className="absolute inset-0  hidden"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.06), rgba(0,0,0,0.06) 1px, transparent 1px, transparent 40px)',
              backgroundSize: '40px 40px'
            }}
          />
          <div
            className="absolute inset-0  block"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06) 1px, transparent 1px, transparent 40px)',
              backgroundSize: '40px 40px'
            }}
          />
          <div
            className="absolute inset-0 hidden"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.06) 1px, transparent 1px, transparent 40px)',
              backgroundSize: '40px 40px'
            }}
          />
          <div className="absolute inset-[12%] text-[16rem] font-calligraphy text-white/10 leading-none">
            名
          </div>
        </div>
      </div>
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: [0, 0.18, 0], y: -120, x: Math.sin(i) * 60 }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear'
            }}
            className="absolute text-6xl font-calligraphy text-whit/10"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              filter: 'blur(1.2px)'
            }}
          >
            {p.char}
          </motion.div>
        ))}
      </div>
      <div
        className="absolute top-[-10%] right-[-10%] w-[1400px] h-[1400px] blur-3xl mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 60%)' }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[1200px] h-[1200px] blur-3xl mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.06) 0%, transparent 60%)' }}
      />
    </div>
  )
})

export default function AiNamePage() {
  const { t } = useTranslation()
  const themeColor = PALETTE.orange

  return (
    <NeoToastProvider swipeDirection="right">
      <PageLayout themeColor={themeColor} logoText={t('ainame.hero.seal')}>
        <BackgroundDecoration />
        <Suspense
          fallback={
            <div
              className={`min-h-[60vh] flex items-center justify-center ${TOKENS.colors.textPrimary}`}
            >
              {t('common.loading')}
            </div>
          }
        >
          <AiNameForm />
        </Suspense>
      </PageLayout>
    </NeoToastProvider>
  )
}

function AiNameForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const themeColor = PALETTE.orange // Orange Theme

  // Form State
  const [gender, setGender] = useState('boy')

  // Refactored State: surnameSlots and givenNameSlots
  const [surnameSlots, setSurnameSlots] = useState<SlotItem[]>([])
  const [givenNameSlots, setGivenNameSlots] = useState<SlotItem[]>([])

  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeItem, setActiveItem] = useState<SlotItem | null>(null)

  // Advanced Config State
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [style, setStyle] = useState('')
  const [balance, setBalance] = useState('auto')
  const [otherConfig, setOtherConfig] = useState('')
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Dnd Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 6
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  useEffect(() => {
    if (searchParams) {
      const pBirthDate = searchParams.get('birthDate')
      const pBirthTime = searchParams.get('birthTime')
      const pStyle = searchParams.get('style')
      const pBalance = searchParams.get('balance')
      const pOtherConfig = searchParams.get('otherConfig')

      if (pBirthDate) setBirthDate(pBirthDate)
      if (pBirthTime) setBirthTime(pBirthTime)
      if (pStyle) setStyle(pStyle)
      if (pBalance) setBalance(pBalance)
      if (pOtherConfig) setOtherConfig(pOtherConfig)
    }
  }, [searchParams])

  // Initialize slots
  useEffect(() => {
    // Only initialize if slots are empty
    if (surnameSlots.length === 0 && givenNameSlots.length === 0) {
      // 1. Try LocalStorage
      try {
        const savedSurname = localStorage.getItem('aibazi_surname_slots')
        const savedGivenName = localStorage.getItem('aibazi_given_name_slots')

        if (savedSurname && savedGivenName) {
          const parsedSurname: SlotItem[] = JSON.parse(savedSurname)
          const parsedGiven: SlotItem[] = JSON.parse(savedGivenName)
          setSurnameSlots(parsedSurname)
          setGivenNameSlots(
            parsedGiven.map((slot) =>
              slot.type === 'empty'
                ? { ...slot, value: slot.value === '?' ? '' : slot.value }
                : slot
            )
          )
          return
        }
      } catch (e) {
        console.error('Failed to load slots from localStorage', e)
      }

      // 2. Default initialization
      setSurnameSlots([{ id: uuidv4(), type: 'surname', value: '' }])
      setGivenNameSlots([
        { id: uuidv4(), type: 'empty', value: '' },
        { id: uuidv4(), type: 'empty', value: '' }
      ])
    }
  }, [])

  // Persist slots to LocalStorage
  useEffect(() => {
    if (surnameSlots.length > 0 && givenNameSlots.length > 0) {
      localStorage.setItem('aibazi_surname_slots', JSON.stringify(surnameSlots))
      localStorage.setItem('aibazi_given_name_slots', JSON.stringify(givenNameSlots))
    }
  }, [surnameSlots, givenNameSlots])

  const handleConfigChange = (key: string, value: string) => {
    switch (key) {
      case 'birthDate':
        setBirthDate(value)
        break
      case 'birthTime':
        setBirthTime(value)
        break
      case 'style':
        setStyle(value)
        break
      case 'balance':
        setBalance(value)
        break
      case 'otherConfig':
        setOtherConfig(value)
        break
    }
  }

  const handleAddSlot = () => {
    setGivenNameSlots([...givenNameSlots, { id: uuidv4(), type: 'empty', value: '' }])
  }

  const handleSlotChange = (id: string, value: string, isSurname: boolean) => {
    if (isSurname) {
      setSurnameSlots((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)))
    } else {
      setGivenNameSlots((prev) =>
        prev.map((s) => {
          if (s.id === id) {
            if (!value) return { ...s, type: 'empty', value: '' }
            return { ...s, type: 'fixed', value }
          }
          return s
        })
      )
    }
  }

  const handleRemoveSlot = (id: string, isSurname: boolean) => {
    if (isSurname) {
      if (surnameSlots.length > 1) {
        setSurnameSlots((prev) => prev.filter((s) => s.id !== id))
      }
    } else {
      if (givenNameSlots.length > 1) {
        setGivenNameSlots((prev) => prev.filter((s) => s.id !== id))
      }
    }
  }

  // Drag Handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    setActiveItem(event.active.data.current?.item || null)
  }

  const findContainer = (id: string) => {
    if (surnameSlots.find((s) => s.id === id)) return 'surname'
    if (givenNameSlots.find((s) => s.id === id)) return 'name'
    if (id === 'surname-container') return 'surname'
    if (id === 'name-container') return 'name'
    return null
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    const overId = over?.id

    if (!overId || active.id === overId) return

    const activeContainer = findContainer(active.id as string)
    let overContainer = findContainer(overId as string)

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return
    }

    // Enforce constraints: at least one item per container
    if (activeContainer === 'surname' && surnameSlots.length <= 1) return
    if (activeContainer === 'name' && givenNameSlots.length <= 1) return

    if (activeContainer === 'surname') {
      // Move from surname to name container
      const itemIndex = surnameSlots.findIndex((s) => s.id === active.id)
      const item = surnameSlots[itemIndex]

      setSurnameSlots((prev) => prev.filter((s) => s.id !== active.id))
      setGivenNameSlots((prev) => {
        const overIndex = prev.findIndex((s) => s.id === overId)
        const newSlots = [...prev]
        const newItem: SlotItem = { ...item, type: 'empty' }
        let newIndex = overIndex
        if (overIndex === -1) newIndex = newSlots.length
        newSlots.splice(newIndex, 0, newItem)
        return newSlots
      })
    } else {
      // Move from name to surname container
      const itemIndex = givenNameSlots.findIndex((s) => s.id === active.id)
      const item = givenNameSlots[itemIndex]

      setGivenNameSlots((prev) => prev.filter((s) => s.id !== active.id))
      setSurnameSlots((prev) => {
        const overIndex = prev.findIndex((s) => s.id === overId)
        const newSlots = [...prev]
        const newItem: SlotItem = {
          ...item,
          type: 'surname',
          value: item.value === '?' || item.type === 'empty' ? '' : item.value
        }
        let newIndex = overIndex
        if (overIndex === -1) newIndex = newSlots.length
        newSlots.splice(newIndex, 0, newItem)
        return newSlots
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    const activeContainer = findContainer(active.id as string)
    const overContainer = over ? findContainer(over.id as string) : null

    if (!activeContainer || !overContainer || activeContainer !== overContainer) {
      setActiveId(null)
      return
    }

    const slots = activeContainer === 'surname' ? surnameSlots : givenNameSlots
    const activeIndex = slots.findIndex((s) => s.id === active.id)
    const overIndex = slots.findIndex((s) => s.id === over!.id)

    if (activeIndex !== overIndex) {
      if (activeContainer === 'surname') {
        setSurnameSlots((prev) => arrayMove(prev, activeIndex, overIndex))
      } else {
        setGivenNameSlots((prev) => arrayMove(prev, activeIndex, overIndex))
      }
    }

    setActiveId(null)
    setActiveItem(null)
  }

  // Disable drop animation to make items appear instantly at drop position
  const dropAnimation: DropAnimation | null = null

  const handleGenerate = () => {
    // Reconstruct surname from slots
    const surname = surnameSlots.map((s) => s.value).join('')

    if (!surname) {
      setToastMessage(t('ainame.form.surname_required') || 'Please enter surname')
      setToastOpen(true)
      return
    }

    setIsLoading(true)
    const params = new URLSearchParams()
    if (surname) params.set('surname', surname)
    if (gender) params.set('gender', gender)

    const totalLength = surname.length + givenNameSlots.length
    params.set('nameLength', totalLength.toString())

    const structure: string[] = []
    surnameSlots.forEach(() => structure.push('surname'))
    givenNameSlots.forEach((s) => {
      if (s.type === 'fixed') structure.push(`fixed:${s.value}`)
      else structure.push('?')
    })
    params.set('nameStructure', JSON.stringify(structure))

    if (birthDate) params.set('birthDate', birthDate)
    if (birthTime) params.set('birthTime', birthTime)
    if (style) params.set('style', style)
    if (balance) params.set('balance', balance)
    if (otherConfig) params.set('otherConfig', otherConfig)

    router.push(`/ainame/result?${params.toString()}`)
  }

  const features = [
    {
      title: t('ainame.features.recommend.title'),
      desc: t('ainame.features.recommend.desc'),
      icon: Sparkles
    },
    {
      title: t('ainame.features.culture.title'),
      desc: t('ainame.features.culture.desc'),
      icon: BookOpen
    },
    {
      title: t('ainame.features.balance.title'),
      desc: t('ainame.features.balance.desc'),
      icon: Scale
    }
  ]

  const surnameDroppable = useDroppable({ id: 'surname-container' })
  const nameDroppable = useDroppable({ id: 'name-container' })

  return (
    <>
      <section className="relative min-h-[80vh] flex flex-col justify-center mb-24 pt-12 z-[2]">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={TOKENS.motion.initial}
            animate={TOKENS.motion.animate}
            transition={TOKENS.motion.transition}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-4 mb-8">
              <Seal
                text={t('ainame.hero.seal')}
                color={themeColor}
                className="w-12 h-12 md:w-16 md:h-16 text-2xl md:text-3xl"
              />
              <div className="h-px w-20" style={{ backgroundColor: themeColor }} />
              <span className={`${TOKENS.type.mono} opacity-60`} style={{ color: themeColor }}>
                {t('ainame.hero.subtitle')}
              </span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`${TOKENS.type.hero} mb-8 text-white tracking-wide drop-shadow-2xl font-chinese`}
            >
              {t('ainame.hero.title1')}
              <br />
              <span
                style={{
                  color: themeColor,
                  textShadow: `0 0 20px ${themeColor}80, 0 0 40px ${themeColor}40`
                }}
                className="relative inline-block"
              >
                {t('ainame.hero.title2')}
              </span>
            </motion.h1>
            <p className={`${TOKENS.type.body} max-w-xl mb-8 whitespace-pre-line`}>
              {t('ainame.hero.desc')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...TOKENS.motion.transition, delay: 0.2 }}
            className="lg:col-span-6 lg:col-start-7"
          >
            <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-8 md:p-10 shadow-2xl shadow-black/40 rounded-2xl z-10 isolate">
              <CornerBracket color={themeColor} />
              <div className="relative">
                <div className="h-full flex flex-col gap-6">
                  {/* Gender Selection */}
                  <NeoRadioGroup
                    className="grid grid-cols-2 gap-4"
                    value={gender}
                    onValueChange={(value) => setGender(value as 'boy' | 'girl')}
                  >
                    <NeoRadioItem value="boy" themeColor={themeColor}>
                      <span>{t('ainame.form.gender.boy')}</span>
                    </NeoRadioItem>
                    <NeoRadioItem value="girl" themeColor={themeColor}>
                      <span>{t('ainame.form.gender.girl')}</span>
                    </NeoRadioItem>
                  </NeoRadioGroup>

                  {/* Structure Editor */}
                  <div className="flex-1 relative ">
                    <div className="p-6 bg-white/8 backdrop-blur-sm border border-white/20 rounded-xl mb-4 shadow-inner shadow-black/20">
                      <div className="flex justify-between items-center mb-6 px-1">
                        <span className="text-xs text-white/60 uppercase tracking-wider font-mono">
                          {t('ainame.structure.current_length', {
                            length: surnameSlots.length + givenNameSlots.length
                          })}
                        </span>
                        <div className="flex gap-4 text-[10px] text-white/50 font-mono">
                          <span>* {t('ainame.structure.hint.surname')}</span>
                          <span>* {t('ainame.structure.hint.fixed')}</span>
                        </div>
                      </div>

                      <DndContext
                        sensors={sensors}
                        collisionDetection={pointerWithin}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                          {/* Surname Slots */}
                          <div
                            ref={surnameDroppable.setNodeRef}
                            className="flex items-center gap-3 min-h-[6rem] p-2  transition-color hover:bg-white/8"
                          >
                            <SortableContext
                              items={surnameSlots.map((s) => s.id)}
                              strategy={horizontalListSortingStrategy}
                            >
                              {surnameSlots.map((slot) => (
                                <SortableSlot
                                  key={slot.id}
                                  item={slot}
                                  containerId="surname"
                                  onChange={(id, val) => handleSlotChange(id, val, true)}
                                  onRemove={
                                    surnameSlots.length > 1
                                      ? (id) => handleRemoveSlot(id, true)
                                      : undefined
                                  }
                                />
                              ))}
                            </SortableContext>
                          </div>

                          {/* Add Surname Slot Button (Optional, if we want to allow adding surname chars) */}
                          {/* For now, let's stick to initial 1 char or user drag */}

                          <div className="w-px h-16 bg-white/10 mx-2" />

                          {/* Given Name Slots */}
                          <div
                            ref={nameDroppable.setNodeRef}
                            className="flex items-center gap-3 min-h-[6rem] p-2  transition-colors hover:bg-white/8"


                          >
                            <SortableContext
                              items={givenNameSlots.map((s) => s.id)}
                              strategy={horizontalListSortingStrategy}
                            >
                              {givenNameSlots.map((slot) => (
                                <SortableSlot
                                  key={slot.id}
                                  item={slot}
                                  containerId="name"
                                  onRemove={
                                    givenNameSlots.length > 1
                                      ? (id) => handleRemoveSlot(id, false)
                                      : undefined
                                  }
                                  onChange={(id, val) => handleSlotChange(id, val, false)}
                                />
                              ))}
                            </SortableContext>
                          </div>

                          {/* Add Slot Button */}
                          <div className="relative">
                            <NeoButton
                              variant="ghost"
                              onClick={handleAddSlot}
                              className="flex-shrink-0 w-16 h-24 bg-white/8 border border-white/20 border-dashed flex flex-col items-center justify-center text-white/50 hover:text-white hover:border-white/40 hover:bg-white/15 transition-all  p-0"
                            >
                              <Plus className="w-6 h-6 mb-1" />
                              <span className="text-[10px] uppercase font-mono">
                                {t('ainame.structure.add')}
                              </span>
                            </NeoButton>
                          </div>
                        </div>

                        <DragOverlay dropAnimation={dropAnimation}>
                          {activeItem ? (
                            <SlotCard
                              item={activeItem}
                              containerId={findContainer(activeItem.id) || 'name'}
                              isOverlay
                            />
                          ) : null}
                        </DragOverlay>
                      </DndContext>
                    </div>
                  </div>

                  <div className="mb-4">
                    <NameConfigPanel
                      values={{ birthDate, birthTime, style, balance, otherConfig }}
                      onChange={handleConfigChange}
                      defaultOpen={false}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-white/5 relative z-10">
                <NeoButton
                  onClick={handleGenerate}
                  disabled={isLoading}
                  fullWidth
                  themeColor={themeColor}
                  className="py-4 font-bold "
                >
                  <div className="relative z-10 flex items-center justify-center gap-2 tracking-[0.2em] uppercase">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />
                        {t('common.processing')}
                      </span>
                    ) : (
                      <>
                        {t('ainame.form.submit')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
                </NeoButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <FeatureSection
        title={t('ainame.features.sectionTitle')}
        subtitle={t('ainame.features.sectionSubtitle')}
        themeColor={themeColor}
        features={features}
      />

      <NeoToast
        open={toastOpen}
        onOpenChange={setToastOpen}
        title={t('common.error')}
        description={toastMessage}
        themeColor={themeColor}
      />
      <NeoToastViewport />
    </>
  )
}
