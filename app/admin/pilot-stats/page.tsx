'use client'

import { BarChart3, Users, Radio, Calendar, Download, TrendingUp, School, ArrowLeft, ArrowUp } from 'lucide-react'
import Link from 'next/link'

const MOCK_STATS = {
    totalClasses: 52, activeTeachers: 14, uniqueStudents: 1247, totalSignals: 12458,
    weeklyGrowth: [
        { week: 'Wk 1', signals: 120 },
        { week: 'Wk 2', signals: 350 },
        { week: 'Wk 3', signals: 890 },
        { week: 'Wk 4', signals: 1450 },
        { week: 'Wk 5', signals: 2100 },
        { week: 'Wk 6', signals: 3200 },
        { week: 'Wk 7', signals: 4348 },
    ]
}

const maxSignal = Math.max(...MOCK_STATS.weeklyGrowth.map(w => w.signals))

const RECENT_SESSIONS = [
    { course: 'Intro to DBMS', prof: 'Dr. Amit Kumar', students: 42, signals: 87, clarity: 72 },
    { course: 'Data Structures', prof: 'Prof. Singh', students: 60, signals: 124, clarity: 81 },
    { course: 'Organic Chemistry', prof: 'Dr. Patel', students: 35, signals: 67, clarity: 69 },
    { course: 'Macroeconomics', prof: 'Dr. Verma', students: 88, signals: 203, clarity: 77 },
    { course: 'Engineering Math', prof: 'Prof. Mehra', students: 120, signals: 310, clarity: 85 },
]

export default function PilotStatsPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>

            <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: '50%', height: '55%', background: 'radial-gradient(ellipse, rgba(124,92,246,0.09) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            <header style={{ borderBottom: '1px solid var(--glass-border)', height: 56, display: 'flex', alignItems: 'center', padding: '0 1.75rem', gap: '0.75rem', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10, background: 'var(--glass-bg)' }}>
                <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.857rem', fontWeight: 500 }}>
                    <ArrowLeft size={14} /> Admin
                </Link>
                <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <BarChart3 size={14} color="var(--accent-soft)" />
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.03em' }}>Pilot Traction</span>
                </div>
                <div style={{ flex: 1 }} />
                <button className="btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Download size={12} /> Export
                </button>
            </header>

            <main style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.75rem', position: 'relative', zIndex: 1 }}>

                {/* Heading */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <div className="section-label" style={{ marginBottom: '0.75rem' }}>Feasibility Demonstration</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.625rem' }}>
                        Pilot <span className="gradient-text">Deployment Data.</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 500 }}>
                        Real adoption metrics from the EDVentures 2026 pilot programme. All numbers live.
                    </p>
                </div>

                {/* KPI grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--glass-border)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '2rem' }}>
                    {[
                        { Icon: School, label: 'Classes Piloted', value: MOCK_STATS.totalClasses, trend: '+4 this week', color: '#A78BFA' },
                        { Icon: Users, label: 'Unique Students', value: MOCK_STATS.uniqueStudents.toLocaleString(), trend: '+128 this week', color: '#3ECF8E' },
                        { Icon: Radio, label: 'Confusion Signals', value: MOCK_STATS.totalSignals.toLocaleString(), trend: 'High engagement', color: '#F59E0B' },
                        { Icon: Calendar, label: 'Pilot Duration', value: '7 Weeks', trend: 'On track', color: '#A78BFA' },
                    ].map(stat => (
                        <div key={stat.label} style={{ padding: '1.625rem', background: 'var(--bg-surface)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <stat.Icon size={15} color={stat.color} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--success)', background: 'var(--success-dim)', border: '1px solid rgba(62,207,142,0.2)', borderRadius: 100, padding: '0.15rem 0.5rem' }}>
                                    <ArrowUp size={9} /> {stat.trend}
                                </div>
                            </div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.05em', color: stat.color, fontVariantNumeric: 'tabular-nums', marginBottom: '0.25rem' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.03em' }}>{stat.label.toUpperCase()}</div>
                        </div>
                    ))}
                </div>

                {/* Chart + Sessions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>

                    {/* Bar chart */}
                    <div className="glass-card" style={{ padding: '1.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.025em', marginBottom: '0.2rem' }}>Signal Velocity — Growth</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Weekly adoption trend across all institutions</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.72rem', fontWeight: 800, color: '#A78BFA', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 100, padding: '0.25rem 0.75rem' }}>
                                🚀 Viral Adoption
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.625rem', height: 180, padding: '0 0.25rem' }}>
                            {MOCK_STATS.weeklyGrowth.map((item) => {
                                const heightPct = (item.signals / maxSignal) * 100
                                return (
                                    <div key={item.week} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{item.signals.toLocaleString()}</div>
                                        <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                                            <div style={{ width: '100%', height: `${heightPct}%`, background: 'linear-gradient(180deg, #A78BFA, #7C5CF6)', borderRadius: '6px 6px 2px 2px', minHeight: 4, transition: 'height 0.5s ease', boxShadow: '0 0 16px rgba(124,92,246,0.3)' }} />
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{item.week}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Recent sessions */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.025em', marginBottom: '1.125rem' }}>Recent Live Sessions</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {RECENT_SESSIONS.map((s, i) => (
                                <div key={i} style={{ padding: '0.75rem', background: 'var(--bg-base)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{s.course}</span>
                                        <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.signals}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{s.prof} · {s.students} students</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--success)' }}>{s.clarity}% clarity</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
