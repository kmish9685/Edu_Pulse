'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitSignal(data: {
    type: string,
    lat?: number,
    lng?: number,
    block_room?: string,
    additional_text?: string
}) {
    const supabase = await createClient()

    // Validate that the session is still active before accepting the signal
    if (data.block_room) {
        const { data: session } = await supabase
            .from('active_sessions')
            .select('id, is_active')
            .eq('id', data.block_room)
            .eq('is_active', true)
            .single()

        if (!session) {
            return { success: false, error: 'No active session with this PIN. The class may have ended.' }
        }
    }

    const { error } = await supabase
        .from('signals')
        .insert({
            type: data.type,
            lat: data.lat,
            lng: data.lng,
            block_room: data.block_room,
            additional_text: data.additional_text?.substring(0, 120),
        })

    if (error) return { success: false, error: error.message }
    return { success: true }
}

export async function validateSession(pin: string): Promise<{ active: boolean }> {
    if (!pin || pin.length !== 4) return { active: false }
    const supabase = await createClient()
    const { data } = await supabase
        .from('active_sessions')
        .select('id')
        .eq('id', pin)
        .eq('is_active', true)
        .single()
    return { active: !!data }
}

export async function startSession(pin: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    // Enforce role authorization
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || (profile.role !== 'educator' && profile.role !== 'admin')) {
        return { success: false, error: 'Unauthorized: Only registered educators can start sessions.' }
    }

    // Upsert — if same PIN was used before (unlikely) reset it to active
    const { error } = await supabase
        .from('active_sessions')
        .upsert({
            id: pin,
            educator_id: user.id,
            started_at: new Date().toISOString(),
            ended_at: null,
            is_active: true,
        })

    if (error) return { success: false, error: error.message }
    return { success: true }
}

export async function endSession(pin: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const { error } = await supabase
        .from('active_sessions')
        .update({ is_active: false, ended_at: new Date().toISOString() })
        .eq('id', pin)
        .eq('educator_id', user.id)

    if (error) return { success: false, error: error.message }
    return { success: true }
}

export async function getCampusSettings() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('campus_settings').select('*').single()
    if (error) return { success: false, error: error.message }
    return { success: true, data }
}

export async function getSignalTypes() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('signal_types').select('*').eq('is_active', true)
    if (error) return { success: false, error: error.message }
    return { success: true, data }
}

export async function addSignalType(label: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('signal_types').insert({ label })
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin')
    return { success: true }
}
