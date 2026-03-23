import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const response = NextResponse.next()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: (cookies) => cookies.forEach(({ name, value, options }) =>
                    response.cookies.set(name, value, options)
                ),
            },
        }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session && request.nextUrl.pathname.startsWith('/chat')) {
        return NextResponse.redirect(new URL('/auth', request.url))
    }

    if (session && request.nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/chat', request.url))
    }

    return response
}

export const config = {
    matcher: ['/chat/:path*', '/auth/:path*'],
}