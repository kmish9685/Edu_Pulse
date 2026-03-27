'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { validateDeepDoubt, enhanceDoubt } from './ai'
import { headers } from 'next/headers'

export type ActionResponse<T = any> = {
    success: boolean
    data?: T
    error?: string
}

export async function submitSignal(data: { type: string, block_room: string, additional_text?: string, device_id?: string, fingerprint_id?: string }): Promise<ActionResponse> {
    console.log('[DEBUG] submitSignal start:', data);
    const supabase = await createClient()
    let roomId = data.block_room || ''
    let instId: string | null = null
    
    // Resolve PIN to UUID if necessary (foreign key requirement)
    if (roomId && roomId.length <= 8) {
        try {
            const { data: sess, error: resError } = await supabase
                .from('active_sessions')
                .select('id, institution_id')
                .or(`join_code.eq.${roomId.toUpperCase()},id.eq.${roomId.toUpperCase()}`)
                .eq('is_active', true)
                .maybeSingle()
            
            if (sess?.id) {
                roomId = sess.id
                instId = sess.institution_id
            } else if (resError) {
                console.error('[DEBUG] Resolution error:', resError.message)
            }
        } catch (e) {
            console.error('[DEBUG] Resolution catch:', e)
        }
    } else if (roomId) {
        // Fetch institution_id even if it's already a UUID
        try {
            const { data: sess } = await supabase
                .from('active_sessions')
                .select('institution_id')
                .eq('id', roomId)
                .maybeSingle()
            if (sess) instId = sess.institution_id
        } catch (e) {}
    }

    let isSpam = false
    let clientIp = 'unknown'

    // 1a. IP-based rate limit — raised to 100/60s (abuse-only, doesn't affect real classrooms)
    try {
        const hdr = await headers()
        clientIp = hdr.get('x-forwarded-for')?.split(',')[0]?.trim()
            || hdr.get('x-real-ip')
            || 'unknown'
        
        if (clientIp !== 'unknown' && roomId) {
            const sixtySecondsAgo = new Date(Date.now() - 60000).toISOString()
            const { count: ipCount } = await supabase
                .from('signals')
                .select('*', { count: 'exact', head: true })
                .eq('block_room', roomId)
                .gte('created_at', sixtySecondsAgo)
                .contains('metadata', { ip: clientIp })
            
            if ((ipCount || 0) >= 100) {
                console.log('[DEBUG] IP abuse limit hit:', clientIp)
                isSpam = true
            }
        }
    } catch (e) {
        // headers() unavailable — fail-open
    }

    // 1b. Fingerprint rate limit — PRIMARY incognito defense
    // Max 3 signals per 60s from the same hardware fingerprint (same across incognito tabs)
    if (data.fingerprint_id && roomId) {
        const sixtySecondsAgo = new Date(Date.now() - 60000).toISOString()
        const { count: fpCount } = await supabase
            .from('signals')
            .select('*', { count: 'exact', head: true })
            .eq('block_room', roomId)
            .gte('created_at', sixtySecondsAgo)
            .contains('metadata', { fingerprint_id: data.fingerprint_id })
        
        if ((fpCount || 0) >= 3) {
            console.log('[DEBUG] Fingerprint rate-limited:', data.fingerprint_id)
            isSpam = true
        }
    }

    // 1c. Device-ID rate limit (original check — only adds to isSpam)
    if (data.device_id && roomId) {
        const sixtySecondsAgo = new Date(Date.now() - 60000).toISOString()
        const { count } = await supabase
            .from('signals')
            .select('*', { count: 'exact', head: true })
            .eq('device_id', data.device_id)
            .eq('block_room', roomId)
            .gte('created_at', sixtySecondsAgo)
        
        if ((count || 0) >= 3) {
            console.log('[DEBUG] Device rate-limited:', data.device_id)
            isSpam = true
        }
    }

    // 2. Fetch session details for manual shadowban (Muted Devices)
    if (roomId) {
        try {
            const { data: sessionData } = await supabase
                .from('active_sessions')
                .select('metadata')
                .eq('id', roomId)
                .maybeSingle()

            if (sessionData?.metadata?.muted_devices?.includes(data.device_id)) {
                console.error('[DEBUG] Device is manually muted:', data.device_id)
                isSpam = true
            }
        } catch (e) {
            console.error('[DEBUG] Session metadata fetch error:', e)
        }
    }

    let finalAdditionalText = data.additional_text
    if (data.additional_text && !isSpam) {
        const valRes = await validateDeepDoubt(data.additional_text)
        if (valRes.success && !valRes.isValid) {
            return { success: false, error: valRes.reason || 'AI rejected this message as not being genuine.' } 
        }

        const enhanced = await enhanceDoubt(data.additional_text)
        if (enhanced.success && enhanced.data) {
            finalAdditionalText = `${enhanced.data} (Original: ${data.additional_text})`
        }
    }

    // Database Constraint Safety: Trim to 500 chars
    const safeText = finalAdditionalText?.substring(0, 500)

    // Primary Insert — store IP + fingerprint in metadata for rate limiting
    const { error } = await supabase.from('signals').insert({
        type: data.type,
        block_room: roomId,
        additional_text: safeText,
        device_id: data.device_id,
        active_topic: data.additional_text?.split(' | ')[0]?.substring(0, 50) || 'General',
        institution_id: instId,
        metadata: { ip: clientIp, fingerprint_id: data.fingerprint_id || null }
    })
    
    if (error) {
        console.error('[ERROR] submitSignal fail:', error.message)
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
    
    // Fetch educator profile to get their institution
    const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user.id).single()

    const { error } = await supabase
        .from('active_sessions')
        .upsert({ id: pin, educator_id: user.id, is_active: true, current_topic: topic, join_code: pin, agenda, institution_id: profile?.institution_id })
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

    // 1. Run AI Validation
    const validation = await validateDeepDoubt(data.doubtText)
    if (!validation.success || !validation.isValid) {
        return { 
            success: false, 
            error: validation.reason || 'AI rejected this message as not being a genuine academic doubt.',
            data: { rejected: true }
        }
    }

    // 2. Save if Valid
    try {
        const { data: session } = await supabase.from('active_sessions').select('metadata').eq('id', data.sessionId).single()
        if (!session) return { success: false, error: 'Session not found' }
        const currentMetadata = session.metadata || {}
        const doubts = Array.isArray(currentMetadata.pending_doubts) ? currentMetadata.pending_doubts : []
        
        let enhancedText = data.doubtText
        const enhancement = await enhanceDoubt(data.doubtText)
        if (enhancement.success && enhancement.data) {
            enhancedText = enhancement.data
        }

        doubts.push({ 
            id: 'd' + Date.now(), 
            text: enhancedText,
            originalText: data.doubtText,
            topic: data.topic, 
            deviceId: data.deviceId, 
            submittedAt: new Date().toISOString(), 
            status: 'pending',
            confidence: validation.confidence 
        })
        
        const { error } = await supabase.from('active_sessions').update({ metadata: { ...currentMetadata, pending_doubts: doubts } }).eq('id', data.sessionId)
        
        return { 
            success: !error, 
            error: error?.message, 
            data: { confidence: validation.confidence } 
        }
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

export async function sendVibeCheck(roomId: string): Promise<ActionResponse> {
    const supabase = await createClient()
    try {
        const { data: session } = await supabase.from('active_sessions').select('metadata').eq('id', roomId).single()
        if (!session) return { success: false, error: 'Session not found' }
        const currentMetadata = session.metadata || {}
        
        const timestamp = Date.now()
        await supabase.from('active_sessions').update({ 
            metadata: { ...currentMetadata, vibe_check_timestamp: timestamp } 
        }).eq('id', roomId)
        
        return { success: true, data: { timestamp } }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}
