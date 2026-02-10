'use client'

import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import { zhCN, zhTW } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { PALETTE } from '@/components/NeoChinese'

export interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
  style?: React.CSSProperties
  // MBTI style
  mbti?: boolean
  // AINaming style
  ainame?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = '选择日期',
  disabled = false,
  minDate,
  maxDate,
  className,
  style,
  mbti = false,
  ainame = false
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

  // MBTI themed styles
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
    }
    .rdp-day {
      color: ${PALETTE.white};
      border: 1px solid transparent;
      transition: all 200ms ease;
    }
    .rdp-day:hover:not(.rdp-selected):not(.rdp-disabled) {
      background: ${PALETTE.blue};
      transform: scale(1.05);
    }
    .rdp-day.rdp_selected {
      background: ${PALETTE.blue};
      color: ${PALETTE.white};
      font-weight: 700;
    }
  `

  // AINaming themed styles
  const ainameStyles = `
    .rdp {
      --rdp-background-color: ${PALETTE.white};
      --rdp-text-color: ${PALETTE.black};
      --rdp-accent-color: ${PALETTE.yellow};
      --rdp-border-color: ${PALETTE.black};
      --rdp-selected-color: ${PALETTE.yellow};
    }
    .rdp-head_row {
      border-bottom: 3px solid ${PALETTE.black};
    }
    .rdp-head_cell {
      font-weight: 800;
      color: ${PALETTE.black};
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.05em;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      padding: 12px 8px;
    }
    .rdp-day {
      color: #000000;
      border: 2px solid transparent;
      transition: all 250ms ease;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-weight: 500;
    }
    .rdp-day:hover:not(.rdp-selected):not(.rdp-disabled) {
      background: rgb(255, 204, 0);
      transform: scale(1.02);
    }
    .rdp-day.rdp_selected {
      background: rgb(255, 204, 0);
      color: #000000;
      font-weight: 900;
      border: 2px solid #000000;
      transform: scale(1.1);
    }
    .rdp-nav_button {
      background: #000000;
      color: #ffffff;
      border: 2px solid #000000;
      transition: all 250ms ease;
    }
    .rdp-nav_button:hover {
      background: rgb(255, 204, 0);
      color: #000000;
      transform: scale(1.05);
    }
  `

  const defaultStyles = `
    .rdp {
      --rdp-background-color: #ffffff;
      --rdp-text-color: #000000;
      --rdp-accent-color: #0066ff;
      --rdp-border-color: #e5e7eb;
      --rdp-selected-color: #0066ff;
    }
    .rdp-day:hover:not(.rdp-selected):not(.rdp-disabled) {
      background: #f3f4f6;
    }
    .rdp-day.rdp_selected {
      background: #0066ff;
      color: #ffffff;
    }
  `

  const styles = mbti ? mbtiStyles : ainame ? ainameStyles : defaultStyles

  // Button styles based on theme
  const buttonStyle = mbti
    ? {
        background: '#0066ff',
        color: '#ffffff',
        border: '3px solid #0066ff',
        fontWeight: 700,
        fontFamily: 'Helvetica Neue, Arial, sans-serif',
        fontSize: 18,
        borderRadius: 0,
        padding: '16px 32px',
        transition: 'all 200ms ease',
        boxShadow: 'none',
        transform: 'translate(0, 0)'
      }
    : ainame
      ? {
          background: '#ffffff',
          color: '#000000',
          border: '2px solid #000000',
          fontWeight: 700,
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          fontSize: 16,
          borderRadius: 0,
          padding: '12px 16px',
          transition: 'all 250ms ease',
          boxShadow: 'none',
          transform: 'translate(0, 0)'
        }
      : {
          background: '#ffffff',
          color: '#000000',
          border: '1px solid #d1d5db',
          borderRadius: 8,
          padding: '12px 16px',
          fontSize: 16,
          transition: 'all 200ms ease'
        }

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (mbti) {
      e.currentTarget.style.transform = 'translate(-2px, -2px)'
      e.currentTarget.style.boxShadow = '8px 8px 0px rgba(0,102,255,0.3)'
    } else if (ainame) {
      e.currentTarget.style.transform = 'translate(-4px, -4px)'
      e.currentTarget.style.boxShadow = '6px 6px 0px #000000'
    } else {
      e.currentTarget.style.borderColor = '#0066ff'
    }
  }

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (mbti) {
      e.currentTarget.style.transform = 'translate(0, 0)'
      e.currentTarget.style.boxShadow = 'none'
    } else if (ainame) {
      e.currentTarget.style.transform = 'translate(0, 0)'
      e.currentTarget.style.boxShadow = 'none'
    } else {
      e.currentTarget.style.borderColor = '#d1d5db'
    }
  }

  return (
    <div className={className} style={style}>
      <style>{styles}</style>

      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        onMouseEnter={handleButtonHover}
        onMouseLeave={handleButtonLeave}
        style={{
          ...buttonStyle,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span>{value ? format(value, 'PPP') : displayPlaceholder}</span>
        <span style={{ marginLeft: 8 }}>{value ? format(value, 'yyyy-MM-dd') : ''}</span>
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
            border: mbti ? '3px solid #0066ff' : ainame ? '3px solid #000000' : '1px solid #d1d5db',
            background: mbti ? '#000000' : '#ffffff',
            borderRadius: mbti ? 0 : 8,
            boxShadow: mbti
              ? '0 20px 40px rgba(0,102,255,0.3)'
              : ainame
                ? '8px 8px 0px #000000'
                : '0 10px 25px rgba(0,0,0,0.1)'
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
