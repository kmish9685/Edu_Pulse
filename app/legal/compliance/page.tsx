'use client'

import { BookOpen, CheckCircle, Globe, Shield, Scale, ArrowLeft, Download, FileCheck } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FadeIn, ScaleHover, StaggerContainer, StaggerItem } from '@/components/Animated'

export default function CompliancePage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>
            
            {/* Ambient glows */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '5%', right: '5%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', bottom: '5%', left: '5%', width: '35%', height: '35%', background: 'radial-gradient(ellipse, rgba(79,70,229,0.03) 0%, transparent 70%)' }} />
            </div>

            {/* Header */}
            <header style={{ borderBottom: '1px solid var(--border)', height: 56, display: 'flex', alignItems: 'center', padding: '0 1.75rem', gap: '0.75rem', backdropFilter: 'blur(24px)', position: 'sticky', top: 0, zIndex: 10, background: 'var(--glass-bg)' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.857rem', fontWeight: 500 }}>
                    <ArrowLeft size={14} /> Home
                </Link>
                <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Policy & Compliance</span>
                <div style={{ flex: 1 }} />
                <div className="section-label" style={{ opacity: 0.8 }}>Institutional Trust Center</div>
            </header>

            <main style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 1.75rem', position: 'relative', zIndex: 1 }}>
                
                <FadeIn style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'rgba(16,185,129,0.1)', borderRadius: 12, marginBottom: '1.5rem', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <FileCheck size={32} color="var(--success)" />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '1rem' }}>
                        Policy <span className="gradient-text">Alignment.</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: 700 }}>
                        EduPulse is designed to exceed institutional standards for safety, inclusivity, and pedagogical excellence. We are fully aligned with major Indian and International educational policies.
                    </p>
                </FadeIn>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                    
                    {/* Indian Compliance */}
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <div style={{ width: 8, height: 24, background: 'var(--accent)', borderRadius: 4 }} />
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Indian Frameworks</h2>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                            {[
                                { 
                                    title: "NEP 2020 Compliance", 
                                    body: "Aligned with Clause 4.34 (Formative Assessment) and Clause 12.5 (Student Support Systems). EduPulse enables the continuous, formative feedback loops mandated for Higher Education Institutions.",
                                    Icon: BookOpen
                                },
                                { 
                                    title: "UGC 2024 Guidelines", 
                                    body: "Complies with the latest UGC standards for 'Enhanced Learning Management & Student Engagement.' Our Zero-PII architecture protects student identity as per National Data Safety norms.",
                                    Icon: Scale
                                },
                                { 
                                    title: "SDG-4 (Quality Education)", 
                                    body: "Directly contributes to Sustainable Development Goal 4.4 by ensuring equal opportunity through anonymity and increasing institutional retention for underserved student populations.",
                                    Icon: Globe
                                }
                            ].map((item, i) => (
                                <div key={i} style={{ padding: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20 }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <item.Icon size={24} color="var(--accent-soft)" />
                                        <div>
                                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.75rem' }}>{item.title}</h3>
                                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{item.body}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* International Standards */}
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <div style={{ width: 8, height: 24, background: 'var(--success)', borderRadius: 4 }} />
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>International Standards</h2>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                            {[
                                { 
                                    title: "FERPA & COPPA Ready", 
                                    body: "By not collecting Personally Identifiable Information (PII), EduPulse bypasses the most significant friction points of educational privacy laws, ensuring absolute data safety for minors and adults alike.",
                                    Icon: Shield
                                },
                                { 
                                    title: "EU AI Act (2024) Governance", 
                                    body: "Our AI is classified as 'Low-Risk' because it strictly avoids biometric profiling, facial recognition, or emotional surveillance, focusing purely on cognitive learning signals.",
                                    Icon: CheckCircle
                                }
                            ].map((item, i) => (
                                <div key={i} style={{ padding: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20 }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <item.Icon size={24} color="var(--success)" />
                                        <div>
                                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.75rem' }}>{item.title}</h3>
                                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{item.body}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                <FadeIn delay={0.6} style={{ marginTop: '4rem', padding: '2.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 24, textAlign: 'center' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1rem' }}>Institutional Audit Material</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>Need a detailed compliance report for your institution's governing body? Our team can provide full pedagogical audit logs.</p>
                    <ScaleHover>
                        <button onClick={() => window.print()} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem' }}>
                            <Download size={16} /> Download Compliance Packet
                        </button>
                    </ScaleHover>
                </FadeIn>

                <footer style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                    Document Ref: EP-COMP-2026-V2 · EduPulse Intelligence Trust Center
                </footer>

            </main>
        </div>
    )
}
