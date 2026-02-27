'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

export async function createEducatorUser(email: string, password: string, displayName: string) {
    // Verify the caller is an admin
    const supabase = await createClient()
    const { data: { user: caller } } = await supabase.auth.getUser()
    if (!caller) return { success: false, error: 'Not authenticated' }

    const { data: callerProfile } = await supabase
        .from('profiles').select('role').eq('id', caller.id).single()
    if (callerProfile?.role !== 'admin') {
        return { success: false, error: 'Unauthorized — admin only' }
    }

    // Use the admin client to create the user — this bypasses email confirmation entirely
    try {
        const adminClient = createAdminClient()

        const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,          // Mark email as already confirmed
            user_metadata: { display_name: displayName },
        })

        if (createError) {
            return { success: false, error: createError.message }
        }

        if (!newUser?.user?.id) {
            return { success: false, error: 'Failed to create user — no ID returned' }
        }

        const userId = newUser.user.id

        // Insert into profiles table with educator role
        const { error: profileError } = await adminClient
            .from('profiles')
            .upsert({
                id: userId,
                role: 'educator',
                email: email,
                display_name: displayName,
            })

        if (profileError) {
            console.error('Profile Insert Error:', profileError)

            let suggestion = `INSERT INTO profiles (id, role, email, display_name) VALUES ('${userId}', 'educator', '${email}', '${displayName}') ON CONFLICT (id) DO UPDATE SET role = 'educator', display_name = '${displayName}';`

            if (profileError.message.includes('display_name')) {
                suggestion = `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT; \n\nThen run original insert: \n${suggestion}`
            }

            return {
                success: false,
                error: `User created (ID: ${userId.slice(0, 8)}…) but profile insert failed: ${profileError.message}. \n\nRun in Supabase SQL: \n${suggestion}`
            }
        }

        return { success: true, userId, email }
    } catch (err: any) {
        if (err.message?.includes('SUPABASE_SERVICE_ROLE_KEY')) {
            return {
                success: false,
                error: 'Service role key not configured. Add SUPABASE_SERVICE_ROLE_KEY to your environment variables.'
            }
        }
        return { success: false, error: err.message || 'Unknown error' }
    }
}

export async function listEducators() {
    const supabase = await createClient()
    const { data: { user: caller } } = await supabase.auth.getUser()
    if (!caller) return { success: false, error: 'Not authenticated', educators: [] }

    const { data: callerProfile } = await supabase
        .from('profiles').select('role').eq('id', caller.id).single()
    if (callerProfile?.role !== 'admin') {
        return { success: false, error: 'Unauthorized', educators: [] }
    }

    try {
        const adminClient = createAdminClient()
        const { data, error } = await adminClient
            .from('profiles')
            .select('id, role, display_name, email, created_at')
            .eq('role', 'educator')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('List Educators Error:', error)
            return { success: false, error: error.message, educators: [] }
        }

        return { success: true, educators: data || [] }
    } catch (e: any) {
        console.error('List Educators Exception:', e)
        return { success: false, error: e.message, educators: [] }
    }
}
