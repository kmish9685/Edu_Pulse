'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { LogOut, Activity, Zap, Tag, ChevronRight, Download, Bell, Sparkles, Loader2, Clock } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { endSession, updateJoinCode } from '@/app/actions/signals'
import { QRCodeSVG } from 'qrcode.react'

// ─── State Banner ──────────────────────────────────────────────
function StateBanner({ pulseValue }: { pulseValue: number }) {
    const level = pulseValue >= 30 ? 'alert' : pulseValue >= 15 ? 'watch' : 'calm'
    const cfg = {
        calm: { cls: 'state-banner state-banner-calm', icon: null, text: `Session active · ${pulseValue < 15 ? 'Class following well' : ''}` },
        watch: { cls: 'state-banner state-banner-watch', icon: <Zap size={13} />, text: 'Signals picking up · Consider a quick check-in' },
        alert: { cls: 'state-banner state-banner-alert', icon: <Bell size={13} />, text: 'High confusion load · Pause now and recap the last concept.' },
    }[level]

    return (
        <div className={cfg.cls}>
            {cfg.icon}
            <span style={{ fontFamily: 'var(--font-body)' }}>{cfg.text}</span>
            {level === 'calm' && pulseValue > 0 && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-tertiary)', marginLeft: '0.25rem' }}>
                    · {pulseValue}% load
                </span>
            )}
        </div>
    )
}

