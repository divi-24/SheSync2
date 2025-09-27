import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/signup'];

function parseSessionCookie(sessionBase64?: string | null) {
  if (!sessionBase64) return null;
  try {
    // atob available in Edge runtime
    const json = atob(sessionBase64);
    const parsed = JSON.parse(json);
    return parsed; // { role, exp }
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const sessionCookie = req.cookies.get('session')?.value || null;
  const session = parseSessionCookie(sessionCookie);
  const isSessionValid = !!(session && session.exp && session.exp > Date.now());

  // if logged in and attempting to open public route -> redirect to dashboard
  if (isSessionValid && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // if NOT logged in and attempting to open protected route -> redirect to login
  if (!isSessionValid && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/login', '/signup', '/'],
};
