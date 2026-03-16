'use client'

import { Shield, Lock, Ghost, EyeOff, Globe, ArrowLeft, Download } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FadeIn, ScaleHover } from '@/components/Animated'

export default function PrivacyManifestoPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>
            
            {/* Ambient glows */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-10%', right: '0%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', bottom: '-10%', left: '0%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(79,70,229,0.03) 0%, transparent 70%)' }} />
            </div>

            {/* Header */}
            <header style={{ borderBottom: '1px solid var(--border)', height: 56, display: 'flex', alignItems: 'center', padding: '0 1.75rem', gap: '0.75rem', backdropFilter: 'blur(24px)', position: 'sticky', top: 0, zIndex: 10, background: 'var(--glass-bg)' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.857rem', fontWeight: 500 }}>
                    <ArrowLeft size={14} /> Home
                </Link>
                <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Privacy Manifesto</span>
                <div style={{ flex: 1 }} />
                <div className="section-label" style={{ opacity: 0.8 }}>Institutional Trust Center</div>
            </header>

            <main style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 1.75rem', position: 'relative', zIndex: 1 }}>
                
                <FadeIn style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'var(--accent-dim)', borderRadius: 12, marginBottom: '1.5rem', border: '1px solid var(--border-accent)' }}>
                        <Shield size={32} color="var(--accent-soft)" />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '1rem' }}>
                        Privacy <span className="gradient-text">Manifesto.</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
                        Our promise to students, parents, and educators. Intelligence without intrusion, by design.
                    </p>
                </FadeIn>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    
                    {[
                        { 
                            Icon: Lock, 
                            title: "Your identity is your own", 
                            body: "EduPulse is built on a Zero-PII (Personally Identifiable Information) Architecture. We do not ask for, collect, or store student names, email addresses, phone numbers, or social media profiles." 
                        },
                        { 
                            Icon: EyeOff, 
                            title: "Anonymity by design", 
                            body: "When a student signals \"I'm Confused,\" the system sees only a temporary, session-specific token. We know a student is lost; we do not know which student it is. This ensures students feel safe to be honest without fear of judgement." 
                        },
                        { 
                            Icon: Ghost, 
                            title: "No accounts, no tracking", 
                            body: "There are no student accounts to create. Access is granted via a temporary 4-digit PIN or QR code that expires as soon as the lecture ends. We do not use persistent cookies to track behavior across the web." 
                        },
                        { 
                            Icon: Globe, 
                            title: "Pedagogical mission only", 
                            body: "We collect one thing: Learning Signals. These signals are used by the Educator to improve their teaching. Your data is never sold, never used for advertising, and never used for academic profiling." 
                        },
                        { 
                            Icon: Shield, 
                            title: "Institutional Security", 
                            body: "All signals are encrypted in transit. Our infrastructure is aligned with the UGC 2024 Guidelines and international standards like FERPA and GDPR for educational data safety." 
                        }
                    ].map((item, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <div style={{ display: 'flex', gap: '1.5rem', paddingBottom: '3rem', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <item.Icon size={20} color="var(--text-primary)" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '1.05rem' }}>{item.body}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}

                </div>

                <FadeIn delay={0.6} style={{ marginTop: '4rem', padding: '2.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20, textAlign: 'center' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1rem' }}>Need this for your board?</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Download the official PDF version of our Privacy Manifesto to include in your institutional documentation.</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <ScaleHover>
                            <button onClick={() => window.print()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem' }}>
                                <Download size={16} /> Print Manifesto
                            </button>
                        </ScaleHover>
                    </div>
                </FadeIn>

                <footer style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                    Last Updated: March 2026 · EduPulse Intelligence Trust Center
                </footer>

            </main>
        </div>
    )
}
