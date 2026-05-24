import { NextResponse } from 'next/server'

const protectedPaths = ['/dashboard', '/my-requests', '/product']
const authPaths = ['/login', '/register']

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get('__Secure-better-auth.session_token')?.value || request.cookies.get('better-auth.session_token')?.value

  const isProtected = protectedPaths.some(path => pathname.startsWith(path))
  const isAuthPage = authPaths.some(path => pathname.startsWith(path))

  if (isProtected) {
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/my-requests/:path*', '/product/:path*', '/login', '/register'],
}
