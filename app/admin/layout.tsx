import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const headerList = await headers()
    const pathname = headerList.get('x-pathname') || ''

    // Allow the login page to render without a session
    if (pathname.includes('/admin/login')) {
        return <>{children}</>
    }

    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        redirect('/admin/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/admin/login?error=admin_required')
    }

    return <>{children}</>
}
