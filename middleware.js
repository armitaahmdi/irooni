import { NextResponse } from 'next/server';

// In-memory rate limiting for Edge runtime (middleware runs in Edge runtime)
// Redis has been removed - using in-memory rate limiting
const rateLimitStore = new Map();

export function middleware(request) {
  // Security headers (these are also set in next.config.mjs, but middleware allows dynamic headers)
  const isProduction = process.env.NODE_ENV === 'production';
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };

  // HSTS only in production (when HTTPS is available)
  if (isProduction && request.nextUrl.protocol === 'https:') {
    securityHeaders['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  }
  const { pathname, searchParams } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Rate limiting for sensitive routes
  if (pathname.startsWith('/api/auth/') || pathname.startsWith('/api/admin/')) {
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const key = `ratelimit:${ip}:${pathname}`;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = pathname.startsWith('/api/auth/') ? 5 : 10;

    // Simple in-memory rate limiting
    const requests = rateLimitStore.get(key) || [];
    const recentRequests = requests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((recentRequests[0] + windowMs - now) / 1000).toString(),
          },
        }
      );
    }

    recentRequests.push(now);
    rateLimitStore.set(key, recentRequests);

    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance
      for (const [k, times] of rateLimitStore.entries()) {
        const filtered = times.filter(time => now - time < windowMs);
        if (filtered.length === 0) {
          rateLimitStore.delete(k);
        } else {
          rateLimitStore.set(k, filtered);
        }
      }
    }
  }

  // Input validation for search parameters
  if (pathname.includes('/products') || pathname.includes('/search')) {
    const suspiciousPatterns = [
      /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bUPDATE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
      /(<script|javascript:|vbscript:|onload=|onerror=|onclick=)/i,
      /(\.\.\/|\.\.\\)/,
    ];

    for (const [key, value] of searchParams.entries()) {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(value)) {
          return new NextResponse(
            JSON.stringify({ error: 'Invalid input detected' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      }
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Content Security Policy
  // Note: Next.js generates inline styles and scripts during SSR/hydration
  // We use 'unsafe-inline' for styles and scripts to support Next.js behavior
  // This is a common and acceptable practice for Next.js applications
  if (process.env.NODE_ENV === 'production') {
    // Production CSP - allows inline styles/scripts for Next.js compatibility
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        // Scripts: allow inline scripts (required for Next.js hydration)
        "script-src 'self' 'unsafe-inline'",
        // Styles: allow inline styles (required for Next.js CSS-in-JS and style attributes)
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://api.kavenegar.com",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
      ].join('; ')
    );
  } else {
    // More permissive CSP for development
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://api.kavenegar.com",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; ')
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
