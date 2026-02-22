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

    const { error } = await supabase
        .from('signals')
        .insert({
            type: data.type,
            lat: data.lat,
            lng: data.lng,
            block_room: data.block_room,
            additional_text: data.additional_text?.substring(0, 120) // Safety truncation
        })

    if (error) return { success: false, error: error.message }

    // Revalidate relevant paths if needed, but for real-time dashboards we usually use Supabase Realtime
    // revalidatePath('/educator/dashboard')

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
