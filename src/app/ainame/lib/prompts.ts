/**
 * AI 起名提示词生成器
 * 根据表单配置生成完整的 AI 起名提示词
 */

export interface NameStructureSlot {
  type: 'surname' | 'fixed' | 'empty'
  value?: string
  position: number
}

export interface NameGenerationParams {
  /** 姓氏 */
  surname: string
  /** 姓氏长度 */
  surnameLength: number
  /** 名的长度 */
  givenNameLength: number
  /** 名字总长度 */
  totalLength: number
  /** 名的结构：每个位置是固定字还是待生成 */
  nameStructure: NameStructureSlot[]
  /** 特定字（名字中必须包含的字）及其位置 */
  fixedChars: { char: string; position: number }[]
  /** 性别 */
  gender: 'boy' | 'girl'
  /** 生日（格式：YYYY-MM-DD） */
  birthDate?: string
  /** 出生时间（格式：HH:mm） */
  birthTime?: string
  /** 日历类型 */
  calendarType?: 'solar' | 'lunar'
  /** 名字风格 */
  style?: 'literary' | 'chinese' | 'minimalist' | 'modern' | 'nature'
  /** 五行调和 */
  balance?: 'auto' | 'metal' | 'wood' | 'water' | 'fire' | 'earth'
  /** 其他要求 */
  otherRequirements?: string
  /** 生成数量 */
  count?: number
}

/**
 * 风格描述映射
 */
const styleDescriptions: Record<string, { name: string; desc: string; examples: string }> = {
  literary: {
    name: '文艺风',
    desc: '富有诗意和文学气息，引用古诗词典故，意境优美',
    examples: '云舒、墨言、清辞、诗涵、若琳、梦瑶'
  },
  chinese: {
    name: '中国风',
    desc: '体现传统文化底蕴，注重礼仪德行，端庄大气',
    examples: '承熙、礼贤、德润、婉仪、淑慧、嘉懿'
  },
  minimalist: {
    name: '简约风',
    desc: '简洁明快，朗朗上口，寓意清晰直接',
    examples: '一帆、子轩、明哲、心悦、思琪、雨晴'
  },
  modern: {
    name: '现代风',
    desc: '时尚新颖，符合当代审美，独特而不失优雅',
    examples: '晨曦、逸飞、泽宇、语嫣、欣妍、芷若'
  },
  nature: {
    name: '自然风',
    desc: '取材自然万物，清新脱俗，充满生命力',
    examples: '林风、泉声、岳峰、溪云、雪晴、芷兰'
  }
}

/**
 * 五行描述映射
 */
const wuxingDescriptions: Record<string, { name: string; desc: string; chars: string }> = {
  metal: {
    name: '金',
    desc: '坚毅、锐利、果断',
    chars: '含金、钅、刂旁的字，如：锋、铭、钰、鑫、钧'
  },
  wood: {
    name: '木',
    desc: '生长、仁爱、向上',
    chars: '含木、艹、竹旁的字，如：林、森、梓、菲、萱'
  },
  water: {
    name: '水',
    desc: '智慧、灵动、柔和',
    chars: '含氵、冫、水旁的字，如：泽、涵、淳、清、澜'
  },
  fire: {
    name: '火',
    desc: '热情、光明、活力',
    chars: '含火、灬、日旁的字，如：炎、烨、煜、晖、昊'
  },
  earth: {
    name: '土',
    desc: '稳重、厚德、包容',
    chars: '含土、山、石旁的字，如：坤、垚、岩、磊、城'
  }
}

/**
 * 生成名字结构描述
 */
function generateStructureDescription(params: NameGenerationParams): string {
  const { surname, givenNameLength, fixedChars, totalLength } = params

  let structureStr = `「${surname}`
  const givenNameParts: string[] = []

  for (let i = 0; i < givenNameLength; i++) {
    const fixed = fixedChars.find((f) => f.position === i)
    if (fixed) {
      givenNameParts.push(fixed.char)
    } else {
      givenNameParts.push('○')
    }
  }

  structureStr += givenNameParts.join('') + '」'

  const desc = [`- 名字总长度：${totalLength} 个字`, `- 姓氏：「${surname}」（${surname.length} 字）`, `- 名：${givenNameLength} 个字`, `- 结构示意：${structureStr}（○ 表示需要 AI 生成的字）`]

  if (fixedChars.length > 0) {
    desc.push(`- 固定字要求：`)
    fixedChars.forEach((f) => {
      desc.push(`  - 第 ${surname.length + f.position + 1} 个字（名的第 ${f.position + 1} 个字）必须是「${f.char}」`)
    })
  }

  return desc.join('\n')
}

