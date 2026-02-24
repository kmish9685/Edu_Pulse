'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowRight, Plus, X, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function EducatorStart() {
    const [sessionId, setSessionId] = useState('')
    const [joinUrl, setJoinUrl] = useState('')
    const [agendaInput, setAgendaInput] = useState('')
    const [agenda, setAgenda] = useState<string[]>([])
    const router = useRouter()

    useEffect(() => {
        const pin = Math.floor(1000 + Math.random() * 9000).toString()
        setSessionId(pin)
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://edupulse.com'
        setJoinUrl(`${baseUrl}/join/${pin}`)
    }, [])

    const addTopic = () => {
        const t = agendaInput.trim()
        if (!t) return
        setAgenda(prev => [...prev, t])
        setAgendaInput('')
    }

    const handleStart = () => {
        const agendaParam = encodeURIComponent(JSON.stringify(agenda))
        router.push(`/educator/dashboard?session=${sessionId}&agenda=${agendaParam}`)
    }

    const displayUrl = joinUrl ? `${new URL(joinUrl).hostname}/join/${sessionId}` : `edupulse.com/join/${sessionId}`

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>

            {/* Topbar */}
            <header style={{ borderBottom: '1px solid var(--border)', height: 52, display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.02em' }}>EduPulse</span>
                <span style={{ color: 'var(--border)', fontSize: '1rem' }}>/</span>
                <span style={{ fontSize: '0.857rem', color: 'var(--text-secondary)' }}>New Session</span>
                <div style={{ flex: 1 }} />
                <Link href="/admin" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textDecoration: 'none' }}>← Admin</Link>
            </header>

            {/* Content */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', maxWidth: 960, margin: '0 auto', width: '100%', padding: '3rem 1.5rem', gap: '3rem', alignItems: 'start' }}>

                {/* Left: Setup */}
                <div>
                    <h1 style={{ fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>Start a Class Session</h1>
                    <p style={{ fontSize: '0.857rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                        Add your lecture topics before class. During the session, advance them with a single tap — no typing while teaching.
                    </p>

                    {/* Agenda */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>
                            Lecture Agenda <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <input
                                className="lx-input"
                                value={agendaInput}
                                onChange={e => setAgendaInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addTopic()}
                                placeholder="e.g. Introduction to Recursion"
                            />
                            <button onClick={addTopic} className="lx-btn lx-btn-ghost" style={{ flexShrink: 0 }}>
                                <Plus size={14} /> Add
                            </button>
                        </div>

                        {agenda.length > 0 ? (
                            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                                {agenda.map((topic, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', borderBottom: i < agenda.length - 1 ? '1px solid var(--border)' : 'none', background: 'var(--bg-surface)' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', width: 20, flexShrink: 0 }}>#{i + 1}</span>
                                        <span style={{ flex: 1, fontSize: '0.857rem', color: 'var(--text-primary)', fontWeight: 500 }}>{topic}</span>
                                        <button onClick={() => setAgenda(prev => prev.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '0.25rem', display: 'flex' }}>
                                            <X size={13} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                                No topics yet — you can also annotate live during the session
                            </div>
                        )}
                    </div>

                    <button onClick={handleStart} className="lx-btn lx-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.9rem' }}>
                        Initialize Dashboard <ArrowRight size={15} />
                    </button>
                </div>

                {/* Right: QR Card */}
                <div style={{ position: 'sticky', top: '5rem' }}>
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                        {/* PIN */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Session PIN</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.15em', color: 'var(--text-primary)' }}>{sessionId}</div>
                        </div>
                        {/* QR */}
                        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', background: '#fff' }}>
                            {joinUrl && <QRCodeSVG value={joinUrl} size={200} fgColor="#09090E" bgColor="#ffffff" level="H" marginSize={1} />}
                        </div>
                        {/* URL */}
                        <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LinkIcon size={12} color="var(--text-tertiary)" />
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace', letterSpacing: '-0.01em' }}>{displayUrl}</span>
                        </div>
                        {/* Agenda loaded indicator */}
                        {agenda.length > 0 && (
                            <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border)', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                                <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>{agenda.length} topic{agenda.length > 1 ? 's' : ''} ready</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
