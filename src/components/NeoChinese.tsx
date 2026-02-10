'use client'

import '../i18n'
import React, { useState, ReactNode } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, Check, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'
import { cn } from '@/lib/utils'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import * as Separator from '@radix-ui/react-separator'
import * as AspectRatio from '@radix-ui/react-aspect-ratio'
import * as Popover from '@radix-ui/react-popover'
import * as Dialog from '@radix-ui/react-dialog'
import * as Label from '@radix-ui/react-label'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as RadioGroup from '@radix-ui/react-radio-group'
import * as Toast from '@radix-ui/react-toast'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import * as Progress from '@radix-ui/react-progress'

// -----------------------------------------------------------------------------
// DESIGN TOKENS (Swiss Style x Neo-Chinese)
// -----------------------------------------------------------------------------
export const PALETTE = {
  black: '#050505',
  surface: '#111111',
  surfaceHover: '#1A1A1A',
  red: '#EB4432',
  redHover: '#D43D2D',
  orange: '#F97316',
  blue: '#0066ff',
  pink: '#FF0066',
  pinkHover: '#D40055',
  yellow: '#FFCC00',
  gold: '#D4AF37',
  green: '#22c55e',
  white: '#FFFFFF',
  gray: '#666666',
  grayLight: '#AAAAAA',
  border: '#222222',
  text: '#F5F5F7',
  subtext: '#888888'
}

export const TOKENS = {
  colors: {
    bg: 'bg-neo-black',
    surface: 'bg-neo-surface',
    surfaceHover: 'hoverhover:bg-neo-surface-hover',
    textPrimary: 'text-neo-text',
    textSecondary: 'text-neo-subtext',
    accent: 'text-neo-red',
    accentBg: 'bg-neo-red',
    border: 'border-neo-border'
  },
  grid: 'grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8',
  type: {
    hero: 'text-6xl md:text-9xl font-black tracking-tighter leading-[0.85]',
    h2: 'text-3xl md:text-5xl font-bold tracking-tight font-serif',
    h3: 'text-xl font-medium tracking-wide uppercase',
    body: 'text-base md:text-lg leading-relaxed text-neo-subtext',
    mono: 'font-mono text-xs md:text-sm tracking-wider',
    serif: 'font-serif',
    calligraphy: 'font-calligraphy'
  },
  motion: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
}

// -----------------------------------------------------------------------------
// COMPONENTS
// -----------------------------------------------------------------------------

// Traditional Chinese Seal Component
export const Seal = ({
  text,
  className = '',
  color = PALETTE.red
}: {
  text: string
  className?: string
  color?: string
}) => (
  <div className={className} style={{ paddingBottom: 0 }}>
    <div
      className="w-full h-full inline-flex items-center justify-center border-2 font-serif font-bold p-1 leading-none select-none"
      style={{
        borderColor: color,
        backgroundColor: `${color}1A`, // 10% opacity
        color: color
      }}
    >
      <div
        className="border w-full h-full flex items-center justify-center px-1"
        style={{ borderColor: color }}
      >
        {text}
      </div>
    </div>
  </div>
)

// Traditional Chinese Lattice Pattern SVG Component
export const LatticePattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
    width="100%"
    height="100%"
  >
    <defs>
      <pattern id="lattice" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M0 20h40M20 0v40" stroke="currentColor" strokeWidth="0.5" className="text-white" />
        <rect
          x="15"
          y="15"
          width="10"
          height="10"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-white"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#lattice)" />
  </svg>
)

// Decorative Corner Component (Neo-Chinese Bracket)
export const CornerBracket = ({ color = PALETTE.red }: { color?: string }) => (
  <>
    <div
      className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2"
      style={{ borderColor: `${color}80` }}
    />
    <div
      className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2"
      style={{ borderColor: `${color}80` }}
    />
    <div
      className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2"
      style={{ borderColor: `${color}80` }}
    />
    <div
      className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2"
      style={{ borderColor: `${color}80` }}
    />
  </>
)

