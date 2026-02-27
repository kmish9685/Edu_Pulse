'use server'

import { createClient } from '@/utils/supabase/server'

export async function loginWithEmail(email: string, password: string, requestedRole: 'admin' | 'educator' | 'unified') {
    const supabase = await createClient()

    try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Connection to authentication server timed out. Please check your network or try again later.')), 10000));

        const signInPromise = supabase.auth.signInWithPassword({ email, password });

        const { data: { user }, error: authError } = await Promise.race([
            signInPromise,
            timeoutPromise
        ]) as any;

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

        // If requested role is 'unified', accept either admin or educator
        if (requestedRole === 'unified') {
            if (profile.role !== 'admin' && profile.role !== 'educator') {
                await supabase.auth.signOut()
                return { success: false, error: 'Access denied. You do not have valid access.' }
            }
        } else if (requestedRole === 'educator' && profile.role !== 'educator' && profile.role !== 'admin') {
            await supabase.auth.signOut()
            return { success: false, error: 'Access denied. Educator privileges required.' }
        }

        return { success: true, role: profile.role }

    } catch (e: any) {
        return { success: false, error: e.message || 'Server-side authentication failed.' }
    }
}
