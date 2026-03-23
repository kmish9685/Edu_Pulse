'use client'

import { useState, useEffect, use } from 'react'
import { getSessionRemediation, submitSignal } from '@/app/actions/signals_fix'
import { Sparkles, Loader2, BookOpen, AlertCircle, MessageSquare, Send, CheckCircle, Brain, Lightbulb, HelpCircle, ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'

// ── Parse AI text into structured sections ───────────────────────────────────
function parseRemediationSections(text: string) {
    const sections: Record<string, string> = {}
    const markers = [
        { key: 'summary',   emoji: '📚' },
        { key: 'confused',  emoji: '🔴' },
        { key: 'review',    emoji: '📖' },
        { key: 'analogies', emoji: '💡' },
        { key: 'resources', emoji: '🎥' },
        { key: 'questions', emoji: '❓' },
        { key: 'recall',    emoji: '🧠' },
    ]
    let remaining = text
    for (let i = 0; i < markers.length; i++) {
        const start = remaining.indexOf(markers[i].emoji)
        if (start === -1) continue
        const nextEmoji = markers.slice(i + 1).map(m => remaining.indexOf(m.emoji, start + 1)).find(idx => idx > start)
        const end = nextEmoji !== undefined && nextEmoji > -1 ? nextEmoji : remaining.length
        sections[markers[i].key] = remaining.slice(start, end).trim()
    }
    return sections
}

export default function StudentStudyPack({ params }: { params: Promise<{ id: string }> }) {
    const { id: sessionId } = use(params)

    const [remediation, setRemediation] = useState<string | null>(null)
    const [topic, setTopic] = useState<string | null>(null)
    const [startedAt, setStartedAt] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [doubt, setDoubt] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        async function fetchRemedy() {
            setLoading(true)
            const res = await getSessionRemediation(sessionId)
            if (res.success && res.data?.remediation_material) {
                setRemediation(res.data.remediation_material)
                setTopic(res.data.current_topic)
                setStartedAt(res.data.started_at)
            } else {
                setError('Study pack not ready yet.')
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
            setTimeout(() => setSubmitted(false), 4000)
        }
        setSubmitting(false)
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <Loader2 size={32} color="var(--accent)" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>LOADING STUDY PACK...</span>
            </div>
        )
    }

    const sections = remediation ? parseRemediationSections(remediation) : {}

    const SectionCard = ({ icon, label, accent, children }: { icon: React.ReactNode, label: string, accent: string, children: React.ReactNode }) => (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: accent, borderRadius: '3px 0 0 3px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 36, height: 36, background: `${accent}18`, border: `1px solid ${accent}30`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {icon}
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{label}</span>
            </div>
            {children}
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-body)', position: 'relative', overflowX: 'hidden' }}>

            {/* Ambient glow */}
            <div style={{ position: 'fixed', top: '-15%', right: '-5%', width: '55%', height: '55%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Header */}
            <header style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', background: 'rgba(7,7,12,0.85)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 10 }}>
                <Link href={`/join/${sessionId}`} style={{ color: 'var(--text-tertiary)', display: 'flex', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}>
                    <ArrowLeft size={20} />
                </Link>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-soft)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            {topic || 'Session Study Pack'}
                        </span>
                        <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-tertiary)' }} />
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                            {startedAt ? new Date(startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Post-Session'}
                        </span>
                    </div>
                    <h1 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>📚 Your Study Pack</h1>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', background: 'rgba(99,102,241,0.08)', border: '1px solid var(--border-accent)', borderRadius: 100 }}>
                    <Sparkles size={11} color="var(--accent-soft)" />
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-soft)', letterSpacing: '0.06em' }}>AI-GENERATED</span>
                </div>
            </header>

            <main style={{ maxWidth: 760, margin: '0 auto', padding: '2.5rem 1.5rem 4rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 1 }}>

                {error || !remediation ? (
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '3rem 2rem', textAlign: 'center' }}>
                        <AlertCircle size={40} color="var(--warning)" style={{ margin: '0 auto 1.5rem' }} />
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Study Pack Not Ready Yet</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: 380, margin: '0 auto 1.5rem' }}>
                            Your teacher is generating the study material. Check back in a minute, or ask your teacher to share the session PDF in the class group.
                        </p>
                        <Link href={`/join/${sessionId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--accent)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
                            Go Back
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Hero summary strip */}
                        {sections.summary && (
                            <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(79,70,229,0.05))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-xl)', padding: '1.5rem 2rem' }}>
                                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, lineHeight: 1.6 }}>
                                    {sections.summary}
                                </div>
                            </div>
                        )}

                        {/* Most confused topics */}
                        {sections.confused && (
                            <SectionCard icon={<span style={{ fontSize: '1rem' }}>🔴</span>} label="Most Confused Topics" accent="#EF4444">
                                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                                    {sections.confused.replace('🔴 Most confused topics:', '').trim()}
                                </div>
                            </SectionCard>
                        )}

                        {/* Key review points */}
                        {sections.review && (
                            <SectionCard icon={<BookOpen size={18} color="#6366F1" />} label="Key Points to Review" accent="#6366F1">
                                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                                    {sections.review.replace('📖 Key points to review:', '').trim()}
                                </div>
                            </SectionCard>
                        )}

                        {/* Concept Analogies */}
                        {sections.analogies && (
                            <SectionCard icon={<Lightbulb size={18} color="#F59E0B" />} label="Concept Analogies — Real-World Examples" accent="#F59E0B">
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                                    These everyday examples are designed to give you an <em>"aha!"</em> moment for each confused topic.
                                </p>
                                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                                    {sections.analogies.replace('💡 Concept Analogies (Real-World Examples):', '').trim()}
                                </div>
                            </SectionCard>
                        )}

                        {/* Resources */}
                        {sections.resources && (
                            <SectionCard icon={<FileText size={18} color="#10B981" />} label="Helpful Resources" accent="#10B981">
                                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                                    {sections.resources.replace('🎥 Helpful resources:', '').trim()}
                                </div>
                            </SectionCard>
                        )}

                        {/* Practice Questions */}
                        {sections.questions && (
                            <SectionCard icon={<HelpCircle size={18} color="#8B5CF6" />} label="Practice Questions + Answers" accent="#8B5CF6">
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                                    Try answering each question before reading the answer. Honest self-testing is how you actually learn.
                                </p>
                                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.9, fontFamily: 'var(--font-body)' }}>
                                    {sections.questions.replace('❓ Practice questions:', '').trim()}
                                </div>
                            </SectionCard>
                        )}

                        {/* Active Recall Challenge */}
                        {sections.recall && (
                            <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.04))', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-xl)', padding: '1.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <Brain size={22} color="#10B981" />
                                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#10B981' }}>ACTIVE RECALL CHALLENGE</span>
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                                    {sections.recall.replace('🧠 Try to explain it:', '').trim()}
                                </div>
                            </div>
                        )}

                        {/* Fallback: show raw text if parsing didn't work */}
                        {!sections.summary && remediation && (
                            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
                                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                                    {remediation}
                                </div>
                            </div>
                        )}

                        {/* Still Have Doubts */}
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-xl)', padding: '1.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <MessageSquare size={18} color="var(--accent-soft)" />
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Still have a specific doubt?</h3>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                                If the study pack didn&apos;t answer your question, send it to your teacher directly — anonymously.
                            </p>
                            {submitted ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(34,197,94,0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius)', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <CheckCircle size={18} />
                                    Sent! Your teacher will see it in their session history.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <textarea
                                        value={doubt}
                                        onChange={(e) => setDoubt(e.target.value)}
                                        placeholder="e.g. 'I still don't get why the formula has a squared term...'"
                                        style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem', fontSize: '0.85rem', fontFamily: 'inherit', resize: 'none', minHeight: 90, color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                                        onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                                        onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                                    />
                                    <button
                                        onClick={handleDoubtSubmit}
                                        disabled={!doubt.trim() || submitting}
                                        style={{ alignSelf: 'flex-end', padding: '0.75rem 1.5rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, cursor: (!doubt.trim() || submitting) ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: (!doubt.trim() || submitting) ? 0.6 : 1, transition: 'all 0.2s' }}
                                    >
                                        {submitting ? 'Sending...' : <><Send size={14} /> Send Doubt</>}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{ textAlign: 'center', padding: '1rem 0', opacity: 0.45 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                                <div style={{ width: 16, height: 16, background: 'var(--accent)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Sparkles size={8} color="#fff" fill="#fff" />
                                </div>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem' }}>EduPulse</span>
                            </div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>100% ANONYMOUS · PEDAGOGICAL INTELLIGENCE LABS © 2026</div>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
