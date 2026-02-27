'use server'

import { createClient } from '@/utils/supabase/server'

export async function loginWithEmail(email: string, password: string, requestedRole: 'admin' | 'educator') {
    const supabase = await createClient()

    try {
        const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({ email, password })

        if (authError) {
            return { success: false, error: authError.message }
        }

        if (!user) {
            return { success: false, error: 'Invalid credentials. User not found.' }
        }

        // Verify the user's role
        const { data: profile } = await supabase
            .from('profiles').select('role').eq('id', user.id).single()

        if (!profile) {
            return { success: false, error: 'Profile data missing. Contact support.' }
        }

        if (requestedRole === 'admin' && profile.role !== 'admin') {
            await supabase.auth.signOut()
            return { success: false, error: 'Access denied. Administrator privileges required.' }
        }

        if (requestedRole === 'educator' && profile.role !== 'educator' && profile.role !== 'admin') {
            await supabase.auth.signOut()
            return { success: false, error: 'Access denied. Educator privileges required.' }
        }

        return { success: true, role: profile.role }

    } catch (e: any) {
        return { success: false, error: e.message || 'Server-side authentication failed.' }
    }
}
