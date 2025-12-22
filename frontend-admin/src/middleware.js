import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Nếu đang ở trang login và đã đăng nhập, chuyển hướng đến dashboard
  if (pathname === '/admin-login') {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  // Nếu truy cập các route admin mà chưa đăng nhập, chuyển hướng đến login
  if (pathname.startsWith('/admin') && pathname !== '/admin-login') {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/admin-login',
    '/users/:path*',
    '/posts/:path*',
    '/settings/:path*',
    '/documents/:path*',
    '/quiz/:path*',
    '/account/:path*'
  ]
} 