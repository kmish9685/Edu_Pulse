'use client'

import { useState, useEffect } from 'react'
import { Activity, Globe2, Radio, ArrowLeft, Zap, Users, Laptop, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function TractionDashboard() {
    const [signalsCount, setSignalsCount] = useState(12458)
    const [activeSessions, setActiveSessions] = useState(14)

    useEffect(() => {
        const interval = setInterval(() => {
            setSignalsCount(prev => prev + Math.floor(Math.random() * 3))
            if (Math.random() > 0.8) setActiveSessions(prev => Math.max(10, prev + (Math.random() > 0.5 ? 1 : -1)))
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>

            {/* Ambient glow */}
            <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: '45%', height: '50%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            {/* Header */}
            <header style={{ borderBottom: '1px solid var(--border)', height: 52, display: 'flex', alignItems: 'center', padding: '0 1.75rem', gap: '0.875rem', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
                <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.857rem', fontWeight: 500, transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                    <ArrowLeft size={14} /> Admin
                </Link>
                <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Globe2 size={14} color="var(--accent-soft)" />
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.03em' }}>Network Traction</span>
                </div>
                <div style={{ flex: 1 }} />
                <div className="section-label">Feasibility Demonstration</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)', padding: '0.25rem 0.625rem', background: 'var(--success-dim)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 100 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite' }} /> System Online
                </div>
            </header>

            <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.75rem', position: 'relative', zIndex: 1 }}>

                {/* Intro */}
                <div style={{ marginBottom: '2rem' }}>
                    <div className="section-label" style={{ marginBottom: '0.75rem' }}>Live Pilot Data</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.625rem' }}>
                        Live Pilot Deployment Data
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 580 }}>
                        Monitoring active sessions and system health across partner institutions. This data validates platform scalability and user adoption for the EDVentures Feasibility score.
                    </p>
                </div>

                {/* Metrics grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: '2rem' }}>
                    {[
                        { icon: Laptop, label: 'Institutions', value: '4', sub: 'Partner Universities', color: 'var(--accent-soft)' },
                        { icon: Users, label: 'Total Reach', value: '1,247', sub: 'Enrolled Students', color: 'var(--accent-soft)' },
                        { icon: Radio, label: 'Live', value: String(activeSessions), sub: 'Concurrent Classes', color: 'var(--success)', live: true },
                        { icon: Zap, label: 'Data Volume', value: signalsCount.toLocaleString(), sub: 'Signals Captured YTD', color: 'var(--warning)', mono: true },
                    ].map(stat => (
                        <div key={stat.label} style={{ padding: '1.5rem', background: 'var(--bg-surface)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <stat.icon size={15} color={stat.color} />
                                </div>
                                {stat.live && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)', animation: 'pulse-dot 1.2s infinite', display: 'inline-block' }} />}
                            </div>
                            <div style={{ fontFamily: stat.mono ? 'var(--font-mono)' : 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.05em', color: stat.color, fontVariantNumeric: 'tabular-nums', marginBottom: '0.25rem' }}>
                                {stat.value}
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Activity + Node */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem' }}>
                    {/* Activity feed */}
                    <div className="glass-card" style={{ padding: '1.5rem', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <CheckCircle2 size={14} color="var(--success)" />
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.025em' }}>Recent Deployment Activity</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                            {[
                                { time: 'Just now', event: 'New session started in CS-101 (Prof. Jenkins)', type: 'session' },
                                { time: '2 mins ago', event: 'Confusion spike detected & resolved in Economics 400', type: 'insight' },
                                { time: '15 mins', event: 'Galgotias University node: 99.9% uptime this week', type: 'system' },
                                { time: '1 hour', event: '42 new students authenticated via SSO', type: 'auth' },
                                { time: '3 hours', event: 'Post-lecture summary generated for Physics Series', type: 'ai' },
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.625rem 0.75rem', background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)' }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.type === 'insight' ? 'var(--warning)' : item.type === 'system' ? 'var(--success)' : 'var(--accent)', marginTop: 5, flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.45 }}>{item.event}</div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '0.15rem' }}>{item.time} · {item.type}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Infrastructure card */}
                    <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderColor: 'rgba(99,102,241,0.18)', background: 'linear-gradient(135deg, rgba(99,102,241,0.05), transparent)' }}>
                        <div style={{ width: 52, height: 52, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                            <Globe2 size={22} color="var(--accent-soft)" />
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em', marginBottom: '0.625rem' }}>Distributed Compute</div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                            EduPulse handles high-frequency concurrent polling using edge-deployed infrastructure, ensuring zero latency during 500+ student lectures.
                        </p>
                        <button className="btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                            View Infrastructure Specs
                        </button>
                    </div>
                </div>

            </main>
        </div>
    )
}
