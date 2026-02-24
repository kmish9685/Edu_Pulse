import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: { headers: request.headers },
    })

    const path = request.nextUrl.pathname
    const isAdminRoute = path.startsWith('/admin')
    const isEducatorRoute = path.startsWith('/educator')
    const isLoginPage = path === '/educator/login'

    // If env vars are missing, fail CLOSED — send unauthenticated users to login
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        if ((isAdminRoute || isEducatorRoute) && !isLoginPage) {
            const loginUrl = new URL('/educator/login', request.url)
            loginUrl.searchParams.set('redirect', path)
            return NextResponse.redirect(loginUrl)
        }
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

        // Unauthenticated → redirect to login
        if (!user && (isAdminRoute || isEducatorRoute) && !isLoginPage) {
            const loginUrl = new URL('/educator/login', request.url)
            loginUrl.searchParams.set('redirect', path)
            return NextResponse.redirect(loginUrl)
        }

        // Role-based access for authenticated users
        if (user && (isAdminRoute || isEducatorRoute)) {
            const { data: profile } = await supabase
                .from('profiles').select('role').eq('id', user.id).single()
            const role = profile?.role

            if (isAdminRoute && role !== 'admin') {
                return NextResponse.redirect(new URL('/educator/start', request.url))
            }
            if (isEducatorRoute && role !== 'educator' && role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }

        // Already logged in, visiting login → redirect to start
        if (user && isLoginPage) {
            return NextResponse.redirect(new URL('/educator/start', request.url))
        }

    } catch {
        // If ANY auth check fails (Supabase unreachable, invalid config, etc.)
        // fail CLOSED — send to login rather than letting through
        if ((isAdminRoute || isEducatorRoute) && !isLoginPage) {
            const loginUrl = new URL('/educator/login', request.url)
            loginUrl.searchParams.set('redirect', path)
            return NextResponse.redirect(loginUrl)
        }
    }

    return response
}

export const config = {
    matcher: ['/admin/:path*', '/educator/:path*'],
}
