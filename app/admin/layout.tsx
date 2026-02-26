// Server Component — no 'use client'
// Hard auth gate for all /admin/* pages EXCEPT /admin/login

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // Read the actual request path so we can skip auth on the login page itself
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') ?? headersList.get('x-invoke-path') ?? ''

    // Skip auth check for the admin login page itself
    if (pathname === '/admin/login' || pathname.startsWith('/admin/login')) {
        return <>{children}</>
    }

    try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            return <>{children}</>
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            redirect('/admin/login')
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'admin') {
            redirect('/admin/login')
        }
    } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
        // Supabase failure — middleware is primary guard, let it handle
    }

    return <>{children}</>
}