// ─── Main dashboard content ────────────────────────────────────
function DashboardContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const sessionId = searchParams.get('session')

    const [chartData, setChartData] = useState<any[]>([])
    const [recentSignals, setRecentSignals] = useState<any[]>([])
    const [stats, setStats] = useState<Record<string, number>>({})
    const [aiInsight, setAiInsight] = useState('Gathering live data...')
    const [pulseValue, setPulseValue] = useState(0)
    const [totalSignals, setTotalSignals] = useState(0)
    const [chartRevealed, setChartRevealed] = useState(false)
    const [ending, setEnding] = useState(false)
    const [muted, setMuted] = useState(false)
    const alertFired = useRef(false) // prevents repeated firing every 3s poll

    // Master Signals State for Realtime
    const [allSignals, setAllSignals] = useState<any[]>([])

    // Anti-Spam state
    const [joinCode, setJoinCode] = useState(sessionId || '')
    const [mutedDevices, setMutedDevices] = useState<string[]>([])
    const [showFloatQR, setShowFloatQR] = useState(false)

    const agendaParam = searchParams.get('agenda')
    const [agenda] = useState<string[]>(() => {
        try { 
            const parsed = agendaParam ? JSON.parse(decodeURIComponent(agendaParam)) : [] 
            return parsed.length > 0 ? parsed : ['Introduction', 'Core Concept 1', 'Core Concept 2', 'Q&A / Summary']
        }
        catch { return ['Introduction', 'Core Concept 1', 'Core Concept 2', 'Q&A / Summary'] }
    })
    const [currentTopicIndex, setCurrentTopicIndex] = useState(0)
    const [topicLog, setTopicLog] = useState<{ time: string; label: string }[]>([])

    const supabase = createClient()

    // ── Sound alert via Web Audio API (no file needed) ──────────────
    const playAlertSound = () => {
        if (muted) return
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
            const playTone = (freq: number, startTime: number, duration: number) => {
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()
                osc.connect(gain)
                gain.connect(ctx.destination)
                osc.type = 'sine'
                osc.frequency.setValueAtTime(freq, startTime)
                gain.gain.setValueAtTime(0, startTime)
                gain.gain.linearRampToValueAtTime(0.5, startTime + 0.02)
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
                osc.start(startTime)
                osc.stop(startTime + duration)
            }
            // Double-ping: two tones for attention
            playTone(880, ctx.currentTime, 0.25)
            playTone(660, ctx.currentTime + 0.3, 0.35)
        } catch (e) {
            // Audio not available (e.g. server-side render) — fail silently
        }
    }

    // Fire alert when confusion crosses 30% threshold
    useEffect(() => {
        if (pulseValue >= 30 && !alertFired.current) {
            alertFired.current = true
            playAlertSound()
        }
        // Reset so it can fire again if load drops below 15% and climbs back
        if (pulseValue < 15) {
            alertFired.current = false
        }
    }, [pulseValue, muted])

    useEffect(() => {
        setTopicLog([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), label: 'Session Started' }])
        // Trigger chart reveal after a short delay
        setTimeout(() => setChartRevealed(true), 200)
    }, [])

    useEffect(() => {
        if (!sessionId || sessionId.length !== 4) { router.push('/educator/start'); return }
        
        // Initial Fetch
        async function fetchSignals() {
            const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
            const { data } = await supabase
                .from('signals').select('*')
                .eq('block_room', sessionId)
                .gte('created_at', oneHourAgo)
                .order('created_at', { ascending: false })
            if (data) setAllSignals(data)
        }
        fetchSignals()
        
        // ── Polling fallback (3s) — works even if Realtime is not enabled ──
        // This guarantees signals always appear. Realtime is a performance bonus on top.
        const pollInterval = setInterval(fetchSignals, 3000)

        // ── Supabase Realtime subscription (instant delivery when available) ──
        const channel = supabase
            .channel(`room_${sessionId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'signals', filter: `block_room=eq.${sessionId}` },
                (payload) => {
                    // Instantly inject the new signal into state
                    setAllSignals(prev => {
                        // Deduplicate — don't add if polling already picked it up
                        if (prev.some(s => s.id === payload.new.id)) return prev
                        return [payload.new, ...prev]
                    })
                }
            )
            .subscribe((status) => {
                console.log('[EduPulse Realtime] Channel status:', status)
            })

        return () => {
            clearInterval(pollInterval)
            supabase.removeChannel(channel)
        }
    }, [sessionId])

    // Code rotation interval
    useEffect(() => {
        if (!sessionId) return
        const rotInt = setInterval(() => {
            const newCode = Array.from(Array(4), () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random()*32)]).join('')
            setJoinCode(newCode)
            updateJoinCode(sessionId, newCode)
        }, 60000)
        return () => clearInterval(rotInt)
    }, [sessionId])

    const advanceTopic = async () => {
        if (currentTopicIndex >= agenda.length) return
        const nextIdx = currentTopicIndex + 1
        const topic = agenda[currentTopicIndex]
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        setTopicLog(prev => [...prev, { time, label: topic }])
        setCurrentTopicIndex(nextIdx)

        const activeTopic = nextIdx < agenda.length ? agenda[nextIdx] : null
        await supabase
            .from('active_sessions')
            .update({ current_topic: activeTopic })
            .eq('id', sessionId)
    }

    // Derive all UI state whenever allSignals or mutedDevices changes
    useEffect(() => {
        const validSignals = allSignals.filter(s => !mutedDevices.includes(s.device_id || ''))

        setRecentSignals(validSignals.slice(0, 10))
        setTotalSignals(validSignals.length)

        const typeCounts: Record<string, number> = {}
        validSignals.forEach(s => { typeCounts[s.type] = (typeCounts[s.type] || 0) + 1 })
        setStats(typeCounts)

        const oneMinAgo = new Date(Date.now() - 60000).toISOString()
        const recentCount = validSignals.filter(s => s.created_at > oneMinAgo).length
        setPulseValue(Math.min(recentCount * 10, 100))

        const timeSeriesMap = new Map<string, { time: string; signals: number }>()
        for (let i = 29; i >= 0; i--) {
            const t = new Date(Date.now() - i * 60000)
            const label = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            timeSeriesMap.set(label, { time: label, signals: 0 })
        }
        validSignals.forEach(s => {
            const label = new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            if (timeSeriesMap.has(label)) timeSeriesMap.get(label)!.signals += 1
        })
        
        // Ensure chart data is strictly chronological
        setChartData(Array.from(timeSeriesMap.values()).reverse().reverse()) 
        generateInsight(validSignals, recentCount, typeCounts)
        
    }, [allSignals, mutedDevices])

    function generateInsight(data: any[], recentCount: number, typeCounts: Record<string, number>) {
        if (data.length === 0) { setAiInsight('No signals yet. Class appears to be following well.'); return }
        if (recentCount === 1) { setAiInsight('Isolated signal — not a class-wide concern. Continue your pace.'); return }
        if (recentCount >= 5) { setAiInsight('⚠ 5+ signals in the last minute. Consider pausing to recap the last point.'); return }
        const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])
        if (sorted[0]?.[0] === 'Too Fast' && sorted[0][1] > 3) {
            setAiInsight('"Too Fast" signals are dominant. Slow down, summarize, then move on.')
        } else {
            setAiInsight('Multiple confusion signals detected. Check the timeline for the exact minute it started.')
        }
    }

    const isHighLoad = pulseValue >= 30
    const isWatchLoad = pulseValue >= 15 && pulseValue < 30
    const currentTopic = currentTopicIndex < agenda.length ? agenda[currentTopicIndex] : null

    // Auto-advance logic based on AI time estimation (e.g. "Topic Name (15m)")
    const [timeLeft, setTimeLeft] = useState<number | null>(null)

    useEffect(() => {
        if (currentTopicIndex >= agenda.length || !agenda[currentTopicIndex]) {
            setTimeLeft(null)
            return
        }

        const topicStr = agenda[currentTopicIndex]
        const match = topicStr.match(/\((\d+)m\)$/i)

        if (match) {
            const minutes = parseInt(match[1])
            let seconds = minutes * 60
            setTimeLeft(seconds)

            const interval = setInterval(() => {
                seconds--
                setTimeLeft(seconds)
                if (seconds <= 0) {
                    clearInterval(interval)
                    // Auto-advance removed so signals follow teacher logic, not clock
                }
            }, 1000)

            return () => clearInterval(interval)
        } else {
            setTimeLeft(null) // Manual mode if no time detected
        }
    }, [currentTopicIndex, agenda])

    const pulseColor = isHighLoad ? 'var(--danger)' : isWatchLoad ? 'var(--warning)' : 'var(--text-primary)'
    const barColor = isHighLoad
        ? 'linear-gradient(90deg, var(--danger), #FF8080)'
        : isWatchLoad
            ? 'linear-gradient(90deg, var(--warning), #FBBF24)'
            : 'linear-gradient(90deg, var(--accent), var(--accent-soft))'

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)' }}>

            {/* Ambient glow */}
            <div style={{ position: 'fixed', top: '-5%', left: '20%', width: '60%', height: '40%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            {/* Topbar */}
            <header style={{ borderBottom: '1px solid var(--border)', height: 54, display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '0.875rem', flexShrink: 0, zIndex: 10, position: 'relative', backdropFilter: 'blur(12px)', background: 'var(--glass-bg)' }}>
                {/* Logo + session */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: 24, height: 24, background: '#0F172A', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={13} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>EduPulse</span>
                </div>
                <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>PIN</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 800, padding: '0.25rem 0.625rem', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', letterSpacing: '0.12em' }}>
                        {joinCode}
                    </span>
                    <button 
                        onClick={async () => {
                            if ('documentPictureInPicture' in window) {
                                try {
                                    const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
                                        width: 250,
                                        height: 300,
                                    });
                                    // Copy styles
                                    Array.from(document.styleSheets).forEach((sheet) => {
                                        try {
                                            const cssRules = Array.from(sheet.cssRules).map(rule => rule.cssText).join('');
                                            const style = document.createElement('style');
                                            style.textContent = cssRules;
                                            pipWindow.document.head.appendChild(style);
                                        } catch (e) {
                                            if (sheet.href) {
                                                const link = document.createElement('link');
                                                link.rel = 'stylesheet';
                                                link.href = sheet.href;
                                                pipWindow.document.head.appendChild(link);
                                            }
                                        }
                                    });
                                    // Move the QR container or create a new one inside the PiP window
                                    pipWindow.document.body.innerHTML = `
                                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #000; color: #fff; font-family: sans-serif; text-align: center;">
                                            <div style="font-weight: bold; margin-bottom: 15px; font-size: 1.2rem;">Scan to Join</div>
                                            <div id="qr-container" style="background: white; padding: 10px; border-radius: 8px;">
                                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(window.location.origin + '/join/' + joinCode)}" alt="QR Code" style="width: 160px; height: 160px; display: block;" />
                                            </div>
                                            <div style="margin-top: 15px; font-size: 1.5rem; font-family: monospace; font-weight: bold; letter-spacing: 2px;">${joinCode}</div>
                                        </div>
                                    `;
                                    
                                    // We'll leave the floating DOM QR code approach running as a fallback if they click the button again
                                    setShowFloatQR(true);
                                } catch (error) {
                                    console.error('PiP failed', error);
                                    setShowFloatQR(!showFloatQR);
                                }
                            } else {
                                setShowFloatQR(!showFloatQR);
                            }
                        }}
                        style={{ padding: '0.25rem 0.625rem', background: showFloatQR ? 'var(--accent)' : 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: showFloatQR ? '#fff' : 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Float QR
                    </button>
                </div>

                {/* Topic advance */}
                {agenda.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 1rem', borderLeft: '1px solid var(--border)', marginLeft: '0.5rem' }}>
                        <Tag size={13} color="var(--accent-soft)" />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {currentTopic ? currentTopic.replace(/\s*\(\d+m\)$/, '') : <span style={{ color: 'var(--text-tertiary)' }}>All topics complete</span>}
                        </span>

                        {/* Auto-advance timer */}
                        {timeLeft !== null && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: timeLeft < 60 ? 'var(--warning)' : 'var(--success)', background: 'var(--bg-base)', border: '1px solid var(--border)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Clock size={11} />
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </span>
                        )}

                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{Math.min(currentTopicIndex + 1, agenda.length)}/{agenda.length}</span>
                        <button onClick={advanceTopic} disabled={currentTopicIndex >= agenda.length}
                            className="btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                            Next Topic <ChevronRight size={15} />
                        </button>
                    </div>
                )}

                <div style={{ flex: 1 }} />
                {/* Mute toggle */}
                <button
                    onClick={() => setMuted(m => !m)}
                    title={muted ? 'Unmute alerts' : 'Mute alerts'}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: muted ? 'var(--danger)' : 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                    {muted ? '🔇' : '🔔'}
                </button>
                <button
                    disabled={ending}
                    onClick={async () => {
                        if (!sessionId) {
                            const { signOut } = await import('@/app/actions/auth')
                            await signOut()
                            window.location.href = '/'
                            return
                        }
                        setEnding(true)
                        await endSession(sessionId)
                        // Pass agenda to the summary page for context
                        const agendaParam = encodeURIComponent(JSON.stringify(agenda))
                        router.push(`/educator/summary/${sessionId}?agenda=${agendaParam}`)
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.4rem 0.8rem', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 600, cursor: ending ? 'wait' : 'pointer' }}
                >
                    {ending ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Ending...</> : <><LogOut size={13} /> End Session</>}
                </button>
            </header>

            {/* Contextual State Banner */}
            <StateBanner pulseValue={pulseValue} />

            {/* Main dashboard grid */}
            <main className="educator-layout">

                {/* Chart card */}
                <div className="glass-card" style={{ gridColumn: 1, gridRow: 1, padding: '1.5rem', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <Activity size={15} color="var(--accent)" />
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.025em' }}>Confusion Timeline</span>
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Signals per minute · last 30 mins</div>
                        </div>
                        <div className="lx-badge">{totalSignals} total</div>
                    </div>
                    {/* Chart with clip-path reveal */}
                    <div
                        style={{
                            height: 195,
                            clipPath: chartRevealed ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                            transition: chartRevealed ? 'clip-path 0.6s ease-in-out' : 'none',
                        }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="var(--accent)" />
                                        <stop offset="100%" stopColor="var(--accent-soft)" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-dim)" />
                                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }} tickMargin={10} axisLine={false} tickLine={false} minTickGap={40} />
                                <YAxis tick={{ fontSize: 10, fill: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip
                                    cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1 }}
                                    contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', color: 'var(--text-primary)', fontSize: 12 }}
                                    itemStyle={{ color: 'var(--accent-soft)', fontWeight: 600 }}
                                    labelStyle={{ color: 'var(--text-tertiary)', marginBottom: 4, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                />
                                <Line type="monotone" dataKey="signals" stroke="url(#lineGrad)" strokeWidth={3} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--accent-soft)' }} animationDuration={1000} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right sidebar */}
                <div style={{ gridColumn: 2, gridRow: '1 / 3', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Confusion Load */}
                    <div
                        className="glass-card"
                        style={{
                            padding: '1.5rem',
                            borderColor: isHighLoad ? 'rgba(239,68,68,0.2)' : isWatchLoad ? 'rgba(245,158,11,0.15)' : 'var(--border)',
                            background: isHighLoad ? 'rgba(239,68,68,0.04)' : 'var(--bg-surface)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {isHighLoad && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--danger)', animation: 'pulse-wide 2s infinite' }} />}
                        <div className="section-label" style={{ marginBottom: '1rem' }}>
                            Confusion Load
                        </div>
                        <div style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '3.75rem',
                            fontWeight: 800,
                            letterSpacing: '-0.05em',
                            color: pulseColor,
                            lineHeight: 1,
                            marginBottom: '0.5rem',
                        }}>
                            {pulseValue}%
                        </div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-tertiary)', marginBottom: '1.25rem' }}>recent participants signaling</div>
                        <div style={{ height: 6, background: 'var(--bg-base)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pulseValue}%`, background: pulseColor, borderRadius: 99, transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                        </div>
                    </div>

                    {/* AI Insight */}
                    <div className="glass-card" style={{ padding: '1.125rem', background: 'var(--bg-surface)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.625rem' }}>
                            <Sparkles size={12} color="var(--accent-soft)" />
                            <span className="section-label">AI Insight</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{aiInsight}</p>
                    </div>

                    {/* Topic Log */}
                    <div className="glass-card" style={{ padding: '1.25rem', overflow: 'hidden', flex: 1 }}>
                        <div className="section-label" style={{ marginBottom: '0.875rem' }}>Topic Log</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: 200 }}>
                            {topicLog.map((entry, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: i === topicLog.length - 1 ? 'var(--accent-soft)' : 'var(--text-tertiary)', flexShrink: 0, paddingTop: 2 }}>{entry.time}</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: i === topicLog.length - 1 ? 700 : 400, color: i === topicLog.length - 1 ? 'var(--text-primary)' : 'var(--text-tertiary)', flex: 1 }}>{entry.label}</span>
                                    {i === topicLog.length - 1 && (
                                        <span style={{ fontSize: '0.6rem', fontWeight: 800, background: 'var(--accent-dim)', color: 'var(--accent-soft)', padding: '0.1rem 0.45rem', borderRadius: 99, border: '1px solid var(--border-accent)', flexShrink: 0 }}>NOW</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div style={{ gridColumn: 1, gridRow: 2, display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1.25rem' }}>

                    {/* Signal Breakdown */}
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                        <div className="section-label" style={{ marginBottom: '1rem' }}>Breakdown</div>
                        {Object.keys(stats).length === 0 ? (
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', padding: '1.25rem 0' }}>No signals yet</div>
                        ) : Object.entries(stats).map(([type, count]) => {
                            const total = Object.values(stats).reduce((a, b) => a + b, 0)
                            const pct = Math.round((count / total) * 100)
                            return (
                                <div key={type} style={{ marginBottom: '0.875rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{type}</span>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{pct}%</span>
                                    </div>
                                    <div style={{ height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 99 }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-soft))', borderRadius: 99, transition: 'width 1s ease' }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Recent Signals feed — staggered entrance */}
                    <div className="glass-card" style={{ padding: '1.25rem', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                            <span className="section-label">Recent Signals</span>
                            <div className="lx-badge lx-badge-live">live</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', overflowY: 'auto', maxHeight: 220 }}>
                            {recentSignals.length === 0 ? (
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-tertiary)', textAlign: 'center', padding: '2.5rem 0' }}>
                                    Waiting for signals...
                                </div>
                            ) : recentSignals.map((signal, idx) => (
                                <div
                                    key={signal.id}
                                    className="signal-row-enter"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem',
                                        background: 'var(--bg-surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                                        animationDelay: `${idx * 40}ms`,
                                    }}
                                >
                                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: signal.type === 'Too Fast' ? 'var(--warning)' : 'var(--danger)', flexShrink: 0, boxShadow: `0 0 6px ${signal.type === 'Too Fast' ? 'rgba(245,158,11,0.5)' : 'rgba(239,68,68,0.5)'}` }} />
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{signal.type}</span>
                                        {signal.additional_text && (
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '0.1rem' }}>
                                                &quot;{signal.additional_text}&quot;
                                            </span>
                                        )}
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                                        {new Date(signal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                    {signal.device_id && (
                                        <button 
                                            onClick={() => setMutedDevices(d => [...d, signal.device_id])}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', fontSize: '0.65rem', cursor: 'pointer', padding: '0.2rem 0.4rem', borderRadius: 4, fontFamily: 'var(--font-mono)' }}
                                            onMouseOver={e => e.currentTarget.style.color = 'var(--danger)'}
                                            onMouseOut={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                                            title={`Mute this student\'s device`}
                                        >
                                            Mute
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating QR Overlay */}
            {showFloatQR && (
                <div 
                    style={{ 
                        position: 'fixed', top: 70, right: 24, zIndex: 100, 
                        background: 'var(--bg-elevated)', border: '1px solid var(--border-accent)', 
                        borderRadius: 'var(--radius)', padding: '1.25rem',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                        animation: 'enter-fade 0.2s ease-out'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Scan to Join</span>
                        <button onClick={() => setShowFloatQR(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>✕</button>
                    </div>
                    <div style={{ background: '#fff', padding: '0.5rem', borderRadius: 8 }}>
                        <QRCodeSVG 
                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/join/${joinCode}`}
                            size={160}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"Q"}
                        />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Or go to edupulse.com and enter</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-soft)', letterSpacing: '0.15em' }}>{joinCode}</div>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={10} /> Closes & changes every 60s
                    </div>
                </div>
            )}
        </div>
    )
}

export default function Dashboard() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 10, animation: 'pulse-dot 2s infinite' }} />
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>Loading session...</span>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    )
}
