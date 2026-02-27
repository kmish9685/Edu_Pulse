'use client'

import { useState, useEffect, useRef } from 'react'
import { Shield, Plus, X, AlertTriangle, QrCode, TrendingUp, Activity, MessageSquareQuote, FileText, BarChart3, Zap, ExternalLink, RotateCcw, CheckCircle2, Settings, Map, Tag, Home } from 'lucide-react'
import Link from 'next/link'
import { verifyAdminPassword, resetAllData, addSignalType } from '@/app/actions/admin'
import { createEducatorUser, listEducators } from '@/app/actions/users'
import { createClient } from '@/utils/supabase/client'

type NavSection = 'overview' | 'signals' | 'sessions' | 'danger' | 'users'

interface RealMetrics {
    totalSignals: number
    activeSessions: string[]
    signalBreakdown: { type: string; count: number }[]
}

interface LiveSignal {
    id: string
    type: string
    created_at: string
}

interface EducatorRow {
    id: string
    email?: string
    display_name: string
    created_at: string
}

// ─── Left Rail ─────────────────────────────────────────────────
const NAV_ITEMS: { id: NavSection; label: string; Icon: any }[] = [
    { id: 'overview', label: 'Overview', Icon: Home },
    { id: 'users', label: 'Users', Icon: ExternalLink },
    { id: 'signals', label: 'Signal Types', Icon: Tag },
    { id: 'sessions', label: 'Session PINs', Icon: QrCode },
    { id: 'danger', label: 'System Reset', Icon: Settings },
]

