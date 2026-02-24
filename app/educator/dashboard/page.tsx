'use client'

import { useState, useEffect, Suspense } from 'react'
import { LogOut, Activity, Zap, Tag, ChevronRight, Download } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function DashboardContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const sessionId = searchParams.get('session')

    const [chartData, setChartData] = useState<any[]>([])
    const [recentSignals, setRecentSignals] = useState<any[]>([])
    const [stats, setStats] = useState<Record<string, number>>({})
    const [aiInsight, setAiInsight] = useState('Gathering data...')
    const [pulseValue, setPulseValue] = useState(0)

    // Pre-set agenda
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
        const { data: allSignals } = await supabase
            .from('signals').select('*').eq('block_room', sessionId).gte('created_at', oneHourAgo).order('created_at', { ascending: false })
        if (!allSignals) return

        setRecentSignals(allSignals.slice(0, 8))

        const typeCounts: Record<string, number> = {}
        allSignals.forEach(s => { typeCounts[s.type] = (typeCounts[s.type] || 0) + 1 })
        setStats(typeCounts)

        const total = allSignals.length
        const oneMinAgo = new Date(Date.now() - 60000).toISOString()
        const recentCount = allSignals.filter(s => s.created_at > oneMinAgo).length
        setPulseValue(total > 0 ? Math.round((recentCount / Math.max(total, 1)) * 100) : 0)

        // Build time-series
        const timeSeriesMap = new Map<string, { time: string; signals: number }>()
        for (let i = 29; i >= 0; i--) {
            const t = new Date(Date.now() - i * 60000)
            const label = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            timeSeriesMap.set(label, { time: label, signals: 0 })
        }
        allSignals.forEach(s => {
            const t = new Date(s.created_at)
            const label = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            if (timeSeriesMap.has(label)) {
                timeSeriesMap.get(label)!.signals += 1
            }
        })
        setChartData(Array.from(timeSeriesMap.values()))
        generateInsight(allSignals, recentCount)
    }

    function generateInsight(data: any[], recentCount: number) {
        if (data.length === 0) { setAiInsight('No signals yet. Class appears to be following the pace.'); return }
        if (recentCount === 1) { setAiInsight('Isolated signal detected. Not a class-wide issue — proceed normally.'); return }
        if (recentCount >= 5) { setAiInsight('⚠ Spike detected. 5+ signals in the last minute. Consider pausing to recap the last concept.'); return }
        const typeClusters: Record<string, number> = {}
        data.forEach(s => { typeClusters[s.type] = (typeClusters[s.type] || 0) + 1 })
        const sorted = Object.entries(typeClusters).sort((a, b) => b[1] - a[1])
        if (sorted[0]?.[0] === 'Too Fast' && sorted[0][1] > 3) {
            setAiInsight('Multiple "Too Fast" signals. Slow down and summarize the last key point before moving on.')
        } else {
            setAiInsight('Signals compounding. Check the timeline for the exact minute confusion started.')
        }
    }

    const isHighLoad = pulseValue > 15
    const totalSignals = Object.values(stats).reduce((a, b) => a + b, 0)

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>

            {/* Top bar */}
            <header style={{ borderBottom: '1px solid var(--border)', height: 52, display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1rem', flexShrink: 0 }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.02em' }}>EduPulse</span>
                <span style={{ color: 'var(--border)', fontSize: '1.2rem' }}>/</span>
                <span style={{ fontSize: '0.857rem', color: 'var(--text-secondary)' }}>Session</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.857rem', color: 'var(--text-primary)', fontWeight: 700, padding: '0.15rem 0.5rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    {sessionId}
                </span>

                {/* Topic Advance — inline in topbar */}
                {agenda.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem', padding: '0 0.75rem', borderLeft: '1px solid var(--border)', height: 32 }}>
                        <Tag size={12} color="var(--accent)" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {currentTopicIndex < agenda.length ? agenda[currentTopicIndex] : <span style={{ color: 'var(--text-tertiary)' }}>All topics done</span>}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{Math.min(currentTopicIndex, agenda.length)}/{agenda.length}</span>
                        <button onClick={advanceTopic} disabled={currentTopicIndex >= agenda.length} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.625rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-sm)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700, cursor: currentTopicIndex >= agenda.length ? 'not-allowed' : 'pointer', opacity: currentTopicIndex >= agenda.length ? 0.4 : 1, fontFamily: 'inherit' }}>
                            Next <ChevronRight size={11} />
                        </button>
                    </div>
                )}

                <div style={{ flex: 1 }} />

                {/* Live badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s infinite' }} />
                    Live
                </div>

                <button style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.75rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    <Download size={12} /> Export
                </button>
                <button onClick={() => router.push('/educator/start')} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.75rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    <LogOut size={12} /> End
                </button>
            </header>

            {/* Main grid */}
            <main style={{ flex: 1, padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 280px', gridTemplateRows: 'auto 1fr', gap: '1rem', overflow: 'auto' }}>

                {/* Chart */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', gridColumn: 1, gridRow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                <Activity size={14} color="var(--accent)" />
                                <span style={{ fontWeight: 600, fontSize: '0.9rem', letterSpacing: '-0.02em' }}>Confusion Timeline</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Signals per minute · last 30 mins</div>
                        </div>
                        <div className="lx-badge">{totalSignals} signals this session</div>
                    </div>
                    <div style={{ height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-tertiary)', fontFamily: 'monospace' }} tickMargin={8} axisLine={false} tickLine={false} minTickGap={40} />
                                <YAxis tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }}
                                    itemStyle={{ color: 'var(--accent)' }}
                                    labelStyle={{ color: 'var(--text-secondary)', marginBottom: 4 }}
                                />
                                <Line type="monotone" dataKey="signals" stroke="var(--accent)" strokeWidth={2} dot={false} animationDuration={800} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right — Confusion Load */}
                <div style={{ gridColumn: 2, gridRow: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Load number */}
                    <div style={{ background: 'var(--bg-surface)', border: `1px solid ${isHighLoad ? 'rgba(239,68,68,0.25)' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', flex: 1 }}>
                        <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Confusion Load</div>
                        <div className="lx-stat-number" style={{ fontSize: '3rem', color: isHighLoad ? 'var(--danger)' : 'var(--text-primary)' }}>{pulseValue}%</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem', marginBottom: '0.875rem' }}>of recent participants signaling</div>
                        <div style={{ height: 3, background: 'var(--bg-elevated)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pulseValue}%`, background: isHighLoad ? 'var(--danger)' : 'var(--accent)', borderRadius: 99, transition: 'width 0.7s ease' }} />
                        </div>
                    </div>

                    {/* AI Insight */}
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                            <Zap size={12} color="var(--accent)" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Insight</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{aiInsight}</p>
                    </div>
                </div>

                {/* Bottom left — Signal breakdown + Audit */}
                <div style={{ gridColumn: 1, gridRow: 2, display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem' }}>

                    {/* Signal breakdown */}
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
                        <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Breakdown</div>
                        {Object.keys(stats).length === 0 ? (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center', padding: '1rem 0' }}>No signals yet</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                {Object.entries(stats).map(([type, count]) => {
                                    const total = Object.values(stats).reduce((a, b) => a + b, 0)
                                    const pct = Math.round((count / total) * 100)
                                    return (
                                        <div key={type}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{type}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
                                            </div>
                                            <div style={{ height: 2, background: 'var(--bg-elevated)', borderRadius: 99 }}>
                                                <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 99, transition: 'width 1s ease' }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Audit log */}
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                            <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Recent Signals</span>
                            <div className="lx-badge lx-badge-live">live</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', overflow: 'auto', maxHeight: 200 }}>
                            {recentSignals.length === 0 ? (
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center', padding: '2rem 0' }}>Waiting for signals...</div>
                            ) : recentSignals.map((signal) => (
                                <div key={signal.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: signal.type === 'Too Fast' ? 'var(--warning)' : 'var(--danger)', flexShrink: 0 }} />
                                    <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{signal.type}</span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                                        {new Date(signal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom right — Topic log */}
                <div style={{ gridColumn: 2, gridRow: 2, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Topic Log</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: 180 }}>
                        {topicLog.map((entry, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                                <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-tertiary)', flexShrink: 0, paddingTop: 2, fontVariantNumeric: 'tabular-nums' }}>{entry.time}</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: i === topicLog.length - 1 ? 600 : 400, color: i === topicLog.length - 1 ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{entry.label}</span>
                                {i === topicLog.length - 1 && <span style={{ marginLeft: 'auto', fontSize: '0.625rem', fontWeight: 700, background: 'var(--accent-dim)', color: 'var(--accent)', padding: '0.1rem 0.4rem', borderRadius: 99, flexShrink: 0, border: '1px solid var(--border-accent)' }}>NOW</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function Dashboard() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '0.857rem' }}>Loading session...</div>}>
            <DashboardContent />
        </Suspense>
    )
}
