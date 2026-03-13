'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { submitSignal, validateSession } from '@/app/actions/signals'
import { CheckCircle, Clock, Loader2, Zap, WifiOff, Radio } from 'lucide-react'

export default function StudentJoin() {
    const params = useParams()
    const router = useRouter()
    const sessionId = params.id as string

    // Generate or retrieve a persistent anonymous device ID
    // This never contains any personal info — just a random string
    const getOrCreateDeviceId = (): string => {
        const key = 'edupulse_device_id'
        let id = localStorage.getItem(key)
        if (!id) {
            id = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36)
            localStorage.setItem(key, id)
        }
        return id
    }

    const [sessionValid, setSessionValid] = useState<boolean | null>(null) // null = checking
    const [roomId, setRoomId] = useState<string | null>(null)
    const [signaled, setSignaled] = useState(false)
    const [optionalText, setOptionalText] = useState('')
    const [cooldown, setCooldown] = useState(false)
    const [cooldownSecs, setCooldownSecs] = useState(0)
    const [submitting, setSubmitting] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const SIGNAL_TYPES = [
        { id: 'confused', label: "I'm Confused", emoji: '🤔', color: '#EF4444', glow: 'rgba(239,68,68,0.35)', gradientFrom: 'rgba(239,68,68,0.12)', gradientTo: 'rgba(239,68,68,0.04)' },
        { id: 'too_fast', label: 'Too Fast', emoji: '⚡', color: '#F59E0B', glow: 'rgba(245,158,11,0.35)', gradientFrom: 'rgba(245,158,11,0.12)', gradientTo: 'rgba(245,158,11,0.04)' },
    ]

    // Validate session on load + check cooldown
    useEffect(() => {
        if (!sessionId || sessionId.length !== 4) {
            router.push('/student')
            return
        }

        // Check session validity
        validateSession(sessionId).then(res => {
            setSessionValid(res.active)
            if (res.active && res.roomId) {
                setRoomId(res.roomId)
            }
        })

        // Check cooldown
        const lastSignal = localStorage.getItem(`edupulse_cooldown_${sessionId}`)
        if (lastSignal) {
            const diff = Date.now() - parseInt(lastSignal)
            if (diff < 60000) {
                const remaining = Math.ceil((60000 - diff) / 1000)
                setCooldown(true)
                setCooldownSecs(remaining)
                const countdown = setInterval(() => {
                    setCooldownSecs(s => {
                        if (s <= 1) { clearInterval(countdown); setCooldown(false); return 0 }
                        return s - 1
                    })
                }, 1000)
                return () => clearInterval(countdown)
            }
        }
    }, [sessionId, router])

    const handleSignal = async (type: string) => {
        if (cooldown || submitting) return
        setSubmitting(type)
        setError(null)
        const deviceId = getOrCreateDeviceId()
        const res = await submitSignal({ type, block_room: roomId || sessionId, additional_text: optionalText, device_id: deviceId })
        if (res.success) {
            setSignaled(true)
            setCooldown(true)
            setCooldownSecs(60)
            setOptionalText('') // Clear it for next time
            localStorage.setItem(`edupulse_cooldown_${sessionId}`, Date.now().toString())
            const countdown = setInterval(() => {
                setCooldownSecs(s => {
                    if (s <= 1) { clearInterval(countdown); setCooldown(false); return 0 }
                    return s - 1
                })
            }, 1000)
        } else {
            setError(res.error || 'Failed to send signal')
        }
        setSubmitting(null)
    }

    // Shared page shell styles
    const pageShell: React.CSSProperties = {
        minHeight: '100vh',
        background: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: 'var(--font-body)',
    }

    // ── Loading state ──────────────────────────────────────────────
    if (sessionValid === null) {
        return (
            <div style={pageShell}>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-dot 2s infinite', boxShadow: '0 0 32px rgba(99,102,241,0.4)' }}>
                        <Zap size={24} color="#fff" fill="#fff" />
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em' }}>Joining session…</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-tertiary)', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', padding: '0.2rem 0.75rem', borderRadius: 100 }}>PIN: {sessionId}</div>
                </div>
            </div>
        )
    }

    // ── No active session ──────────────────────────────────────────
    if (!sessionValid) {
        return (
            <div style={pageShell}>
                <div style={{ textAlign: 'center', width: '100%', maxWidth: 380 }}>
                    <div style={{ width: 72, height: 72, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 32px rgba(239,68,68,0.1)' }}>
                        <WifiOff size={30} color="#EF4444" />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 5vw, 1.75rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                        No active session
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '2rem', padding: '0 0.5rem' }}>
                        Session PIN <strong style={{ fontFamily: 'var(--font-mono)', color: '#EF4444' }}>{sessionId}</strong> doesn&apos;t have an active class right now. Your teacher may not have started yet.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                        <button onClick={async (e) => {
                            const btn = e.currentTarget;
                            btn.textContent = 'Checking...';
                            btn.style.opacity = '0.7';
                            const r = await validateSession(sessionId);
                            setSessionValid(r.active);
                            if (r.active && r.roomId) setRoomId(r.roomId);
                            setTimeout(() => {
                                if (btn) { btn.innerHTML = '<span>Check Again</span>'; btn.style.opacity = '1'; }
                            }, 500);
                        }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 14, color: 'var(--accent-soft)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s', width: '100%' }}>
                            <Radio size={15} /> Check Again
                        </button>
                        <button onClick={() => router.push('/student')}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.875rem 1.5rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 14, color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
                            Try a Different PIN
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ── Signal Sent ────────────────────────────────────────────────
    if (signaled && cooldown) {
        return (
            <div style={pageShell}>
                <div style={{ textAlign: 'center', width: '100%', maxWidth: 360 }}>
                    <div style={{ width: 80, height: 80, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 48px rgba(34,197,94,0.18)' }}>
                        <CheckCircle size={38} color="#22C55E" />
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.625rem', color: 'var(--text-primary)' }}>
                        Signal received! ✓
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.75rem', padding: '0 0.5rem' }}>
                        Your teacher has been notified <strong style={{ color: 'var(--text-primary)' }}>anonymously</strong>. You can signal again after the cooldown.
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 100, fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>
                        <Clock size={14} />
                        Signal again in {cooldownSecs}s
                    </div>
                    <div style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        🔒 100% anonymous · No account needed
                    </div>
                </div>
            </div>
        )
    }

    // ── Active session — Signal buttons ────────────────────────────
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>

            {/* Ambient orbs */}
            <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '60%', height: '70%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: '50%', height: '60%', background: 'radial-gradient(ellipse, rgba(79,70,229,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            {/* Header */}
            <header style={{ borderBottom: '1px solid var(--glass-border)', height: 52, display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.5rem', backdropFilter: 'blur(12px)', background: 'rgba(6,6,10,0.85)', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={11} color="#fff" fill="#fff" />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.03em' }}>EduPulse</span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>/</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Session</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem', padding: '0.15rem 0.5rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-soft)', letterSpacing: '0.1em' }}>{sessionId}</span>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)', background: 'var(--success-dim)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 100, padding: '0.2rem 0.625rem', flexShrink: 0 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite' }} />
                    Live
                </div>
            </header>

            {/* Main content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem', position: 'relative', zIndex: 1 }}>

                {/* Top text */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: 380, width: '100%' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.875rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 100, marginBottom: '1.25rem' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite' }} />
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-soft)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Class in session</span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 7vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                        How are you<br />keeping up?
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                        Tap a button below. Your feedback is <strong style={{ color: 'var(--text-primary)' }}>100% anonymous</strong> — your teacher won&apos;t know it&apos;s you.
                    </p>
                </div>

                {/* Signals */}
                <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Optional Context Field */}
                        <div style={{ marginBottom: '0.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textAlign: 'center' }}>
                                Optional: What specifically is confusing?
                            </label>
                            <input
                                type="text"
                                value={optionalText}
                                onChange={(e) => setOptionalText(e.target.value)}
                                placeholder="e.g. The math in slide 4..."
                                maxLength={120}
                                disabled={submitting !== null}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>
                    {SIGNAL_TYPES.map(sig => {
                        const isSubmittingThis = submitting === sig.label
                        return (
                            <button
                                key={sig.id}
                                disabled={submitting !== null}
                                onClick={() => handleSignal(sig.label)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: '1rem',
                                    padding: 'clamp(1.1rem, 4vw, 1.5rem) clamp(1.1rem, 5vw, 1.75rem)',
                                    background: cooldown
                                        ? 'rgba(255,255,255,0.02)'
                                        : isSubmittingThis
                                            ? sig.glow
                                            : `linear-gradient(135deg, ${sig.gradientFrom}, ${sig.gradientTo})`,
                                    border: `1px solid ${cooldown ? 'var(--glass-border)' : sig.glow}`,
                                    borderRadius: 24,
                                    color: cooldown ? 'var(--text-tertiary)' : sig.color,
                                    fontSize: 'clamp(1.1rem, 4.5vw, 1.25rem)',
                                    fontWeight: 700,
                                    cursor: cooldown ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: !cooldown && !isSubmittingThis ? `0 8px 32px ${sig.glow}` : 'none',
                                    transform: isSubmittingThis ? 'scale(0.98)' : 'scale(1)',
                                    opacity: cooldown ? 0.5 : 1,
                                }}
                            >
                                <span style={{ fontSize: '1.75rem', filter: cooldown ? 'grayscale(100%)' : 'none' }}>
                                    {isSubmittingThis ? <Loader2 size={28} style={{ animation: 'spin 1.5s linear infinite' }} /> : sig.emoji}
                                </span>
                                {isSubmittingThis ? 'Sending...' : sig.label}
                            </button>
                        )
                    })}
                </div>

                {/* Cooldown state */}
                {cooldown && !signaled && (
                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.125rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 100, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
                        <Clock size={14} />
                        Wait {cooldownSecs}s before signaling again
                    </div>
                )}

                {/* Anon note */}
                <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-tertiary)', lineHeight: 1.65 }}>
                    🔒 No account needed · Fully anonymous · No data linked to you
                </div>
            </main>
        </div>
    )
}
