import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Basic Auth 配置
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

// 需要保护的路径
const PROTECTED_PATHS = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 检查是否是需要保护的路径
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path))

  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // 获取 Authorization header
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    })
  }

  // 解码 Basic Auth
  try {
    const base64Credentials = authHeader.split(' ')[1]
    const credentials = atob(base64Credentials)
    const [username, password] = credentials.split(':')

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return NextResponse.next()
    }
  } catch (e) {
    console.error('Auth decode error:', e)
  }

  return new NextResponse('Invalid credentials', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area"',
    },
  })
}

export const config = {
  matcher: ['/admin/:path*'],
}
