'use server'

import { createClient } from '@/utils/supabase/server'

export async function createEducatorUser(email: string, password: string, _displayName: string) {
    const supabase = await createClient()

    // Only admins can call this
    const { data: { user: caller } } = await supabase.auth.getUser()
    if (!caller) return { success: false, error: 'Not authenticated' }

    const { data: callerProfile } = await supabase
        .from('profiles').select('role').eq('id', caller.id).single()
    if (callerProfile?.role !== 'admin') return { success: false, error: 'Unauthorized — admin only' }

    // Create the auth user
    const { data: newUserData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: undefined },
    })

    if (signUpError && !signUpError.message.includes('already registered')) {
        return { success: false, error: signUpError.message }
    }

    const userId = newUserData?.user?.id
    if (!userId) {
        // User may already exist — try to find via API (limited by anon key, so return partial success)
        return { success: false, error: 'User already registered. Please set role via Supabase dashboard.' }
    }

    // Try RPC function (requires the set_user_role function in Supabase)
    const { error: rpcError } = await supabase.rpc('set_user_role', {
        target_user_id: userId,
        new_role: 'educator',
    })

    if (rpcError) {
        // Fallback: try direct upsert — will only succeed if RLS allows it or trigger created the row
        const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({ id: userId, role: 'educator' })

        if (upsertError) {
            return {
                success: false,
                error: `Auth user created (ID: ${userId.slice(0, 8)}…) but role not set. Run this in Supabase SQL: INSERT INTO profiles (id, role) VALUES ('${userId}', 'educator') ON CONFLICT (id) DO UPDATE SET role = 'educator';`
            }
        }
    }

    return { success: true, userId, email }
}