// Feature Card Component
export const FeatureCard = ({
  icon: Icon,
  title,
  desc,
  delay = 0,
  showAction = true,
  themeColor = PALETTE.red
}: {
  icon: any
  title: string
  desc: string
  showAction?: boolean
  delay?: number
  themeColor?: string
}) => {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={TOKENS.motion.initial}
      whileInView={TOKENS.motion.animate}
      viewport={{ once: true }}
      transition={{ ...TOKENS.motion.transition, delay }}
      className={`group relative p-8 h-full flex flex-col justify-between border ${TOKENS.colors.border} ${TOKENS.colors.surface} ${TOKENS.colors.surfaceHover} transition-colors duration-300`}
    >
      <CornerBracket color={themeColor} />
      <div>
        <div className="mb-8 flex justify-between items-start">
          <Icon className="w-8 h-8 stroke-1 text-white/40 group-hover:text-white transition-colors" />
          <span className={`${TOKENS.type.mono} opacity-30`}>0{Math.floor(delay * 10) || 1}</span>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-white group-hover:translate-x-1 transition-transform font-serif">
          {title}
        </h3>
        <p className="text-white/60 leading-relaxed">{desc}</p>
      </div>
      {showAction && <Separator.Root className="mt-8 mb-8 h-px w-full bg-white/5" />}
      {showAction && (
        <div className="flex items-center gap-2 text-sm font-medium text-white/40 group-hover:text-white transition-colors">
          {t('common.explore')} <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  )
}

// Feature Section Component
export const FeatureSection = ({
  title,
  subtitle,
  features,
  themeColor = PALETTE.red
}: {
  title: React.ReactNode
  subtitle: React.ReactNode
  features: Array<{ title: string; desc: string; icon: any }>
  themeColor?: string
}) => {
  return (
    <section className="mb-32">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 relative">
        <div>
          <h2 className={`${TOKENS.type.h2} text-white`}>{title}</h2>
          <Separator.Root className="h-1 w-20 mt-4" style={{ backgroundColor: themeColor }} />
        </div>
        <p className={`${TOKENS.type.mono} mt-4 md:mt-0`}>{subtitle}</p>
      </div>
      <Separator.Root className="mb-16 h-px w-full bg-white/10" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            delay={0.1 * (index + 1)}
            icon={feature.icon}
            title={feature.title}
            desc={feature.desc}
            themeColor={themeColor}
            showAction={false}
          />
        ))}
      </div>
    </section>
  )
}

// NeoButton Component
export const NeoButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    themeColor?: string
    fullWidth?: boolean
  }
>(
  (
    {
      className,
      variant = 'primary',
      themeColor = PALETTE.red,
      fullWidth = false,
      children,
      style: propStyle,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'border-0 cursor-pointer inline-flex items-center justify-center px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300  disabled:opacity-50 disabled:pointer-events-none group relative overflow-hidden'

    let variantStyles = ''
    let style = { ...propStyle }

    switch (variant) {
      case 'primary':
        variantStyles = `text-white hover:opacity-90`
        style = { ...style, backgroundColor: themeColor }
        break
      case 'secondary':
        variantStyles = `bg-neo-border text-white/80 hover:text-white hover:bg-white/20`
        break
      case 'outline':
        variantStyles = `bg-transparent  text-white/60 hover:text-white hover:border-white/40`
        break
      case 'ghost':
        variantStyles = `bg-transparent text-white/60 hover:text-white hover:bg-white/5`
        break
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${fullWidth ? 'w-full' : ''} ${variantStyles} ${className}`}
        style={style}
        {...props}
      >
        {children}
      </button>
    )
  }
)
NeoButton.displayName = 'NeoButton'

// NeoInput Component
export const NeoInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    themeColor?: string
    variant?: 'default' | 'ghost' | 'flushed'
  }
>(
  (
    { className, themeColor = PALETTE.red, variant = 'default', style: propStyle, ...props },
    ref
  ) => {
    const baseStyles =
      ' focus:outline-none transition-colors font-mono placeholder:text-white/20 disabled:opacity-50 disabled:pointer-events-none'

    let variantStyles = ''
    switch (variant) {
      case 'default':
        variantStyles = 'bg-neo-surface border border-neo-border text-white px-4 py-3'
        break
      case 'ghost':
        variantStyles = 'bg-transparent border-none text-white p-0'
        break
      case 'flushed':
        variantStyles =
          'bg-transparent border-b border-neo-border text-white px-0 py-2 rounded-none hover:border-white/40'
        break
    }

    return (
      <input
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${className}`}
        style={
          {
            ...propStyle,
            '--focus-color': themeColor
          } as React.CSSProperties
        }
        onFocus={(e) => {
          if (variant === 'default' || variant === 'flushed') {
            e.currentTarget.style.borderColor = themeColor
          }
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          if (variant === 'default' || variant === 'flushed') {
            e.currentTarget.style.borderColor = PALETTE.border
          }
          props.onBlur?.(e)
        }}
        {...props}
      />
    )
  }
)
NeoInput.displayName = 'NeoInput'

