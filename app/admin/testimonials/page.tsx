'use client'

import { useState } from 'react'
import { Star, MessageSquareQuote, ThumbsUp, ArrowLeft, Filter, Quote } from 'lucide-react'
import Link from 'next/link'

const MOCK_TESTIMONIALS = [
    { id: 1, name: 'Dr. Sarah Jenkins', role: 'Professor of Computer Science', institution: 'Galgotias University', rating: 5, content: 'EduPulse completely changed how I teach Intro to Algorithms. I used to find out my students were lost only after they failed the midterm. Now I see the confusion spike on my dashboard in real-time — I explain the concept differently and watch the metric recover. It saves me hours of re-teaching.', date: '2 days ago', avatar: 'SJ' },
    { id: 2, name: 'Prof. Ananya Sharma', role: 'Head of Economics', institution: 'Delhi University', rating: 5, content: "The best part isn't even the real-time feedback — it's that it doesn't disrupt my flow. Students signal anonymously, so shy kids finally have a voice, and I don't have to stop my lecture to ask 'does everyone understand?' every 10 minutes.", date: '1 week ago', avatar: 'AS' },
    { id: 3, name: 'Dr. Rahul Verma', role: 'Asst. Professor, Engineering', institution: 'Amity University', rating: 4, content: "Our department's average scores have demonstrably improved since deploying EduPulse. We are catching the 'invisible learning gaps' that were causing our first-year dropouts. The ROI for the institution is undeniable.", date: '2 weeks ago', avatar: 'RV' },
]

const avatarColors = ['#7C5CF6', '#3ECF8E', '#F59E0B']

export default function TestimonialDashboard() {
    const [testimonials] = useState(MOCK_TESTIMONIALS)

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>

            {/* Orbs */}
            <div style={{ position: 'fixed', top: '-15%', right: '-5%', width: '50%', height: '55%', background: 'radial-gradient(ellipse, rgba(124,92,246,0.10) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            {/* Header */}
            <header style={{ borderBottom: '1px solid var(--glass-border)', height: 56, display: 'flex', alignItems: 'center', padding: '0 1.75rem', gap: '0.75rem', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10, background: 'var(--glass-bg)' }}>
                <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.857rem', fontWeight: 500 }}>
                    <ArrowLeft size={14} /> Admin
                </Link>
                <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MessageSquareQuote size={14} color="var(--accent-soft)" />
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.03em' }}>Educator Testimonials</span>
                </div>
                <div style={{ flex: 1 }} />
                <div className="section-label">Qualitative Proof</div>
            </header>

            <main style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.75rem', position: 'relative', zIndex: 1 }}>

                {/* Hero */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div className="section-label" style={{ marginBottom: '0.75rem' }}>Faculty Adoption & Feedback</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
                        Educators who use it <span className="gradient-text">never go back.</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
                        Real-world reviews from educators in the initial rollout. Qualitative proof of product-market fit.
                    </p>
                </div>

                {/* Metric row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--glass-border)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '2.5rem' }}>
                    {[
                        { label: 'Average Rating', value: '4.8 / 5', sub: 'Across pilot group' },
                        { label: 'Reviews Collected', value: '124', sub: 'Verified educators' },
                        { label: 'Would Recommend', value: '97%', sub: 'To their department' },
                    ].map((m, i) => (
                        <div key={i} style={{ padding: '1.75rem', background: 'var(--bg-surface)' }}>
                            <div className="section-label" style={{ marginBottom: '0.625rem' }}>{m.label}</div>
                            <div className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.05em', marginBottom: '0.25rem' }}>{m.value}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{m.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Action bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.025em' }}>All feedback ({testimonials.length})</div>
                    <div style={{ display: 'flex', gap: '0.625rem' }}>
                        <button className="btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Filter size={12} /> Filter</button>
                        <button className="btn-primary btn-sm">Copy Review Link</button>
                    </div>
                </div>

                {/* Testimonial cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {testimonials.map((t, idx) => (
                        <div key={t.id} className="glass-card" style={{ padding: '2rem' }}>
                            {/* Header row */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: avatarColors[idx % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.875rem', color: '#fff', flexShrink: 0, letterSpacing: '0.02em' }}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.025em', marginBottom: '0.15rem' }}>{t.name}</div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t.role} · {t.institution}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
                                    <div style={{ display: 'flex', gap: '0.2rem' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} color={i < t.rating ? '#F59E0B' : 'var(--text-tertiary)'} fill={i < t.rating ? '#F59E0B' : 'none'} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{t.date}</span>
                                </div>
                            </div>

                            {/* Quote */}
                            <div style={{ position: 'relative', paddingLeft: '1.25rem', marginBottom: '1rem' }}>
                                <Quote size={20} color="var(--accent)" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.5 }} />
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.75, fontStyle: 'italic' }}>{t.content}</p>
                            </div>

                            {/* Footer */}
                            <div style={{ paddingTop: '0.875rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end' }}>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-soft)', fontFamily: 'inherit' }}>
                                    <ThumbsUp size={12} /> Feature on landing page
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
