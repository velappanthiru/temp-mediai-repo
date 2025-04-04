import { NextResponse } from 'next/server';

const protectedPaths = ['/chatbot'];

export function middleware(request) {
  const { pathname, origin } = request.nextUrl;
  const cookieData = request.cookies.get('mediai_token')?.value;

  let role = cookieData ? JSON.parse(cookieData).role : null;
  console.log('Middleware triggered:', { pathname, role });

  // Redirect to login if no token and not already on login page
  if (!cookieData && pathname !== '/') {
    console.log('Redirecting to login');
    return NextResponse.redirect(new URL('/', origin));
  }

  // Handle homepage redirection after login
  if (pathname === '/' && cookieData) {
    const redirectUrl = role === 2 || role === 3 ? '/chatbot' : '/super-admin/chatbot';

    if (pathname !== redirectUrl) {
      console.log('Redirecting to:', redirectUrl);
      return NextResponse.redirect(new URL(redirectUrl, origin));
    }
  }

  // Prevent admin users from accessing /chatbot
  if (cookieData && role === 1 && protectedPaths.includes(pathname)) {
    console.log('Admin blocked from chatbot, redirecting...');
    return NextResponse.redirect(new URL('/super-admin/chatbot', origin));
  }

  // Prevent users from accessing admin pages
  if (cookieData && (role === 2 || role === 3) && pathname.startsWith('/super-admin')) {
    console.log('User blocked from admin, redirecting...');
    return NextResponse.redirect(new URL('/chatbot', origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|chatbot.json).*)'], // Ignore API calls and static files
};