const QUICK_LINKS = [
    { href: '/educator/start', icon: QrCode, title: 'Start a Class' },
    { href: '/admin/outcomes', icon: TrendingUp, title: 'Learning Outcomes' },
    { href: '/admin/traction', icon: Activity, title: 'Traction' },
    { href: '/admin/testimonials', icon: MessageSquareQuote, title: 'Testimonials' },
    { href: '/admin/loi-generator', icon: FileText, title: 'LOI Generator' },
    { href: '/pitch/roi-calculator', icon: BarChart3, title: 'ROI Calculator' },
    { href: '/pitch/comparison', icon: Zap, title: 'Compare' },
]

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState<NavSection>('overview')
    const [metrics, setMetrics] = useState<RealMetrics>({ totalSignals: 0, activeSessions: [], signalBreakdown: [] })
    const [loadingMetrics, setLoadingMetrics] = useState(true)
    const [signalTypes, setSignalTypes] = useState<{ id: number; label: string }[]>([])
    const [newSignalLabel, setNewSignalLabel] = useState('')
    const [liveSignals, setLiveSignals] = useState<LiveSignal[]>([])
    const [showResetModal, setShowResetModal] = useState(false)
    const [password, setPassword] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [resetDone, setResetDone] = useState(false)
    const [resetError, setResetError] = useState('')

    // User creation & listing
    const [newEmail, setNewEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newName, setNewName] = useState('')
    const [creating, setCreating] = useState(false)
    const [createResult, setCreateResult] = useState<{ ok: boolean; msg: string } | null>(null)
    const [educators, setEducators] = useState<EducatorRow[]>([])
    const [loadingEducators, setLoadingEducators] = useState(true)

    const tickerRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        async function checkAuth() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                window.location.href = '/admin/login'
                return
            }

            // Look for the role in user metadata first (set by JWT)
            // or fallback to checking the profile if not present.
            const userRole = user.user_metadata?.role

            if (userRole === 'admin') {
                // Role confirmed via JWT
                fetchSignalTypes()
                fetchRealMetrics()
                fetchEducators()
            } else {
                // Fallback check against profiles table if JWT doesn't have it
                const { data: profile } = await supabase
                    .from('profiles').select('role').eq('id', user.id).single()

                if (profile?.role !== 'admin') {
                    window.location.href = '/admin/login?error=admin_required'
                    return
                }

                fetchSignalTypes()
                fetchRealMetrics()
                fetchEducators()
            }
        }

        checkAuth()
        const interval = setInterval(fetchRealMetrics, 10000)
        return () => clearInterval(interval)
    }, [])

    async function fetchEducators() {
        setLoadingEducators(true)
        const res = await listEducators()
        if (res.success) {
            setEducators(res.educators as EducatorRow[])
        }
        setLoadingEducators(false)
    }

    // Supabase realtime for the ticker
    useEffect(() => {
        const channel = supabase
            .channel('admin-live-ticker')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'signals' }, payload => {
                setLiveSignals(prev => [payload.new as LiveSignal, ...prev].slice(0, 8))
                // Auto-scroll ticker
                if (tickerRef.current) {
                    tickerRef.current.scrollTop = 0
                }
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [])

    async function fetchRealMetrics() {
        const ago = new Date(Date.now() - 24 * 3600000).toISOString()
        const { data: signals } = await supabase.from('signals').select('id,type,block_room,created_at').gte('created_at', ago).order('created_at', { ascending: false })
        if (signals) {
            const sessions = [...new Set(signals.map(s => s.block_room).filter(Boolean))]
            const breakdown: Record<string, number> = {}
            signals.forEach(s => { breakdown[s.type] = (breakdown[s.type] || 0) + 1 })
            const recent = signals.slice(0, 6).map(s => ({ id: s.id, type: s.type, created_at: s.created_at }))
            setLiveSignals(recent)
            setMetrics({ totalSignals: signals.length, activeSessions: sessions, signalBreakdown: Object.entries(breakdown).map(([type, count]) => ({ type, count })) })
        }
        setLoadingMetrics(false)
    }

    async function fetchSignalTypes() {
        const { data } = await supabase.from('signal_types').select('*').eq('is_active', true)
        if (data) setSignalTypes(data)
    }

    const handleConfirmReset = async () => {
        setIsVerifying(true); setResetError('')
        const v = await verifyAdminPassword(password)
        if (v.success) {
            const r = await resetAllData()
            if (r.success) { setResetDone(true); setShowResetModal(false); fetchRealMetrics() }
            else setResetError(r.error || 'Failed to reset')
        } else setResetError(v.error || 'Invalid password')
        setIsVerifying(false)
    }

    const handleAddSignalType = async () => {
        if (!newSignalLabel.trim()) return
        await addSignalType(newSignalLabel.trim())
        setNewSignalLabel('')
        fetchSignalTypes()
    }

    const handleDeleteSignalType = async (id: number) => {
        await supabase.from('signal_types').update({ is_active: false }).eq('id', id)
        fetchSignalTypes()
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column' }}>

            {/* Top bar */}
            <header style={{ borderBottom: '1px solid var(--border)', height: 52, display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '0.75rem', flexShrink: 0, background: 'rgba(7,7,12,0.92)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield size={11} color="#fff" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.03em' }}>EduPulse</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                    <span style={{ fontSize: '0.857rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Admin</span>
                </div>
                <div style={{ flex: 1 }} />
                <button
                    onClick={async () => {
                        const { signOut } = await import('@/app/actions/auth')
                        await signOut()
                        window.location.href = '/'
                    }}
                    style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, marginRight: '1rem', transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                >
                    Log Out
                </button>
                <Link href="/" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}>
                    ← Back to Home
                </Link>
            </header>

            {/* Split layout: left rail + right panel */}
            <div className="admin-layout">

                {/* ── Left Rail ─────────────────────────────────────── */}
                <aside style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', overflow: 'hidden' }}>

                    {/* Rail nav */}
                    <div style={{ padding: '1.25rem 0.75rem 0.75rem', flex: 1 }}>
                        <div className="section-label" style={{ marginBottom: '0.75rem', padding: '0 0.5rem' }}>Configuration</div>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`admin-nav-item${activeSection === item.id ? ' active' : ''}`}
                                >
                                    <item.Icon size={14} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <div style={{ height: 1, background: 'var(--border)', margin: '1.25rem 0.5rem' }} />

                        <div className="section-label" style={{ marginBottom: '0.75rem', padding: '0 0.5rem' }}>Quick Links</div>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                            {QUICK_LINKS.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', height: 34, padding: '0 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-tertiary)', textDecoration: 'none', transition: 'background 0.15s, color 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                                >
                                    <link.icon size={13} />
                                    {link.title}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Live signal ticker at bottom of rail */}
                    <div style={{ borderTop: '1px solid var(--border)', padding: '0.875rem 0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.625rem' }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite', flexShrink: 0 }} />
                            <span className="section-label">Live Signals</span>
                        </div>
                        <div
                            ref={tickerRef}
                            style={{ height: 130, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
                        >
                            {liveSignals.length === 0 ? (
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-tertiary)', textAlign: 'center', padding: '1.25rem 0' }}>
                                    Waiting for signals...
                                </div>
                            ) : liveSignals.map((sig, i) => (
                                <div key={sig.id} className="animate-signal-arrive" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', animationDelay: `${i * 30}ms` }}>
                                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: sig.type === 'Too Fast' ? 'var(--warning)' : sig.type === "I'm Confused" ? 'var(--danger)' : 'var(--accent)', flexShrink: 0 }} />
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sig.type}</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-tertiary)', flexShrink: 0 }}>
                                        {new Date(sig.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ── Right Panel ───────────────────────────────────── */}
                <main key={activeSection} className="admin-panel-enter" style={{ padding: '2rem 2.5rem', overflowY: 'auto' }}>

                    {/* ── OVERVIEW ──────────────────────────────────────── */}
                    {activeSection === 'overview' && (
                        <div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.375rem' }}>Admin Panel</h1>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Institution-level overview for the last 24 hours.</p>
                            </div>

                            {/* Stats row */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: '2rem' }}>
                                {[
                                    { label: 'Active Sessions', value: loadingMetrics ? '—' : String(metrics.activeSessions.length), sub: metrics.activeSessions.length > 0 ? 'PINs with activity' : 'No sessions yet' },
                                    { label: 'Total Signals', value: loadingMetrics ? '—' : metrics.totalSignals.toLocaleString(), sub: 'from all sessions today' },
                                    { label: 'Top Signal Type', value: loadingMetrics ? '—' : (metrics.signalBreakdown.sort((a, b) => b.count - a.count)[0]?.type || '—'), sub: 'most common today' },
                                ].map((stat, i) => (
                                    <div key={i} style={{ padding: '1.5rem', background: 'var(--bg-surface)' }}>
                                        <div className="section-label" style={{ marginBottom: '0.625rem' }}>{stat.label}</div>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{stat.value}</div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{stat.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* System status */}
                            <div style={{ marginBottom: '2rem' }}>
                                <div className="section-label" style={{ marginBottom: '1rem' }}>System Status</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {[
                                        { label: 'Database', status: 'Connected', color: 'var(--success)' },
                                        { label: 'Signal Receiver', status: 'Live', color: 'var(--success)' },
                                        { label: 'Anonymous Mode', status: 'Active', color: 'var(--success)' },
                                        { label: 'Geofence', status: 'Configured', color: 'var(--accent-soft)' },
                                    ].map(item => (
                                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.625rem 0.875rem', background: 'var(--glass-bg)', border: '1px solid var(--border)', borderRadius: 8 }}>
                                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.857rem', color: 'var(--text-secondary)', flex: 1 }}>{item.label}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: item.color }}>{item.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Signal breakdown */}
                            {metrics.signalBreakdown.length > 0 && (
                                <div>
                                    <div className="section-label" style={{ marginBottom: '1rem' }}>Signal Breakdown</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                        {metrics.signalBreakdown.sort((a, b) => b.count - a.count).map(item => (
                                            <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                                <span style={{ fontSize: '0.857rem', fontWeight: 600, color: 'var(--text-secondary)', width: 130, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.type}</span>
                                                <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${(item.count / metrics.totalSignals) * 100}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-soft))', borderRadius: 99, transition: 'width 0.7s ease' }} />
                                                </div>
                                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', width: 28, textAlign: 'right' }}>{item.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── SIGNAL TYPES ──────────────────────────────────── */}
                    {/* ── USERS ─────────────────────────────────────────── */}
                    {activeSection === 'users' && (
                        <div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.375rem' }}>Users</h1>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Create and manage educator accounts for your institution.</p>
                            </div>

                            <div className="section-label" style={{ marginBottom: '0.875rem' }}>Create Educator Account</div>
                            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Display Name</label>
                                        <input className="lx-input" type="text" placeholder="e.g. Dr. Sharma" value={newName} onChange={e => setNewName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Email Address</label>
                                        <input className="lx-input" type="email" placeholder="educator@edupulse.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Password</label>
                                        <input className="lx-input" type="password" placeholder="Min. 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                    </div>

                                    {createResult && (
                                        <div style={{ padding: '0.75rem 1rem', background: createResult.ok ? 'var(--success-dim)' : 'var(--danger-dim)', border: `1px solid ${createResult.ok ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 9, fontSize: '0.82rem', fontWeight: 600, color: createResult.ok ? 'var(--success)' : 'var(--danger)' }}>
                                            {createResult.msg}
                                        </div>
                                    )}

                                    <button
                                        disabled={creating || !newEmail || !newPassword || !newName}
                                        onClick={async () => {
                                            setCreating(true)
                                            setCreateResult(null)
                                            const res = await createEducatorUser(newEmail, newPassword, newName)
                                            if (res.success) {
                                                setCreateResult({ ok: true, msg: `✓ Educator account created for ${newEmail}` })
                                                setNewEmail(''); setNewPassword(''); setNewName('')
                                            } else {
                                                setCreateResult({ ok: false, msg: res.error || 'Failed to create account' })
                                            }
                                            setCreating(false)
                                        }}
                                        className="btn-primary"
                                        style={{ justifyContent: 'center', opacity: (!newEmail || !newPassword || !newName) ? 0.45 : 1 }}
                                    >
                                        {creating ? 'Creating Account...' : 'Create Educator Account'}
                                    </button>
                                </div>
                            </div>

                            <div style={{ padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: '2.5rem' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', lineHeight: 1.65 }}>
                                    New educators will receive one unified login at <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>/admin/login</span>. Their role is set to <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-soft)' }}>educator</span> automatically — they will only see classroom tools, not admin pages.
                                </p>
                            </div>

                            <div className="section-label" style={{ marginBottom: '0.875rem' }}>Registered Educators</div>
                            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                                {loadingEducators ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.857rem' }}>
                                        Loading educators...
                                    </div>
                                ) : educators.length === 0 ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.857rem' }}>
                                        No educators found. Create one above to get started.
                                    </div>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.857rem' }}>
                                        <thead>
                                            <tr style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Name</th>
                                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</th>
                                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Role</th>
                                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Created</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {educators.map((edu, i) => (
                                                <tr key={edu.id} style={{ borderBottom: i < educators.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                                    <td style={{ padding: '0.875rem 1.25rem', color: 'var(--text-primary)', fontWeight: 500 }}>{edu.display_name || '—'}</td>
                                                    <td style={{ padding: '0.875rem 1.25rem', color: 'var(--text-secondary)' }}>{edu.email || '—'}</td>
                                                    <td style={{ padding: '0.875rem 1.25rem' }}>
                                                        <span style={{ padding: '0.2rem 0.5rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-soft)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Educator</span>
                                                    </td>
                                                    <td style={{ padding: '0.875rem 1.25rem', color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>
                                                        {new Date(edu.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── SIGNAL TYPES ──────────────────────────────────── */}
                    {activeSection === 'signals' && (

                        <div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.375rem' }}>Signal Types</h1>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>These are the buttons shown to students when they join a session.</p>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <input
                                    className="lx-input"
                                    type="text"
                                    placeholder="New signal label (e.g. Audio Issue)"
                                    value={newSignalLabel}
                                    onChange={e => setNewSignalLabel(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddSignalType()}
                                />
                                <button onClick={handleAddSignalType} className="btn-primary" style={{ flexShrink: 0 }}>
                                    <Plus size={13} /> Add
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                {signalTypes.map(type => (
                                    <div key={type.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--glass-bg)', border: '1px solid var(--border)', borderRadius: 10 }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, flex: 1, color: 'var(--text-primary)' }}>{type.label}</span>
                                        <button
                                            onClick={() => handleDeleteSignalType(type.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: '0.2rem', borderRadius: 4, transition: 'color 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── SESSION PINs ──────────────────────────────────── */}
                    {activeSection === 'sessions' && (
                        <div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.375rem' }}>Session PINs</h1>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>All active sessions from the last 24 hours.</p>
                            </div>

                            <Link href="/educator/start" className="btn-primary" style={{ display: 'inline-flex', marginBottom: '2rem' }}>
                                <Zap size={14} /> Start New Session
                            </Link>

                            {loadingMetrics ? (
                                <div style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>Loading sessions...</div>
                            ) : metrics.activeSessions.length === 0 ? (
                                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', textAlign: 'center', padding: '3rem 0', border: '1px dashed var(--border)', borderRadius: 12 }}>
                                    No sessions in the last 24 hours
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {metrics.activeSessions.map(pin => (
                                        <Link
                                            key={pin}
                                            href={`/educator/dashboard?session=${pin}`}
                                            style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.1em', padding: '0.625rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', textDecoration: 'none', transition: 'border-color 0.15s, background 0.15s' }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.background = 'var(--accent-dim)' }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface)' }}
                                        >
                                            {pin}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── DANGER ZONE ───────────────────────────────────── */}
                    {activeSection === 'danger' && (
                        <div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.375rem' }}>System Reset</h1>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Destructive operations. These cannot be undone.</p>
                            </div>

                            <div style={{ background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.375rem', color: 'var(--danger)' }}>Reset All Signal Data</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Permanently clears all signals from the database. Use this to reset demo data before a pitch.</div>
                                </div>
                                <button
                                    onClick={() => { setShowResetModal(true); setResetError(''); setPassword('') }}
                                    disabled={resetDone}
                                    style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, color: 'var(--danger)', fontWeight: 700, fontSize: '0.857rem', cursor: resetDone ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', opacity: resetDone ? 0.5 : 1 }}
                                    onMouseEnter={e => !resetDone && (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    {resetDone ? <><CheckCircle2 size={13} /> Done</> : <><RotateCcw size={13} /> Reset Data</>}
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Reset Modal */}
            {showResetModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, width: '100%', maxWidth: 400, overflow: 'hidden', animation: 'fadeUp 0.25s ease both' }}>
                        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertTriangle size={15} color="var(--danger)" />
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>Confirm Reset</span>
                            </div>
                            <button onClick={() => setShowResetModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex' }}><X size={16} /></button>
                        </div>
                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: '0.75rem', margin: 0 }}>
                                This will permanently delete all signal data. Enter your admin password to confirm.
                            </p>
                            <input className="lx-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin password" autoFocus
                                onKeyDown={e => e.key === 'Enter' && handleConfirmReset()} />
                            {resetError && <p style={{ fontSize: '0.8rem', color: 'var(--danger)', margin: 0 }}>{resetError}</p>}
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setShowResetModal(false)} className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                                <button
                                    onClick={handleConfirmReset}
                                    disabled={isVerifying || !password}
                                    style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.857rem', cursor: isVerifying || !password ? 'not-allowed' : 'pointer', opacity: !password ? 0.5 : 1, fontFamily: 'inherit' }}
                                >
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
