'use server'

import { generateNamePrompt, buildPromptParams, type NameGenerationParams } from './lib/prompts'
import { getAIClient, AIError, getEnvInfo } from '@/lib/ai'

export interface NameCharAnalysis {
  char: string
  wuxing: string
  meaning: string
}

export interface NameResult {
  fullName: string
  givenName: string
  pinyin: string
  meaning: string
  charAnalysis: NameCharAnalysis[]
  origin: string
  score: number
}

export interface GenerationAnalysis {
  surname_info: string
  bazi_analysis: string
  wuxing_summary: string
  wuxing_suggestion: string
}

export interface GenerateNamesResponse {
  analysis: GenerationAnalysis
  names: NameResult[]
}

interface GenerateParams {
  surname: string
  gender: string
  nameStructure?: string
  birthDate?: string
  birthTime?: string
  calendarType?: string
  style?: string
  balance?: string
  otherConfig?: string
}

/**
 * 生成名字的 Server Action
 */
export async function generateNamesAction(params: GenerateParams): Promise<GenerateNamesResponse> {
  const {
    surname,
    gender,
    nameStructure,
    birthDate,
    birthTime,
    calendarType,
    style,
    balance,
    otherConfig
  } = params

  // 验证输入
  if (!surname) {
    throw new Error('Surname is required')
  }

  // 构建提示词参数
  const promptParams = buildPromptParams({
    surname,
    gender,
    nameStructure,
    birthDate,
    birthTime,
    calendarType,
    style,
    balance,
    otherConfig
  })

  // 生成提示词
  const prompt = generateNamePrompt(promptParams)

  console.log('=== Generated Prompt ===')
  console.log(prompt)
  console.log('=== Environment Info ===')
  console.log(getEnvInfo())
  console.log('========================')

  try {
    const aiClient = getAIClient()
    const configInfo = aiClient.getConfigInfo()

    console.log('=== AI Config ===')
    console.log('API URL:', configInfo.apiUrl)
    console.log('Model:', configInfo.model)
    console.log('Has API Key:', configInfo.hasKey)
    console.log('=================')

    if (!configInfo.hasKey) {
      console.warn('Missing API key, falling back to mock data')
      return getMockResponse(surname, promptParams)
    }

    const systemPrompt = '你是一位专业的中国起名大师，精通姓名学、五行八字和传统文化。请严格按照用户要求的 JSON 格式输出结果。'

    const result = await aiClient.completeJSON<{
      analysis?: {
        surname_info?: string
        bazi_analysis?: string
        wuxing_summary?: string
        wuxing_suggestion?: string
      }
      names: Array<{
        fullName?: string
        name?: string
        givenName?: string
        pinyin?: string
        meaning?: string
        charAnalysis?: Array<{
          char?: string
          wuxing?: string
          meaning?: string
        }>
        origin?: string
        score?: number
      }>
    }>(prompt, systemPrompt)

    // 验证和规范化结果
    if (!result.names || !Array.isArray(result.names)) {
      throw new Error('Invalid response format: missing names array')
    }

    return {
      analysis: {
        surname_info: result.analysis?.surname_info || '',
        bazi_analysis: result.analysis?.bazi_analysis || '',
        wuxing_summary: result.analysis?.wuxing_summary || '',
        wuxing_suggestion: result.analysis?.wuxing_suggestion || ''
      },
      names: result.names.slice(0, 12).map((item: any) => ({
        fullName: String(item.fullName || item.name || ''),
        givenName: String(item.givenName || ''),
        pinyin: String(item.pinyin || ''),
        meaning: String(item.meaning || ''),
        charAnalysis: Array.isArray(item.charAnalysis)
          ? item.charAnalysis.map((ca: any) => ({
              char: String(ca.char || ''),
              wuxing: String(ca.wuxing || ''),
              meaning: String(ca.meaning || '')
            }))
          : [],
        origin: String(item.origin || ''),
        score: Number(item.score || 85)
      }))
    }
  } catch (error) {
    if (error instanceof AIError) {
      console.error('AI Error:', error.code, error.message, error.status)
    } else {
      console.error('Name generation error:', error)
    }
    // 出错时返回 mock 数据
    return getMockResponse(surname, promptParams)
  }
}

/**
 * 获取 Mock 响应（开发/测试用）
 */
