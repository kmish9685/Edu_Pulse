'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type ActionResponse<T = any> = {
    success: boolean
    data?: T
    error?: string
}

export async function submitSignal(data: { type: string, block_room: string, additional_text?: string, device_id?: string }): Promise<ActionResponse> {
    console.log('[DEBUG] submitSignal start:', data);
    const supabase = await createClient()
    let roomId = data.block_room || ''
    
    // Resolve PIN to UUID if necessary
    if (roomId.length <= 6) {
        try {
            const { data: sess } = await supabase
                .from('active_sessions')
                .select('id')
                .or(`join_code.eq.${roomId.toUpperCase()},id.eq.${roomId.toUpperCase()}`)
                .eq('is_active', true)
                .limit(1)
                .single()
            if (sess) roomId = sess.id
        } catch (e) {
            console.error('[DEBUG] Resolution error:', e)
        }
    }

    const { error } = await supabase.from('signals').insert({
        type: data.type,
        block_room: roomId,
        additional_text: data.additional_text,
        device_id: data.device_id,
        active_topic: data.additional_text?.split(' | ')[0] || 'General'
    })
    
    if (error) {
        console.error('[ERROR] submitSignal fail:', error.message);
        return { success: false, error: error.message }
    }
    return { success: true }
}

export async function validateSession(code: string): Promise<{ active: boolean, roomId?: string, agenda?: string[] }> {
    const supabase = await createClient()
    const pin = code.trim().toUpperCase()
    try {
        const { data, error } = await supabase
            .from('active_sessions')
            .select('id, agenda')
            .or(`join_code.eq.${pin},id.eq.${pin}`)
            .eq('is_active', true)
            .limit(1)

        if (error || !data || data.length === 0) return { active: false }
        return { active: true, roomId: data[0].id, agenda: data[0].agenda || [] }
    } catch {
        return { active: false }
    }
}

export async function startSession(pin: string, topic: string, agenda: string[]): Promise<ActionResponse> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }
    const { error } = await supabase
        .from('active_sessions')
        .upsert({ id: pin, educator_id: user.id, is_active: true, current_topic: topic, join_code: pin, agenda })
    return { success: !error, error: error?.message }
}

export async function endSession(pin: string): Promise<ActionResponse> {
    const supabase = await createClient()
    const { error } = await supabase.from('active_sessions').update({ is_active: false }).eq('id', pin)
    return { success: !error, error: error?.message }
}

export async function updateJoinCode(roomId: string, newCode: string): Promise<ActionResponse> {
    const supabase = await createClient()
    const { error } = await supabase
        .from('active_sessions')
        .update({ join_code: newCode.toUpperCase() })
        .eq('id', roomId)
    return { success: !error, error: error?.message }
}

export async function getSessionRemediation(sessionId: string): Promise<ActionResponse> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('active_sessions')
        .select('remediation_material, current_topic, started_at')
        .eq('id', sessionId)
        .single()
    if (error) return { success: false, error: error.message }
    return { success: true, data }
}

export async function saveRemediation(sessionId: string, material: string): Promise<ActionResponse> {
    const supabase = await createClient()
    const { error } = await supabase
        .from('active_sessions')
        .update({ remediation_material: material })
        .eq('id', sessionId)
    return { success: !error, error: error?.message }
}

export async function getMutedDevices(roomId: string): Promise<string[]> {
    const supabase = await createClient()
    try {
        const { data } = await supabase.from('active_sessions').select('metadata').eq('id', roomId).single()
        return data?.metadata?.muted_devices || []
    } catch {
        return []
    }
}

export async function muteDevice(roomId: string, deviceId: string): Promise<ActionResponse> {
    const supabase = await createClient()
    try {
        const { data: session } = await supabase.from('active_sessions').select('metadata').eq('id', roomId).single()
        if (!session) return { success: false, error: 'Session not found' }
        const currentMetadata = session.metadata || {}
        const muted = Array.isArray(currentMetadata.muted_devices) ? currentMetadata.muted_devices : []
        if (!muted.includes(deviceId)) {
            muted.push(deviceId)
            await supabase.from('active_sessions').update({ metadata: { ...currentMetadata, muted_devices: muted } }).eq('id', roomId)
        }
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function getPendingDoubts(sessionId: string): Promise<any[]> {
    const supabase = await createClient()
    try {
        const { data } = await supabase.from('active_sessions').select('metadata').eq('id', sessionId).single()
        return data?.metadata?.pending_doubts || []
    } catch {
        return []
    }
}

export async function submitPendingDoubt(data: any): Promise<ActionResponse> {
    const supabase = await createClient()
    try {
        const { data: session } = await supabase.from('active_sessions').select('metadata').eq('id', data.sessionId).single()
        if (!session) return { success: false, error: 'Session not found' }
        const currentMetadata = session.metadata || {}
        const doubts = Array.isArray(currentMetadata.pending_doubts) ? currentMetadata.pending_doubts : []
        doubts.push({ id: 'd' + Date.now(), text: data.doubtText, topic: data.topic, deviceId: data.deviceId, submittedAt: new Date().toISOString(), status: 'pending' })
        const { error } = await supabase.from('active_sessions').update({ metadata: { ...currentMetadata, pending_doubts: doubts } }).eq('id', data.sessionId)
        return { success: !error, error: error?.message }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function reviewPendingDoubt(sessionId: string, doubtId: string, status: string): Promise<ActionResponse> {
    const supabase = await createClient()
    try {
        const { data: session } = await supabase.from('active_sessions').select('metadata').eq('id', sessionId).single()
        if (!session || !session.metadata) return { success: false, error: 'Session not found' }
        const doubts = (session.metadata.pending_doubts || []).map((d: any) => d.id === doubtId ? { ...d, status } : d)
        const { error } = await supabase.from('active_sessions').update({ metadata: { ...session.metadata, pending_doubts: doubts } }).eq('id', sessionId)
        return { success: !error, error: error?.message }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}
