import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;
  // const token = request.cookies.get('user')?.value;

  // if (pathname === '/login' && token) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  // const protectedRoutes = ['/', '/i-pledge', '/record-video',"/doctors","/dashboard"]; 
  // const isProtected = protectedRoutes.includes(pathname)

  // if (isProtected && !token) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  // return NextResponse.next();
}
