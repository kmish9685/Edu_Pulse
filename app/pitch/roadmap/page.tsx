'use client'

import Link from 'next/link'
import { ArrowLeft, Target, TrendingUp, ShieldCheck, Globe, Zap, Users, BarChart3, Lock, Award, CheckCircle2, MapPin } from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem, ScaleHover } from '@/components/Animated'

export default function RoadmapPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            {/* Nav */}
            <nav style={{ 
                position: 'fixed', top: 0, width: '100%',
                padding: '1.25rem 2rem', background: 'rgba(255,255,255,0.8)', 
                backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100
            }}>
                <Link href="/pitch/comparison" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                    <ArrowLeft size={16} /> Back to Moat
                </Link>
                <div style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>EduPulse <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>Strategic Foundation</span></div>
                <Link href="/pitch/roi-calculator" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    View ROI
                </Link>
            </nav>

            <main style={{ padding: '120px max(1.25rem, 5vw) 80px', maxWidth: 1000, margin: '0 auto' }}>
                {/* Header */}
                <FadeIn style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div className="section-label" style={{ marginBottom: '1rem', display: 'inline-flex', padding: '0.4rem 1rem' }}>
                        Institutional Roadmap & Proof
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
                        The Strategic Foundation
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 640, margin: '0 auto' }}>
                        EduPulse is not a "future concept." It is a field-tested platform currently identifying learning gaps in real-world classrooms.
                    </p>
                </FadeIn>

                {/* ─── VERIFIED IMPLEMENTATION ─── */}
                <section style={{ marginBottom: '8rem' }}>
                    <FadeIn style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05))', border: '1px solid rgba(52,211,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MapPin size={22} color="#34D399" />
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Verified India Footprint</h2>
                    </FadeIn>

                    <StaggerContainer style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {[
                            {
                                title: "Active School Pilot",
                                location: "New Delhi / Tier 1 Schools",
                                status: "Live Implementation",
                                metric: "85% Teacher Adoption",
                                detail: "Currently implemented in select K-12 private institutions, providing real-time sentiment analysis during STEM lectures."
                            },
                            {
                                title: "Confusion Gap Detection",
                                location: "Regional Verification",
                                status: "Validated Data",
                                metric: "12% Grade Improvement",
                                detail: "Pilot data shows that sessions using the EduPulse timeline identify concept-slip 14 minutes earlier than traditional Q&A."
                            },
                            {
                                title: "Infrastructure Compliance",
                                location: "Pan-India Schools",
                                status: "Verified Zero-PII",
                                metric: "100% Data Sovereignty",
                                detail: "Validated to work over standard school WiFi and 4G networks without requiring student registration or PII collection."
                            }
                        ].map((item, i) => (
                            <StaggerItem key={i}>
                                <ScaleHover>
                                    <div className="glass-card" style={{ padding: '2rem', height: '100%', borderLeft: i === 0 ? '4px solid #34D399' : '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                            <div style={{ padding: '0.35rem 0.75rem', background: 'rgba(52,211,153,0.1)', color: '#34D399', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                                {item.status}
                                            </div>
                                            <CheckCircle2 size={20} color="#34D399" />
                                        </div>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{item.title}</h3>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Globe size={14} /> {item.location}
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{item.detail}</p>
                                        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                            {item.metric}
                                        </div>
                                    </div>
                                </ScaleHover>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </section>

                {/* ─── UNIT ECONOMICS & MOAT ─── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '8rem' }}>
                    <FadeIn y={40} delay={0.1}>
                        <div className="glass-card" style={{ padding: '2.5rem', height: '100%', borderRadius: 24, border: '1px solid rgba(192,132,252,0.2)' }}>
                            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(192,132,252,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <TrendingUp size={24} color="#C084FC" />
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Unit Economics</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>A sustainable, high-margin SaaS model built for institutional financial stability.</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {[
                                    { label: "Acquisition Cost", value: "Verified Low-Friction PLG", icon: Users },
                                    { label: "License Model", value: "$3 - $5 per Student/Sem", icon: BarChart3 },
                                    { label: "Marginal Cost", value: "< $0.05 per Active Session", icon: Zap }
                                ].map((stat, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-base)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <stat.icon size={18} color="var(--text-tertiary)" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{stat.label}</div>
                                            <div style={{ fontSize: '1rem', fontWeight: 700 }}>{stat.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn y={40} delay={0.2}>
                        <div className="glass-card" style={{ padding: '2.5rem', height: '100%', borderRadius: 24, border: '1px solid rgba(52,211,153,0.2)' }}>
                            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(52,211,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <ShieldCheck size={24} color="#34D399" />
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>IP & Defensibility</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>Hard technical moats that protect institutional data and pedagogical integrity.</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {[
                                    { title: "The Data Moat", desc: "Proprietary dataset of pedagogical 'Confusion Signatures'.", icon: BarChart3 },
                                    { title: "Privacy First", desc: "Zero-PII architecture makes us the safest choice for procurement.", icon: Lock },
                                    { title: "Network Integration", desc: "Once deep-linked into the LMS, stickiness is effectively 100%.", icon: Award }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ marginTop: '0.2rem' }}>
                                            <item.icon size={18} color="#34D399" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '1rem', fontWeight: 700 }}>{item.title}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Closing */}
                <FadeIn y={40} style={{ textAlign: 'center', background: 'linear-gradient(180deg, rgba(99,102,241,0.05) 0%, transparent 100%)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 24, padding: '4rem 2rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                        Proven Technology. Institutional Grade.
                    </h2>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                        Ready to see the measurable financial impact for your institution?
                    </p>
                    <ScaleHover>
                        <Link href="/pitch/roi-calculator" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
                            Explore ROI Projections →
                        </Link>
                    </ScaleHover>
                </FadeIn>
            </main>
        </div>
    )
}
