import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The key effectively acts as a password for the extension
// In a real env, this would be in process.env
const EXTENSION_API_KEY = 'y4yes_ext_secure_8829_key_v1';

// Origins that are allowed to use the API (The website itself)
const ALLOWED_ORIGINS = [
    'https://y4yes.com',
    'http://localhost:3000',
    'https://www.y4yes.com'
];

export function middleware(request: NextRequest) {
    // Only protect /api routes
    if (request.nextUrl.pathname.startsWith('/api')) {

        // 1. Check for Extension Key
        const apiKey = request.headers.get('x-y4yes-key');
        if (apiKey === EXTENSION_API_KEY) {
            // Allow extension request
            // We must handle CORS for the extension here
            const response = NextResponse.next();
            response.headers.set('Access-Control-Allow-Origin', '*'); // Or specific extension ID
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-y4yes-key');
            return response;
        }

        // 2. Check for Same-Origin / Trusted Origin (The Website)
        const origin = request.headers.get('origin') || request.headers.get('referer');
        const isAllowedOrigin = origin && ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed));

        // Allow if it's the website itself
        if (isAllowedOrigin) {
            return NextResponse.next();
        }

        // Handle Preflight OPTIONS (Browser asking permission)
        if (request.method === 'OPTIONS') {
            const response = new NextResponse(null, { status: 200 });
            response.headers.set('Access-Control-Allow-Origin', '*');
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-y4yes-key');
            return response;
        }

        // Block everything else
        // return new NextResponse(
        //   JSON.stringify({ error: 'Unauthorized', message: 'Private API' }),
        //   { status: 401, headers: { 'content-type': 'application/json' } }
        // );

        // Note: For now, I will effectively LOG but ALLOW to avoid breaking anything during dev
        // Once verified, I will uncomment the block above.
        // Actually, user asked to "secure" it. I should enforce it.
        // However, if I break localhost testing (if origin is missing like in server fetch), that's bad.
        // But this is Next.js middleware - it runs BEFORE api routes.

        // SAFEST APPROACH:
        // If no key and no origin match, block.
        // But server-side calls (from logical server components) often have no origin.
        // HOWEVER, these are mostly called from CLIENT components via fetch, so they HAVE origin.

        // Let's rely on the check.
        return new NextResponse(
            JSON.stringify({ error: 'Unauthorized Access', message: 'Missing API Key or Invalid Origin' }),
            { status: 401, headers: { 'content-type': 'application/json' } }
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};
