'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowRight, Plus, X, Link as LinkIcon, Zap, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function EducatorStart() {
    const [sessionId, setSessionId] = useState('')
    const [joinUrl, setJoinUrl] = useState('')
    const [agendaInput, setAgendaInput] = useState('')
    const [agenda, setAgenda] = useState<string[]>([])
    const router = useRouter()

    useEffect(() => {
        const pin = Math.floor(1000 + Math.random() * 9000).toString()
        setSessionId(pin)
        const base = typeof window !== 'undefined' ? window.location.origin : 'https://edu-pulse-xi.vercel.app'
        setJoinUrl(`${base}/join/${pin}`)
    }, [])

    const addTopic = () => {
        const t = agendaInput.trim()
        if (!t) return
        setAgenda(prev => [...prev, t])
        setAgendaInput('')
    }

    const handleStart = () => {
        const agendaParam = encodeURIComponent(JSON.stringify(agenda))
        router.push(`/educator/dashboard?session=${sessionId}&agenda=${agendaParam}`)
    }

    const displayUrl = joinUrl
        ? `${new URL(joinUrl).hostname}/join/${sessionId}`
        : `edupulse.vercel.app/join/${sessionId}`

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>

            {/* Ambient orbs */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '60%', background: 'radial-gradient(ellipse, rgba(124,92,246,0.12) 0%, transparent 70%)', animation: 'orb-drift 20s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '50%', background: 'radial-gradient(ellipse, rgba(94,92,246,0.08) 0%, transparent 70%)', animation: 'orb-drift 25s ease-in-out infinite reverse' }} />
            </div>

            {/* Topbar */}
            <header style={{ borderBottom: '1px solid var(--glass-border)', height: 56, display: 'flex', alignItems: 'center', padding: '0 1.75rem', gap: '0.75rem', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(6,6,10,0.85)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg,#7C5CF6,#5E5CF6)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={11} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.03em' }}>EduPulse</span>
                </div>
                <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                <span style={{ fontSize: '0.857rem', color: 'var(--text-secondary)', fontWeight: 500 }}>New Session</span>
                <div style={{ flex: 1 }} />
                <Link href="/admin" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textDecoration: 'none', fontWeight: 500 }}>← Admin</Link>
            </header>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1020, margin: '0 auto', padding: '4rem 1.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>

                {/* Left: Setup */}
                <div>
                    {/* Header */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 100, marginBottom: '1.25rem' }}>
                            <Sparkles size={11} color="#A78BFA" />
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A78BFA', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Ready to launch</span>
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1.1, marginBottom: '0.625rem' }}>
                            Start your <span className="gradient-text">class session.</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.65, maxWidth: 380 }}>
                            Add your lecture topics below. Project the QR code on the classroom screen and begin teaching.
                        </p>
                    </div>

                    {/* Agenda */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.625rem' }}>
                            Lecture Agenda <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '0.72rem' }}>— optional but recommended</span>
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem' }}>
                            <input
                                className="lx-input"
                                value={agendaInput}
                                onChange={e => setAgendaInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addTopic()}
                                placeholder="e.g. Introduction to Recursion"
                            />
                            <button onClick={addTopic} className="btn-ghost btn-sm" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Plus size={13} /> Add
                            </button>
                        </div>

                        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', minHeight: agenda.length === 0 ? 80 : 'auto' }}>
                            {agenda.length === 0 ? (
                                <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.8rem', lineHeight: 1.6 }}>
                                    No topics yet — you can also annotate live<br />during the session with keyboard shortcuts.
                                </div>
                            ) : agenda.map((topic, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem', borderBottom: i < agenda.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums', width: 20, textAlign: 'right', flexShrink: 0 }}>#{i + 1}</span>
                                    <span style={{ flex: 1, fontSize: '0.857rem', fontWeight: 500, color: 'var(--text-primary)' }}>{topic}</span>
                                    <button onClick={() => setAgenda(p => p.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: '0.125rem' }}>
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Launch CTA */}
                    <button onClick={handleStart} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '1rem' }}>
                        Initialize Dashboard <ArrowRight size={16} />
                    </button>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '0.75rem' }}>
                        You can also start the session first and annotate topics live.
                    </p>
                </div>

                {/* Right: QR Card */}
                <div style={{ position: 'sticky', top: '5rem' }}>
                    <div style={{ background: 'var(--glass-bg)', border: '1px solid rgba(124,92,246,0.2)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: '0 32px 64px -16px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,92,246,0.08)', backdropFilter: 'blur(20px)' }}>
                        {/* PIN section */}
                        <div style={{ padding: '1.75rem', borderBottom: '1px solid var(--glass-border)', textAlign: 'center', background: 'linear-gradient(135deg, rgba(124,92,246,0.08), rgba(94,92,246,0.04))' }}>
                            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Session PIN</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--text-primary)', lineHeight: 1 }} className="gradient-text">
                                {sessionId || '—'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>Students can also type this at /join</div>
                        </div>

                        {/* QR code */}
                        <div style={{ padding: '1.75rem', display: 'flex', justifyContent: 'center', background: '#fff' }}>
                            {joinUrl && (
                                <QRCodeSVG value={joinUrl} size={210} fgColor="#09090E" bgColor="#ffffff" level="H" marginSize={1} />
                            )}
                        </div>

                        {/* URL strip */}
                        <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LinkIcon size={12} color="var(--text-tertiary)" />
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{displayUrl}</span>
                        </div>

                        {/* Agenda count badge */}
                        {agenda.length > 0 && (
                            <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--glass-border)', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#A78BFA' }}>{agenda.length} topic{agenda.length > 1 ? 's' : ''} queued — ready to launch</span>
                            </div>
                        )}
                    </div>

                    {/* Help tip */}
                    <div style={{ marginTop: '1rem', padding: '0.875rem 1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {['Project this on the classroom display', 'Students scan → anonymous tap → done', 'Dashboard updates every 3 seconds', 'No student accounts required'].map(tip => (
                            <div key={tip} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', marginTop: 4, flexShrink: 0 }} />
                                {tip}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
