'use client'

import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { useEffect, useState } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const toggleLanguage = (lang: string) => {
    if (lang) {
      i18n.changeLanguage(lang)
    }
  }

  return (
    <ToggleGroup.Root
      type="single"
      value={i18n.language}
      onValueChange={toggleLanguage}
      className="flex items-center gap-2 text-xs font-mono text-white/40 z-50 relative"
    >
      <Globe size={14} />
      <ToggleGroup.Item
        value="zh-CN"
        className="hover:text-white transition-colors data-[state=on]:text-neo-red focus:outline-none cursor-pointer"
        aria-label="Chinese (Simplified)"
      >
        CN
      </ToggleGroup.Item>
      <span>/</span>
      <ToggleGroup.Item
        value="zh-TW"
        className="hover:text-white transition-colors data-[state=on]:text-neo-red focus:outline-none cursor-pointer"
        aria-label="Chinese (Traditional)"
      >
        TW
      </ToggleGroup.Item>
      <span>/</span>
      <ToggleGroup.Item
        value="en"
        className="hover:text-white transition-colors data-[state=on]:text-neo-red focus:outline-none cursor-pointer"
        aria-label="English"
      >
        EN
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}
