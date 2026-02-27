'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowRight, Plus, X, Link as LinkIcon, Zap, GripVertical, Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { startSession } from '@/app/actions/signals'
import { generateAgenda } from '@/app/actions/ai'

export default function EducatorStart() {
    const [sessionId, setSessionId] = useState('')
    const [joinUrl, setJoinUrl] = useState('')
    const [agendaInput, setAgendaInput] = useState('')
    const [agenda, setAgenda] = useState<string[]>([])
    const [dragIdx, setDragIdx] = useState<number | null>(null)
    const [copyDone, setCopyDone] = useState(false)
    const [generatingAgenda, setGeneratingAgenda] = useState(false)
    const [agendaError, setAgendaError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const pin = Math.floor(1000 + Math.random() * 9000).toString()
        const base = typeof window !== 'undefined' ? window.location.origin : 'https://edu-pulse-xi.vercel.app'
        setSessionId(pin)
        setJoinUrl(`${base}/join/${pin}`)
    }, [])

    const addTopic = () => {
        const t = agendaInput.trim()
        if (!t) return
        setAgenda(prev => [...prev, t])
        setAgendaInput('')
    }

    const removeTopic = (i: number) => setAgenda(prev => prev.filter((_, idx) => idx !== i))

    const handleGenerateAgenda = async () => {
        const t = agendaInput.trim()
        if (!t) {
            setAgendaError('Please enter a broad topic in the box first (e.g., "Photosynthesis")')
            setTimeout(() => setAgendaError(null), 3000)
            return
        }
        setGeneratingAgenda(true)
        setAgendaError(null)

        try {
            const res = await generateAgenda(t)
            if (res.success && res.data) {
                setAgenda(prev => [...prev, ...res.data!])
                setAgendaInput('')
            } else {
                setAgendaError(res.error || 'Failed to generate agenda.')
                setTimeout(() => setAgendaError(null), 3000)
            }
        } catch (e: any) {
            setAgendaError('Error connecting to AI.')
            setTimeout(() => setAgendaError(null), 3000)
        } finally {
            setGeneratingAgenda(false)
        }
    }

    const [starting, setStarting] = useState(false)
    const [startError, setStartError] = useState<string | null>(null)

    const handleStart = async () => {
        if (!sessionId) return
        setStarting(true)
        setStartError(null)
        const res = await startSession(sessionId)
        if (!res.success) {
            setStartError(res.error || 'Failed to register session. Check your connection.')
            setStarting(false)
            return
        }
        const agendaParam = encodeURIComponent(JSON.stringify(agenda))
        router.push(`/educator/dashboard?session=${sessionId}&agenda=${agendaParam}`)
    }

    const copyUrl = () => {
        navigator.clipboard.writeText(joinUrl).then(() => {
            setCopyDone(true)
            setTimeout(() => setCopyDone(false), 1800)
        })
    }

    // Drag-to-reorder (HTML5 Drag API, no library)
    const handleDragStart = (i: number) => setDragIdx(i)
    const handleDragOver = (e: React.DragEvent, i: number) => {
        e.preventDefault()
        if (dragIdx === null || dragIdx === i) return
        const next = [...agenda]
        const [moved] = next.splice(dragIdx, 1)
        next.splice(i, 0, moved)
        setAgenda(next)
        setDragIdx(i)
    }
    const handleDragEnd = () => setDragIdx(null)

    const displayUrl = joinUrl
        ? `${new URL(joinUrl).hostname}/join/${sessionId}`
        : `edupulse.app/join/${sessionId}`

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>

            {/* Ambient orbs */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '60%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.10) 0%, transparent 70%)', animation: 'orb-drift 22s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '50%', background: 'radial-gradient(ellipse, rgba(79,70,229,0.07) 0%, transparent 70%)', animation: 'orb-drift 28s ease-in-out infinite reverse' }} />
            </div>

            {/* Topbar */}
            <header style={{ borderBottom: '1px solid var(--border)', height: 56, display: 'flex', alignItems: 'center', padding: '0 1.75rem', gap: '0.75rem', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(7,7,12,0.85)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={11} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.03em' }}>EduPulse</span>
                </div>
                <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                <span style={{ fontSize: '0.857rem', color: 'var(--text-secondary)', fontWeight: 500 }}>New Session</span>
                <div style={{ flex: 1 }} />
            </header>

            <div className="setup-layout" style={{ position: 'relative', zIndex: 1, maxWidth: 1080, margin: '0 auto', padding: '4rem 1.75rem', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '3.5rem', alignItems: 'start' }}>

                {/* ── LEFT: Session Setup ───────────────────────────── */}
                <div style={{ position: 'relative' }}>

                    {/* Decorative oversize PIN behind form */}
                    {sessionId && (
                        <div
                            aria-hidden="true"
                            style={{
                                position: 'absolute',
                                top: '-1.5rem',
                                left: '-1rem',
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(80px, 12vw, 128px)',
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                color: 'var(--border)',
                                lineHeight: 1,
                                pointerEvents: 'none',
                                userSelect: 'none',
                                zIndex: 0,
                            }}
                        >
                            {sessionId}
                        </div>
                    )}

                    {/* Content above decorative PIN */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        {/* Header */}
                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 100, marginBottom: '1.25rem' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite' }} />
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-soft)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Ready to launch</span>
                            </div>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1.1, marginBottom: '0.75rem' }}>
                                Start your <span className="gradient-text">class session.</span>
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 380 }}>
                                Add your lecture topics below. Project the QR code on the classroom screen and begin teaching.
                            </p>
                        </div>

                        {/* Agenda input */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                Lecture Agenda <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '0.72rem' }}>— optional but recommended</span>
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem' }}>
                                <input
                                    className="lx-input"
                                    value={agendaInput}
                                    onChange={e => setAgendaInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addTopic()}
                                    placeholder="e.g. Introduction to Recursion"
                                    disabled={generatingAgenda}
                                />
                                <button disabled={generatingAgenda} onClick={addTopic} className="btn-ghost btn-sm" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Plus size={13} /> Add
                                </button>
                                <button
                                    disabled={generatingAgenda}
                                    onClick={handleGenerateAgenda}
                                    className="btn-sm"
                                    style={{
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem',
                                        background: 'rgba(99,102,241,0.1)',
                                        color: 'var(--accent)',
                                        border: '1px solid rgba(99,102,241,0.2)',
                                        borderRadius: 'var(--radius)',
                                        fontWeight: 600,
                                        cursor: generatingAgenda ? 'wait' : 'pointer'
                                    }}
                                >
                                    {generatingAgenda ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={13} />}
                                    {generatingAgenda ? 'Thinking...' : 'AI Auto-Fill'}
                                </button>
                            </div>
                            {agendaError && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginBottom: '0.875rem', marginTop: '-0.375rem' }}>
                                    {agendaError}
                                </div>
                            )}

                            {/* Agenda list */}
                            <div className="glass-card" style={{ padding: 0, overflow: 'hidden', minHeight: agenda.length === 0 ? 80 : 'auto' }}>
                                {agenda.length === 0 ? (
                                    <div style={{ padding: '1.375rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.8rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                                        No topics yet — you can also annotate live<br />during the session.
                                    </div>
                                ) : agenda.map((topic, i) => (
                                    <div
                                        key={i}
                                        draggable
                                        onDragStart={() => handleDragStart(i)}
                                        onDragOver={e => handleDragOver(e, i)}
                                        onDragEnd={handleDragEnd}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem',
                                            borderBottom: i < agenda.length - 1 ? '1px solid var(--border)' : 'none',
                                            background: dragIdx === i ? 'var(--bg-hover)' : 'transparent',
                                            transition: 'background 0.15s',
                                            cursor: 'grab',
                                        }}
                                    >
                                        <GripVertical size={13} color="var(--text-tertiary)" style={{ flexShrink: 0, cursor: 'grab' }} />
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-soft)', fontVariantNumeric: 'tabular-nums', width: 20, textAlign: 'right', flexShrink: 0 }}>#{i + 1}</span>
                                        <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{topic}</span>
                                        <button onClick={() => removeTopic(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: '0.125rem', transition: 'color 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}>
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Launch CTA */}
                        {startError && (
                            <div style={{ padding: '0.75rem', background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius)', fontSize: '0.8rem', color: 'var(--danger)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                                {startError}
                            </div>
                        )}
                        <button onClick={handleStart} disabled={starting || !sessionId} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', borderRadius: 12, opacity: starting ? 0.7 : 1 }}>
                            {starting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Registering session…</> : <>Initialize Dashboard <ArrowRight size={16} /></>}
                        </button>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '0.75rem' }}>
                            Students can join as soon as the session starts.
                        </p>
                    </div>
                </div>

                {/* ── RIGHT: QR Card (sticky) ───────────────────────── */}
                <div style={{ position: 'sticky', top: '5.5rem' }}>
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 64px -16px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.06)' }}>

                        {/* PIN section */}
                        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(79,70,229,0.04))' }}>
                            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Session PIN</div>
                            <div className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 700, letterSpacing: '0.2em', lineHeight: 1 }}>
                                {sessionId || '——'}
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                                Students can also type this at /join
                            </div>
                        </div>

                        {/* QR code — white background */}
                        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', background: '#FFFFFF' }}>
                            {joinUrl && (
                                <QRCodeSVG value={joinUrl} size={200} fgColor="#09090E" bgColor="#ffffff" level="H" marginSize={1} />
                            )}
                        </div>

                        {/* URL strip */}
                        <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LinkIcon size={11} color="var(--text-tertiary)" />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayUrl}</span>
                            <button onClick={copyUrl} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: copyDone ? 'var(--success)' : 'var(--accent-soft)', padding: '0.2rem 0.5rem', borderRadius: 4, transition: 'color 0.15s' }}>
                                {copyDone ? 'Copied!' : 'Copy'}
                            </button>
                        </div>

                        {/* Agenda count badge */}
                        {agenda.length > 0 && (
                            <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border)', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-soft)' }}>
                                    {agenda.length} topic{agenda.length > 1 ? 's' : ''} queued — ready to launch
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Tips grid */}
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--glass-bg)', border: '1px solid var(--border)', borderRadius: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                        {[
                            'Project this on the classroom display',
                            'Students scan → one tap → anonymous',
                            'Dashboard updates every 3 seconds',
                            'No student accounts required',
                        ].map(tip => (
                            <div key={tip} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem', fontSize: '0.78rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', marginTop: 4, flexShrink: 0 }} />
                                {tip}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
