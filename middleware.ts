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

    // Public login pages — always allow through, no auth check
    if (
        path === '/admin/login' ||
        path.startsWith('/admin/login/') ||
        path === '/educator/login' ||
        path.startsWith('/educator/login/')
    ) {
        return response
    }

    const isAdminRoute = path.startsWith('/admin')
    const isEducatorRoute = path.startsWith('/educator')

    // Only protect admin and educator routes
    if (!isAdminRoute && !isEducatorRoute) {
        return response
    }

    // Fail CLOSED — if Supabase not configured, block access
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
                cookieOptions: {
                    name: 'sb-edupulse-auth-token'
                },
                cookies: {
                    getAll() { return request.cookies.getAll() },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                        response = NextResponse.next({ request: { headers: requestHeaders } })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser()

        // No session → redirect to the correct login page
        if (!user) {
            if (isAdminRoute) return NextResponse.redirect(new URL('/admin/login', request.url))
            if (isEducatorRoute) {
                const loginUrl = new URL('/educator/login', request.url)
                loginUrl.searchParams.set('redirect', path)
                return NextResponse.redirect(loginUrl)
            }
        }

        // Has session → enforce role-based access
        if (user) {
            const { data: profile } = await supabase
                .from('profiles').select('role').eq('id', user.id).single()
            const role = profile?.role

            if (isAdminRoute && role !== 'admin') {
                // Non-admin trying to access admin — send to their dashboard
                return NextResponse.redirect(new URL('/educator/start', request.url))
            }
            if (isEducatorRoute && role !== 'educator' && role !== 'admin') {
                // Non-educator/non-admin trying to access educator routes
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
    // Match BOTH the bare root (/admin, /educator) AND all sub-paths.
    matcher: [
        '/admin',
        '/admin/:path*',
        '/educator',
        '/educator/:path*',
    ],
}
