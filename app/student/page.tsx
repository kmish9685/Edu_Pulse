'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, MapPin, Zap } from 'lucide-react'
import Link from 'next/link'
import { submitSignal, getCampusSettings, getSignalTypes } from '@/app/actions/signals'

type PageState = 'active' | 'success' | 'cooldown' | 'location-error'

export default function StudentPage() {
    const [pageState, setPageState] = useState<PageState>('active')
    const [loading, setLoading] = useState(true)
    const [signalTypes, setSignalTypes] = useState<{ id: number; label: string }[]>([])
    const [campus, setCampus] = useState<any>(null)
    const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null)
    const [isWithinRange, setIsWithinRange] = useState(false)
    const [blockRoom, setBlockRoom] = useState('')
    const [additionalText, setAdditionalText] = useState('')
    const [showContext, setShowContext] = useState(false)
    const [cooldownPct, setCooldownPct] = useState(0)

    useEffect(() => { init() }, [])

    const init = async () => {
        const [types, settings] = await Promise.all([getSignalTypes(), getCampusSettings()])
        if (types.success && types.data) setSignalTypes(types.data as { id: number; label: string }[])
        if (settings.success && settings.data) setCampus(settings.data)
        setLoading(false)
        setIsWithinRange(true) // demo: always within range

        const last = localStorage.getItem('last_signal_time')
        if (last) {
            const diff = Date.now() - parseInt(last)
            if (diff < 60000) {
                setPageState('cooldown')
                const elapsed = diff / 60000
                setCooldownPct(elapsed * 100)
                setTimeout(() => { setPageState('active'); setCooldownPct(0) }, 60000 - diff)
            }
        }
    }

    const handleSignal = async (type: string) => {
        if (pageState !== 'active' || loading) return
        if (!isWithinRange) { setPageState('location-error'); return }

        const res = await submitSignal({
            type,
            lat: userLoc?.lat,
            lng: userLoc?.lng,
            block_room: blockRoom,
            additional_text: additionalText,
        })

        if (res.success) {
            setPageState('success')
            setAdditionalText('')
            setBlockRoom('')
            localStorage.setItem('last_signal_time', Date.now().toString())
            setTimeout(() => { setPageState('cooldown') }, 2800)
            setTimeout(() => { setPageState('active'); setCooldownPct(0) }, 62800)
        }
    }

    const secondaryTypes = signalTypes.filter(t => t.label !== "I'm Confused")

    return (
        <div style={{ minHeight: '100vh', background: 'var(--student-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <header style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                    <div style={{ width: 20, height: 20, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={10} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>EduPulse</span>
                </Link>
            </header>

            {/* Main content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>

                {/* ── SUCCESS STATE ─────────────────────────────────── */}
                {pageState === 'success' && (
                    <div className="animate-success-enter" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                        {/* CSS checkmark circle */}
                        <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'var(--success-dim)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle2 size={40} color="var(--success)" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>Signal sent.</h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your teacher sees it now.</p>
                        </div>
                    </div>
                )}

                {/* ── LOCATION ERROR STATE ──────────────────────────── */}
                {pageState === 'location-error' && (
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', maxWidth: 340 }}>
                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--warning-dim)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MapPin size={28} color="var(--warning)" />
                        </div>
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.625rem' }}>You appear to be off-campus.</h2>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>Signals can only be sent from within campus boundaries. Enable location or contact your educator if you believe this is an error.</p>
                        </div>
                        <button onClick={() => setPageState('active')} className="btn-ghost" style={{ marginTop: '0.5rem' }}>
                            Try Again
                        </button>
                    </div>
                )}

                {/* ── ACTIVE / COOLDOWN STATE ───────────────────────── */}
                {(pageState === 'active' || pageState === 'cooldown') && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0', maxWidth: 400 }}>

                        {/* Session PIN */}
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                            Anonymous session
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '2.5rem', textAlign: 'center', maxWidth: 280 }}>
                            Your response is anonymous and logged only by signal type.
                        </p>

                        {/* Big primary button */}
                        <div style={{ position: 'relative', width: 'min(80vw, 340px)', aspectRatio: '1', marginBottom: '1.75rem' }}>
                            <button
                                onClick={() => handleSignal("I'm Confused")}
                                disabled={pageState === 'cooldown' || loading}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    background: pageState === 'cooldown' ? 'rgba(99,102,241,0.35)' : '#6366F1',
                                    borderRadius: 28,
                                    border: 'none',
                                    cursor: pageState === 'cooldown' ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '1rem',
                                    transition: 'background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
                                    boxShadow: pageState === 'cooldown' ? 'none' : '0 20px 60px -15px rgba(99,102,241,0.5)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                                onMouseDown={e => {
                                    if (pageState === 'active') {
                                        const b = e.currentTarget
                                        b.style.transform = 'scale(0.94)'
                                        b.style.boxShadow = '0 0 0 16px rgba(99,102,241,0.15)'
                                    }
                                }}
                                onMouseUp={e => {
                                    const b = e.currentTarget
                                    b.style.transform = 'scale(1)'
                                    b.style.boxShadow = pageState === 'cooldown' ? 'none' : '0 20px 60px -15px rgba(99,102,241,0.5)'
                                }}
                                onMouseLeave={e => {
                                    const b = e.currentTarget
                                    b.style.transform = 'scale(1)'
                                    b.style.boxShadow = pageState === 'cooldown' ? 'none' : '0 20px 60px -15px rgba(99,102,241,0.5)'
                                }}
                            >
                                {/* Cooldown progress bar at bottom of button */}
                                {pageState === 'cooldown' && (
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, height: 4,
                                        background: 'rgba(255,255,255,0.4)',
                                        animation: 'cooldown-sweep 60s linear forwards',
                                        borderRadius: '0 0 28px 28px',
                                        width: `${cooldownPct}%`,
                                    }} />
                                )}

                                {/* Icon */}
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>

                                {/* Label */}
                                <span style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '2.25rem',
                                    fontWeight: 800,
                                    color: pageState === 'cooldown' ? 'rgba(255,255,255,0.45)' : '#fff',
                                    letterSpacing: '-0.03em',
                                    lineHeight: 1.1,
                                    textAlign: 'center',
                                    padding: '0 1rem',
                                }}>
                                    {pageState === 'cooldown' ? 'Signal sent' : "I'm Confused"}
                                </span>

                                {pageState === 'cooldown' && (
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
                                        1-min cooldown active
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Secondary signal types — horizontal pill rail */}
                        {pageState === 'active' && secondaryTypes.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {secondaryTypes.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => handleSignal(type.label)}
                                        disabled={loading}
                                        style={{
                                            padding: '0.625rem 1.25rem',
                                            borderRadius: 100,
                                            border: '1px solid var(--border-strong)',
                                            background: 'transparent',
                                            color: 'var(--text-secondary)',
                                            fontFamily: 'var(--font-body)',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            transition: 'border-color 0.15s, color 0.15s, background 0.15s',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = 'var(--accent)'
                                            e.currentTarget.style.color = 'var(--text-primary)'
                                            e.currentTarget.style.background = 'var(--accent-dim)'
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = 'var(--border-strong)'
                                            e.currentTarget.style.color = 'var(--text-secondary)'
                                            e.currentTarget.style.background = 'transparent'
                                        }}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Optional context toggle */}
                        {pageState === 'active' && (
                            <div style={{ width: '100%', marginTop: '2rem' }}>
                                <button
                                    onClick={() => setShowContext(v => !v)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.375rem', margin: '0 auto', fontFamily: 'var(--font-body)', padding: '0.5rem' }}
                                >
                                    {showContext ? '− Hide' : '+ Add'} context (optional)
                                </button>

                                {showContext && (
                                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'fadeUp 0.25s ease both' }}>
                                        <input
                                            type="text"
                                            className="lx-input"
                                            placeholder="Block / Room (e.g. C-101)"
                                            value={blockRoom}
                                            onChange={e => setBlockRoom(e.target.value)}
                                            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
                                        />
                                        <div style={{ position: 'relative' }}>
                                            <textarea
                                                className="lx-input"
                                                placeholder="Brief details (max 120 chars)"
                                                maxLength={120}
                                                value={additionalText}
                                                onChange={e => setAdditionalText(e.target.value)}
                                                style={{ minHeight: 72, resize: 'none', background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
                                            />
                                            <span style={{ position: 'absolute', right: '0.75rem', bottom: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
                                                {additionalText.length}/120
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer micro-text */}
            <footer style={{ padding: '1.25rem', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Anonymized · Secure · No Account Required
                </p>
            </footer>
        </div>
    )
}
