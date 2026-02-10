/**
 * 运行时配置管理
 * 支持 Edge Runtime（Cloudflare Workers）
 */

// 运行时配置接口
export interface RuntimeConfig {
  // AI Provider 选择
  provider: 'openai' | 'ollama' | 'dashscope' | 'custom'

  // OpenAI 兼容 API 配置
  apiUrl: string
  apiKey: string
  model: string

  // 模型参数
  maxTokens: number
  temperature: number

  // Ollama 专用配置
  ollamaHost?: string

  // 其他设置
  enableDebugLog: boolean

  // 更新时间
  updatedAt?: string
}

// 默认配置
const defaultRuntimeConfig: RuntimeConfig = {
  provider: 'dashscope',
  apiUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  apiKey: '',
  model: 'qwen-plus',
  maxTokens: 4000,
  temperature: 0.8,
  ollamaHost: 'http://localhost:11434',
  enableDebugLog: false,
}

// 使用全局变量存储配置（Edge Runtime 兼容）
declare global {
  // eslint-disable-next-line no-var
  var __RUNTIME_CONFIG_CACHE__: RuntimeConfig | null | undefined
}

// 初始化全局缓存
if (typeof globalThis.__RUNTIME_CONFIG_CACHE__ === 'undefined') {
  globalThis.__RUNTIME_CONFIG_CACHE__ = null
}

/**
 * 从环境变量初始化配置
 */
function initFromEnv(): RuntimeConfig {
  const config = { ...defaultRuntimeConfig }

  // 检测 provider
  const localUrl = process.env.AI_LOCAL_URL
  const completionUrl = process.env.COMPLETION_URL

  if (localUrl?.includes('11434')) {
    config.provider = 'ollama'
    config.ollamaHost = localUrl.replace('/v1/chat/completions', '')
  } else if (completionUrl?.includes('dashscope')) {
    config.provider = 'dashscope'
  } else if (completionUrl?.includes('openai')) {
    config.provider = 'openai'
  }

  // 设置 URL 和 Key
  config.apiUrl = localUrl || completionUrl || config.apiUrl
  config.apiKey = process.env.AI_LOCAL_KEY || process.env.BEARER_TOKEN || ''
  config.model = process.env.AI_LOCAL_MODEL || process.env.MODEL_NAME || config.model
  config.maxTokens = Number(process.env.AI_MAX_TOKENS) || config.maxTokens
  config.temperature = Number(process.env.AI_TEMPERATURE) || config.temperature

  return config
}

/**
 * 加载运行时配置
 * 注意：在 Edge Runtime 中，配置存储在内存中，不会持久化到文件系统
 */
export function loadRuntimeConfig(): RuntimeConfig {
  // 如果有缓存，直接返回
  if (globalThis.__RUNTIME_CONFIG_CACHE__) {
    return globalThis.__RUNTIME_CONFIG_CACHE__
  }

  // 从环境变量初始化
  globalThis.__RUNTIME_CONFIG_CACHE__ = initFromEnv()
  return globalThis.__RUNTIME_CONFIG_CACHE__
}

/**
 * 保存运行时配置
 * 注意：在 Edge Runtime 中，配置仅保存在内存中
 */
export function saveRuntimeConfig(config: Partial<RuntimeConfig>): RuntimeConfig {
  const currentConfig = loadRuntimeConfig()
  const newConfig: RuntimeConfig = {
    ...currentConfig,
    ...config,
    updatedAt: new Date().toISOString(),
  }

  globalThis.__RUNTIME_CONFIG_CACHE__ = newConfig
  return newConfig
}

/**
 * 重置为默认配置
 */
export function resetRuntimeConfig(): RuntimeConfig {
  globalThis.__RUNTIME_CONFIG_CACHE__ = null
  return loadRuntimeConfig()
}

/**
 * 清除缓存，强制重新加载
 */
export function clearConfigCache(): void {
  globalThis.__RUNTIME_CONFIG_CACHE__ = null
}

/**
 * 根据 provider 获取预设的 API URL
 */
export function getProviderPresets(provider: RuntimeConfig['provider']): Partial<RuntimeConfig> {
  switch (provider) {
    case 'openai':
      return {
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4o-mini',
      }
    case 'ollama':
      return {
        apiUrl: 'http://localhost:11434/v1/chat/completions',
        apiKey: 'ollama',
        model: 'qwen2.5:14b',
      }
    case 'dashscope':
      return {
        apiUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        model: 'qwen-plus',
      }
    case 'custom':
    default:
      return {}
  }
}

/**
 * 验证配置是否有效
 */
export function validateConfig(config: RuntimeConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.apiUrl) {
    errors.push('API URL 不能为空')
  }

  if (!config.apiKey && config.provider !== 'ollama') {
    errors.push('API Key 不能为空')
  }

  if (!config.model) {
    errors.push('模型名称不能为空')
  }

  if (config.maxTokens < 100 || config.maxTokens > 128000) {
    errors.push('Max Tokens 应在 100-128000 之间')
  }

  if (config.temperature < 0 || config.temperature > 2) {
    errors.push('Temperature 应在 0-2 之间')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