// NeoSelect Component (Rebuilt with Popover to prevent scroll locking)
export const NeoSelect = ({
  value,
  onValueChange,
  options,
  placeholder,
  themeColor = PALETTE.red,
  className,
  ...props
}: {
  value?: string
  onValueChange?: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  themeColor?: string
  className?: string
}) => {
  const [open, setOpen] = useState(false)
  const selectedLabel = options.find((o) => o.value === value)?.label

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className={`inline-flex items-center justify-between w-full bg-neo-surface border border-neo-border text-white px-4 py-3 focus:outline-none transition-colors hover:border-white/40 ${
            !value ? 'text-white/40' : ''
          } ${className}`}
          style={{ cursor: 'pointer' }}
          {...props}
        >
          <span className="truncate">{selectedLabel || placeholder}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="overflow-hidden bg-neo-surface border border-neo-border shadow-xl z-50 w-[var(--radix-popover-trigger-width)] max-h-[300px] flex flex-col"
          sideOffset={4}
          align="start"
        >
          <div className="overflow-y-auto p-1 custom-scrollbar">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onValueChange?.(option.value)
                  setOpen(false)
                }}
                className={` border-0  relative flex items-center w-full px-8 py-2.5 text-left text-white  hover:bg-white/10 bg-transparent  focus:outline-none cursor-pointer text-sm transition-colors`}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value && (
                  <span className="absolute left-2 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" style={{ color: themeColor }} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
NeoSelect.displayName = 'NeoSelect'

// NeoCheckbox Component (Radix UI Checkbox)
export const NeoCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox.Root>,
  React.ComponentPropsWithoutRef<typeof Checkbox.Root> & {
    themeColor?: string
    label?: string
  }
>(({ themeColor = PALETTE.red, label, className, ...props }, ref) => (
  <div className="flex items-center gap-3">
    <Checkbox.Root
      ref={ref}
      className={`flex items-center justify-center w-5 h-5 border border-neo-border rounded-md bg-neo-surface focus:outline-none transition-colors ${
        props.checked ? 'border-orange-500/60 bg-orange-500/10' : ''
      } ${className}`}
      style={{
        borderColor: props.checked ? themeColor : undefined
      }}
      {...props}
    >
      <Checkbox.Indicator className="text-white">
        <Check className="w-4 h-4" style={{ color: themeColor }} />
      </Checkbox.Indicator>
    </Checkbox.Root>
    {label && (
      <Label.Root className="text-sm text-white/80 font-medium cursor-pointer select-none hover:text-white transition-colors">
        {label}
      </Label.Root>
    )}
  </div>
))
NeoCheckbox.displayName = 'NeoCheckbox'

// NeoTextarea Component
export const NeoTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    themeColor?: string
    variant?: 'default' | 'ghost' | 'flushed'
  }
