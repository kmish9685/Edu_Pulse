'use client'

import { useState, useEffect, Suspense } from 'react'
import { LogOut, Activity, Zap, Tag, ChevronRight, Download, Bell } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'

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
        const { data: allSignals } = await supabase.from('signals').select('*').eq('block_room', sessionId).gte('created_at', oneHourAgo).order('created_at', { ascending: false })
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
        generateInsight(allSignals, recentCount)
    }

    function generateInsight(data: any[], recentCount: number) {
        if (data.length === 0) { setAiInsight('No signals received yet. Class appears to be following well.'); return }
        if (recentCount === 1) { setAiInsight('Isolated signal — not a class-wide concern. Continue your pace.'); return }
        if (recentCount >= 5) { setAiInsight('⚠ Alert: 5+ signals in the last minute. Consider pausing to recap the last point.'); return }
        const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1])
        if (sorted[0]?.[0] === 'Too Fast' && sorted[0][1] > 3) {
            setAiInsight('"Too Fast" signals are dominant. Slow down, summarize, then move on.')
        } else {
            setAiInsight('Multiple confusion signals detected. Check the timeline for the exact minute it started.')
        }
    }

    const isHighLoad = pulseValue > 15
    const currentTopic = currentTopicIndex < agenda.length ? agenda[currentTopicIndex] : null

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)', position: 'relative' }}>

            {/* Subtle ambient glow */}
            <div style={{ position: 'fixed', top: '-5%', left: '20%', width: '60%', height: '40%', background: 'radial-gradient(ellipse, rgba(124,92,246,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            {/* Topbar */}
            <header style={{ borderBottom: '1px solid var(--glass-border)', height: 54, display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '0.875rem', flexShrink: 0, zIndex: 10, position: 'relative', backdropFilter: 'blur(12px)', background: 'rgba(6,6,10,0.92)' }}>
                {/* Logo + session */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg,#7C5CF6,#5E5CF6)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={11} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.03em' }}>EduPulse</span>
                </div>
                <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Session</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 800, padding: '0.15rem 0.6rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius)', color: '#A78BFA', letterSpacing: '0.08em' }}>
                    {sessionId}
                </span>

                {/* Topic advance */}
                {agenda.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0 0.875rem', borderLeft: '1px solid var(--glass-border)', height: 34, marginLeft: '0.25rem' }}>
                        <Tag size={12} color="#A78BFA" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {currentTopic || <span style={{ color: 'var(--text-tertiary)' }}>All topics complete</span>}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{Math.min(currentTopicIndex, agenda.length)}/{agenda.length}</span>
                        <button onClick={advanceTopic} disabled={currentTopicIndex >= agenda.length}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.25rem 0.625rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-sm)', color: '#A78BFA', fontSize: '0.72rem', fontWeight: 700, cursor: currentTopicIndex >= agenda.length ? 'not-allowed' : 'pointer', opacity: currentTopicIndex >= agenda.length ? 0.4 : 1, fontFamily: 'inherit' }}>
                            Next <ChevronRight size={11} />
                        </button>
                    </div>
                )}

                <div style={{ flex: 1 }} />

                {/* Live badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', padding: '0.3rem 0.75rem', background: 'var(--success-dim)', border: '1px solid rgba(62,207,142,0.2)', borderRadius: 100 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite' }} />
                    Live
                </div>

                <button style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.75rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius)', color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    <Download size={12} /> Export
                </button>
                <button onClick={() => router.push('/educator/start')} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.75rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    <LogOut size={12} /> End
                </button>
            </header>

            {/* Main dashboard */}
            <main style={{ flex: 1, padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 268px', gridTemplateRows: 'auto 1fr', gap: '1.25rem', overflow: 'auto', position: 'relative', zIndex: 1 }}>

                {/* Chart — full width top left */}
                <div className="glass-card" style={{ gridColumn: 1, gridRow: 1, padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <Activity size={15} color="var(--accent)" />
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.025em' }}>Confusion Timeline</span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Signals per minute · last 30 mins</div>
                        </div>
                        <div className="lx-badge">{totalSignals} total signals</div>
                    </div>
                    <div style={{ height: 195 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#7C5CF6" />
                                        <stop offset="100%" stopColor="#A78BFA" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="2 5" vertical={false} stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'var(--text-tertiary)', fontFamily: 'monospace' }} tickMargin={8} axisLine={false} tickLine={false} minTickGap={45} />
                                <YAxis tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 12, fontFamily: 'inherit' }} itemStyle={{ color: '#A78BFA' }} labelStyle={{ color: 'var(--text-secondary)', marginBottom: 4 }} />
                                {isHighLoad && <ReferenceLine y={pulseValue > 5 ? 3 : 1} stroke="var(--danger)" strokeDasharray="3 3" strokeOpacity={0.5} />}
                                <Line type="monotone" dataKey="signals" stroke="url(#lineGrad)" strokeWidth={2.5} dot={false} animationDuration={800} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Confusion load — top right */}
                <div style={{ gridColumn: 2, gridRow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem', flex: 1, borderColor: isHighLoad ? 'rgba(239,68,68,0.2)' : 'var(--glass-border)', background: isHighLoad ? 'rgba(239,68,68,0.04)' : 'var(--glass-bg)', position: 'relative', overflow: 'hidden' }}>
                        {isHighLoad && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--danger), #FF8080)', borderRadius: 0 }} />}
                        <div className="section-label" style={{ marginBottom: '0.875rem' }}>
                            {isHighLoad && <Bell size={11} style={{ display: 'inline', marginRight: 4 }} />}
                            Confusion Load
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.25rem', fontWeight: 700, letterSpacing: '-0.06em', color: isHighLoad ? 'var(--danger)' : 'var(--text-primary)', lineHeight: 1, marginBottom: '0.375rem', fontVariantNumeric: 'tabular-nums' }}>
                            {pulseValue}%
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>recent participants signaling</div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pulseValue}%`, background: isHighLoad ? 'linear-gradient(90deg, var(--danger), #FF8080)' : 'linear-gradient(90deg, var(--accent), #A78BFA)', borderRadius: 99, transition: 'width 0.7s ease' }} />
                        </div>
                    </div>

                    {/* AI Insight */}
                    <div className="glass-card" style={{ padding: '1.125rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                            <Zap size={12} color="#A78BFA" />
                            <span className="section-label">AI Insight</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{aiInsight}</p>
                    </div>
                </div>

                {/* Bottom left: breakdown + signals */}
                <div style={{ gridColumn: 1, gridRow: 2, display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1.25rem' }}>

                    {/* Signal breakdown */}
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                        <div className="section-label" style={{ marginBottom: '1rem' }}>Breakdown</div>
                        {Object.keys(stats).length === 0 ? (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textAlign: 'center', padding: '1.25rem 0' }}>No signals yet</div>
                        ) : Object.entries(stats).map(([type, count]) => {
                            const total = Object.values(stats).reduce((a, b) => a + b, 0)
                            const pct = Math.round((count / total) * 100)
                            return (
                                <div key={type} style={{ marginBottom: '0.875rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{type}</span>
                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{pct}%</span>
                                    </div>
                                    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--accent), #A78BFA)', borderRadius: 99, transition: 'width 1s ease' }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Audit log */}
                    <div className="glass-card" style={{ padding: '1.25rem', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                            <span className="section-label">Recent Signals</span>
                            <div className="lx-badge lx-badge-live">live</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', overflowY: 'auto', maxHeight: 220 }}>
                            {recentSignals.length === 0 ? (
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center', padding: '2.5rem 0' }}>Waiting for signals...</div>
                            ) : recentSignals.map((signal) => (
                                <div key={signal.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius)', border: '1px solid var(--glass-border)', transition: 'background 0.15s' }}>
                                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: signal.type === 'Too Fast' ? 'var(--warning)' : 'var(--danger)', flexShrink: 0, boxShadow: `0 0 6px ${signal.type === 'Too Fast' ? 'rgba(245,158,11,0.5)' : 'rgba(239,68,68,0.5)'}` }} />
                                    <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{signal.type}</span>
                                    <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                                        {new Date(signal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom right: Topic log */}
                <div className="glass-card" style={{ gridColumn: 2, gridRow: 2, padding: '1.25rem', overflow: 'hidden' }}>
                    <div className="section-label" style={{ marginBottom: '0.875rem' }}>Topic Log</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: 220 }}>
                        {topicLog.map((entry, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                                <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: i === topicLog.length - 1 ? '#A78BFA' : 'var(--text-tertiary)', flexShrink: 0, paddingTop: 2 }}>{entry.time}</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: i === topicLog.length - 1 ? 700 : 400, color: i === topicLog.length - 1 ? 'var(--text-primary)' : 'var(--text-tertiary)', flex: 1 }}>{entry.label}</span>
                                {i === topicLog.length - 1 && (
                                    <span style={{ fontSize: '0.6rem', fontWeight: 800, background: 'var(--accent-dim)', color: '#A78BFA', padding: '0.1rem 0.45rem', borderRadius: 99, border: '1px solid var(--border-accent)', flexShrink: 0 }}>NOW</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default function Dashboard() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#7C5CF6,#5E5CF6)', borderRadius: 10, animation: 'pulse-dot 2s infinite' }} />
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.857rem' }}>Loading session...</span>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    )
}
