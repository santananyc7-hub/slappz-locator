import { NextResponse, type NextRequest } from 'next/server';

/**
 * Admin access gate.
 *
 * /admin can create, edit and deactivate retailers, and can read demand data. Shipping that
 * unauthenticated would be a real vulnerability, so it is gated here rather than left as a
 * TODO.
 *
 * This is intentionally the simplest thing that is actually safe: HTTP Basic auth against
 * SLAPPZ_ADMIN_PASSWORD. It is a placeholder for real auth (Supabase Auth, Auth.js, or SSO)
 * once SLAPPZ has accounts — not a long-term answer, because it has no per-user identity and
 * no audit trail.
 *
 * Behaviour:
 *   - password set          -> Basic auth challenge
 *   - unset, development    -> open, with a console warning
 *   - unset, production     -> 503, because an open admin is worse than no admin
 */
export function proxy(request: NextRequest) {
  const password = process.env.SLAPPZ_ADMIN_PASSWORD;

  if (!password) {
    if (process.env.NODE_ENV !== 'production') return NextResponse.next();

    return new NextResponse(
      'Admin is disabled. Set SLAPPZ_ADMIN_PASSWORD to enable it.',
      { status: 503, headers: { 'Content-Type': 'text/plain' } },
    );
  }

  const header = request.headers.get('authorization');

  if (header?.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6));
      const supplied = decoded.slice(decoded.indexOf(':') + 1);
      if (timingSafeEqual(supplied, password)) return NextResponse.next();
    } catch {
      /* fall through to the challenge */
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="SLAPPZ Admin", charset="UTF-8"' },
  });
}

/** Constant-time comparison so the response time can't be used to guess the password. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const config = {
  matcher: ['/admin/:path*'],
};
