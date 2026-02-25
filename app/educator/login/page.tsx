'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Zap, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { Suspense } from 'react'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect') || '/educator/start'
    const supabase = createClient()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPwd, setShowPwd] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({ email, password })
            if (authError) throw authError
            if (!user) throw new Error('No user returned')

            const { data: profile, error: profileError } = await supabase
                .from('profiles').select('role').eq('id', user.id).single()

            if (profileError) throw new Error('User profile not found. Contact support.')

            if (profile.role === 'admin') router.push('/admin')
            else if (profile.role === 'educator') router.push(redirect === '/admin' ? '/educator/start' : redirect)
            else router.push('/educator/start')

            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Authentication failed')
            setIsLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden', fontFamily: 'var(--font-body)' }}>

            {/* Ambient orbs */}
            <div style={{ position: 'fixed', top: '-15%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: '45%', height: '50%', background: 'radial-gradient(ellipse, rgba(79,70,229,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
                        <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
                            <Zap size={16} color="#fff" fill="#fff" />
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>EduPulse</span>
                    </Link>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.625rem', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        Educator Sign In
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Access your classroom dashboard and session tools.
                    </p>
                </div>

                {/* Form card */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 18, padding: '2rem', boxShadow: '0 24px 48px -12px rgba(0,0,0,0.4)' }}>

                    {/* Error */}
                    {error && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', padding: '0.875rem 1rem', background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, marginBottom: '1.25rem', fontSize: '0.857rem', color: 'var(--danger)' }}>
                            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="lx-input"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="professor@university.edu"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    id="password"
                                    className="lx-input"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                    style={{ paddingRight: '2.75rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(v => !v)}
                                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 0, transition: 'color 0.15s' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                                >
                                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary"
                            style={{ justifyContent: 'center', padding: '0.8rem', fontSize: '0.95rem', borderRadius: 10, marginTop: '0.375rem', opacity: isLoading ? 0.7 : 1, width: '100%' }}
                        >
                            {isLoading ? (
                                <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Signing In...</>
                            ) : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Roles note */}
                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                        Administrator?{' '}
                        <Link href="/admin/login" style={{ color: 'var(--accent-soft)', textDecoration: 'none', fontWeight: 600 }}>Use the Admin Portal →</Link>
                    </p>
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
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

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={20} color="var(--text-tertiary)" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
