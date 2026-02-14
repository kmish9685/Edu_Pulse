'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function verifyAdminPassword(password: string) {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    // Check role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') return { success: false, error: 'Unauthorized' }

    // Verify password by attempting to sign in
    const { error } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: password
    })

    if (error) return { success: false, error: 'Invalid password' }

    return { success: true }
}

export async function resetAllData() {
    const supabase = await createClient()

    // Double check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') return { success: false }

    // Reset logic: Delete signals and summaries (if summaries was a table, but for now we just clear signals)
    const { error } = await supabase
        .from('signals')
        .delete()
        .neq('id', 0) // Delete all

    if (error) return { success: false, error: error.message }

    revalidatePath('/admin')
    revalidatePath('/educator/dashboard')

    return { success: true }
}

export async function updateCampusSettings(settings: { latitude: number, longitude: number, radius_meters: number, demo_mode?: boolean }) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('campus_settings')
        .update(settings)
        .eq('id', 1) // Assuming single campus setting for now

    if (error) return { success: false, error: error.message }

    revalidatePath('/admin')
    return { success: true }
}

export async function addSignalType(label: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('signal_types')
        .insert({ label })

    if (error) return { success: false, error: error.message }

    revalidatePath('/admin')
    revalidatePath('/student')
    return { success: true }
}