>(
  (
    { className, themeColor = PALETTE.red, variant = 'default', style: propStyle, ...props },
    ref
  ) => {
    const baseStyles =
      'w-full focus:outline-none transition-colors font-mono placeholder:text-white/20 disabled:opacity-50 disabled:pointer-events-none'

    let variantStyles = ''
    switch (variant) {
      case 'default':
        variantStyles = 'bg-neo-surface border border-neo-border text-white px-4 py-3 rounded-lg'
        break
      case 'ghost':
        variantStyles = 'bg-transparent border-none text-white p-0'
        break
      case 'flushed':
        variantStyles =
          'bg-transparent border-b border-neo-border text-white px-0 py-2 rounded-none hover:border-white/40'
        break
    }

    return (
      <textarea
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${className}`}
        style={
          {
            ...propStyle,
            '--focus-color': themeColor
          } as React.CSSProperties
        }
        onFocus={(e) => {
          if (variant === 'default' || variant === 'flushed') {
            e.currentTarget.style.borderColor = themeColor
          }
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          if (variant === 'default' || variant === 'flushed') {
            e.currentTarget.style.borderColor = PALETTE.border
          }
          props.onBlur?.(e)
        }}
        {...props}
      />
    )
  }
)
NeoTextarea.displayName = 'NeoTextarea'

// NeoLabel Component (Radix UI Label)
export const NeoLabel = React.forwardRef<
  React.ElementRef<typeof Label.Root>,
  React.ComponentPropsWithoutRef<typeof Label.Root> & {
    required?: boolean
    hint?: string
  }
>(({ className, required, hint, children, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    <Label.Root
      ref={ref}
      className={`text-xs text-white/40 uppercase tracking-wider font-mono ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-orange-500 ml-1">*</span>}
    </Label.Root>
    {hint && <span className="text-xs text-white/30 font-mono">{hint}</span>}
  </div>
))
NeoLabel.displayName = 'NeoLabel'

// NeoDialog Components
export const NeoDialogRoot = Dialog.Root
export const NeoDialogTrigger = Dialog.Trigger
export const NeoDialogPortal = Dialog.Portal
export const NeoDialogClose = Dialog.Close

export const NeoDialogOverlay = React.forwardRef<
  React.ElementRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
NeoDialogOverlay.displayName = 'NeoDialogOverlay'

export const NeoDialogContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content> & {
    themeColor?: string
  }
>(({ className, themeColor, style, children, ...props }, ref) => (
  <Dialog.Content
    ref={ref}
    className={cn(
      'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/20 bg-neo-surface p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
      className
    )}
    style={{
      ...style,
      borderColor: themeColor ? `${themeColor}40` : undefined
    }}
    {...props}
  >
    {children}
  </Dialog.Content>
))
NeoDialogContent.displayName = 'NeoDialogContent'

export const NeoDialogTitle = React.forwardRef<
  React.ElementRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight text-white', className)}
    {...props}
  />
))
NeoDialogTitle.displayName = 'NeoDialogTitle'

export const NeoDialogDescription = React.forwardRef<
  React.ElementRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description ref={ref} className={cn('text-sm text-white/60', className)} {...props} />
))
NeoDialogDescription.displayName = 'NeoDialogDescription'

// NeoDialog Component (Simplified Wrapper - kept for backward compatibility if needed, but composed is preferred)
export const NeoDialog = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  themeColor = PALETTE.red
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title?: string
  description?: string
  children?: React.ReactNode
  themeColor?: string
}) => (
  <NeoDialogRoot open={open} onOpenChange={onOpenChange}>
    {trigger && <NeoDialogTrigger asChild>{trigger}</NeoDialogTrigger>}
    <NeoDialogPortal>
      <NeoDialogOverlay />
      <NeoDialogContent themeColor={themeColor}>
        {title && (
          <>
            <NeoDialogTitle>{title}</NeoDialogTitle>
            <Separator.Root className="h-px w-full bg-white/5 mb-4 mt-2" />
          </>
        )}
        {description && <NeoDialogDescription className="mb-4">{description}</NeoDialogDescription>}
        {children}
        <NeoDialogClose asChild>
          <button className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </NeoDialogClose>
      </NeoDialogContent>
    </NeoDialogPortal>
  </NeoDialogRoot>
)

// NeoRadioGroup Component
export const NeoRadioGroup = RadioGroup.Root

// NeoRadioItem Component
export const NeoRadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroup.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroup.Item> & {
    themeColor?: string
  }
