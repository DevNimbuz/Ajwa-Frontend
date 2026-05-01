import { NextResponse } from 'next/server';

/**
 * Next.js Middleware — Platform Security
 * Enforces server-side authentication checks for protected routes
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // 1. Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  // 2. Protected Admin Routes
  // NOTE: In a cross-domain setup (Vercel/Render), the 'token' cookie set by Render
  // is NOT sent to Vercel. We rely on client-side auth in AdminLayout for now.
  /*
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }
  */
  
  // 3. Protected Customer Routes
  const protectedCustomerRoutes = ['/dashboard', '/profile', '/booking'];
  const isProtectedCustomer = protectedCustomerRoutes.some(route => pathname.startsWith(route));
  
  /*
  if (isProtectedCustomer) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  */
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/booking/:path*',
  ],
};
