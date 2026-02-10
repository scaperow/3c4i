'use client'

import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import { zhCN, zhTW } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'
import { PALETTE } from '@/components/NeoChinese'

import { useTranslation } from 'react-i18next'

export interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
  style?: React.CSSProperties
}

export function MDatePicker({
  value,
  onChange,
  placeholder,
  disabled = false,
  minDate,
  maxDate,
  className,
  style
}: DatePickerProps) {
  const { t, i18n } = useTranslation()
  const displayPlaceholder = placeholder || t('common.datePicker.placeholder', 'Select Date')
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedMonth, setSelectedMonth] = React.useState<Date>(value || new Date())

  const localeMap: Record<string, any> = {
    'zh-CN': zhCN,
    'zh-TW': zhTW
  }
  const dateLocale = localeMap[i18n.language] || undefined

  const handleDateSelect = (date: Date | undefined) => {
    onChange?.(date || null)
    setIsOpen(false)
  }

  const mbtiStyles = `
    .rdp {
      --rdp-background-color: ${PALETTE.black};
      --rdp-text-color: ${PALETTE.white};
      --rdp-accent-color: ${PALETTE.blue};
      --rdp-border-color: ${PALETTE.white};
      --rdp-selected-color: ${PALETTE.blue};
    }
    .rdp-head_row {
      border-bottom: 2px solid ${PALETTE.blue};
    }
    .rdp-head_cell {
      font-weight: 700;
      color: ${PALETTE.blue};
      text-transform: uppercase;
      font-size: 12px;
      padding: 8px;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      letter-spacing: '0.05em';
    }
    .rdp-day {
      color: ${PALETTE.white};
      border: 1px solid transparent;
      transition: all 200ms ease;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-weight: 500;
    }
    .rdp-day:hover:not(.rdp-selected):not(.rdp-disabled) {
      background: ${PALETTE.blue};
      transform: scale(1.05);
    }
    .rdp-day.rdp_selected {
      background: ${PALETTE.blue};
      color: ${PALETTE.white};
      font-weight: 700;
      border: 2px solid ${PALETTE.white};
    }
    .rdp-nav_button {
      background: ${PALETTE.blue};
      color: ${PALETTE.white};
      border: 2px solid ${PALETTE.blue};
      transition: all 200ms ease;
    }
    .rdp-nav_button:hover {
      background: ${PALETTE.white};
      color: ${PALETTE.blue};
      transform: scale(1.05);
    }
  `

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translate(-2px, -2px)'
    e.currentTarget.style.boxShadow = '8px 8px 0px rgba(0,102,255,0.3)'
  }

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translate(0, 0)'
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <div className={className} style={style}>
      <style>{mbtiStyles}</style>

      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        onMouseEnter={handleButtonHover}
        onMouseLeave={handleButtonLeave}
        style={{
          background: '#0066ff',
          color: '#ffffff',
          border: '3px solid #0066ff',
          fontWeight: 700,
          fontFamily: 'Space Grotesk, monospace',
          fontSize: 18,
          borderRadius: 0,
          padding: '16px 32px',
          transition: 'all 200ms ease',
          boxShadow: 'none',
          transform: 'translate(0, 0)',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span>{value ? format(value, 'PPP', { locale: dateLocale }) : displayPlaceholder}</span>
        <span
          style={{
            marginLeft: 8,
            fontFamily: 'Space Grotesk, monospace',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {value ? format(value, 'yyyy-MM-dd') : ''}
        </span>
      </button>

      {isOpen && !disabled && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 50,
            marginTop: 4,
            border: '3px solid #0066ff',
            background: '#000000',
            borderRadius: 0,
            boxShadow: '0 20px 40px rgba(0,102,255,0.3)'
          }}
        >
          <DayPicker
            mode="single"
            selected={value || undefined}
            onSelect={handleDateSelect}
            month={selectedMonth}
            onMonthChange={setSelectedMonth}
            disabled={disabled}
            fromMonth={minDate}
            toMonth={maxDate}
            captionLayout="dropdown"
            style={{
              background: 'transparent'
            }}
          />
        </div>
      )}
    </div>
  )
}
