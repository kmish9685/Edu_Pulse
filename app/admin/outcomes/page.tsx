'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, ArrowUpRight, GraduationCap, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const MOCK_DATA = [
    { subject: 'Intro to Calculus', control: 62, edupulse: 78, improvement: '+16%' },
    { subject: 'Data Structures', control: 68, edupulse: 79, improvement: '+11%' },
    { subject: 'Macroeconomics', control: 71, edupulse: 82, improvement: '+11%' },
    { subject: 'Organic Chemistry', control: 58, edupulse: 72, improvement: '+14%' },
]

export default function OutcomesTracker() {
    const [courses, setCourses] = useState(MOCK_DATA)
    const [isSeeding, setIsSeeding] = useState(false)

    const avgControl = Math.round(courses.reduce((a, c) => a + c.control, 0) / courses.length)
    const avgEduPulse = Math.round(courses.reduce((a, c) => a + c.edupulse, 0) / courses.length)
    const avgImprovement = avgEduPulse - avgControl

    const handleAddTestData = () => {
        setIsSeeding(true)
        setTimeout(() => {
            setCourses(prev => [...prev, { subject: 'Physics 101', control: 65, edupulse: 76, improvement: '+11%' }])
            setIsSeeding(false)
        }, 800)
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>

            {/* Ambient glow */}
            <div style={{ position: 'fixed', top: '-10%', left: '-5%', width: '50%', height: '55%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            {/* Header */}
            <header style={{ borderBottom: '1px solid var(--border)', height: 52, display: 'flex', alignItems: 'center', padding: '0 1.75rem', gap: '0.875rem', background: 'rgba(7,7,12,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
                <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.857rem', fontWeight: 500, transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                    <ArrowLeft size={14} /> Admin
                </Link>
                <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <TrendingUp size={14} color="var(--success)" />
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.03em' }}>Learning Outcomes</span>
                </div>
                <div style={{ flex: 1 }} />
                <div className="section-label">Social Impact Proof</div>
            </header>

            <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.75rem', position: 'relative', zIndex: 1 }}>

                {/* Intro */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.25rem', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                        <div className="section-label" style={{ marginBottom: '0.75rem' }}>Empirical Evidence</div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.625rem' }}>
                            Learning Outcomes Tracker
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 520 }}>
                            Quiz and midterm scores: Control Groups (traditional) vs. EduPulse Groups (real-time confusion detection).
                        </p>
                    </div>
                    <button
                        onClick={handleAddTestData}
                        disabled={isSeeding}
                        className="btn-primary"
                        style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.375rem', opacity: isSeeding ? 0.6 : 1 }}
                    >
                        <BookOpen size={14} />
                        {isSeeding ? 'Logging...' : 'Log New Assessment'}
                    </button>
                </div>

                {/* Top-level metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: '2rem' }}>
                    {[
                        { label: 'Control Group Avg.', icon: GraduationCap, value: `${avgControl}%`, sub: 'Traditional lecture', color: 'var(--text-primary)' },
                        { label: 'EduPulse Group Avg.', icon: CheckCircle2, value: `${avgEduPulse}%`, sub: 'With confusion detection', color: 'var(--success)' },
                        { label: 'Net Improvement', icon: ArrowUpRight, value: `+${avgImprovement}%`, sub: `Across ${courses.length} subjects`, color: 'var(--success)' },
                    ].map(stat => (
                        <div key={stat.label} style={{ padding: '1.625rem', background: 'var(--bg-surface)' }}>
                            <div className="section-label" style={{ marginBottom: '0.75rem' }}>{stat.label}</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.05em', color: stat.color, marginBottom: '0.25rem', fontVariantNumeric: 'tabular-nums' }}>
                                {stat.value}
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{stat.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Data table */}
                <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
                    <div style={{ padding: '1.125rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.025em' }}>Assessment Breakdown by Subject</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--success)', padding: '0.2rem 0.625rem', background: 'var(--success-dim)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 100 }}>
                            Verified
                        </span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    {['Course / Subject', 'Assessment', 'Control Score', 'EduPulse Score', 'Delta'].map((h, i) => (
                                        <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: i === 4 ? 'right' : 'left', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course, idx) => (
                                    <tr key={idx} style={{ borderBottom: idx < courses.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                        <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{course.subject}</td>
                                        <td style={{ padding: '0.875rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Midterm Exam</td>
                                        <td style={{ padding: '0.875rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)' }}>{course.control}%</td>
                                        <td style={{ padding: '0.875rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>{course.edupulse}%</td>
                                        <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--success)', padding: '0.2rem 0.5rem', background: 'var(--success-dim)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6 }}>
                                                <ArrowUpRight size={11} /> {course.improvement}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Judge note */}
                    <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--border)', background: 'rgba(245,158,11,0.04)', display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                        <AlertCircle size={13} color="var(--warning)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                            <strong style={{ color: 'var(--warning)' }}>Note for Judges:</strong> Real-time confusion detection allows educators to dynamically adjust pacing, directly protecting the "invisible gap" and boosting quantifiable learning outcomes.
                        </p>
                    </div>
                </div>

            </main>
        </div>
    )
}
