import { NextResponse } from 'next/server';

/**
 * Next.js Middleware — Platform Security
 * Enforces server-side authentication checks for protected routes
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;
  
  // 1. Get token from cookies (checking both the backend cookie and our local fallback cookie)
  const token = request.cookies.get('token')?.value || request.cookies.get('ajwa_local_token')?.value;
  
  // 2. Protected Admin Routes
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }
  
  // 3. Protected Customer Routes
  const protectedCustomerRoutes = ['/dashboard', '/profile', '/booking'];
  const isProtectedCustomer = protectedCustomerRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedCustomer) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  
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