/**
 * 生成 AI 起名提示词
 */
export function generateNamePrompt(params: NameGenerationParams): string {
  const {
    surname,
    givenNameLength,
    fixedChars,
    gender,
    birthDate,
    birthTime,
    calendarType = 'solar',
    style,
    balance,
    otherRequirements,
    count = 6
  } = params

  const sections: string[] = []

  // ===== 角色设定 =====
  sections.push(`你是一位精通中国传统文化、姓名学和五行八字的资深起名大师。请严格按照以下要求为用户起名。`)

  // ===== 基本要求 =====
  const genderText = gender === 'boy' ? '男孩' : '女孩'
  const genderDesc = gender === 'boy' ? '阳刚大气，寓意事业有成、品德高尚' : '温婉优雅，寓意美好幸福、才德兼备'

  sections.push(`## 一、基本信息

${generateStructureDescription(params)}
- 性别：${genderText}（${genderDesc}）
- 生成数量：${count} 个名字`)

  // ===== 固定字要求（如果有） =====
  if (fixedChars.length > 0) {
    const fixedDesc = fixedChars
      .map((f) => {
        const positionInName = f.position + 1
        const positionInFull = surname.length + f.position + 1
        return `「${f.char}」必须位于名字的第 ${positionInFull} 个字（即名的第 ${positionInName} 个字）`
      })
      .join('\n- ')

    // 生成示例
    let example = surname
    for (let i = 0; i < givenNameLength; i++) {
      const fixed = fixedChars.find((fc) => fc.position === i)
      example += fixed ? fixed.char : 'X'
    }

    sections.push(`## 二、固定字要求【重要】

以下字符在名字中的位置是固定的，不可更改：
- ${fixedDesc}

示例格式：「${example}」（其中 X 为需要 AI 生成的字）

**注意：固定字的位置必须严格遵守，不能调换位置。**`)
  }

  // ===== 生辰八字与五行（如果有生日） =====
  if (birthDate) {
    const calendarDesc = calendarType === 'lunar' ? '农历' : '公历'
    const timeDesc = birthTime ? `\n- 出生时间：${birthTime}` : ''

    let wuxingInstruction = ''
    if (balance && balance !== 'auto') {
      const wx = wuxingDescriptions[balance]
      wuxingInstruction = `
**用户指定五行偏好：${wx.name}**
请在名字中优先使用五行属「${wx.name}」的字（${wx.chars}），以增强该属性。`
    } else {
      wuxingInstruction = `
请根据八字分析结果，自动判断需要补充的五行属性，在名字中进行平衡。`
    }

    sections.push(`## 三、生辰八字与五行

- 出生日期：${calendarDesc} ${birthDate}${timeDesc}

请进行以下分析：
1. 根据出生日期推算生辰八字（年柱、月柱、日柱、时柱）
2. 分析八字中的五行分布（金、木、水、火、土的强弱）
3. 确定日主强弱和喜用神
4. 识别五行中缺失或偏弱的元素
${wuxingInstruction}

五行属性参考：
- 金：${wuxingDescriptions.metal.chars}
- 木：${wuxingDescriptions.wood.chars}
- 水：${wuxingDescriptions.water.chars}
- 火：${wuxingDescriptions.fire.chars}
- 土：${wuxingDescriptions.earth.chars}`)
  } else if (balance && balance !== 'auto') {
    // 没有生日但指定了五行
    const wx = wuxingDescriptions[balance]
    sections.push(`## 三、五行偏好

用户希望名字侧重「${wx.name}」属性（${wx.desc}）。
请优先选用五行属「${wx.name}」的字：${wx.chars}`)
  }

  // ===== 风格要求（如果有） =====
  if (style && styleDescriptions[style]) {
    const s = styleDescriptions[style]
    sections.push(`## 四、风格要求

请按照「${s.name}」风格起名：
- 特点：${s.desc}
- 参考示例：${s.examples}

名字应体现该风格的特点，在意境、用字、寓意上保持一致。`)
  }

  // ===== 其他要求（如果有） =====
  if (otherRequirements && otherRequirements.trim()) {
    sections.push(`## 五、特殊要求

${otherRequirements.trim()}`)
  }

  // ===== 通用起名原则 =====
  sections.push(`## 起名原则

1. **结构正确**：严格遵守名字结构要求，固定字位置不可更改
2. **音韵优美**：声调搭配和谐（避免三连同调），读起来朗朗上口，避免拗口或谐音不雅
3. **字形美观**：笔画结构均衡，书写美观，避免过于繁复或生僻的字
4. **寓意吉祥**：字义积极向上，寓意美好，承载期望与祝福
5. **避免重复**：每个名字都应独特，避免雷同
6. **文化内涵**：可适当引用古诗词、典故，增加文化底蕴`)

  // ===== 输出格式 =====
  sections.push(`## 输出格式

请严格按照以下 JSON 格式输出，确保格式正确可解析：

\`\`\`json
{
  "analysis": {
    "surname_info": "姓氏「${surname}」的含义和来源",
    "bazi_analysis": "八字分析结果（如有生辰信息）",
    "wuxing_summary": "五行分布总结（如有生辰信息）",
    "wuxing_suggestion": "五行补充建议"
  },
  "names": [
    {
      "fullName": "完整姓名（必须符合结构要求）",
      "givenName": "名（不含姓氏）",
      "pinyin": "完整拼音（带声调数字，如 lǐ zé yǔ）",
      "meaning": "名字的整体寓意解释（80字以内）",
      "charAnalysis": [
        { "char": "字1", "wuxing": "五行属性", "meaning": "单字含义" }
      ],
      "origin": "出处或灵感来源（古诗词、典故等，如无可留空）",
      "score": 90
    }
  ]
}
\`\`\`

**输出要求：**
- 必须输出 ${count} 个名字
- score 评分范围 80-98，根据音韵、寓意、五行匹配度等综合评估
- 每个名字的 fullName 必须以「${surname}」开头
- charAnalysis 只分析名的每个字（不含姓氏）
- 确保 JSON 格式正确，不要有多余的逗号或语法错误
- 只输出 JSON，不要有其他内容`)

  return sections.join('\n\n')
}

