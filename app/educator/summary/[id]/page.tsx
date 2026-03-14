'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Sparkles, Loader2, ArrowLeft, LogOut, Send } from 'lucide-react'
import { generateSummary, generateRemediation } from '@/app/actions/ai'
import Link from 'next/link'

export default function EducatorSummary({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Unwrap the params promise (Next.js 15 requirement)
    const { id: sessionId } = use(params)

    const [summary, setSummary] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [totalSignals, setTotalSignals] = useState(0)
    const [followUpMode, setFollowUpMode] = useState<'idle' | 'generating' | 'done'>('idle')
    const [remediationText, setRemediationText] = useState<string | null>(null)
    const [remediationError, setRemediationError] = useState<string | null>(null)
    const [teacherResources, setTeacherResources] = useState('')

    const agendaParam = searchParams.get('agenda')
    const agenda: string[] = agendaParam ? JSON.parse(decodeURIComponent(agendaParam)) : []

    useEffect(() => {
        async function fetchAndGenerate() {
            setLoading(true)
            const supabase = createClient()

            // 1. Fetch Signals for this session
            const { data: signals, error: fetchError } = await supabase
                .from('signals')
                .select('*')
                .eq('block_room', sessionId)

            if (fetchError || !signals) {
                setError('Failed to load session data.')
                setLoading(false)
                return
            }

            setTotalSignals(signals.length)

            // 2. Generate Summary with AI
            const res = await generateSummary(agenda, signals)
            if (res.success && res.data) {
                setSummary(res.data)
            } else {
                setError(res.error || 'AI failed to generate a summary.')
            }

            setLoading(false)
        }

        fetchAndGenerate()
    }, [sessionId])

    const handleLogOut = async () => {
        const { signOut } = await import('@/app/actions/auth')
        await signOut()
        window.location.href = '/'
    }

    const handleGenerateRemediation = async () => {
        setFollowUpMode('generating')
        setRemediationError(null)

        const supabase = createClient()
        const { data: signalsData } = await supabase
            .from('signals')
            .select('*')
            .eq('block_room', sessionId)
            .order('created_at', { ascending: true })

        const res = await generateRemediation(agenda, signalsData || [], teacherResources)

        if (res.success && res.data) {
            setRemediationText(res.data)
            setFollowUpMode('done')
        } else {
            setRemediationError(res.error || 'Failed to generate review material.')
            setFollowUpMode('idle')
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>

            {/* Ambient glow */}
            <div style={{ position: 'fixed', top: '-10%', left: '0%', width: '60%', height: '50%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Nav */}
            <header style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: 26, height: 26, background: '#0F172A', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={14} color="#fff" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>EduPulse <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>/ AI Summary</span></span>
                </div>

                <button
                    onClick={handleLogOut}
                    className="btn-ghost btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-primary)' }}
                >
                    <LogOut size={14} /> Close & Log Out
                </button>
            </header>

            {/* Content */}
            <main style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', zIndex: 1, overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: 700 }}>

                    <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                                Session Insight
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                AI analysis for session <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{sessionId}</span>
                            </p>
                        </div>
                        <div className="lx-badge" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-secondary)' }}>
                            {totalSignals} signals collected
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem', position: 'relative' }}>
                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                                <Loader2 size={32} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--accent)', marginBottom: '1rem' }} />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>ANALYZING CLASSROOM SIGNALS...</span>
                            </div>
                        ) : error ? (
                            <div style={{ color: 'var(--danger)', padding: '1rem', background: 'var(--bg-base)', borderRadius: 'var(--radius)', border: '1px solid var(--danger)', fontSize: '0.85rem' }}>
                                {error}
                            </div>
                        ) : summary ? (
                            <div style={{ lineHeight: 1.8, fontSize: '1rem', color: 'var(--text-primary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-soft)' }}>
                                    <Sparkles size={18} />
                                    <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>EduPulse AI Insight</span>
                                </div>
                                {summary.split('\n\n').map((paragraph, i) => (
                                    <p key={i} style={{ marginBottom: '1.25rem' }}>{paragraph}</p>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    {/* AI-Powered "Next Best Action" (Automated Remediation) Feature */}
                    {!loading && summary && (
                        <div className="glass-card" style={{ padding: '2rem', marginTop: '1.5rem', background: 'var(--bg-surface)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
                                <Send size={15} color="var(--accent-soft)" />
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Automated Remediation</span>
                            </div>

                            {followUpMode === 'idle' && (
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                                        Generate a structured student review, resources, and a diagnostic quiz based on today's confusion data.
                                    </p>

                                    {/* Teacher resource input */}
                                    <div style={{ marginBottom: '1.25rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            📎 Paste your study materials / links (optional)
                                        </label>
                                        <textarea
                                            value={teacherResources}
                                            onChange={e => setTeacherResources(e.target.value)}
                                            placeholder={'Paste YouTube links, article URLs, or your own notes here. The AI will use these exact resources.\n\nExample:\nhttps://youtu.be/oZbTKBbdNa4\nhttps://geeksforgeeks.org/linked-list'}
                                            rows={4}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                background: 'var(--bg-base)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 10,
                                                color: 'var(--text-primary)',
                                                fontSize: '0.85rem',
                                                fontFamily: 'var(--font-mono)',
                                                lineHeight: 1.6,
                                                outline: 'none',
                                                resize: 'vertical',
                                                transition: 'border-color 0.2s',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                                            onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                                        />
                                        <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '0.375rem' }}>
                                            If left empty, the AI will suggest resource titles only (no clickable links).
                                        </p>
                                    </div>
                                    {remediationError && (
                                        <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                            {remediationError}
                                        </div>
                                    )}
                                    <button
                                        onClick={handleGenerateRemediation}
                                        className="btn-primary"
                                        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <Sparkles size={15} /> Generate Student Follow-Up Material
                                    </button>
                                </div>
                            )}

                            {followUpMode === 'generating' && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 0', color: 'var(--text-secondary)' }}>
                                    <Loader2 size={24} style={{ animation: 'spin 1.5s linear infinite', color: '#A78BFA', marginBottom: '1rem' }} />
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>DRAFTING REMEDIATION MATERIALS...</span>
                                </div>
                            )}

                            {followUpMode === 'done' && remediationText && (
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                        Generated draft for students:
                                    </p>
                                    <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        {remediationText.split('\n').map((paragraph: string, i: number) => {
                                            if (!paragraph.trim()) return <br key={i} />
                                            return <p key={i} style={{ marginBottom: '0.5rem' }}>{paragraph}</p>
                                        })}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                                        <button className="btn-primary" style={{ flex: 1 }} onClick={() => {
                                            navigator.clipboard.writeText(remediationText || '');
                                            alert('Text copied to clipboard!');
                                        }}>Copy Text</button>
                                        <button className="btn-ghost" onClick={() => setFollowUpMode('idle')}>Regenerate</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {!loading && (
                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <button
                                onClick={handleLogOut}
                                className="btn-primary"
                            >
                                Finish & Log Out
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
