/**
 * AI 请求客户端
 * 封装与 AI 服务的通信逻辑
 */

import { getAIConfig, isAIConfigValid, type AIConfig } from './config'

// 消息类型
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// 请求选项
export interface ChatRequestOptions {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

// 响应类型
export interface ChatResponse {
  content: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// 错误类型
export class AIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'AIError'
  }
}

/**
 * AI 客户端类
 */
export class AIClient {
  private config: AIConfig

  constructor(config?: Partial<AIConfig>) {
    this.config = { ...getAIConfig(), ...config }
  }

  /**
   * 发送聊天请求
   */
  async chat(options: ChatRequestOptions): Promise<ChatResponse> {
    if (!isAIConfigValid(this.config)) {
      throw new AIError('AI configuration is invalid', undefined, 'CONFIG_INVALID')
    }

    const { messages, temperature, maxTokens, stream = false } = options

    try {
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: temperature ?? this.config.temperature,
          max_tokens: maxTokens ?? this.config.maxTokens,
          stream
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[AIClient] API Error:', {
          status: response.status,
          statusText: response.statusText,
          url: this.config.apiUrl,
          model: this.config.model,
          response: errorText
        })
        throw new AIError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          'API_ERROR'
        )
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content

      if (!content) {
        throw new AIError('Empty response from API', undefined, 'EMPTY_RESPONSE')
      }

      return {
        content,
        usage: data.usage
      }
    } catch (error) {
      if (error instanceof AIError) {
        throw error
      }
      throw new AIError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'NETWORK_ERROR'
      )
    }
  }

  /**
   * 发送简单的文本请求
   */
  async complete(
    prompt: string,
    systemPrompt?: string,
    options?: Omit<ChatRequestOptions, 'messages'>
  ): Promise<string> {
    const messages: ChatMessage[] = []

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }
    messages.push({ role: 'user', content: prompt })

    const response = await this.chat({ ...options, messages })
    return response.content
  }

  /**
   * 发送 JSON 格式的请求并解析响应
   */
  async completeJSON<T>(
    prompt: string,
    systemPrompt?: string,
    options?: Omit<ChatRequestOptions, 'messages'>
  ): Promise<T> {
    const content = await this.complete(prompt, systemPrompt, options)

    // 处理可能的 markdown 代码块
    let jsonStr = content.trim()
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }

    try {
      return JSON.parse(jsonStr) as T
    } catch (error) {
      throw new AIError(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'JSON_PARSE_ERROR'
      )
    }
  }

  /**
   * 获取当前配置信息（隐藏敏感信息）
   */
  getConfigInfo(): { apiUrl: string; model: string; hasKey: boolean } {
    return {
      apiUrl: this.config.apiUrl,
      model: this.config.model,
      hasKey: Boolean(this.config.apiKey)
    }
  }
}

// 创建默认客户端实例
let defaultClient: AIClient | null = null

/**
 * 获取默认 AI 客户端
 * 每次调用都会重新加载配置，以支持运行时配置更新
 */
export function getAIClient(): AIClient {
  // 总是创建新实例以获取最新配置
  defaultClient = new AIClient()
  return defaultClient
}

/**
 * 创建新的 AI 客户端
 */
export function createAIClient(config?: Partial<AIConfig>): AIClient {
  return new AIClient(config)
}
