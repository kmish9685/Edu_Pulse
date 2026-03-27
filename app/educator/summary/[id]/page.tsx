'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Sparkles, Loader2, ArrowLeft, LogOut, Send } from 'lucide-react'
import { generateSummary, generateRemediation } from '@/app/actions/ai'
import { saveRemediation } from '@/app/actions/signals_fix'
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
    const [followUpMode, setFollowUpMode] = useState<'idle' | 'generating' | 'draft' | 'publishing' | 'published'>('idle')
    const [remediationText, setRemediationText] = useState<string | null>(null)
    const [remediationError, setRemediationError] = useState<string | null>(null)
    const [teacherResources, setTeacherResources] = useState('')
    const [copied, setCopied] = useState(false)

    const agendaParam = searchParams.get('agenda')
    const agenda: string[] = agendaParam ? JSON.parse(decodeURIComponent(agendaParam)) : []

    // Prevent raw API errors from spilling into the UI
    const friendlyAIError = (raw?: string, fallback: string = 'AI temporarily unavailable.'): string => {
        if (!raw) return fallback
        if (raw.includes('429') || raw.toLowerCase().includes('quota') || raw.toLowerCase().includes('too many')) {
            return '✨ Our AI is taking a quick breather! We had too many requests at once. Please wait a moment and refresh the page to try again.'
        }
        return fallback 
    }

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
                setError(friendlyAIError(res.error, 'AI failed to generate a summary.'))
            }

            // 3. Check if remediation is already published
            const { data: sessionData } = await supabase
                .from('active_sessions')
                .select('remediation_material')
                .eq('id', sessionId)
                .single()
            
            if (sessionData && sessionData.remediation_material) {
                setRemediationText(sessionData.remediation_material)
                setFollowUpMode('published')
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
            setFollowUpMode('draft') // DO NOT auto-save. Let the teacher approve it.
        } else {
            setRemediationError(friendlyAIError(res.error, 'Failed to generate review material.'))
            setFollowUpMode('idle')
        }
    }

    const handleApproveAndPublish = async () => {
        if (!remediationText) return
        setFollowUpMode('publishing')
        
        // PERSIST to database for students to see
        const res = await saveRemediation(sessionId, remediationText)
        
        if (res.success) {
            setFollowUpMode('published')
        } else {
            setRemediationError(res.error || 'Failed to publish.')
            setFollowUpMode('draft')
        }
    }

    const handleShareLink = () => {
        const link = `${window.location.origin}/join/${sessionId}/remedy`
        const msg = `📚 Study Pack from today's class is ready!\n\nIt includes a session recap, concept analogies, practice questions with answers, and more.\n\nOpen here (no login needed): ${link}`
        navigator.clipboard.writeText(msg).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        })
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
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,rgba(167,139,250,0.1),rgba(139,92,246,0.2))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', animation: 'pulse-dot 2s infinite' }}>
                                        <Sparkles size={20} color="#A78BFA" />
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>DRAFTING REMEDIATION MATERIALS...</span>
                                </div>
                            )}

                            {followUpMode === 'draft' && remediationText && (
                                <div style={{ animation: 'enter-fade 0.4s ease-out' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)' }} />
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Review draft before publishing to students</p>
                                    </div>
                                    <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxHeight: 400, overflowY: 'auto', marginBottom: '1.5rem' }}>
                                        {remediationText.split('\n').map((paragraph: string, i: number) => {
                                            if (!paragraph.trim()) return <br key={i} />
                                            return <p key={i} style={{ marginBottom: '0.5rem' }}>{paragraph}</p>
                                        })}
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button 
                                            className="btn-primary" 
                                            style={{ flex: 1, padding: '1rem', fontSize: '0.95rem', background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none' }} 
                                            onClick={handleApproveAndPublish}
                                        >
                                            ✅ Approve & Publish Study Pack
                                        </button>
                                        <button 
                                            className="btn-ghost" 
                                            onClick={() => setFollowUpMode('idle')}
                                        >
                                            Discard & Edit Resources
                                        </button>
                                    </div>
                                </div>
                            )}

                            {followUpMode === 'publishing' && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#10B981', marginBottom: '1rem' }} />
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.05em', color: '#10B981' }}>PUBLISHING TO REMEDY HUB...</span>
                                </div>
                            )}

                            {followUpMode === 'published' && (
                                <div style={{ textAlign: 'center', padding: '1rem 0', animation: 'enter-fade 0.5s ease-out' }}>
                                    <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.05))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                                        <Sparkles size={28} color="#10B981" />
                                    </div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                        Study Pack Published!
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
                                        The AI-generated study pack is now live for all students at the session Remedy Hub link.
                                    </p>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <Link 
                                            href={`/join/${sessionId}/pdf`}
                                            target="_blank"
                                            className="btn-primary" 
                                            style={{ padding: '0.875rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-accent)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: 'none' }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                                            Download Premium PDF
                                        </Link>
                                        <button 
                                            className="btn-primary" 
                                            onClick={handleShareLink}
                                            style={{ padding: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: copied ? 'var(--success)' : 'var(--accent)' }}
                                        >
                                            {copied ? (
                                                <>✅ Link Copied!</>
                                            ) : (
                                                <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg> Copy Study Pack Link</>
                                            )}
                                        </button>
                                    </div>
                                    <div style={{ marginTop: '1rem' }}>
                                        <button className="btn-ghost" onClick={() => setFollowUpMode('idle')} style={{ fontSize: '0.8rem' }}>
                                            Regenerate Material
                                        </button>
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
