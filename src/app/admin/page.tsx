'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Settings,
  Save,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  Server,
  Key,
  Cpu,
  Thermometer,
  Hash,
  Bug,
  Zap,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { NeoButton, NeoInput, NeoSelect, NeoCheckbox, NeoLabel, TOKENS } from '@/components/NeoChinese'

const THEME_COLOR = 'rgb(234 88 12)'

// 预设模型
const MODEL_PRESETS: Record<string, string[]> = {
  dashscope: ['qwen-plus', 'qwen-turbo', 'qwen-max', 'qwen-long'],
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  ollama: ['qwen2.5:14b', 'qwen2.5:7b', 'llama3.1:8b', 'mistral:7b', 'deepseek-coder:6.7b'],
  custom: [],
}

interface ConfigState {
  provider: 'openai' | 'ollama' | 'dashscope' | 'custom'
  apiUrl: string
  apiKey: string
  model: string
  maxTokens: number
  temperature: number
  ollamaHost?: string
  enableDebugLog: boolean
  hasApiKey?: boolean
  updatedAt?: string
}

export default function AdminPage() {
  const { t } = useTranslation()
  const inputClass = 'rounded-xl bg-white/8 border-white/20 text-white/90'

  // Provider 选项
  const PROVIDERS = [
    { value: 'dashscope', label: t('admin.provider.dashscope'), description: t('admin.provider.desc.dashscope') },
    { value: 'openai', label: t('admin.provider.openai'), description: t('admin.provider.desc.openai') },
    { value: 'ollama', label: t('admin.provider.ollama'), description: t('admin.provider.desc.ollama') },
    { value: 'custom', label: t('admin.provider.custom'), description: t('admin.provider.desc.custom') },
  ]

  const [config, setConfig] = useState<ConfigState>({
    provider: 'dashscope',
    apiUrl: '',
    apiKey: '',
    model: 'qwen-plus',
    maxTokens: 4000,
    temperature: 0.8,
    ollamaHost: 'http://localhost:11434',
    enableDebugLog: false,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null)
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  // 加载配置
  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/config')
      const data = await res.json()
      if (data.success) {
        setConfig(data.data)
      }
    } catch (e) {
      console.error('Failed to fetch config:', e)
    } finally {
      setLoading(false)
    }
  }

  // 切换 Provider 时获取预设
  const handleProviderChange = async (provider: ConfigState['provider']) => {
    setConfig(prev => ({ ...prev, provider }))

    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-presets', config: { provider } }),
      })
      const data = await res.json()
      if (data.success && data.data) {
        setConfig(prev => ({
          ...prev,
          provider,
          ...data.data,
        }))
      }
    } catch (e) {
      console.error('Failed to get presets:', e)
    }
  }

  // 保存配置
  const handleSave = async () => {
    setSaving(true)
    setSaveResult(null)
    setErrors([])

    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      })
      const data = await res.json()

      if (data.success) {
        setSaveResult({ success: true, message: data.message || t('admin.saved') })
        setConfig(data.data)
      } else {
        setSaveResult({ success: false, message: t('admin.saveFailed') })
        setErrors(data.errors || [])
      }
    } catch (e) {
      setSaveResult({ success: false, message: t('admin.saveFailed') + ': ' + (e instanceof Error ? e.message : t('common.unknownError')) })
    } finally {
      setSaving(false)
    }
  }

  // 重置配置
  const handleReset = async () => {
    if (!confirm(t('admin.resetConfirm'))) return

    setSaving(true)
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      })
      const data = await res.json()
      if (data.success) {
        setConfig(data.data)
        setSaveResult({ success: true, message: t('admin.resetSuccess') })
      }
    } catch (e) {
      console.error('Failed to reset:', e)
    } finally {
      setSaving(false)
    }
  }

  // 测试连接
  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      const res = await fetch('/api/admin/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiUrl: config.apiUrl,
          apiKey: config.apiKey,
          model: config.model,
        }),
      })
      const data = await res.json()

      setTestResult({
        success: data.success,
        message: data.success ? t('admin.connectionSuccess', { latency: data.data?.latency }) : data.error,
        latency: data.data?.latency,
      })
    } catch (e) {
      setTestResult({
        success: false,
        message: t('admin.connectionFailed') + (e instanceof Error ? e.message : t('common.unknownError')),
      })
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black/90 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black/90 text-white">
      {/* Header */}
      <div className="border-b border-white/15 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white/60" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/25 rounded-lg">
                <Settings className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h1 className="text-lg font-bold">{t('admin.title')}</h1>
                <p className="text-xs text-white/40 font-mono">{t('admin.subtitle')}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NeoButton
              onClick={handleReset}
              disabled={saving}
              variant="ghost"
              className="px-4 py-2 text-sm bg-white/8 hover:bg-white/15 rounded-lg flex items-center gap-2"
              themeColor={THEME_COLOR}
            >
              <RefreshCw className="w-4 h-4" />
              {t('admin.reset')}
            </NeoButton>
            <NeoButton
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm rounded-lg flex items-center gap-2 font-bold"
              themeColor={THEME_COLOR}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t('admin.save')}
            </NeoButton>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 状态提示 */}
        {saveResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              saveResult.success
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {saveResult.success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {saveResult.message}
          </motion.div>
        )}

        {errors.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/12 border border-red-500/35">
            <h4 className="text-red-400 font-bold mb-2">{t('admin.errors')}</h4>
            <ul className="list-disc list-inside text-red-400/80 text-sm space-y-1">
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        {/* AI Provider 选择 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-orange-500" />
            {t('admin.provider.title')}
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {PROVIDERS.map(p => (
              <NeoButton
                key={p.value}
                onClick={() => handleProviderChange(p.value as ConfigState['provider'])}
                variant="ghost"
                className={`p-4 rounded-xl border text-left transition-all h-auto flex flex-col items-start ${
                  config.provider === p.value
                    ? 'border-orange-500 bg-orange-500/12'
                    : 'border-white/15 bg-white/8 hover:bg-white/12'
                }`}
                themeColor={THEME_COLOR}
              >
                <div className="font-bold">{p.label}</div>
                <div className="text-xs text-white/50 mt-1">{p.description}</div>
              </NeoButton>
            ))}
          </div>
        </section>

        {/* API 配置 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-orange-500" />
            {t('admin.api.title')}
          </h2>

          <div className="space-y-4">
            {/* API URL */}
            <div>
              <NeoLabel className="mb-2">API URL</NeoLabel>
              <NeoInput
                type="text"
                value={config.apiUrl}
                onChange={e => setConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
                className={inputClass}
                themeColor={THEME_COLOR}
                placeholder="https://api.openai.com/v1/chat/completions"
              />
            </div>

            {/* API Key */}
            <div>
              <NeoLabel className="mb-2 flex items-center gap-2">
                <Key className="w-4 h-4" />
                API Key
                {config.hasApiKey && (
                  <span className="text-xs text-green-400">{t('admin.api.configured')}</span>
                )}
              </NeoLabel>
              <NeoInput
                type="password"
                value={config.apiKey}
                onChange={e => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                className={inputClass}
                themeColor={THEME_COLOR}
                placeholder={config.provider === 'ollama' ? t('admin.api.placeholder.ollamaKey') : t('admin.api.placeholder.key')}
              />
            </div>

            {/* Model */}
            <div>
              <NeoLabel className="mb-2">{t('admin.api.model')}</NeoLabel>
              <div className="flex gap-2">
                <NeoInput
                  type="text"
                  value={config.model}
                  onChange={e => setConfig(prev => ({ ...prev, model: e.target.value }))}
                  className={`flex-1 ${inputClass}`}
                  themeColor={THEME_COLOR}
                  placeholder={t('admin.api.placeholder.model')}
                />
                <NeoSelect
                  value={config.model}
                  onValueChange={value => setConfig(prev => ({ ...prev, model: value }))}
                  placeholder={t('admin.api.placeholder.selectPreset')}
                  options={MODEL_PRESETS[config.provider]?.map(m => ({ value: m, label: m })) || []}
                  themeColor={THEME_COLOR}
                />
              </div>
            </div>

            {/* Ollama Host (仅 Ollama 模式) */}
            {config.provider === 'ollama' && (
              <div>
                <NeoLabel className="mb-2">Ollama Host</NeoLabel>
                <NeoInput
                  type="text"
                  value={config.ollamaHost || ''}
                  onChange={e => setConfig(prev => ({ ...prev, ollamaHost: e.target.value }))}
                  className={inputClass}
                  themeColor={THEME_COLOR}
                  placeholder="http://localhost:11434"
                />
              </div>
            )}
          </div>
        </section>

        {/* 模型参数 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-orange-500" />
            {t('admin.params.title')}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Max Tokens */}
            <div>
              <NeoLabel className="mb-2 flex items-center gap-2" hint={t('admin.params.hint.maxTokens')}>
                <Hash className="w-4 h-4" />
                {t('admin.params.maxTokens')}
              </NeoLabel>
              <NeoInput
                type="number"
                value={config.maxTokens}
                onChange={e => setConfig(prev => ({ ...prev, maxTokens: Number(e.target.value) }))}
                min={100}
                max={128000}
                className={inputClass}
                themeColor={THEME_COLOR}
              />
            </div>

            {/* Temperature */}
            <div>
              <NeoLabel className="mb-2 flex items-center gap-2" hint={t('admin.params.hint.temperature')}>
                <Thermometer className="w-4 h-4" />
                {t('admin.params.temperature')}
              </NeoLabel>
              <NeoInput
                type="number"
                value={config.temperature}
                onChange={e => setConfig(prev => ({ ...prev, temperature: Number(e.target.value) }))}
                min={0}
                max={2}
                step={0.1}
                className={inputClass}
                themeColor={THEME_COLOR}
              />
            </div>
          </div>
        </section>

        {/* 其他设置 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Bug className="w-5 h-5 text-orange-500" />
            {t('admin.other.title')}
          </h2>

          <div className="flex items-center gap-3 p-4 bg-white/8 rounded-xl border border-white/15">
            <NeoCheckbox
              checked={config.enableDebugLog}
              onCheckedChange={checked => setConfig(prev => ({ ...prev, enableDebugLog: !!checked }))}
              themeColor={THEME_COLOR}
            />
            <div>
              <div className="font-medium">{t('admin.other.debug')}</div>
              <div className="text-xs text-white/50">{t('admin.other.debugDesc')}</div>
            </div>
          </div>
        </section>

        {/* 连接测试 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            {t('admin.connection.title')}
          </h2>

          <div className="p-6 bg-white/8 rounded-xl border border-white/15">
            <div className="flex items-center gap-4">
              <NeoButton
                onClick={handleTestConnection}
                disabled={testing}
                className="px-6 py-3 rounded-xl flex items-center gap-2 font-bold bg-blue-500 hover:bg-blue-600"
                themeColor="#3B82F6"
              >
                {testing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Zap className="w-5 h-5" />
                )}
                {t('admin.testConnection')}
              </NeoButton>

              {testResult && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-2 ${
                    testResult.success ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm">{testResult.message}</span>
                </motion.div>
              )}
            </div>

            <p className="text-xs text-white/40 mt-3">
              {t('admin.connection.desc')}
            </p>
          </div>
        </section>

        {/* 配置信息 */}
        {config.updatedAt && (
          <div className="text-center text-xs text-white/30 font-mono">
            {t('admin.lastUpdated')}: {new Date(config.updatedAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  )
}
