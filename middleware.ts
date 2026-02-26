import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // Forward pathname as a header so server layouts can read it
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', request.nextUrl.pathname)

    let response = NextResponse.next({
        request: { headers: requestHeaders },
    })

    const path = request.nextUrl.pathname
    const isAdminRoute = path.startsWith('/admin')
    const isEducatorRoute = path.startsWith('/educator')
    const isAdminLogin = path === '/admin/login'
    const isEducatorLogin = path === '/educator/login'

    // Don't redirect the login pages themselves
    if (isAdminLogin || isEducatorLogin) {
        // If already logged in, redirect to proper dashboard
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            try {
                const supabase = createServerClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                    { cookies: { getAll() { return request.cookies.getAll() }, setAll() { } } }
                )
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles').select('role').eq('id', user.id).single()
                    if (profile?.role === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
                    if (profile?.role === 'educator') return NextResponse.redirect(new URL('/educator/start', request.url))
                }
            } catch { /* ignore */ }
        }
        return response
    }

    // Fail CLOSED if env vars missing
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        if (isAdminRoute) return NextResponse.redirect(new URL('/admin/login', request.url))
        if (isEducatorRoute) return NextResponse.redirect(new URL('/educator/login', request.url))
        return response
    }

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() { return request.cookies.getAll() },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                        response = NextResponse.next({ request })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser()

        // Unauthenticated — send to the correct login page for that route type
        if (!user) {
            if (isAdminRoute) return NextResponse.redirect(new URL('/admin/login', request.url))
            if (isEducatorRoute) {
                const loginUrl = new URL('/educator/login', request.url)
                loginUrl.searchParams.set('redirect', path)
                return NextResponse.redirect(loginUrl)
            }
        }

        // Role-based access for authenticated users
        if (user) {
            const { data: profile } = await supabase
                .from('profiles').select('role').eq('id', user.id).single()
            const role = profile?.role

            // Wrong role for admin routes
            if (isAdminRoute && role !== 'admin') {
                return NextResponse.redirect(new URL('/educator/start', request.url))
            }
            // Wrong role for educator routes
            if (isEducatorRoute && role !== 'educator' && role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }

    } catch {
        // Supabase unreachable — fail closed
        if (isAdminRoute) return NextResponse.redirect(new URL('/admin/login', request.url))
        if (isEducatorRoute) {
            const loginUrl = new URL('/educator/login', request.url)
            loginUrl.searchParams.set('redirect', path)
            return NextResponse.redirect(loginUrl)
        }
    }

    return response
}

export const config = {
    // Match BOTH the bare root (/admin, /educator/start) AND all sub-paths.
    // '/admin/:path*' does NOT match '/admin' in Next.js — must list both.
    matcher: [
        '/admin',
        '/admin/:path*',
        '/educator',
        '/educator/:path*',
    ],
}

