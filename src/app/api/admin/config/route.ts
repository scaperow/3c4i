import { NextRequest, NextResponse } from 'next/server'
import {
  loadRuntimeConfig,
  saveRuntimeConfig,
  resetRuntimeConfig,
  validateConfig,
  getProviderPresets,
  type RuntimeConfig
} from '@/lib/ai/runtime-config'

// GET - 获取当前配置
export async function GET() {
  try {
    const config = loadRuntimeConfig()

    // 隐藏敏感信息（只显示部分 API Key）
    const safeConfig = {
      ...config,
      apiKey: config.apiKey ? `${config.apiKey.substring(0, 8)}...${config.apiKey.substring(config.apiKey.length - 4)}` : '',
      hasApiKey: Boolean(config.apiKey),
    }

    return NextResponse.json({
      success: true,
      data: safeConfig,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '获取配置失败',
    }, { status: 500 })
  }
}

// POST - 更新配置
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, config } = body

    // 处理特殊操作
    if (action === 'reset') {
      const resetConfig = resetRuntimeConfig()
      return NextResponse.json({
        success: true,
        data: resetConfig,
        message: '配置已重置为默认值',
      })
    }

    if (action === 'get-presets') {
      const presets = getProviderPresets(config?.provider || 'dashscope')
      return NextResponse.json({
        success: true,
        data: presets,
      })
    }

    // 更新配置
    if (config) {
      const currentConfig = loadRuntimeConfig()
      const newConfig: RuntimeConfig = {
        ...currentConfig,
        ...config,
        // 如果 apiKey 是隐藏格式，保持原值
        apiKey: config.apiKey?.includes('...') ? currentConfig.apiKey : (config.apiKey || currentConfig.apiKey),
      }

      // 验证配置
      const validation = validateConfig(newConfig)
      if (!validation.valid) {
        return NextResponse.json({
          success: false,
          errors: validation.errors,
        }, { status: 400 })
      }

      const savedConfig = saveRuntimeConfig(newConfig)

      return NextResponse.json({
        success: true,
        data: {
          ...savedConfig,
          apiKey: savedConfig.apiKey ? `${savedConfig.apiKey.substring(0, 8)}...` : '',
          hasApiKey: Boolean(savedConfig.apiKey),
        },
        message: '配置已保存',
      })
    }

    return NextResponse.json({
      success: false,
      error: '无效的请求',
    }, { status: 400 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '保存配置失败',
    }, { status: 500 })
  }
}
