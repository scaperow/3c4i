/**
 * AI 服务配置
 * 支持开发环境和生产环境的不同配置
 * 支持运行时动态配置
 */

import fs from 'fs'
import path from 'path'

// 获取当前环境
const isDev = process.env.NODE_ENV === 'development'

// AI 服务配置接口
export interface AIConfig {
  apiUrl: string
  apiKey: string
  model: string
  maxTokens: number
  temperature: number
}

// 默认配置
const defaultConfig: AIConfig = {
  apiUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  apiKey: '',
  model: 'qwen-plus',
  maxTokens: 4000,
  temperature: 0.8
}

// 运行时配置文件路径
const RUNTIME_CONFIG_FILE = path.join(process.cwd(), '.runtime-config.json')

/**
 * 尝试从运行时配置文件加载配置
 */
function loadRuntimeConfigSync(): AIConfig | null {
  try {
    if (fs.existsSync(RUNTIME_CONFIG_FILE)) {
      const content = fs.readFileSync(RUNTIME_CONFIG_FILE, 'utf-8')
      const runtimeConfig = JSON.parse(content)
      if (runtimeConfig.apiUrl && runtimeConfig.model) {
        return {
          apiUrl: runtimeConfig.apiUrl,
          apiKey: runtimeConfig.apiKey || '',
          model: runtimeConfig.model,
          maxTokens: runtimeConfig.maxTokens || defaultConfig.maxTokens,
          temperature: runtimeConfig.temperature ?? defaultConfig.temperature
        }
      }
    }
  } catch (e) {
    // 忽略错误，使用环境变量配置
  }
  return null
}

/**
 * 获取 AI 配置
 * 优先级：运行时配置 > 环境变量 > 默认配置
 */
export function getAIConfig(): AIConfig {
  // 1. 优先尝试加载运行时配置
  const runtimeConfig = loadRuntimeConfigSync()
  if (runtimeConfig && runtimeConfig.apiKey) {
    return runtimeConfig
  }

  // 2. 开发环境优先使用本地配置
  if (isDev) {
    const localUrl = process.env.AI_LOCAL_URL || process.env.COMPLETION_URL
    const localKey = process.env.AI_LOCAL_KEY || process.env.BEARER_TOKEN
    const localModel = process.env.AI_LOCAL_MODEL || process.env.MODEL_NAME

    if (localUrl && localKey) {
      return {
        apiUrl: localUrl,
        apiKey: localKey,
        model: localModel || 'qwen-plus',
        maxTokens: Number(process.env.AI_MAX_TOKENS) || defaultConfig.maxTokens,
        temperature: Number(process.env.AI_TEMPERATURE) || defaultConfig.temperature
      }
    }
  }

  // 3. 生产环境配置
  return {
    apiUrl: process.env.COMPLETION_URL || process.env.AI_API_URL || defaultConfig.apiUrl,
    apiKey: process.env.BEARER_TOKEN || process.env.AI_API_KEY || defaultConfig.apiKey,
    model: process.env.MODEL_NAME || process.env.AI_MODEL || defaultConfig.model,
    maxTokens: Number(process.env.AI_MAX_TOKENS) || defaultConfig.maxTokens,
    temperature: Number(process.env.AI_TEMPERATURE) || defaultConfig.temperature
  }
}

/**
 * 检查 AI 配置是否有效
 */
export function isAIConfigValid(config: AIConfig): boolean {
  return Boolean(config.apiUrl && config.apiKey && config.model)
}

/**
 * 获取环境信息（用于调试）
 */
export function getEnvInfo(): { environment: string; hasConfig: boolean } {
  const config = getAIConfig()
  return {
    environment: isDev ? 'development' : 'production',
    hasConfig: isAIConfigValid(config)
  }
}
