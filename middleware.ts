import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Only protect admin routes
  if (path.startsWith('/admin') && !path.includes('/login')) {
    // NextAuth menggunakan cookie 'next-auth.session-token', bukan 'auth'
    const sessionToken = request.cookies.get('next-auth.session-token');
    console.log(`[Middleware] Checking auth for path: ${path}, session token exists: ${!!sessionToken}`);
    
    if (!sessionToken) {
      console.log(`[Middleware] No session token found, redirecting to login`);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
