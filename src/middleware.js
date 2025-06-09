// middleware.js (or .ts if you prefer)
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname, origin } = request.nextUrl;

  const cookieValue = request.cookies.get('mediai_token')?.value;
  let accessToken, role;

  // Skip middleware for system/public files/routes first
  const excluded = ['/_next', '/favicon.ico', '/api', '/login', '/404', '/.well-known'];
  if (excluded.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Parse cookie if it exists
  if (cookieValue) {
    try {
      const parsed = JSON.parse(cookieValue);
      accessToken = parsed?.accessToken;
      role = parsed?.role;
    } catch {
      // Invalid cookie, treat as no cookie
      // Clear the invalid cookie and redirect to home
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('mediai_token');
      return response;
    }
  }

  // Handle homepage - allow access regardless of auth status
  if (pathname === '/') {
    // If user is authenticated, redirect to dashboard
    if (cookieValue && accessToken && role) {
      console.log('Authenticated user accessing home, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', origin));
    }
    // If not authenticated, allow access to home/login page
    return NextResponse.next();
  }

  // For all other routes, require authentication
  if (!cookieValue || !accessToken || !role) {
    console.log('No valid authentication, redirecting to login');
    return NextResponse.redirect(new URL('/', origin));
  }

  // Fetch role-based permissions for authenticated users
  try {
    const apiUrl = `https://doctorjebasingh.in/api/roles/${role}/permissions`;
    const res = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      console.error('Failed to fetch permissions');
      return NextResponse.redirect(new URL('/', request.url));
    }

    const data = await res.json();
    const allowed = new Set(['/dashboard']);

    for (const menu of data.menus || []) {
      if (menu.path) allowed.add(menu.path);
      for (const child of menu.children || []) {
        if (child.path) allowed.add(child.path);
      }
    }

    // Ensure Set isn't empty even if data.menus had no entries
    if (allowed.size === 0) {
      allowed.add('/dashboard');
    }

    const permitted = Array.from(allowed).some(path => pathname.startsWith(path));
    if (!permitted) {
      return NextResponse.redirect(new URL('/404', request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error('Middleware error:', err);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api|login|404|.well-known).*)'],
};
