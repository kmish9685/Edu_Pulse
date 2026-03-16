'use client'

import { Brain, Scale, ShieldCheck, Eye, Zap, ArrowLeft, Info } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FadeIn, ScaleHover } from '@/components/Animated'

export default function AIEthicsPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>
            
            {/* Ambient glows */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-10%', left: '10%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(79,70,229,0.03) 0%, transparent 70%)' }} />
            </div>

            {/* Header */}
            <header style={{ borderBottom: '1px solid var(--border)', height: 56, display: 'flex', alignItems: 'center', padding: '0 1.75rem', gap: '0.75rem', backdropFilter: 'blur(24px)', position: 'sticky', top: 0, zIndex: 10, background: 'var(--glass-bg)' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.857rem', fontWeight: 500 }}>
                    <ArrowLeft size={14} /> Home
                </Link>
                <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>AI Ethics & Bias</span>
                <div style={{ flex: 1 }} />
                <div className="section-label" style={{ opacity: 0.8 }}>Institutional Trust Center</div>
            </header>

            <main style={{ maxWidth: 850, margin: '0 auto', padding: '4rem 1.75rem', position: 'relative', zIndex: 1 }}>
                
                <FadeIn style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'rgba(99,102,241,0.1)', borderRadius: 12, marginBottom: '1.5rem', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <Brain size={32} color="var(--accent-soft)" />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '1rem' }}>
                        Ethical AI <span className="gradient-text">Governance.</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: 650 }}>
                        At EduPulse, we believe AI should illuminate learning without compromising human dignity. This policy outlines our algorithmic safeguards and commitment to fairness.
                    </p>
                </FadeIn>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                    {[
                        { 
                            Icon: Scale, 
                            title: "Algorithmic Fairness", 
                            body: "Our 'Confusion Engine' is trained on pedagogical progress signatures, not demographic data. We strictly exclude age, gender, ethnicity, and socioeconomic status from our primary signal processing." 
                        },
                        { 
                            Icon: Eye, 
                            title: "No Biological Biometrics", 
                            body: "Consistent with the EU AI Act (2024), we do not use facial recognition, emotion tracking, or any biometric monitoring that attempts to 'read' a student's feelings or biology." 
                        },
                        { 
                            Icon: ShieldCheck, 
                            title: "Non-Profiled AI", 
                            body: "EduPulse does not create 'Academic Profiles.' The AI analyzes session-specific signals to help teachers, not to rank or judge individual students across their lifetime." 
                        },
                        { 
                            Icon: Zap, 
                            title: "Actionable Insights Only", 
                            body: "The AI's sole purpose is to draft review materials and identify topic-level gaps. It never makes automated decisions regarding grading or institutional status." 
                        }
                    ].map((item, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <div style={{ padding: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <item.Icon size={18} color="var(--accent-soft)" />
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{item.body}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                <FadeIn delay={0.4} style={{ borderLeft: '4px solid var(--accent)', padding: '2rem', background: 'var(--bg-elevated)', borderRadius: '0 16px 16px 0', marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <Info size={24} color="var(--accent-soft)" style={{ flexShrink: 0 }} />
                        <div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Our Data Source Declaration</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                Unlike social-emotion AI vendors, EduPulse uses **Pedagogical Pulse Signatures**. We measure the gap between a teacher's delivery speed and a student's cognitive processing self-report. This is a behavioral learning signal, not an emotional or biological one, making it the most ethical approach to real-time classroom analytics.
                            </p>
                        </div>
                    </div>
                </FadeIn>

                <footer style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                    Compliance Statement March 2026 · EduPulse Trust & AI Ethics Council
                </footer>

            </main>
        </div>
    )
}