function getMockResponse(surname: string, params: NameGenerationParams): GenerateNamesResponse {
  const { gender, fixedChars, givenNameLength, style } = params
  const isBoy = gender === 'boy'

  // 根据风格选择不同的名字
  const namePool = isBoy
    ? [
        {
          given: '泽宇',
          pinyin: 'zé yǔ',
          meaning: '泽：恩泽、光泽，宇：气宇轩昂。寓意福泽深厚，胸怀广阔，气度不凡。',
          origin: '《楚辞》："皇览揆余初度兮，肇锡余以嘉名"',
          charAnalysis: [
            { char: '泽', wuxing: '水', meaning: '恩泽、润泽' },
            { char: '宇', wuxing: '土', meaning: '宇宙、气宇' }
          ]
        },
        {
          given: '浩然',
          pinyin: 'hào rán',
          meaning: '取自"浩然正气"，寓意胸怀宽广、光明磊落，正气凛然。',
          origin: '《孟子》："我善养吾浩然之气"',
          charAnalysis: [
            { char: '浩', wuxing: '水', meaning: '广大、浩瀚' },
            { char: '然', wuxing: '金', meaning: '如此、自然' }
          ]
        },
        {
          given: '子轩',
          pinyin: 'zǐ xuān',
          meaning: '子：天之骄子，轩：气宇轩昂。寓意才貌双全，气质高雅。',
          origin: '古代常用于表达对子嗣的美好期望',
          charAnalysis: [
            { char: '子', wuxing: '水', meaning: '儿子、有学问的人' },
            { char: '轩', wuxing: '土', meaning: '高大、轩昂' }
          ]
        },
        {
          given: '锦程',
          pinyin: 'jǐn chéng',
          meaning: '锦绣前程，寓意未来发展顺利，前途光明灿烂。',
          origin: '成语"前程似锦"',
          charAnalysis: [
            { char: '锦', wuxing: '金', meaning: '锦绣、美好' },
            { char: '程', wuxing: '木', meaning: '路程、前程' }
          ]
        },
        {
          given: '梓睿',
          pinyin: 'zǐ ruì',
          meaning: '梓：生机勃勃，睿：聪明睿智。寓意聪慧过人，茁壮成长。',
          origin: '梓为良木，古代常用于表达父母对子女的爱',
          charAnalysis: [
            { char: '梓', wuxing: '木', meaning: '梓树、故乡' },
            { char: '睿', wuxing: '金', meaning: '智慧、明智' }
          ]
        },
        {
          given: '宇航',
          pinyin: 'yǔ háng',
          meaning: '宇宙航行，寓意志向远大，勇于探索，追求卓越。',
          origin: '现代词汇，象征对未来的憧憬',
          charAnalysis: [
            { char: '宇', wuxing: '土', meaning: '宇宙、空间' },
            { char: '航', wuxing: '水', meaning: '航行、远航' }
          ]
        }
      ]
    : [
        {
          given: '诗涵',
          pinyin: 'shī hán',
          meaning: '诗：诗情画意，涵：内涵深厚。寓意才华横溢，气质如诗。',
          origin: '诗经传统，涵养深厚',
          charAnalysis: [
            { char: '诗', wuxing: '金', meaning: '诗歌、诗意' },
            { char: '涵', wuxing: '水', meaning: '包含、涵养' }
          ]
        },
        {
          given: '若琳',
          pinyin: 'ruò lín',
          meaning: '若：温婉如玉，琳：美玉。寓意温柔典雅，美丽如玉。',
          origin: '琳琅满目，美玉之意',
          charAnalysis: [
            { char: '若', wuxing: '木', meaning: '如果、好像' },
            { char: '琳', wuxing: '木', meaning: '美玉' }
          ]
        },
        {
          given: '梦瑶',
          pinyin: 'mèng yáo',
          meaning: '梦：如梦如幻，瑶：美玉。寓意梦想美好，珍贵如瑶。',
          origin: '瑶池仙境之意',
          charAnalysis: [
            { char: '梦', wuxing: '木', meaning: '梦想、梦境' },
            { char: '瑶', wuxing: '火', meaning: '美玉' }
          ]
        },
        {
          given: '欣妍',
          pinyin: 'xīn yán',
          meaning: '欣：欣欣向荣，妍：美丽。寓意快乐美丽，朝气蓬勃。',
          origin: '欣欣向荣，妍姿艳质',
          charAnalysis: [
            { char: '欣', wuxing: '木', meaning: '高兴、欣喜' },
            { char: '妍', wuxing: '水', meaning: '美丽' }
          ]
        },
        {
          given: '语嫣',
          pinyin: 'yǔ yān',
          meaning: '语：言语温柔，嫣：美好。寓意温柔善言，笑靥如花。',
          origin: '嫣然一笑',
          charAnalysis: [
            { char: '语', wuxing: '木', meaning: '言语、说话' },
            { char: '嫣', wuxing: '土', meaning: '美好的样子' }
          ]
        },
        {
          given: '芷若',
          pinyin: 'zhǐ ruò',
          meaning: '芷：香草，若：温柔。寓意清新淡雅，温婉如兰。',
          origin: '《楚辞》："沅有芷兮澧有兰"',
          charAnalysis: [
            { char: '芷', wuxing: '木', meaning: '香草' },
            { char: '若', wuxing: '木', meaning: '如果、好像' }
          ]
        }
      ]

  // 处理固定字
  const processedNames = namePool.map((n, index) => {
    let given = n.given
    let charAnalysis = [...n.charAnalysis]

    // 如果有固定字，替换相应位置
    if (fixedChars.length > 0) {
      const chars = given.split('')
      fixedChars.forEach((fc) => {
        if (fc.position < chars.length) {
          chars[fc.position] = fc.char
          charAnalysis[fc.position] = {
            char: fc.char,
            wuxing: '待分析',
            meaning: '用户指定字'
          }
        }
      })
      given = chars.join('')
    }

    // 如果名的长度是1，只取第一个字
    if (givenNameLength === 1) {
      given = given[0]
      charAnalysis = [charAnalysis[0]]
    }

    return {
      fullName: surname + given,
      givenName: given,
      pinyin: `${surname.toLowerCase()} ${n.pinyin}`,
      meaning: n.meaning,
      charAnalysis,
      origin: n.origin,
      score: 95 - index * 2
    }
  })

  return {
    analysis: {
      surname_info: `「${surname}」是中国常见姓氏，历史悠久，名人辈出。`,
      bazi_analysis: '（未提供生辰信息，无法进行八字分析）',
      wuxing_summary: '建议根据具体生辰进行五行分析，以获得更精准的起名建议。',
      wuxing_suggestion: '通用建议：选择寓意美好、音韵和谐的字。'
    },
    names: processedNames
  }
}

// 保持向后兼容的旧接口
export type { NameResult as LegacyNameResult }
