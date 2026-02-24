'use client'

import { useState, useEffect } from 'react'
import { submitSignal } from '@/app/actions/signals'
import { CheckCircle, Clock, Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

export default function StudentJoin() {
    const params = useParams()
    const router = useRouter()
    const sessionId = params.id as string

    const [signaled, setSignaled] = useState(false)
    const [cooldown, setCooldown] = useState(false)
    const [cooldownSecs, setCooldownSecs] = useState(0)
    const [submitting, setSubmitting] = useState<string | null>(null)
    const [types] = useState([
        { id: 1, label: "I'm Confused" },
        { id: 2, label: "Too Fast" },
    ])

    useEffect(() => {
        if (!sessionId || sessionId.length !== 4) router.push('/')

        const lastSignal = localStorage.getItem('last_signal_time')
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
        const res = await submitSignal({ type, block_room: sessionId, additional_text: '' })
        if (res.success) {
            setSignaled(true)
            setCooldown(true)
            setCooldownSecs(60)
            localStorage.setItem('last_signal_time', Date.now().toString())
            setTimeout(() => setSignaled(false), 4000)
            const countdown = setInterval(() => {
                setCooldownSecs(s => {
                    if (s <= 1) { clearInterval(countdown); setCooldown(false); return 0 }
                    return s - 1
                })
            }, 1000)
        }
        setSubmitting(null)
    }

    if (!sessionId || sessionId.length !== 4) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={20} color="var(--text-tertiary)" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ width: '100%', maxWidth: 360 }}>

                {/* Header */}
                <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                        Session · {sessionId}
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.4rem' }}>EduPulse</h1>
                    <p style={{ fontSize: '0.857rem', color: 'var(--text-secondary)' }}>Anonymous classroom feedback</p>
                </div>

                {/* Status */}
                {signaled && (
                    <div style={{ marginBottom: '1.5rem', background: 'var(--success-dim)', border: '1px solid rgba(62,207,142,0.2)', borderRadius: 'var(--radius-lg)', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <CheckCircle size={16} color="var(--success)" />
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.857rem', color: 'var(--success)' }}>Signal sent</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Your teacher has been notified anonymously.</div>
                        </div>
                    </div>
                )}

                {cooldown && !signaled && (
                    <div style={{ marginBottom: '1.5rem', background: 'var(--warning-dim)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-lg)', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Clock size={16} color="var(--warning)" />
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.857rem', color: 'var(--warning)' }}>Cooldown — {cooldownSecs}s remaining</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>One signal per minute to prevent noise.</div>
                        </div>
                    </div>
                )}

                {/* Signal Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {types.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => handleSignal(type.label)}
                            disabled={cooldown || !!submitting}
                            style={{
                                width: '100%',
                                padding: '1rem 1.25rem',
                                borderRadius: 'var(--radius-lg)',
                                border: `1px solid ${cooldown ? 'var(--border)' : 'var(--border-accent)'}`,
                                background: cooldown ? 'var(--bg-surface)' : submitting === type.label ? 'var(--accent)' : 'var(--accent-dim)',
                                color: cooldown ? 'var(--text-tertiary)' : 'var(--text-primary)',
                                fontFamily: 'inherit',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                letterSpacing: '-0.02em',
                                cursor: cooldown ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.15s ease',
                                textAlign: 'left',
                                opacity: cooldown ? 0.5 : 1,
                            }}
                        >
                            <span>{type.label}</span>
                            {submitting === type.label
                                ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                                : <span style={{ fontSize: '0.75rem', color: cooldown ? 'var(--text-tertiary)' : 'var(--accent)', fontWeight: 600 }}>Tap to signal →</span>
                            }
                        </button>
                    ))}
                </div>

                {/* Trust line */}
                <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>100% anonymous · No account required</span>
                </div>
            </div>
        </div>
    )
}
