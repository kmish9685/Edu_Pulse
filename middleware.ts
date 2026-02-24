import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
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

    // Refresh session
    const { data: { user } } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname
    const isAdminRoute = path.startsWith('/admin')
    const isEducatorRoute = path.startsWith('/educator')  // covers /educator/start AND /educator/dashboard
    const isLoginPage = path === '/educator/login'

    // If not logged in and trying to access educator or admin routes → send to login
    if (!user && (isAdminRoute || isEducatorRoute) && !isLoginPage) {
        const loginUrl = new URL('/educator/login', request.url)
        loginUrl.searchParams.set('redirect', path)   // remember where they were going
        return NextResponse.redirect(loginUrl)
    }

    // If logged in, enforce role-based access
    if (user && (isAdminRoute || isEducatorRoute)) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const role = profile?.role

        // Non-admins cannot access /admin/* — redirect to their dashboard
        if (isAdminRoute && role !== 'admin') {
            return NextResponse.redirect(new URL('/educator/start', request.url))
        }

        // If somehow a student role exists and tries /educator/* — send home
        if (isEducatorRoute && role !== 'educator' && role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // Already logged in and visiting login page → redirect to start
    if (user && isLoginPage) {
        return NextResponse.redirect(new URL('/educator/start', request.url))
    }

    return response
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/educator/:path*',   // now covers /educator/start too
    ],
}
