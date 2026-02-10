'use client'

import { useState, useEffect } from 'react'

interface VersionInfo {
  version: string
  fullVersion: string
  buildTime: string
  commit: string
  branch: string
}

export function VersionDisplay() {
  const [version, setVersion] = useState<string>('')
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // 首先尝试从环境变量获取版本号
    const envVersion = process.env.NEXT_PUBLIC_APP_VERSION
    if (envVersion) {
      setVersion(envVersion)
      return
    }

    // 如果环境变量不存在，尝试从 version.json 文件获取
    fetch('/version.json')
      .then(res => res.json())
      .then((data: VersionInfo) => {
        setVersion(data.version)
      })
      .catch(() => {
        // 如果都获取失败，显示开发版本
        setVersion('dev')
      })
  }, [])

  const handleClick = () => {
    setShowDetails(!showDetails)
  }

  if (!version) return null

  return (
    <div className="fixed bottom-2 right-2 z-50">
      <button
        onClick={handleClick}
        className="text-[10px] text-white/30 hover:text-white/60 transition-colors font-mono cursor-pointer"
        title="点击显示版本详情"
      >
        v{version}
      </button>
      
      {showDetails && (
        <div 
          className="absolute bottom-6 right-0 bg-black/90 border border-white/10 rounded-lg p-3 text-xs text-white/70 min-w-[200px] shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-white/40">版本:</span>
              <span className="font-mono">{version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">构建时间:</span>
              <span className="font-mono">{process.env.NEXT_PUBLIC_BUILD_TIME || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Commit:</span>
              <span className="font-mono">{process.env.NEXT_PUBLIC_GIT_COMMIT?.slice(0, 7) || 'N/A'}</span>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(false)}
            className="mt-2 w-full text-center text-[10px] text-white/40 hover:text-white/60"
          >
            关闭
          </button>
        </div>
      )}
    </div>
  )
}