>(({ className, themeColor = PALETTE.red, children, style, ...props }, ref) => {
  return (
    <RadioGroup.Item
      ref={ref}
      className={`px-3 py-3 border transition-all text-center flex items-center justify-center cursor-pointer focus:outline-none  bg-black/20 border-white/20 text-white/60 hover:border-white/35 hover:text-white data-[state=checked]:bg-[var(--checked-bg)] data-[state=checked]:border-[var(--checked-border)] data-[state=checked]:text-[var(--checked-text)] ${
        className || ''
      }`}
      style={
        {
          ...style,
          '--checked-border': `${themeColor}`, // 70% opacity
          '--checked-text': themeColor
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </RadioGroup.Item>
  )
})
NeoRadioItem.displayName = 'NeoRadioItem'

// NeoRadioCard Component (For MBTI Test & Name Config)
export const NeoRadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroup.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroup.Item> & {
    themeColor?: string
    label?: string
    showIndicator?: boolean
  }
>(
  (
    { className, themeColor = PALETTE.red, label, showIndicator = true, children, ...props },
    ref
  ) => {
    return (
      <RadioGroup.Item
        ref={ref}
        className={cn(
          'group w-full p-5 border cursor-pointer transition-all duration-200 text-left',
          'bg-white/5 border-white/10',
          'data-[state=checked]:bg-[var(--checked-bg)] data-[state=checked]:border-[var(--checked-border)]',
          'hover:border-white/40',
          'outline-none focus-visible:ring-1 focus-visible:ring-[var(--checked-border)]',
          showIndicator ? 'flex items-center gap-4' : 'block',
          className
        )}
        style={
          {
            ...props.style,
            '--checked-bg': `${themeColor}0D`, // 5% opacity
            '--checked-border': themeColor
          } as React.CSSProperties
        }
        {...props}
      >
        {showIndicator && (
          <div
            className={`
            w-6 h-6 rounded-full flex items-center justify-center border transition-colors
            border-white/40 text-transparent
            group-data-[state=checked]:bg-[var(--checked-border)] group-data-[state=checked]:border-[var(--checked-border)] group-data-[state=checked]:text-white
          `}
          >
            <RadioGroup.Indicator>
              <Check size={14} />
            </RadioGroup.Indicator>
          </div>
        )}
        <span className={showIndicator ? 'text-base text-white/90' : ''}>{label || children}</span>
      </RadioGroup.Item>
    )
  }
)
NeoRadioCard.displayName = 'NeoRadioCard'

// NeoToast Component
export const NeoToast = ({
  open,
  onOpenChange,
  title,
  description,
  themeColor = PALETTE.red
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: React.ReactNode
  themeColor?: string
}) => (
  <Toast.Root
    open={open}
    onOpenChange={onOpenChange}
    className="bg-neo-surface border border-white/10 rounded-xl p-4 shadow-xl shadow-black/40 data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-swipeOut"
    style={{ borderColor: `${themeColor}40` }}
  >
    <div className="flex gap-4">
      <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: themeColor }} />
      <div className="flex-1">
        <Toast.Title className="text-white font-medium mb-1">{title}</Toast.Title>
        <Toast.Description className="text-white/60 text-sm">{description}</Toast.Description>
      </div>
      <Toast.Close className="text-white/40 hover:text-white transition-colors h-fit">
        <X className="w-4 h-4" />
      </Toast.Close>
    </div>
  </Toast.Root>
)

export const NeoToastProvider = Toast.Provider
export const NeoToastViewport = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Toast.Viewport>) => (
  <Toast.Viewport
    className={cn(
      'fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none',
      className
    )}
    {...props}
  />
)

// CoreForceCard Component
export const CoreForceCard = ({
  title,
  concept,
  desc,
  themeColor = PALETTE.red
}: {
  title: string
  concept: string
  desc: string
  themeColor?: string
}) => {
  const { t } = useTranslation()
  return (
    <div className="relative p-8 h-full bg-neo-surface border border-neo-border hover:border-white/20 transition-all duration-500 group overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-6xl text-white group-hover:opacity-20 transition-opacity select-none">
        {concept}
      </div>
      <CornerBracket color={themeColor} />
      <div className="relative z-10">
        <div className="mb-4 text-xs font-mono text-white/40 uppercase tracking-widest">
          {t('common.coreForce', 'Core Force')}
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 font-serif">{title}</h3>
        <Separator.Root className="w-8 h-1 mb-6" style={{ backgroundColor: themeColor }} />
        <p className="text-white/60 leading-relaxed text-sm">{desc}</p>
      </div>
    </div>
  )
}

// PageLayout Component
export const PageLayout = ({
  children,
  className = '',
  themeColor = PALETTE.red,
  logoText = '易'
}: {
  children: React.ReactNode
  className?: string
  themeColor?: string
  logoText?: string
}) => {
  const { t, i18n } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: t('common.nav.bazi'), href: '/bazi' },
    { label: t('common.nav.mbti'), href: '/mbti' },
    { label: t('common.nav.ainame'), href: '/ainame' }
  ]

  return (
    <div
      className={`min-h-screen bg-neo-black text-white selection:bg-neo-red selection:text-white ${className}`}
    >
      {/* Background Noise/Texture */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'url("/noise.png")' }}
      ></div>
      <LatticePattern />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300 bg-gradient-to-b from-neo-black to-transparent">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <Seal text={logoText} color={themeColor} className="w-10 h-10" />
            <span className="font-bold text-xl tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
              3C4I
            </span>
          </Link>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-white/60 hover:text-white transition-colors tracking-widest uppercase relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            <LanguageSwitcher />

            <button
              className="md:hidden z-50 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-neo-black flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-2xl font-bold text-white hover:text-neo-red transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 px-6 pt-32 pb-20 max-w-7xl mx-auto min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-6 bg-neo-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-white/40 text-sm font-mono">
            <span>{t('common.footerText')}</span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <span>ALL RIGHTS RESERVED</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-white/40 hover:text-white transition-colors text-sm">
              PRIVACY
            </Link>
            <Link href="#" className="text-white/40 hover:text-white transition-colors text-sm">
              TERMS
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// NeoScrollArea Component
export const NeoScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollArea.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollArea.Root> & {
    themeColor?: string
    viewportClassName?: string
    scrollbarClassName?: string
    thumbClassName?: string
    orientation?: 'vertical' | 'horizontal' | 'both'
  }
