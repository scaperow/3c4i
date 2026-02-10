import React from 'react'
import { MantineProvider } from '@mantine/core'
import { ColorSchemeScript } from '@mantine/core'
import './globals.css'
import ClientPageLoader from '@/components/ClientPageLoader'

export const metadata = {
  title: '3C4I Portal | Intelligent Destiny Matrix',
  description: 'Three Core Forces × Intelligence - Intelligent portal fusing Eastern wisdom with modern technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <ColorSchemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Inter:wght@300;400;600;900&family=Noto+Sans+SC:wght@300;400;700&family=Noto+Serif+SC:wght@300;500;700;900&family=JetBrains+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MantineProvider>
          <ClientPageLoader />
          {children}
        </MantineProvider>
      </body>
    </html>
  )
}
