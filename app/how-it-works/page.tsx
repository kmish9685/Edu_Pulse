'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowLeft, QrCode, ScanLine, Activity, Brain, Shield, Clock, Tag, AlertTriangle, Users, ChevronRight, Zap } from 'lucide-react'

export default function HowItWorks() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-body)', position: 'relative', overflowX: 'hidden' }}>
            {/* Ambient backglow */}
            <div style={{ position: 'fixed', top: '-20%', right: '-10%', width: '70%', height: '70%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'fixed', bottom: '-10%', left: '-20%', width: '60%', height: '60%', background: 'radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

            {/* Nav */}
            <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, borderBottom: `1px solid ${scrolled ? 'var(--border-strong)' : 'transparent'}`, backdropFilter: scrolled ? 'blur(24px)' : 'none', background: scrolled ? 'rgba(7,7,12,0.85)' : 'transparent', transition: 'all 0.3s' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.75rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}>
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <Link href="/admin/login" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                        Start a Class Now
                    </Link>
                </div>
            </header>

            <main style={{ position: 'relative', zIndex: 1, padding: '120px 1.75rem 80px', maxWidth: 900, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div className="section-label" style={{ marginBottom: '1rem', display: 'inline-flex', padding: '0.4rem 1rem' }}>
                        Complete Walkthrough
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                        How EduPulse Works
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 640, margin: '0 auto' }}>
                        Exactly what happens from the moment an educator opens their laptop to the moment a confused student gets help — step by step, no theory.
                    </p>
                </div>

                {/* ─── FOR TEACHERS ─── */}
                <section style={{ marginBottom: '6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={22} color="#818CF8" />
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>The Teacher's Journey</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            {
                                step: "01", icon: QrCode, color: "#818CF8", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.2)",
                                title: "Open the Educator Launchpad",
                                detail: "Before class, the teacher goes to /admin/login on their laptop. Instantly, a unique 4-digit PIN and a large QR code are generated. No setup needed.",
                                action: "Project this screen on the classroom display. Students will see it as they walk in."
                            },
                            {
                                step: "02", icon: Tag, color: "#C084FC", bg: "rgba(192,132,252,0.1)", border: "rgba(192,132,252,0.2)",
                                title: "Tag Topics During the Lecture",
                                detail: "Using the Topic Annotation bar, type 'Live coding: Binary Search' and hit Enter as you teach. This drops a timestamp marker on the graph.",
                                action: "When you see a spike at 10:22 AM, you know it was during the Recursion explanation."
                            },
                            {
                                step: "03", icon: Activity, color: "#F472B6", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.2)",
                                title: "Watch the Intelligence Dashboard",
                                detail: "The timeline graph updates every 3s. When multiple students signal within 2 minutes, the graph spikes and the AI assistant changes to amber.",
                                action: "The color change alone is the signal. No need to stop and read long alerts mid-lecture."
                            },
                            {
                                step: "04", icon: Brain, color: "#34D399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)",
                                title: "Respond — Without Breaking Flow",
                                detail: "When alerted, make a choice: (A) Quick fix: rephrase and continue. (B) Log it: click 'Mark for Post-Class Review' to revisit later.",
                                action: "Never stop to ask 'does everyone understand?' and sit in awkward silence again."
                            }
                        ].map((item, i) => (
                            <div key={i} className="glass-card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', transition: 'all 0.3s' }}>
                                <div style={{ width: 56, height: 56, borderRadius: 16, background: item.bg, border: `1px solid ${item.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <item.icon size={26} color={item.color} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: item.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>STEP {item.step}</span>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{item.title}</h3>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>{item.detail}</p>
                                    <div style={{ padding: '0.875rem 1rem', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '1rem' }}>💡</span>
                                        <span>{item.action}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── FOR STUDENTS ─── */}
                <section style={{ marginBottom: '6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05))', border: '1px solid rgba(52,211,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ScanLine size={22} color="#34D399" />
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>The Student's Journey</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                        {[
                            { icon: ScanLine, title: "Scan the QR Code", desc: "Open your phone camera and point it at the QR code on the classroom screen. No app download needed." },
                            { icon: Shield, title: "100% Anonymous", desc: "The system never records your name, ID, or device. Shy students signal exactly as often as confident ones." },
                            { icon: Zap, title: "Tap Your Feeling", desc: "Two buttons: 'I'm Confused' and 'Too Fast'. One tap. Your signal hits the dashboard within 1 second." },
                            { icon: Clock, title: "60-Second Cooldown", desc: "After sending a signal, you must wait 60s before sending another. This prevents spam automatically." },
                        ].map((item, i) => (
                            <div key={i} className="glass-card" style={{ padding: '1.75rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-base)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                    <item.icon size={20} color="var(--text-secondary)" />
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{item.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── FAQ ─── */}
                <section style={{ marginBottom: '6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))', border: '1px solid rgba(251,191,36,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertTriangle size={22} color="#FBBF24" />
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>Every Concern, Answered</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {[
                            { q: "Does this give teachers extra work hours?", a: "No. EduPulse is designed to eliminate re-teaching time. Because you catch confusion during the lecture, you don't have to revisit it next week." },
                            { q: "What if only ONE shy student is lost?", a: "Their signal is logged but does NOT trigger a class-wide alert. After class, view the log and send them a supplementary resource." },
                            { q: "What if a student tries to spam the button?", a: "A hardware-level 60-second cooldown is enforced. Even if they clear storage, the AI filters isolated noise automatically." },
                            { q: "Who owns the classroom data?", a: "The institution owns all data. It is never shared with third parties. Responses are cryptographically anonymized at submission." }
                        ].map((item, i) => (
                            <details key={i} className="glass-card" style={{ padding: '1.5rem', borderRadius: 16, cursor: 'pointer' }}>
                                <summary style={{ listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', outline: 'none' }}>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.q}</span>
                                    <ChevronRight size={18} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
                                </summary>
                                <div style={{ paddingTop: '1.25rem', marginTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.a}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div style={{ textAlign: 'center', background: 'linear-gradient(180deg, rgba(99,102,241,0.05) 0%, transparent 100%)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 24, padding: '4rem 2rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                        Ready to try it for real?
                    </h2>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: 460, margin: '0 auto 2.5rem' }}>
                        Open the Educator Launchpad, project the QR code, and ask someone to scan it. The timeline updates in 3 seconds.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link href="/admin/login" className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '0.95rem' }}>
                            Start a Session →
                        </Link>
                        <Link href="/pitch/roi-calculator" className="btn-ghost" style={{ padding: '0.875rem 2rem', fontSize: '0.95rem', background: 'var(--bg-surface)' }}>
                            Calculate ROI
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    )
}