>(
  (
    {
      className,
      viewportClassName,
      scrollbarClassName,
      thumbClassName,
      children,
      themeColor = PALETTE.red,
      orientation = 'vertical',
      ...props
    },
    ref
  ) => (
    <ScrollArea.Root ref={ref} className={cn('w-full', className)} {...props}>
      <ScrollArea.Viewport className={cn('w-full h-full', viewportClassName)}>
        {children}
      </ScrollArea.Viewport>
      {(orientation === 'vertical' || orientation === 'both') && (
        <ScrollArea.Scrollbar
          orientation="vertical"
          className={cn(
            'flex select-none touch-none p-0.5 bg-white/5 transition-colors duration-[160ms] ease-out hover:bg-white/10 w-2.5 rounded-full',
            scrollbarClassName
          )}
        >
          <ScrollArea.Thumb
            className={cn(
              "flex-1 bg-white/20 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]",
              thumbClassName
            )}
          />
        </ScrollArea.Scrollbar>
      )}
      {(orientation === 'horizontal' || orientation === 'both') && (
        <ScrollArea.Scrollbar
          orientation="horizontal"
          className={cn(
            'flex select-none touch-none p-0.5 bg-white/5 transition-colors duration-[160ms] ease-out hover:bg-white/10 flex-col h-2.5 rounded-full',
            scrollbarClassName
          )}
        >
          <ScrollArea.Thumb
            className={cn(
              "flex-1 bg-white/20 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]",
              thumbClassName
            )}
          />
        </ScrollArea.Scrollbar>
      )}
      <ScrollArea.Corner className="bg-black/5" />
    </ScrollArea.Root>
  )
)
NeoScrollArea.displayName = 'NeoScrollArea'

// NeoSeparator Component
export const NeoSeparator = React.forwardRef<
  React.ElementRef<typeof Separator.Root>,
  React.ComponentPropsWithoutRef<typeof Separator.Root> & {
    themeColor?: string
  }
>(({ className, themeColor, style, ...props }, ref) => (
  <Separator.Root
    ref={ref}
    className={cn('bg-white/10', className)}
    style={{
      ...style,
      backgroundColor: themeColor ? themeColor : undefined
    }}
    {...props}
  />
))
NeoSeparator.displayName = 'NeoSeparator'

// NeoProgress Component
export const NeoProgress = React.forwardRef<
  React.ElementRef<typeof Progress.Root>,
  React.ComponentPropsWithoutRef<typeof Progress.Root> & {
    themeColor?: string
    indicatorClassName?: string
  }
>(({ className, themeColor = PALETTE.red, value, indicatorClassName, ...props }, ref) => (
  <Progress.Root
    ref={ref}
    className={cn(
      'relative overflow-hidden bg-white/10 h-2 w-full rounded-full transform-gpu',
      className
    )}
    style={{ transform: 'translateZ(0)' }}
    value={value}
    {...props}
  >
    <Progress.Indicator
      className={cn(
        'h-full w-full flex-1 transition-all duration-[660ms] ease-[cubic-bezier(0.65,0,0.35,1)]',
        indicatorClassName
      )}
      style={{
        backgroundColor: themeColor,
        transform: `translateX(-${100 - (value || 0)}%)`
      }}
    />
  </Progress.Root>
))
NeoProgress.displayName = 'NeoProgress'

// NeoCollapsible Components
export const NeoCollapsible = Collapsible.Root
export const NeoCollapsibleTrigger = Collapsible.Trigger
export const NeoCollapsibleContent = Collapsible.Content
