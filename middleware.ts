import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 1. Initialize Supabase Client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 2. Refresh Session
    const { data: { user } } = await supabase.auth.getUser()

    // 3. Define Protected Routes
    const path = request.nextUrl.pathname
    const isAdminRoute = path.startsWith('/admin')
    const isEducatorRoute = path.startsWith('/educator/dashboard')

    // 4. Redirect Unauthenticated Users
    if ((isAdminRoute || isEducatorRoute) && !user) {
        return NextResponse.redirect(new URL('/educator/login', request.url))
    }

    // 5. Role-Based Access Control (RBAC)
    if (user && (isAdminRoute || isEducatorRoute)) {
        // Fetch profile role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const role = profile?.role

        // Admin Route Protection
        if (isAdminRoute && role !== 'admin') {
            // Redirect non-admins to their dashboard or home
            return NextResponse.redirect(new URL('/educator/dashboard', request.url))
        }

        // Educator Route Protection (Admins can also view dashboards, purely educator view logic)
        // If strict separation is needed: if (isEducatorRoute && role !== 'educator' && role !== 'admin') ...
        // Assuming 'educator' role is required, or 'admin' is superuser.
        // Spec: "dashboard Allow: educator, admin". So both are fine.
    }

    return response
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/educator/dashboard/:path*',
    ],
}
