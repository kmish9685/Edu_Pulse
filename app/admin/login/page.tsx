'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function AdminLoginPage() {
    const router = useRouter()
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

            const { data: profile } = await supabase
                .from('profiles').select('role').eq('id', user.id).single()

            if (profile?.role !== 'admin') {
                await supabase.auth.signOut()
                throw new Error('Access denied. This login is for administrators only.')
            }

            router.push('/admin')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Authentication failed')
            setIsLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden', fontFamily: 'var(--font-body)' }}>

            {/* Ambient orbs */}
            <div style={{ position: 'fixed', top: '-15%', right: '-10%', width: '55%', height: '60%', background: 'radial-gradient(ellipse, rgba(239,68,68,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: '40%', height: '50%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
                        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#EF4444,#DC2626)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 22px rgba(239,68,68,0.25)' }}>
                            <Shield size={17} color="#fff" />
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.04em' }}>Admin Portal</span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.045em', marginBottom: '0.5rem' }}>
                        Administrator Access
                    </h1>
                    <p style={{ fontSize: '0.857rem', color: 'var(--text-secondary)' }}>
                        Restricted to verified institution administrators only.
                    </p>
                </div>

                {/* Form card */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 18, padding: '2rem', boxShadow: '0 24px 48px -12px rgba(0,0,0,0.45)' }}>

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', padding: '0.875rem 1rem', background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, marginBottom: '1.25rem', fontSize: '0.857rem', color: 'var(--danger)' }}>
                            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Admin Email
                            </label>
                            <input type="email" id="admin-email" className="lx-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@institution.edu" required autoComplete="email" />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input type={showPwd ? 'text' : 'password'} id="admin-password" className="lx-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" style={{ paddingRight: '2.75rem' }} />
                                <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 0 }}>
                                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="btn-primary" style={{ justifyContent: 'center', padding: '0.8rem', borderRadius: 10, marginTop: '0.375rem', width: '100%', background: isLoading ? undefined : '#DC2626', boxShadow: '0 0 0 0 rgba(239,68,68,0)', opacity: isLoading ? 0.7 : 1 }}>
                            {isLoading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</> : 'Access Admin Panel'}
                        </button>
                    </form>
                </div>

                {/* Sep educator link */}
                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                        Educator?{' '}
                        <Link href="/educator/login" style={{ color: 'var(--accent-soft)', textDecoration: 'none', fontWeight: 600 }}>Sign in here instead →</Link>
                    </p>
                </div>

                <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                    <Link href="/" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textDecoration: 'none' }}>← Back to Home</Link>
                </div>
            </div>
        </div>
    )
}
