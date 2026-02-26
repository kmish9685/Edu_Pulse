// Server Component — no 'use client'
// Hard auth gate for all /educator/* pages EXCEPT /educator/login

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export default async function EducatorLayout({ children }: { children: React.ReactNode }) {
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') ?? headersList.get('x-invoke-path') ?? ''

    if (pathname === '/educator/login' || pathname.startsWith('/educator/login')) {
        return <>{children}</>
    }

    try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            return <>{children}</>
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            redirect('/educator/login')
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || (profile.role !== 'educator' && profile.role !== 'admin')) {
            redirect('/educator/login')
        }
    } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
    }

    return <>{children}</>
}
