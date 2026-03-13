'use server'

import { createClient } from '@/utils/supabase/server'
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

    // ── IP Geofencing: Shadow Ban ──────────────────────────────────
    // If teacher IP is recorded and student is on a different network — silently drop
    if (teacherIp && studentIp && !isSameNetwork(studentIp, teacherIp)) {
        // Return success=true so student doesn't know they're shadow-banned
        // But also set offNetwork=true so the student UI can show the WiFi message
        return { success: true, offNetwork: true }
    }

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
        })

    if (error) return { success: false, error: error.message }
    return { success: true, offNetwork: false }
}

export async function validateSession(code: string): Promise<{ active: boolean, roomId?: string, agenda?: string[] }> {
    if (!code) return { active: false }
    const supabase = await createClient()
    
    // Primary query — only select guaranteed columns. This must NEVER fail due to missing columns.
    const { data } = await supabase
        .from('active_sessions')
        .select('id')
        .eq('join_code', code)
        .eq('is_active', true)
        .single()

    if (!data) return { active: false }

    // Secondary query — try to get agenda separately. If column doesn't exist, fail silently.
    let agenda: string[] = []
    try {
        const { data: sessionData } = await supabase
            .from('active_sessions')
            .select('agenda')
            .eq('id', data.id)
            .single()
        if (sessionData?.agenda && Array.isArray(sessionData.agenda)) {
            agenda = sessionData.agenda
        }
    } catch {
        // agenda column may not exist yet — that's fine, topics just won't show in dropdown
    }

    return { active: true, roomId: data.id, agenda }
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
