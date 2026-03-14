'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { loginWithEmail } from '@/app/actions/auth'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect') || '/educator/start'
    const errorParam = searchParams.get('error')

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(
        errorParam === 'admin_required'
            ? 'Administrator privileges required. Please sign in with an admin account.'
            : null
    )

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPwd, setShowPwd] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const res = await loginWithEmail(email, password, 'unified')
            if (!res.success) {
                throw new Error(res.error || 'Authentication failed')
            }

            if (res.role === 'admin') {
                window.location.href = redirect.startsWith('/admin') ? redirect : '/admin'
            } else {
                window.location.href = redirect.startsWith('/admin') ? '/educator/start' : redirect
            }
            // window.location.href forces a hard reload, clearing the Next.js router cache
            // and ensuring middleware runs fresh with the new cookies.
        } catch (err: any) {
            setError(err.message || 'Server connection failed. Try again.')
            setIsLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden', fontFamily: 'var(--font-body)' }}>

            {/* Ambient orbs */}
            <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '-5%', left: '0%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', marginBottom: '1.25rem' }}>
                        <div style={{ width: 32, height: 32, background: '#0F172A', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shield size={16} color="#fff" />
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>EduPulse</span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.045em', marginBottom: '0.5rem' }}>
                        Portal Login
                    </h1>
                    <p style={{ fontSize: '0.857rem', color: 'var(--text-secondary)' }}>
                        Sign in as an Educator or Administrator.
                    </p>
                </div>

                {/* Form card */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: 'var(--shadow-xl)' }}>

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', padding: '0.875rem 1rem', background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, marginBottom: '1.25rem', fontSize: '0.857rem', color: 'var(--danger)' }}>
                            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Email
                            </label>
                            <input type="email" id="email" className="lx-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="contact@institution.edu" required autoComplete="email" />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input type={showPwd ? 'text' : 'password'} id="password" className="lx-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" style={{ paddingRight: '2.75rem' }} />
                                <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 0 }}>
                                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="btn-primary" style={{ justifyContent: 'center', padding: '0.8rem', borderRadius: 10, marginTop: '0.375rem', width: '100%', opacity: isLoading ? 0.7 : 1 }}>
                            {isLoading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Authenticating...</> : 'Sign In'}
                        </button>
                    </form>
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link href="/" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textDecoration: 'none' }}>← Back to Home</Link>
                </div>
            </div>
        </div>
    )
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}><Loader2 className="animate-spin text-indigo-500" /></div>}>
            <LoginForm />
        </Suspense>
    )
}
