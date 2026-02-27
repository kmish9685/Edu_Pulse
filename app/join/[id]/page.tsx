'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { submitSignal, validateSession } from '@/app/actions/signals'
import { CheckCircle, Clock, Loader2, Zap, WifiOff, Radio } from 'lucide-react'

export default function StudentJoin() {
    const params = useParams()
    const router = useRouter()
    const sessionId = params.id as string

    const [sessionValid, setSessionValid] = useState<boolean | null>(null) // null = checking
    const [signaled, setSignaled] = useState(false)
    const [cooldown, setCooldown] = useState(false)
    const [cooldownSecs, setCooldownSecs] = useState(0)
    const [submitting, setSubmitting] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const SIGNAL_TYPES = [
        { id: 'confused', label: "I'm Confused", emoji: '🤔', color: '#EF4444', glow: 'rgba(239,68,68,0.3)' },
        { id: 'too_fast', label: 'Too Fast', emoji: '⚡', color: '#F59E0B', glow: 'rgba(245,158,11,0.3)' },
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
        const res = await submitSignal({ type, block_room: sessionId, additional_text: '' })
        if (res.success) {
            setSignaled(true)
            setCooldown(true)
            setCooldownSecs(60)
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

    // ── Loading state ──────────────────────────────────────────────
    if (sessionValid === null) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-dot 2s infinite' }}>
                        <Zap size={22} color="#fff" fill="#fff" />
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.03em' }}>Joining session…</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>PIN: {sessionId}</div>
                </div>
            </div>
        )
    }

    // ── No active session ──────────────────────────────────────────
    if (!sessionValid) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'var(--font-body)' }}>
                <div style={{ textAlign: 'center', maxWidth: 380 }}>
                    <div style={{ width: 64, height: 64, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <WifiOff size={28} color="#EF4444" />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.625rem', color: 'var(--text-primary)' }}>
                        No active session
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '2rem' }}>
                        Session PIN <strong style={{ fontFamily: 'var(--font-mono)', color: '#EF4444' }}>{sessionId}</strong> doesn't have an active class right now. Your teacher may not have started the session yet, or it may have ended.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={async (e) => {
                            const btn = e.currentTarget;
                            const originalHtml = btn.innerHTML;
                            btn.innerHTML = 'Checking...';
                            btn.style.opacity = '0.7';
                            const r = await validateSession(sessionId);
                            setSessionValid(r.active);
                            setTimeout(() => {
                                if (btn) {
                                    btn.innerHTML = originalHtml;
                                    btn.style.opacity = '1';
                                }
                            }, 500);
                        }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.625rem 1.25rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius)', color: 'var(--accent-soft)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s' }}>
                            <Radio size={14} /> Check Again
                        </button>
                        <button onClick={() => router.push('/student')}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.625rem 1.25rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius)', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
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
            <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'var(--font-body)' }}>
                <div style={{ textAlign: 'center', maxWidth: 340 }}>
                    <div style={{ width: 72, height: 72, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 32px rgba(34,197,94,0.15)' }}>
                        <CheckCircle size={34} color="#22C55E" />
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        Signal received!
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                        Your teacher has been notified anonymously. You can signal again after the cooldown.
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: 100, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        <Clock size={13} />
                        You can signal again in {cooldownSecs}s
                    </div>
                    <div style={{ marginTop: '1rem', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                        100% anonymous · No account needed
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
            <header style={{ borderBottom: '1px solid var(--glass-border)', height: 52, display: 'flex', alignItems: 'center', padding: '0 1.25rem', gap: '0.5rem', backdropFilter: 'blur(12px)', background: 'rgba(6,6,10,0.85)', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={11} color="#fff" fill="#fff" />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.03em' }}>EduPulse</span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>/</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Session</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', padding: '0.15rem 0.5rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-soft)', letterSpacing: '0.1em' }}>{sessionId}</span>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)', background: 'var(--success-dim)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 100, padding: '0.2rem 0.625rem' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite' }} />
                    Live
                </div>
            </header>

            {/* Main content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem', position: 'relative', zIndex: 1 }}>

                {/* Top text */}
                <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: 340 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.75rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 100, marginBottom: '1.25rem' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite' }} />
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-soft)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Class in session</span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                        How are you keeping up?
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>
                        Tap a button below. Your feedback is <strong style={{ color: 'var(--text-primary)' }}>100% anonymous</strong> — your teacher won't know it's you.
                    </p>
                </div>

                {/* Signal buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 360 }}>
                    {error && (
                        <div style={{ padding: '0.75rem 1rem', background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius)', fontSize: '0.8rem', color: 'var(--danger)', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                    {SIGNAL_TYPES.map(sig => (
                        <button
                            key={sig.id}
                            onClick={() => handleSignal(sig.id)}
                            disabled={!!(cooldown || submitting)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1.5rem 2rem',
                                background: cooldown ? 'rgba(255,255,255,0.02)' : `rgba(${sig.color === '#EF4444' ? '239,68,68' : '245,158,11'},0.06)`,
                                border: `1px solid ${cooldown ? 'var(--glass-border)' : `${sig.color}33`}`,
                                borderRadius: 18,
                                cursor: cooldown || submitting ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit',
                                width: '100%',
                                transition: 'all 0.2s ease',
                                opacity: cooldown ? 0.5 : 1,
                                boxShadow: cooldown ? 'none' : `0 0 0 0 ${sig.glow}`,
                            }}
                            onMouseEnter={e => { if (!cooldown && !submitting) (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 24px ${sig.glow}` }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none' }}
                        >
                            <span style={{ fontSize: '2rem', lineHeight: 1 }}>{sig.emoji}</span>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: cooldown ? 'var(--text-tertiary)' : 'var(--text-primary)', letterSpacing: '-0.025em' }}>
                                    {submitting === sig.id ? 'Sending…' : sig.label}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.15rem' }}>
                                    {sig.id === 'confused' ? 'Tap if you\'re lost on the current topic' : 'Tap if the pace is too fast for you'}
                                </div>
                            </div>
                            {submitting === sig.id && (
                                <Loader2 size={16} color="var(--text-tertiary)" style={{ marginLeft: 'auto', animation: 'spin 1s linear infinite' }} />
                            )}
                        </button>
                    ))}
                </div>

                {/* Cooldown state */}
                {cooldown && !signaled && (
                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 100, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        <Clock size={13} />
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
