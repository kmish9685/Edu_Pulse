'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { getSessionRemediation, submitSignal } from '@/app/actions/signals'
import { Sparkles, Loader2, ArrowLeft, BookOpen, Clock, AlertCircle, MessageSquare, Send, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function StudentRemedy({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id: sessionId } = use(params)

    const [remediation, setRemediation] = useState<string | null>(null)
    const [topic, setTopic] = useState<string | null>(null)
    const [startedAt, setStartedAt] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    // Deep Doubt form state
    const [doubt, setDoubt] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        async function fetchRemedy() {
            setLoading(true)
            const res = await getSessionRemediation(sessionId)
            if (res.success && res.data) {
                setRemediation(res.data.remediation_material)
                setTopic(res.data.current_topic)
                setStartedAt(res.data.started_at)
            } else {
                setError('No study material available for this session yet.')
            }
            setLoading(false)
        }
        fetchRemedy()
    }, [sessionId])

    const handleDoubtSubmit = async () => {
        if (!doubt.trim() || submitting) return
        setSubmitting(true)
        const res = await submitSignal({
            type: 'Deep Doubt',
            block_room: sessionId,
            additional_text: doubt,
            device_id: 'remedy_hub_' + Math.random().toString(36).substring(2, 9)
        })
        if (res.success) {
            setSubmitted(true)
            setDoubt('')
            setTimeout(() => setSubmitted(false), 3000)
        }
        setSubmitting(false)
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', gap: '1rem' }}>
                <Loader2 className="animate-spin" size={32} color="var(--accent)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>PREPARING YOUR STUDY GUIDE...</span>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)', position: 'relative', overflowX: 'hidden' }}>
            
            {/* Ambient glow */}
            <div style={{ position: 'fixed', top: '-10%', right: '0%', width: '60%', height: '50%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
            
            <header style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', background: 'rgba(7,7,12,0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
                <Link href={`/join/${sessionId}`} style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-soft)', letterSpacing: '0.05em' }}>SEMINAR PIN: {sessionId}</span>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            {startedAt ? new Date(startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Post-Session'}
                        </span>
                    </div>
                    <h1 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Remedy Hub</h1>
                </div>
            </header>

            <main style={{ flex: 1, maxWidth: 800, margin: '0 auto', width: '100%', padding: '2rem 1.5rem', position: 'relative', zIndex: 1 }}>
                
                {error || !remediation ? (
                    <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                        <AlertCircle size={40} color="var(--warning)" style={{ margin: '0 auto 1.5rem' }} />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Material Not Ready</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            Your educator hasn&apos;t generated the recap material for this session yet. Please check back in a few minutes!
                        </p>
                        <Link href={`/join/${sessionId}`} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            Go Back to Live Session
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* Summary Section */}
                        <div className="glass-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366F1, #818CF8)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
                                    <BookOpen size={18} color="#fff" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI-Generated Recap</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{topic || 'Core Session Principles'}</div>
                                </div>
                            </div>

                            <div style={{ 
                                whiteSpace: 'pre-wrap', 
                                color: 'var(--text-secondary)', 
                                fontSize: '0.95rem', 
                                lineHeight: 1.7, 
                                fontFamily: 'var(--font-body)',
                                letterSpacing: '-0.01em'
                            }}>
                                {remediation}
                            </div>
                        </div>

                        {/* Asynchronous Feedback Loop */}
                        <div id="doubt-form" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.03))', pointerEvents: 'none' }} />
                            
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                                    <MessageSquare size={18} color="var(--accent-soft)" />
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Still have doubts?</h3>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                                    If this recap didn&apos;t answer your specific question, send it directly to your teacher. They value your understanding.
                                </p>

                                {submitted ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(34,197,94,0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius)', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600, animation: 'enter-fade 0.3s ease-out' }}>
                                        <CheckCircle size={18} />
                                        Your specific doubt has been sent to the teacher!
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <textarea 
                                            value={doubt}
                                            onChange={(e) => setDoubt(e.target.value)}
                                            placeholder="What exactly is still unclear? (e.g., 'I still don't get why the derivative of x^2 is 2x')"
                                            style={{
                                                width: '100%',
                                                background: 'var(--bg-base)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 12,
                                                padding: '1rem',
                                                fontSize: '0.85rem',
                                                fontFamily: 'inherit',
                                                resize: 'none',
                                                minHeight: 100,
                                                color: 'var(--text-primary)',
                                                outline: 'none',
                                                transition: 'border-color 0.2s',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                                            onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                                        />
                                        <button 
                                            onClick={handleDoubtSubmit}
                                            disabled={!doubt.trim() || submitting}
                                            style={{
                                                alignSelf: 'flex-end',
                                                padding: '0.75rem 1.5rem',
                                                background: 'var(--accent)',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 10,
                                                fontSize: '0.85rem',
                                                fontWeight: 700,
                                                cursor: (!doubt.trim() || submitting) ? 'default' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                opacity: (!doubt.trim() || submitting) ? 0.6 : 1,
                                                transition: 'all 0.2s',
                                                boxShadow: '0 4px 12px rgba(99,102,241,0.2)'
                                            }}
                                        >
                                            {submitting ? 'Sending...' : <><Send size={14} /> Send Doubt</>}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer branding */}
                        <div style={{ textAlign: 'center', padding: '2rem 0', opacity: 0.5 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                                <div style={{ width: 16, height: 16, background: 'var(--accent)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Sparkles size={8} color="#fff" fill="#fff" />
                                </div>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '-0.03em' }}>EduPulse</span>
                            </div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>PEDAGOGICAL INTELLIGENCE LABS © 2026</div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    )
}
