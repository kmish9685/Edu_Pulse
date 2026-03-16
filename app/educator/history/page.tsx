'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Zap, Sparkles, TrendingDown, TrendingUp, Minus, ArrowRight, Clock, AlertTriangle, BarChart2, LogOut, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface SessionRow {
    id: string
    started_at: string
    ended_at: string | null
    is_active: boolean
    signalCount: number
    doubtCount: number
    topConfusedTopic: string | null
    agendaTopics: string[]
}

export default function SessionHistory() {
    const router = useRouter()
    const [sessions, setSessions] = useState<SessionRow[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadHistory()
    }, [])

    async function loadHistory() {
        setLoading(true)
        const supabase = createClient()

        // 1. Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/'); return }

        // 2. Fetch past sessions (most recent first, max 20)
        const { data: rawSessions, error: sessErr } = await supabase
            .from('active_sessions')
            .select('id, started_at, ended_at, is_active')
            .eq('educator_id', user.id)
            .order('started_at', { ascending: false })
            .limit(20)

        if (sessErr || !rawSessions) {
            setError('Failed to load session history.')
            setLoading(false)
            return
        }

        // 3. For each session, fetch its signals
        const enriched: SessionRow[] = await Promise.all(
            rawSessions.map(async (s) => {
                const { data: signals } = await supabase
                    .from('signals')
                    .select('type')
                    .eq('block_room', s.id)

                const signalCount = signals?.length ?? 0
                const doubtCount = signals?.filter(sig => sig.type === 'Deep Doubt').length ?? 0

                // Find most common signal type (excluding deep doubts which are text-based)
                const typeCounts: Record<string, number> = {}
                signals?.filter(sig => sig.type !== 'Deep Doubt').forEach(sig => {
                    typeCounts[sig.type] = (typeCounts[sig.type] || 0) + 1
                })
                const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])
                const topConfusedTopic = sorted[0]?.[0] ?? null

                return {
                    ...s,
                    signalCount,
                    doubtCount,
                    topConfusedTopic,
                    agendaTopics: [], // agenda not stored in DB currently
                }
            })
        )

        setSessions(enriched)
        setLoading(false)
    }

    const handleLogOut = async () => {
        const { signOut } = await import('@/app/actions/auth')
        await signOut()
        window.location.href = '/'
    }

    // Build trend chart data from sessions (oldest → newest)
    const trendData = [...sessions]
        .reverse()
        .map((s, i) => ({
            label: `S${i + 1}`,
            signals: s.signalCount,
            date: new Date(s.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        }))

    // Trend direction
    const getTrend = () => {
        if (sessions.length < 2) return 'neutral'
        const recent = sessions.slice(0, 3).reduce((a, b) => a + b.signalCount, 0) / Math.min(3, sessions.length)
        const older = sessions.slice(-3).reduce((a, b) => a + b.signalCount, 0) / Math.min(3, sessions.length)
        if (recent < older * 0.85) return 'down'
        if (recent > older * 1.15) return 'up'
        return 'neutral'
    }
    const trend = getTrend()

    const totalSessions = sessions.filter(s => !s.is_active).length
    const avgSignals = sessions.length > 0
        ? Math.round(sessions.reduce((a, b) => a + b.signalCount, 0) / sessions.length)
        : 0

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-body)', position: 'relative' }}>

            {/* Ambient glow */}
            <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '60%', height: '70%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            {/* Header */}
            <header style={{ borderBottom: '1px solid var(--border)', height: 54, display: 'flex', alignItems: 'center', padding: '0 1.75rem', gap: '0.75rem', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(7,7,12,0.92)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={11} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.03em' }}>EduPulse</span>
                </div>
                <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                <span style={{ fontSize: '0.857rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Session History</span>
                <div style={{ flex: 1 }} />
                <Link href="/educator/start" className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.375rem 1rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Zap size={13} fill="currentColor" /> New Session
                </Link>
                <button onClick={handleLogOut} className="btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    <LogOut size={13} /> Log Out
                </button>
            </header>

            <main style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1.75rem', position: 'relative', zIndex: 1 }}>

                {/* Page title */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>
                        Your Teaching <span className="gradient-text">Insights</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        See how classroom confusion changes across sessions — your impact over time.
                    </p>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', color: 'var(--text-secondary)', gap: '1rem' }}>
                        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 10, animation: 'pulse-dot 2s infinite' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>LOADING HISTORY...</span>
                    </div>
                ) : error ? (
                    <div style={{ color: 'var(--danger)', padding: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>
                ) : sessions.length === 0 ? (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <Sparkles size={32} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No sessions yet</h2>
                        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Start your first class session to see insights here.</p>
                        <Link href="/educator/start" className="btn-primary">Start a Session <ArrowRight size={14} /></Link>
                    </div>
                ) : (
                    <>
                        {/* Top stats row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                            {[
                                { label: 'Total Sessions', value: totalSessions, icon: <BarChart2 size={16} color="var(--accent)" /> },
                                { label: 'Avg Signals / Session', value: avgSignals, icon: <AlertTriangle size={16} color="var(--warning)" /> },
                                {
                                    label: 'Confusion Trend',
                                    value: trend === 'down' ? 'Improving ↓' : trend === 'up' ? 'Increasing ↑' : 'Stable →',
                                    icon: trend === 'down' ? <TrendingDown size={16} color="var(--success)" /> : trend === 'up' ? <TrendingUp size={16} color="var(--danger)" /> : <Minus size={16} color="var(--text-secondary)" />,
                                    color: trend === 'down' ? 'var(--success)' : trend === 'up' ? 'var(--danger)' : 'var(--text-secondary)',
                                },
                            ].map((stat, i) => (
                                <div key={i} className="glass-card" style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        {stat.icon}
                                        <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{stat.label}</span>
                                    </div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', color: (stat as any).color || 'var(--text-primary)' }}>
                                        {stat.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Trend chart */}
                        {trendData.length >= 2 && (
                            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                    <Sparkles size={14} color="var(--accent-soft)" />
                                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>Confusion Over Time</span>
                                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: trend === 'down' ? 'var(--success)' : trend === 'up' ? 'var(--danger)' : 'var(--text-tertiary)', fontWeight: 600 }}>
                                        {trend === 'down' ? '✅ Students are getting it' : trend === 'up' ? '⚠️ Confusion increasing' : '→ Holding steady'}
                                    </span>
                                </div>
                                <ResponsiveContainer width="100%" height={180}>
                                    <LineChart data={trendData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="trendGrad" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor={trend === 'down' ? '#22C55E' : trend === 'up' ? '#EF4444' : '#6366F1'} />
                                                <stop offset="100%" stopColor="#818CF8" />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="2 5" vertical={false} stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-tertiary)', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 12 }}
                                            itemStyle={{ color: 'var(--accent-soft)' }}
                                            formatter={(val: any) => [`${val} signals`, 'Confusion']}
                                        />
                                        <Line type="monotone" dataKey="signals" stroke="url(#trendGrad)" strokeWidth={2.5} dot={{ fill: 'var(--accent)', strokeWidth: 0, r: 4 }} animationDuration={800} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Session cards list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>
                                Past Sessions
                            </div>
                            {sessions.map((s, i) => (
                                <div key={s.id} className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', transition: 'border-color 0.2s' }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)')}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                >
                                    {/* Session number */}
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-soft)' }}>S{sessions.length - i}</span>
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                                                PIN: {s.id}
                                            </span>
                                            {s.is_active && (
                                                <span style={{ fontSize: '0.62rem', fontWeight: 800, background: 'rgba(34,197,94,0.15)', color: 'var(--success)', padding: '0.1rem 0.5rem', borderRadius: 99, border: '1px solid rgba(34,197,94,0.25)' }}>LIVE</span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            <Clock size={12} />
                                            {new Date(s.started_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            {' · '}
                                            {new Date(s.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    {/* Top confused topic badge */}
                                    {s.topConfusedTopic && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.75rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 99, flexShrink: 0 }}>
                                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)', flexShrink: 0 }} />
                                            <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 600 }}>{s.topConfusedTopic}</span>
                                        </div>
                                    )}

                                    {/* Doubt count badge */}
                                    {s.doubtCount > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.75rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 99, flexShrink: 0 }}>
                                            <MessageSquare size={12} color="var(--accent-soft)" />
                                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-soft)', fontWeight: 600 }}>{s.doubtCount} Doubts</span>
                                        </div>
                                    )}

                                    {/* Signal count */}
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.04em', color: s.signalCount > 20 ? 'var(--danger)' : s.signalCount > 10 ? 'var(--warning)' : 'var(--text-primary)' }}>
                                            {s.signalCount}
                                        </div>
                                        <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>signals</div>
                                    </div>

                                    {/* View summary link */}
                                    <Link
                                        href={`/educator/summary/${s.id}`}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.875rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius)', color: 'var(--accent-soft)', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', flexShrink: 0, transition: 'opacity 0.15s' }}
                                    >
                                        View <ArrowRight size={12} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
