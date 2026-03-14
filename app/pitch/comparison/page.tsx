'use client'

import { Check, X, Shield, ArrowLeft, Info, Zap } from 'lucide-react'
import Link from 'next/link'
import { FadeIn, StaggerContainer, StaggerItem, ScaleHover } from '@/components/Animated'

const ROWS = [
    {
        feature: 'Feedback Mechanism',
        sub: 'How feedback is collected',
        ep: { text: 'Passive & Real-time', bold: true },
        polling: { text: 'Active (Must ask Qs)' },
        lms: { text: 'Post-event surveys' },
    },
    {
        feature: 'Identity Safety',
        sub: 'Protection for shy students',
        ep: { check: true, text: '100% Anonymous' },
        polling: { check: true, text: 'Anonymous' },
        lms: { cross: true, text: 'Identity-linked' },
    },
    {
        feature: 'Time-Series Context',
        sub: 'Exact confusion pinpointing',
        ep: { check: true, text: 'Timeline Graphing' },
        polling: { cross: true, text: 'Static aggregates' },
        lms: { cross: true, text: 'None' },
    },
    {
        feature: 'Business ROI',
        sub: 'Value to the institution',
        ep: { check: true, text: 'Dropout Prevention' },
        polling: { cross: true, text: 'None' },
        lms: { check: true, text: 'Grade tracking' },
    },
    {
        feature: 'Spam Prevention',
        sub: 'Protecting class signal quality',
        ep: { check: true, text: '60s Cooldowns' },
        polling: { cross: true, text: 'Open submission' },
        lms: { text: 'N/A' },
    },
    {
        feature: 'Student Setup',
        sub: 'Friction to participate',
        ep: { check: true, text: 'Phone camera → tap' },
        polling: { text: 'Requires account' },
        lms: { cross: true, text: 'Full install' },
    },
]

function Cell({ data }: { data: { text?: string; bold?: boolean; check?: boolean; cross?: boolean } }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            {data.check && (
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--success-dim)', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={13} color="var(--success)" strokeWidth={3} />
                </div>
            )}
            {data.cross && (
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={13} color="var(--danger)" strokeWidth={3} />
                </div>
            )}
            {data.text && (
                <span style={{ fontSize: '0.75rem', fontWeight: data.bold ? 700 : 500, color: data.bold ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center' }}>
                    {data.text}
                </span>
            )}
        </div>
    )
}

export default function CompetitiveComparison() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>
            {/* Ambient glows */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-10%', right: '0%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 70%)', animation: 'orb-drift 22s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', bottom: '-10%', left: '0%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(79,70,229,0.03) 0%, transparent 70%)', animation: 'orb-drift 28s ease-in-out infinite reverse' }} />
            </div>

            {/* Header */}
            <header style={{ borderBottom: '1px solid var(--border)', height: 56, display: 'flex', alignItems: 'center', padding: '0 1.75rem', gap: '0.75rem', backdropFilter: 'blur(24px)', position: 'sticky', top: 0, zIndex: 10, background: 'var(--glass-bg)' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.857rem', fontWeight: 500, transition: 'color 0.15s' }}>
                    <ArrowLeft size={14} /> Home
                </Link>
                <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: 22, height: 22, background: '#0F172A', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={11} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Moat Analysis</span>
                </div>
                <div style={{ flex: 1 }} />
                <div className="section-label" style={{ opacity: 0.8 }}>Institutional Pitch Kit</div>
            </header>

            <main style={{ maxWidth: 1060, margin: '0 auto', padding: '3.5rem 1.75rem', position: 'relative', zIndex: 1 }}>

                {/* Hero */}
                <FadeIn style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 100, marginBottom: '1.25rem' }}>
                        <Shield size={11} color="var(--accent-soft)" />
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Competitive Positioning</span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.045em', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                        We're playing a <span style={{ color: 'var(--accent-soft)' }}>different game entirely.</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, maxWidth: 560, margin: '0 auto' }}>
                        Mentimeter and Poll Everywhere are event tools. EduPulse is an institutional learning intelligence platform built to protect revenue and guarantee outcomes.
                    </p>
                </FadeIn>

                {/* Table */}
                <FadeIn delay={0.2} className="glass-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <div style={{ minWidth: 600 }}>
                            {/* Column headers */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                                <div style={{ padding: '1.25rem 1.5rem' }}>
                                    <span className="section-label">Core Capability</span>
                                </div>
                                {/* EduPulse header — highlighted */}
                                <div style={{ padding: '1.25rem 1rem', borderLeft: '1px solid var(--border)', background: 'var(--bg-elevated)', textAlign: 'center' }}>
                                    <ScaleHover scale={1.05}>
                                        <div style={{ width: 36, height: 36, background: '#0F172A', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                                            <Zap size={16} color="#fff" fill="#fff" />
                                        </div>
                                    </ScaleHover>
                                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>EduPulse</div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-soft)', marginTop: '0.25rem' }}>INSTITUTIONAL PLATFORM</div>
                                </div>
                                {[
                                    { title: 'Polling Tools', sub: 'Mentimeter, Slido' },
                                    { title: 'Traditional LMS', sub: 'Blackboard, Canvas' },
                                ].map(col => (
                                    <div key={col.title} style={{ padding: '1.25rem 1rem', borderLeft: '1px solid var(--border)', textAlign: 'center' }}>
                                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-secondary)', letterSpacing: '-0.015em' }}>{col.title}</div>
                                        <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>{col.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Rows */}
                            <StaggerContainer>
                                {ROWS.map((row, i) => (
                                    <StaggerItem key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: i < ROWS.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
                                        <div style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>{row.feature}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{row.sub}</div>
                                        </div>
                                        {/* EduPulse col — highlighted */}
                                        <div style={{ padding: '1rem', borderLeft: '1px solid var(--glass-border)', background: 'rgba(124,92,246,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Cell data={row.ep} />
                                        </div>
                                        <div style={{ padding: '1rem', borderLeft: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Cell data={row.polling} />
                                        </div>
                                        <div style={{ padding: '1rem', borderLeft: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Cell data={row.lms} />
                                        </div>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        </div>
                    </div>
                </FadeIn>

                {/* Judge callout */}
                <FadeIn delay={0.4} className="glass-card" style={{ padding: '1.75rem', border: '1px solid var(--border)', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-md)', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Info size={16} color="var(--accent-soft)" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>The "So What?" for Judges</div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 780 }}>
                            Polling tools are B2C products bought by individual teachers for ₹800/month. EduPulse is a B2B platform bought by the Dean for ₹8,000,000/year to protect ₹2.1 Crore in at-risk tuition revenue.{' '}
                            <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>We don't sell quizzes. We sell institutional retention.</strong>
                        </p>
                    </div>
                </FadeIn>
            </main>
        </div>
    )
}