/**
 * 从 URL 参数解析名字结构
 */
export function parseNameStructure(structureJson: string): NameStructureSlot[] {
  try {
    const arr = JSON.parse(structureJson) as string[]
    return arr.map((item, index) => {
      if (item === 'surname') {
        return { type: 'surname' as const, position: index }
      } else if (item.startsWith('fixed:')) {
        return { type: 'fixed' as const, value: item.replace('fixed:', ''), position: index }
      } else {
        return { type: 'empty' as const, position: index }
      }
    })
  } catch {
    return []
  }
}

/**
 * 从表单/URL 参数构建提示词参数
 */
export function buildPromptParams(urlParams: {
  surname: string
  gender: string
  nameStructure?: string
  birthDate?: string
  birthTime?: string
  calendarType?: string
  style?: string
  balance?: string
  otherConfig?: string
}): NameGenerationParams {
  const { surname, gender, nameStructure, birthDate, birthTime, calendarType, style, balance, otherConfig } = urlParams

  // 解析名字结构
  const structure = nameStructure ? parseNameStructure(nameStructure) : []

  // 计算姓氏和名的长度
  const surnameSlots = structure.filter((s) => s.type === 'surname')
  const givenNameSlots = structure.filter((s) => s.type !== 'surname')

  const surnameLength = surname.length || surnameSlots.length || 1
  const givenNameLength = givenNameSlots.length || 2
  const totalLength = surnameLength + givenNameLength

  // 提取固定字
  const fixedChars: { char: string; position: number }[] = []
  givenNameSlots.forEach((slot, index) => {
    if (slot.type === 'fixed' && slot.value) {
      fixedChars.push({ char: slot.value, position: index })
    }
  })

  return {
    surname: surname || '李',
    surnameLength,
    givenNameLength,
    totalLength,
    nameStructure: structure,
    fixedChars,
    gender: (gender as 'boy' | 'girl') || 'boy',
    birthDate: birthDate || undefined,
    birthTime: birthTime || undefined,
    calendarType: (calendarType as 'solar' | 'lunar') || 'solar',
    style: style as NameGenerationParams['style'],
    balance: balance as NameGenerationParams['balance'],
    otherRequirements: otherConfig || undefined,
    count: 6
  }
}
