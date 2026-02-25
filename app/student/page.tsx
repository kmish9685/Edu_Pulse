'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, ArrowRight, QrCode } from 'lucide-react'

export default function StudentEntryPage() {
    const [pin, setPin] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault()
        const cleaned = pin.trim()
        if (cleaned.length !== 4 || !/^\d{4}$/.test(cleaned)) {
            setError('Please enter a valid 4-digit session PIN.')
            return
        }
        setLoading(true)
        router.push(`/join/${cleaned}`)
    }

    const handlePinChange = (v: string) => {
        const digits = v.replace(/\D/g, '').slice(0, 4)
        setPin(digits)
        if (error) setError('')
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--student-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden' }}>

            {/* Ambient glow */}
            <div style={{ position: 'fixed', top: '-20%', left: '10%', width: '80%', height: '60%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Logo */}
            <div style={{ position: 'absolute', top: '1.75rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={11} color="#fff" fill="#fff" />
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>EduPulse</span>
            </div>

            <div style={{ width: '100%', maxWidth: 360, position: 'relative', zIndex: 1 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 1.1, marginBottom: '0.875rem' }}>
                        Join your<br />class session.
                    </h1>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                        Enter the 4-digit PIN your educator posted on the board, or scan the QR code.
                    </p>
                </div>

                {/* QR Scan Hint */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.125rem', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 12, marginBottom: '1.5rem' }}>
                    <div style={{ width: 40, height: 40, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <QrCode size={18} color="var(--accent-soft)" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.857rem', marginBottom: '0.15rem' }}>
                            Fastest way: Scan the QR
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Open your camera app and point it at the code on the classroom display.
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>or enter PIN</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                </div>

                {/* PIN Form */}
                <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="tel"
                            inputMode="numeric"
                            pattern="\d{4}"
                            maxLength={4}
                            value={pin}
                            onChange={e => handlePinChange(e.target.value)}
                            placeholder="0000"
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                textAlign: 'center',
                                fontFamily: 'var(--font-display)',
                                fontSize: '3rem',
                                fontWeight: 700,
                                letterSpacing: '0.3em',
                                color: 'var(--text-primary)',
                                background: 'rgba(255,255,255,0.04)',
                                border: `1px solid ${error ? 'var(--danger)' : pin.length === 4 ? 'var(--border-accent)' : 'rgba(255,255,255,0.10)'}`,
                                borderRadius: 14,
                                outline: 'none',
                                transition: 'border-color 0.15s, box-shadow 0.15s',
                                caretColor: 'var(--accent)',
                            }}
                            onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.18)'; e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border-accent)' }}
                            onBlur={e => { e.currentTarget.style.boxShadow = 'none' }}
                        />
                        {/* 4-dot progress indicators */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.625rem' }}>
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i < pin.length ? 'var(--accent)' : 'rgba(255,255,255,0.12)', transition: 'background 0.15s' }} />
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--danger)', textAlign: 'center', animation: 'fadeUp 0.2s ease' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={pin.length !== 4 || loading}
                        className="btn-primary"
                        style={{ justifyContent: 'center', padding: '0.875rem', fontSize: '1rem', borderRadius: 12, opacity: pin.length !== 4 ? 0.45 : 1, width: '100%', marginTop: '0.25rem' }}
                    >
                        {loading ? 'Joining...' : <>Join Session <ArrowRight size={16} /></>}
                    </button>
                </form>

                {/* Trust text */}
                <div style={{ marginTop: '2.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        100% Anonymous · No Account Required
                    </span>
                </div>

                {/* Back link */}
                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                    <Link href="/" style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textDecoration: 'none', transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
