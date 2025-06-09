// middleware.js (or .ts if you prefer)

// Note: Next.js automatically handles parsing NextRequest — no need to import types
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const cookieValue = request.cookies.get('mediai_token')?.value;
  let accessToken, role;

  try {
    const parsed = JSON.parse(cookieValue);
    accessToken = parsed?.accessToken;
    role = parsed?.role;
  } catch {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If missing credentials, send to login
  if (!accessToken || !role) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const { pathname } = request.nextUrl;

  // If authenticated, block base route
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Skip middleware for system/public files/routes
  const excluded = ['/_next', '/favicon.ico', '/api', '/login', '/404', '/.well-known'];
  if (excluded.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Fetch role-based permissions
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
