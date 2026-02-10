import { NextRequest, NextResponse } from 'next/server'
import { loadRuntimeConfig } from '@/lib/ai/runtime-config'

// Configure Edge Runtime for Cloudflare Workers
export const runtime = 'edge'

// POST - 测试 AI 连接
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { apiUrl, apiKey, model } = body

    // 使用提供的配置或当前配置
    const config = loadRuntimeConfig()
    const testUrl = apiUrl || config.apiUrl
    const testKey = apiKey?.includes('...') ? config.apiKey : (apiKey || config.apiKey)
    const testModel = model || config.model

    // 发送测试请求
    const startTime = Date.now()

    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testKey}`,
      },
      body: JSON.stringify({
        model: testModel,
        messages: [
          { role: 'user', content: '你好，请回复"连接成功"' }
        ],
        max_tokens: 50,
        temperature: 0.1,
      }),
    })

    const latency = Date.now() - startTime

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({
        success: false,
        error: `API 返回错误: ${response.status} - ${errorText}`,
        latency,
      }, { status: response.status })
    }

    const data = await response.json()
    const replyContent = data.choices?.[0]?.message?.content || '无响应'

    return NextResponse.json({
      success: true,
      message: '连接成功',
      data: {
        latency,
        model: data.model || testModel,
        reply: replyContent.substring(0, 100),
      },
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '连接测试失败',
    }, { status: 500 })
  }
}
