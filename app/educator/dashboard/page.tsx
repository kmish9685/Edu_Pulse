'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { LogOut, Activity, Zap, Tag, ChevronRight, Download, Bell, Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { endSession } from '@/app/actions/signals'

// ─── State Banner ──────────────────────────────────────────────
function StateBanner({ pulseValue }: { pulseValue: number }) {
    const level = pulseValue >= 30 ? 'alert' : pulseValue >= 15 ? 'watch' : 'calm'
    const cfg = {
        calm: { cls: 'state-banner state-banner-calm', icon: null, text: `Session active · ${level === 'calm' ? 'Class following well' : ''}` },
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

    const agendaParam = searchParams.get('agenda')
    const [agenda] = useState<string[]>(() => {
        try { return agendaParam ? JSON.parse(decodeURIComponent(agendaParam)) : [] }
        catch { return [] }
    })
    const [currentTopicIndex, setCurrentTopicIndex] = useState(0)
    const [topicLog, setTopicLog] = useState<{ time: string; label: string }[]>([])

    const supabase = createClient()

    useEffect(() => {
        setTopicLog([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), label: 'Session Started' }])
        // Trigger chart reveal after a short delay
        setTimeout(() => setChartRevealed(true), 200)
    }, [])

    useEffect(() => {
        if (!sessionId || sessionId.length !== 4) { router.push('/educator/start'); return }
        fetchData()
        const interval = setInterval(fetchData, 3000)
        return () => clearInterval(interval)
    }, [sessionId])

    const advanceTopic = () => {
        if (currentTopicIndex >= agenda.length) return
        const topic = agenda[currentTopicIndex]
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        setTopicLog(prev => [...prev, { time, label: topic }])
        setCurrentTopicIndex(prev => prev + 1)
    }

    async function fetchData() {
        if (!sessionId) return
        const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
        const { data: allSignals } = await supabase
            .from('signals').select('*')
            .eq('block_room', sessionId)
            .gte('created_at', oneHourAgo)
            .order('created_at', { ascending: false })
        if (!allSignals) return

        setRecentSignals(allSignals.slice(0, 10))
        setTotalSignals(allSignals.length)

        const typeCounts: Record<string, number> = {}
        allSignals.forEach(s => { typeCounts[s.type] = (typeCounts[s.type] || 0) + 1 })
        setStats(typeCounts)

        const oneMinAgo = new Date(Date.now() - 60000).toISOString()
        const recentCount = allSignals.filter(s => s.created_at > oneMinAgo).length
        setPulseValue(allSignals.length > 0 ? Math.round((recentCount / Math.max(allSignals.length, 1)) * 100) : 0)

        const timeSeriesMap = new Map<string, { time: string; signals: number }>()
        for (let i = 29; i >= 0; i--) {
            const t = new Date(Date.now() - i * 60000)
            const label = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            timeSeriesMap.set(label, { time: label, signals: 0 })
        }
        allSignals.forEach(s => {
            const label = new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            if (timeSeriesMap.has(label)) timeSeriesMap.get(label)!.signals += 1
        })
        setChartData(Array.from(timeSeriesMap.values()))
        generateInsight(allSignals, recentCount, typeCounts)
    }

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
            <header style={{ borderBottom: '1px solid var(--border)', height: 54, display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '0.875rem', flexShrink: 0, zIndex: 10, position: 'relative', backdropFilter: 'blur(12px)', background: 'rgba(7,7,12,0.92)' }}>
                {/* Logo + session */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={11} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.03em' }}>EduPulse</span>
                </div>
                <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Session</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, padding: '0.15rem 0.6rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius)', color: 'var(--accent-soft)', letterSpacing: '0.1em' }}>
                    {sessionId}
                </span>

                {/* Topic advance */}
                {agenda.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0 0.875rem', borderLeft: '1px solid var(--border)', height: 34, marginLeft: '0.25rem' }}>
                        <Tag size={12} color="var(--accent-soft)" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {currentTopic || <span style={{ color: 'var(--text-tertiary)' }}>All topics complete</span>}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{Math.min(currentTopicIndex, agenda.length)}/{agenda.length}</span>
                        <button onClick={advanceTopic} disabled={currentTopicIndex >= agenda.length}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.25rem 0.625rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-soft)', fontSize: '0.72rem', fontWeight: 700, cursor: currentTopicIndex >= agenda.length ? 'not-allowed' : 'pointer', opacity: currentTopicIndex >= agenda.length ? 0.4 : 1, fontFamily: 'inherit' }}>
                            Next <ChevronRight size={11} />
                        </button>
                    </div>
                )}

                <div style={{ flex: 1 }} />

                {/* Right controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', padding: '0.3rem 0.75rem', background: 'var(--success-dim)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 100 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite' }} />
                    Live
                </div>
                <button
                    onClick={() => {
                        if (recentSignals.length === 0) {
                            alert('No signals to export yet.');
                            return;
                        }
                        const csvHeader = 'Time,Type\n';
                        const csvRows = recentSignals.map(s => `${new Date(s.created_at).toLocaleTimeString()},"${s.type}"`).join('\n');
                        const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = `EduPulse_Session_${sessionId}_Export.csv`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.75rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    <Download size={12} /> Export
                </button>
                <button
                    disabled={ending}
                    onClick={async () => {
                        if (!sessionId) { router.push('/educator/start'); return }
                        setEnding(true)
                        await endSession(sessionId)
                        router.push('/educator/start')
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.75rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: '0.78rem', fontWeight: 700, cursor: ending ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: ending ? 0.7 : 1 }}
                >
                    {ending ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Ending…</> : <><LogOut size={12} /> End Session</>}
                </button>
            </header>

            {/* Contextual State Banner */}
            <StateBanner pulseValue={pulseValue} />

            {/* Main dashboard grid */}
            <main style={{ flex: 1, padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 272px', gridTemplateRows: 'auto 1fr', gap: '1.25rem', overflow: 'auto', position: 'relative', zIndex: 1 }}>

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
                                        <stop offset="0%" stopColor="#6366F1" />
                                        <stop offset="100%" stopColor="#818CF8" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="2 5" vertical={false} stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'var(--text-tertiary)', fontFamily: 'monospace' }} tickMargin={8} axisLine={false} tickLine={false} minTickGap={45} />
                                <YAxis tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 12, fontFamily: 'var(--font-body)' }}
                                    itemStyle={{ color: 'var(--accent-soft)' }}
                                    labelStyle={{ color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}
                                />
                                <Line type="monotone" dataKey="signals" stroke="url(#lineGrad)" strokeWidth={2.5} dot={false} animationDuration={800} />
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
                            background: isHighLoad ? 'rgba(239,68,68,0.04)' : 'var(--glass-bg)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'border-color 0.35s, background 0.35s',
                        }}
                    >
                        {isHighLoad && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--danger), #FF8080)', animation: 'pulse-wide 2s infinite' }} />}
                        <div className="section-label" style={{ marginBottom: '0.875rem' }}>
                            {isHighLoad && <Bell size={11} style={{ display: 'inline', marginRight: 4 }} />}
                            Confusion Load
                        </div>
                        <div style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '3.5rem',
                            fontWeight: 700,
                            letterSpacing: '-0.06em',
                            color: pulseColor,
                            lineHeight: 1,
                            marginBottom: '0.375rem',
                            fontVariantNumeric: 'tabular-nums',
                            transition: 'color 0.35s ease',
                        }}>
                            {pulseValue}%
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>recent participants signaling</div>
                        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pulseValue}%`, background: barColor, borderRadius: 99, transition: 'width 0.7s ease, background 0.35s ease' }} />
                        </div>
                    </div>

                    {/* AI Insight */}
                    <div className="glass-card" style={{ padding: '1.125rem' }}>
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
                                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
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
                                        background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                                        animationDelay: `${idx * 40}ms`,
                                    }}
                                >
                                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: signal.type === 'Too Fast' ? 'var(--warning)' : 'var(--danger)', flexShrink: 0, boxShadow: `0 0 6px ${signal.type === 'Too Fast' ? 'rgba(245,158,11,0.5)' : 'rgba(239,68,68,0.5)'}` }} />
                                    <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{signal.type}</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                                        {new Date(signal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
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
