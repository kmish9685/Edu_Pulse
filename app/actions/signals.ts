'use server'

import { createClient } from '@/utils/supabase/server'
import { checkDeepDoubtSpam } from './ai'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

// ─── IP Helpers ───────────────────────────────────────────────────
function getClientIp(headerList: Headers): string | null {
    // In production (Vercel/Cloudflare), real IP is in x-forwarded-for
    const forwarded = headerList.get('x-forwarded-for')
    if (forwarded) return forwarded.split(',')[0].trim()
    const realIp = headerList.get('x-real-ip')
    if (realIp) return realIp.trim()
    return null
}

// Compare /16 network prefix (first two octets) — same campus WiFi will match
function isSameNetwork(ip1: string | null, ip2: string | null): boolean {
    if (!ip1 || !ip2) return true // If we can't determine IP, allow through
    // Handle IPv6 loopback (localhost testing) — always allow
    if (ip1.includes(':') || ip2.includes(':')) return true
    const net1 = ip1.split('.').slice(0, 2).join('.')
    const net2 = ip2.split('.').slice(0, 2).join('.')
    return net1 === net2
}

export async function submitSignal(data: {
    type: string,
    lat?: number,
    lng?: number,
    block_room?: string,
    additional_text?: string,
    device_id?: string
}) {
    const supabase = await createClient()
    const headerList = await headers()
    const studentIp = getClientIp(headerList)

    let activeTopic = null
    let teacherIp: string | null = null

    // Validate session and get teacher IP for geofencing
    if (data.block_room) {
        const { data: session } = await supabase
            .from('active_sessions')
            .select('id, is_active, current_topic, teacher_ip')
            .eq('id', data.block_room)
            .eq('is_active', true)
            .single()

        if (!session) {
            return { success: false, error: 'No active session with this PIN. The class may have ended.' }
        }

        activeTopic = session.current_topic
        // teacher_ip may not exist as column yet — use optional chaining
        teacherIp = (session as any).teacher_ip ?? null
    }

    // ── Shadowbanning Check (Persistent) ──────────────────────────
    let isShadowBanned = false
    if (data.block_room && data.device_id) {
        const { data: sessionData } = await supabase
            .from('active_sessions')
            .select('metadata')
            .eq('id', data.block_room)
            .single()
        
        const mutes = sessionData?.metadata?.muted_devices || []
        if (mutes.includes(data.device_id)) {
            isShadowBanned = true
            console.log(`[Shadowban] Blocked signal from device: ${data.device_id}`)
        }
    }

    // ── IP Geofencing: Soft Check ──────────────────────────────────
    let isOffNetwork = false
    
    // If teacher IP is recorded and student is on a different network, flag it but do NOT drop the signal.
    if (teacherIp && studentIp && !isSameNetwork(studentIp, teacherIp)) {
        isOffNetwork = true
        console.log(`[Soft Geofence] Student IP (${studentIp}) does NOT match Teacher IP network (${teacherIp}). Signal accepted but flagged.`)
    }

    // ── AI Spam Guard: Gatekeeper ──────────────────────────────────
    let isSpamCategory = isShadowBanned // If already shadowbanned, it's spam by default
    let signalCategory: 'academic' | 'noise' | 'spam' = isShadowBanned ? 'spam' : 'academic'
    
    if (data.type === 'deep_doubt' && data.additional_text) {
        const spamCheck = await checkDeepDoubtSpam(data.additional_text)
        if (spamCheck.success) {
            isSpamCategory = spamCheck.isSpam
            signalCategory = spamCheck.category
        }
    }

    // ── Shadowbanning Check ────────────────────────────────────────
    // If the device is shadowbanned, we still return "success" but we mark it as spam
    // to hide it from the main dashboard.
    // (In a full implementation, we would check a 'muted_devices' table here)

    const { error } = await supabase
        .from('signals')
        .insert({
            type: data.type,
            lat: data.lat,
            lng: data.lng,
            block_room: data.block_room,
            additional_text: data.additional_text?.substring(0, 120),
            device_id: data.device_id ?? null,
            active_topic: activeTopic,
            is_spam: isSpamCategory, // Flag it so teacher can filter
            metadata: { category: signalCategory } // Store AI classification
        })

    if (error) return { success: false, error: error.message }
    
    // Return offNetwork so the client can still show the "Connect to Campus WiFi" warning banner
    return { success: true, offNetwork: isOffNetwork }
}

