'use client'

import { useState, useEffect } from 'react'
import { Shield, Plus, Trash2, X, AlertTriangle, QrCode, TrendingUp, Activity, MessageSquareQuote, FileText, BarChart3, Zap, ExternalLink, RotateCcw, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { verifyAdminPassword, resetAllData, addSignalType } from '@/app/actions/admin'
import { createClient } from '@/utils/supabase/client'

interface RealMetrics {
    totalSignals: number
    activeSessions: string[]
    signalBreakdown: { type: string; count: number }[]
}

export default function AdminPage() {
    const [showResetModal, setShowResetModal] = useState(false)
    const [password, setPassword] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [resetDone, setResetDone] = useState(false)
    const [error, setError] = useState('')
    const [signalTypes, setSignalTypes] = useState<{ id: number, label: string }[]>([])
    const [newSignalLabel, setNewSignalLabel] = useState('')
    const [metrics, setMetrics] = useState<RealMetrics>({ totalSignals: 0, activeSessions: [], signalBreakdown: [] })
    const [loadingMetrics, setLoadingMetrics] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        fetchSignalTypes()
        fetchRealMetrics()
        const interval = setInterval(fetchRealMetrics, 10000)
        return () => clearInterval(interval)
    }, [])

    async function fetchRealMetrics() {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        const { data: signals } = await supabase.from('signals').select('id, type, block_room, created_at').gte('created_at', twentyFourHoursAgo).order('created_at', { ascending: false })
        if (signals) {
            const sessions = [...new Set(signals.map(s => s.block_room).filter(Boolean))]
            const breakdown: Record<string, number> = {}
            signals.forEach(s => { breakdown[s.type] = (breakdown[s.type] || 0) + 1 })
            setMetrics({ totalSignals: signals.length, activeSessions: sessions, signalBreakdown: Object.entries(breakdown).map(([type, count]) => ({ type, count })) })
        }
        setLoadingMetrics(false)
    }

    async function fetchSignalTypes() {
        const { data } = await supabase.from('signal_types').select('*').eq('is_active', true)
        if (data) setSignalTypes(data)
    }

    const handleConfirmReset = async () => {
        setIsVerifying(true); setError('')
        const verification = await verifyAdminPassword(password)
        if (verification.success) {
            const reset = await resetAllData()
            if (reset.success) { setResetDone(true); setShowResetModal(false); fetchRealMetrics() }
            else setError(reset.error || 'Failed to reset')
        } else setError(verification.error || 'Invalid password')
        setIsVerifying(false)
    }

    const handleAddSignalType = async () => {
        if (!newSignalLabel) return
        await addSignalType(newSignalLabel)
        setNewSignalLabel(''); fetchSignalTypes()
    }

    const handleDeleteSignalType = async (id: number) => {
        await supabase.from('signal_types').update({ is_active: false }).eq('id', id)
        fetchSignalTypes()
    }

    const subPages = [
        { href: '/educator/start', icon: QrCode, title: 'Start a Class' },
        { href: '/admin/outcomes', icon: TrendingUp, title: 'Learning Outcomes' },
        { href: '/admin/traction', icon: Activity, title: 'Traction' },
        { href: '/admin/testimonials', icon: MessageSquareQuote, title: 'Testimonials' },
        { href: '/admin/loi-generator', icon: FileText, title: 'LOI Generator' },
        { href: '/pitch/roi-calculator', icon: BarChart3, title: 'ROI Calculator' },
        { href: '/pitch/comparison', icon: Zap, title: 'Comparison' },
    ]

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

            {/* Topbar */}
            <header style={{ borderBottom: '1px solid var(--border)', height: 52, display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '0.75rem' }}>
                <div style={{ width: 22, height: 22, background: 'var(--accent)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Shield size={11} color="#fff" />
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.02em' }}>EduPulse Admin</span>
                <div style={{ flex: 1 }} />
                <Link href="/" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textDecoration: 'none' }}>Exit</Link>
            </header>

            <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Quick Nav */}
                <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ExternalLink size={13} color="var(--text-tertiary)" />
                            <span style={{ fontWeight: 600, fontSize: '0.857rem' }}>Platform</span>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderTop: 'none' }}>
                        {subPages.map((page, i) => (
                            <Link key={page.href} href={page.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem 0.5rem', borderRight: i < subPages.length - 1 ? '1px solid var(--border)' : 'none', textDecoration: 'none', background: 'transparent', transition: 'background 0.15s' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                <page.icon size={16} color="var(--text-secondary)" />
                                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.3 }}>{page.title}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Metrics */}
                <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.857rem' }}>Last 24 Hours</span>
                        {!loadingMetrics && <div className="lx-badge lx-badge-live">Live</div>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {[
                            { label: 'Active Sessions', value: loadingMetrics ? '—' : String(metrics.activeSessions.length), sub: metrics.activeSessions.length > 0 ? metrics.activeSessions.slice(0, 3).join(', ') : 'None yet' },
                            { label: 'Total Signals', value: loadingMetrics ? '—' : metrics.totalSignals.toLocaleString(), sub: metrics.totalSignals === 0 ? 'Start a session to collect data' : 'from all sessions' },
                            { label: 'Top Signal', value: loadingMetrics ? '—' : (metrics.signalBreakdown.sort((a, b) => b.count - a.count)[0]?.type || '—'), sub: 'most common signal type' },
                        ].map((stat, i) => (
                            <div key={i} style={{ padding: '1.25rem 1.5rem', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                                <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{stat.label}</div>
                                <div className="lx-stat-number" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{stat.value}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{stat.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Signal breakdown */}
                    {metrics.signalBreakdown.length > 0 && (
                        <div style={{ borderTop: '1px solid var(--border)', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                            {metrics.signalBreakdown.sort((a, b) => b.count - a.count).map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', width: 110, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.type}</span>
                                    <div style={{ flex: 1, height: 3, background: 'var(--bg-elevated)', borderRadius: 99, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${(item.count / metrics.totalSignals) * 100}%`, background: 'var(--accent)', borderRadius: 99, transition: 'width 0.7s ease' }} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', width: 24, textAlign: 'right' }}>{item.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Session PINs */}
                <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.857rem' }}>Session PINs (24h)</span>
                        <Link href="/educator/start" className="lx-btn lx-btn-ghost" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                            <Zap size={11} /> New Session
                        </Link>
                    </div>
                    <div style={{ padding: '1rem 1.25rem' }}>
                        {loadingMetrics ? (
                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', padding: '0.5rem 0' }}>Loading...</div>
                        ) : metrics.activeSessions.length === 0 ? (
                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', textAlign: 'center', padding: '1.5rem 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>No sessions in the last 24 hours</div>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {metrics.activeSessions.map(pin => (
                                    <Link key={pin} href={`/educator/dashboard?session=${pin}`} style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.1em', padding: '0.5rem 0.875rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', textDecoration: 'none', transition: 'border-color 0.15s' }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                                        {pin}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Signal Management */}
                <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.857rem', marginBottom: '0.2rem' }}>Signal Buttons</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Shown to students when they join a session</div>
                    </div>
                    <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input className="lx-input" type="text" placeholder="New signal label (e.g. Audio Issue)" value={newSignalLabel} onChange={e => setNewSignalLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSignalType()} />
                            <button onClick={handleAddSignalType} className="lx-btn lx-btn-primary" style={{ flexShrink: 0 }}><Plus size={13} /> Add</button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {signalTypes.map(type => (
                                <div key={type.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.6rem 0.3rem 0.875rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 99, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {type.label}
                                    <button onClick={() => handleDeleteSignalType(type.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 0, display: 'flex', lineHeight: 1 }}>
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section style={{ background: 'var(--bg-surface)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(239,68,68,0.1)' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.857rem', color: 'var(--danger)' }}>Danger Zone</span>
                    </div>
                    <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.857rem', marginBottom: '0.2rem' }}>Reset All Signal Data</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Permanently clears all signals from the database. Cannot be undone.</div>
                        </div>
                        <button onClick={() => { setShowResetModal(true); setError(''); setPassword('') }} disabled={resetDone} className="lx-btn lx-btn-ghost" style={{ flexShrink: 0, color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }}>
                            {resetDone ? <><CheckCircle2 size={13} /> Done</> : <><RotateCcw size={13} /> Reset</>}
                        </button>
                    </div>
                </section>

                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', paddingTop: '0.5rem' }}>
                    EduPulse Admin · Restricted Access
                </div>
            </div>

            {/* Reset Modal */}
            {showResetModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 400, overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertTriangle size={15} color="var(--danger)" />
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Confirm Reset</span>
                            </div>
                            <button onClick={() => setShowResetModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex' }}><X size={16} /></button>
                        </div>
                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 'var(--radius)', padding: '0.75rem', margin: 0 }}>
                                This will permanently delete all signal data. Enter your admin password to confirm.
                            </p>
                            <input className="lx-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin password" autoFocus />
                            {error && <p style={{ fontSize: '0.8rem', color: 'var(--danger)', margin: 0 }}>{error}</p>}
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setShowResetModal(false)} className="lx-btn lx-btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                                <button onClick={handleConfirmReset} disabled={isVerifying || !password} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: 700, fontSize: '0.857rem', cursor: isVerifying || !password ? 'not-allowed' : 'pointer', opacity: !password ? 0.5 : 1, fontFamily: 'inherit' }}>
                                    {isVerifying ? 'Verifying...' : 'Reset Data'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
