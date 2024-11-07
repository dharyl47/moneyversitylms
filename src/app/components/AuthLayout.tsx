// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass auth for public API routes like `/api/uploads`
  if (pathname.startsWith('/api/uploads')) {
    return NextResponse.next();
  }

  // Check for authentication for other routes
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/uploads).*)'], // Only apply middleware to routes except `/api/uploads`
};