export async function validateSession(code: string): Promise<{ active: boolean, roomId?: string, agenda?: string[] }> {
    if (!code) return { active: false }
    const supabase = await createClient()
    
    // Primary query - use limit(1) instead of single() to avoid throwing errors if there are duplicates
    let { data, error: primaryError } = await supabase
        .from('active_sessions')
        .select('id')
        .eq('join_code', code)
        .eq('is_active', true)
        .limit(1)

    // Secondary fallback: if join_code didn't match, they might've entered the original static PIN (the ID itself)
    if (!data || data.length === 0) {
        const { data: fallbackData, error: fallbackError } = await supabase
            .from('active_sessions')
            .select('id')
            .eq('id', code)
            .eq('is_active', true)
            .limit(1)
            
        if (!fallbackData || fallbackData.length === 0) {
            console.log(`[Validation Failed] PIN ${code} not found as join_code or active id.`)
            return { active: false }
        }
        data = fallbackData
    }

    const roomId = data[0].id

    // Secondary query — try to get agenda separately. If column doesn't exist, fail silently.
    let agenda: string[] = []
    try {
        const { data: sessionData } = await supabase
            .from('active_sessions')
            .select('agenda')
            .eq('id', roomId)
            .single()
        if (sessionData?.agenda && Array.isArray(sessionData.agenda)) {
            agenda = sessionData.agenda
        }
    } catch {
        // agenda column may not exist yet — that's fine, topics just won't show in dropdown
    }

    return { active: true, roomId, agenda }
}

