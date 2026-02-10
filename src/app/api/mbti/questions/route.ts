import { NextRequest, NextResponse } from 'next/server'
import en from '@/src/locales/en.json'
import zhCN from '@/src/locales/zh-CN.json'
import zhTW from '@/src/locales/zh-TW.json'

export const dynamic = 'force-dynamic'

const locales: Record<string, any> = {
  en: en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  zh: zhCN
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lang = searchParams.get('lang') || 'zh-CN'

    // Default to zh-CN if lang not found
    const localeData = locales[lang] || locales['zh-CN']

    // The questions are stored under mbti.questions in the locale files
    const questions = localeData.mbti?.questions || []

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Error loading questions:', error)
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
  }
}