export async function startSession(pin: string, initialTopic?: string, agenda?: string[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    // Capture teacher IP for geofencing
    let teacherIp: string | null = null
    try {
        const headerList = await headers()
        teacherIp = getClientIp(headerList)
    } catch { /* headers not available in some contexts */ }

    // Enforce role authorization
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || (profile.role !== 'educator' && profile.role !== 'admin')) {
        return { success: false, error: 'Unauthorized: Only registered educators can start sessions.' }
    }

    // Upsert — save agenda + teacher IP to DB
    const { error } = await supabase
        .from('active_sessions')
        .upsert({
            id: pin,
            educator_id: user.id,
            started_at: new Date().toISOString(),
            ended_at: null,
            is_active: true,
            current_topic: initialTopic || null,
            join_code: pin,
            agenda: agenda && agenda.length > 0 ? agenda : null,
            teacher_ip: teacherIp,
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

export async function updateJoinCode(roomId: string, newCode: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const { error } = await supabase
        .from('active_sessions')
        .update({ join_code: newCode })
        .eq('id', roomId)
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
export async function saveRemediation(pin: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const { error } = await supabase
        .from('active_sessions')
        .update({ remediation_material: content })
        .eq('id', pin)
        .eq('educator_id', user.id)

    if (error) return { success: false, error: error.message }
    return { success: true }
}

export async function getSessionRemediation(pin: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('active_sessions')
        .select('remediation_material, current_topic, started_at, metadata')
        .eq('id', pin)
        .single()
    
    if (error) return { success: false, error: error.message }
    return { success: true, data }
}

export async function muteDevice(roomId: string, deviceId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    // Fetch current metadata to update muted_devices array
    const { data: session } = await supabase
        .from('active_sessions')
        .select('metadata')
        .eq('id', roomId)
        .eq('educator_id', user.id)
        .single()

    const currentMetadata = session?.metadata || {}
    const mutedDevices = Array.isArray(currentMetadata.muted_devices) ? currentMetadata.muted_devices : []
    
    if (!mutedDevices.includes(deviceId)) {
        mutedDevices.push(deviceId)
    }

    const { error } = await supabase
        .from('active_sessions')
        .update({ metadata: { ...currentMetadata, muted_devices: mutedDevices } })
        .eq('id', roomId)
        .eq('educator_id', user.id)

    if (error) return { success: false, error: error.message }
    return { success: true }
}

export async function getMutedDevices(roomId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('active_sessions')
        .select('metadata')
        .eq('id', roomId)
        .single()

    if (error || !data?.metadata?.muted_devices) return []
    return data.metadata.muted_devices as string[]
}

// --- Pending Doubt System -------------------------------------

/**
 * submitPendingDoubt � Called when a student is rate-limited and submits a text doubt.
 * Runs AI validation first. If invalid, returns an error with the reason.
 * If valid, stores the doubt in the session metadata's pending_doubts array.
 */
export async function submitPendingDoubt(data: {
    sessionId: string;
    deviceId: string;
    topic?: string;
    doubtText: string;
}) {
    if (!data.doubtText || data.doubtText.trim().length < 5) {
        return { success: false, error: 'Please describe your doubt in more detail.' }
    }

    const { validateDeepDoubt } = await import('./ai')
    const validation = await validateDeepDoubt(data.doubtText)

    if (!validation.isValid) {
        const reason = validation.reason || 'This message does not appear to be a genuine academic doubt.'
        return { success: false, rejected: true, error: `Not saved: ${reason}` }
    }

    const supabase = await createClient()
    const { data: session, error: fetchError } = await supabase
        .from('active_sessions')
        .select('metadata')
        .eq('id', data.sessionId)
        .single()

    if (fetchError) return { success: false, error: 'Session not found.' }

    const currentMetadata = session?.metadata || {}
    const pendingDoubts = Array.isArray(currentMetadata.pending_doubts)
        ? currentMetadata.pending_doubts : []

    const newDoubt = {
        id: `doubt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        deviceId: data.deviceId,
        topic: data.topic || 'General',
        text: data.doubtText.substring(0, 500),
        confidence: validation.confidence,
        status: 'pending',
        submittedAt: new Date().toISOString(),
    }
    pendingDoubts.push(newDoubt)

    const { error: updateError } = await supabase
        .from('active_sessions')
        .update({ metadata: { ...currentMetadata, pending_doubts: pendingDoubts } })
        .eq('id', data.sessionId)

    if (updateError) return { success: false, error: updateError.message }
    return { success: true, confidence: validation.confidence }
}

/**
 * getPendingDoubts � Fetches all pending doubts for a session.
 * Returns sorted: pending first, then by confidence descending.
 */
export async function getPendingDoubts(sessionId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('active_sessions')
        .select('metadata')
        .eq('id', sessionId)
        .single()

    if (error || !data?.metadata?.pending_doubts) return []
    const doubts = data.metadata.pending_doubts as any[]
    return doubts.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1
        if (a.status !== 'pending' && b.status === 'pending') return 1
        return (b.confidence || 0) - (a.confidence || 0)
    })
}

/**
 * reviewPendingDoubt � Educator approves or dismisses a pending doubt.
 */
export async function reviewPendingDoubt(sessionId: string, doubtId: string, status: 'approved' | 'dismissed') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const { data: session, error: fetchError } = await supabase
        .from('active_sessions')
        .select('metadata')
        .eq('id', sessionId)
        .eq('educator_id', user.id)
        .single()

    if (fetchError || !session) return { success: false, error: 'Session not found.' }

    const currentMetadata = session?.metadata || {}
    const pendingDoubts = Array.isArray(currentMetadata.pending_doubts)
        ? currentMetadata.pending_doubts : []

    const updated = pendingDoubts.map((d: any) =>
        d.id === doubtId ? { ...d, status, reviewedAt: new Date().toISOString() } : d
    )

    const { error: updateError } = await supabase
        .from('active_sessions')
        .update({ metadata: { ...currentMetadata, pending_doubts: updated } })
        .eq('id', sessionId)

    if (updateError) return { success: false, error: updateError.message }
    return { success: true }
}
