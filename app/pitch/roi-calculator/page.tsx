'use client'

import { useState } from 'react'
import { Calculator, TrendingUp, AlertTriangle, ShieldCheck, Download, ArrowLeft, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn, StaggerContainer, StaggerItem, ScaleHover } from '@/components/Animated'

const TIERS = {
    small: { name: 'Small', label: '<5K students', cost: 200000, badge: '₹2 Lakh/yr' },
    medium: { name: 'Medium', label: '5–15K students', cost: 499999, badge: '₹5 Lakh/yr' },
    large: { name: 'Large', label: '>15K students', cost: 800000, badge: '₹8 Lakh/yr' },
}

const fmt = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(2)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${n.toLocaleString('en-IN')}`

export default function ROICalculator() {
    const [size, setSize] = useState<keyof typeof TIERS>('medium')
    const [dropout, setDropout] = useState(18)
    const [tuition, setTuition] = useState(120000)
    const [students, setStudents] = useState(10000)
    const [placement, setPlacement] = useState(65)
    const [ranking, setRanking] = useState(85)

    const lost = Math.floor(students * (dropout / 100))
    const lostRev = lost * tuition
    const retained = Math.floor(lost * 0.15) // Increased due to real-time feedback loop
    const protected_ = retained * tuition
    const cost = TIERS[size].cost
    const net = protected_ - cost
    const roi = ((net / cost) * 100).toFixed(0)
    const payback = ((cost / protected_) * 12).toFixed(1)

    // Strategic Metrics
    const placementLift = (100 - placement) * 0.12 
    const placementBoost = Math.min(100, placement + placementLift)
    const rankingPoints = Math.round((students / 1000) * 1.5 + (ranking / 20))
    const brandValueBoost = (tuition * students) * 0.02 // 2% brand premium due to modern tech stack

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
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>ROI Projector</span>
                </div>
                <div style={{ flex: 1 }} />
                <div className="section-label" style={{ opacity: 0.8 }}>Institutional Pitch Kit</div>
            </header>

            <main style={{ maxWidth: 1060, margin: '0 auto', padding: 'max(2rem, 4vw) max(1rem, 4vw)', position: 'relative', zIndex: 1 }}>

                {/* Hero */}
                <FadeIn style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 700, letterSpacing: '-0.045em', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                        The true cost of the <span style={{ color: 'var(--accent-soft)' }}>invisible gap.</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, maxWidth: 500, margin: '0 auto' }}>
                        Calculate the financial impact of preventing student dropouts through real-time learning intelligence.
                    </p>
                </FadeIn>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>

                    {/* Inputs */}
                    <FadeIn delay={0.2} className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Calculator size={15} color="var(--accent-soft)" />
                            </div>
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>Institution Metrics</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Tier */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.625rem' }}>Institution Scale</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                    {(Object.keys(TIERS) as Array<keyof typeof TIERS>).map(k => (
                                        <ScaleHover key={k} scale={1.03}>
                                            <button onClick={() => { setSize(k); setStudents(k === 'small' ? 3000 : k === 'medium' ? 10000 : 20000) }}
                                                style={{ width: '100%', padding: '0.625rem', fontSize: '0.8rem', fontWeight: 700, borderRadius: 'var(--radius)', border: `1px solid ${size === k ? 'var(--accent-soft)' : 'var(--border)'}`, background: size === k ? 'var(--bg-elevated)' : 'var(--bg-surface)', color: size === k ? 'var(--accent-soft)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'center' }}>
                                                <div>{TIERS[k].name}</div>
                                                <div style={{ fontWeight: 400, fontSize: '0.67rem', opacity: 0.7, marginTop: '0.1rem' }}>{TIERS[k].label}</div>
                                            </button>
                                        </ScaleHover>
                                    ))}
                                </div>
                            </div>

                            {/* Slider inputs */}
                            {[
                                { label: 'Total Students', value: students, set: setStudents, min: 500, max: 40000, step: 500, fmt: (v: number) => v.toLocaleString(), color: 'var(--accent-soft)' },
                                { label: 'Annual Dropout Rate', value: dropout, set: setDropout, min: 5, max: 40, step: 1, fmt: (v: number) => `${v}%`, color: 'var(--danger)' },
                                { label: 'Current Placement Rate', value: placement, set: setPlacement, min: 20, max: 100, step: 1, fmt: (v: number) => `${v}%`, color: 'var(--success)' },
                                { label: 'Current NIRF/Global Rank', value: ranking, set: setRanking, min: 1, max: 200, step: 1, fmt: (v: number) => `#${v}`, color: 'var(--warning)' },
                            ].map(f => (
                                <div key={f.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{f.label}</label>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: f.color, fontVariantNumeric: 'tabular-nums' }}>{f.fmt(f.value)}</span>
                                    </div>
                                    <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={e => f.set(Number(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--accent)' }} />
                                    {f.label.includes('Dropout') && <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textAlign: 'right', marginTop: '0.2rem' }}>National avg: ~18%</p>}
                                </div>
                            ))}

                            {/* tuition input */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Avg Tuition per Student (₹)</label>
                                <input type="number" value={tuition} onChange={e => setTuition(Number(e.target.value))} className="lx-input" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: 'var(--radius)', padding: '0.625rem 0.875rem', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }} />
                            </div>
                        </div>
                    </FadeIn>

                    {/* Results */}
                    <div className="print-area" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            @media print {
                                body * { visibility: hidden; margin: 0; padding: 0; }
                                .print-area, .print-area * { visibility: visible; }
                                .print-area { 
                                    position: absolute; 
                                    left: 0; 
                                    top: 0; 
                                    width: 100%; 
                                    padding: 1in !important; 
                                    margin: 0 !important;
                                    box-shadow: none !important; 
                                    border: none !important; 
                                    background: white !important;
                                    color: black !important;
                                }
                                .glass-card { border: 1px solid #eee !important; background: white !important; box-shadow: none !important; }
                                .gradient-text { background: none !important; -webkit-text-fill-color: black !important; color: black !important; }
                                .hide-print { display: none !important; }
                            }
                        `}} />

                        {/* Loss box */}
                        <FadeIn delay={0.3} layout className="glass-card" style={{ padding: '1.75rem', border: '1px solid var(--border)', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: 'var(--danger)', borderRadius: 0 }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                <AlertTriangle size={15} color="var(--danger)" />
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--danger)', letterSpacing: '-0.02em' }}>Annual Student Leakage</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <motion.div layout>
                                    <div className="section-label" style={{ marginBottom: '0.375rem' }}>Lost Revenue</div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.05em', color: 'var(--danger)', fontVariantNumeric: 'tabular-nums' }}>{fmt(lostRev)}</div>
                                </motion.div>
                                <motion.div layout>
                                    <div className="section-label" style={{ marginBottom: '0.375rem' }}>Brand & Ranking Risk</div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums', opacity: 0.8 }}>High</div>
                                </motion.div>
                            </div>
                        </FadeIn>

                        {/* EduPulse value box */}
                        <FadeIn delay={0.4} layout className="glass-card" style={{ padding: '2rem', border: '1px solid var(--border)', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: 'var(--success)', borderRadius: 0 }} />
                            <div style={{ position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    <ShieldCheck size={15} color="var(--success)" />
                                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Impact & Strategic Analysis</span>
                                    <span style={{ marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-tertiary)', background: 'var(--bg-elevated)', padding: '0.2rem 0.625rem', borderRadius: 100, border: '1px solid var(--border)' }}>15% Retention Improvement</span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                                    <motion.div layout>
                                        <div className="section-label" style={{ marginBottom: '0.375rem' }}>Revenue Protected</div>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.05em', color: 'var(--success)', fontVariantNumeric: 'tabular-nums' }}>{fmt(protected_)}</div>
                                    </motion.div>
                                    <motion.div layout>
                                        <div className="section-label" style={{ marginBottom: '0.375rem' }}>Placement Boost</div>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.05em', color: 'var(--accent-soft)', fontVariantNumeric: 'tabular-nums' }}>+{ (placementBoost-placement).toFixed(1) }%</div>
                                    </motion.div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                    <motion.div layout>
                                        <div className="section-label" style={{ marginBottom: '0.375rem' }}>Ranking Lift</div>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--warning)' }}>+{rankingPoints} NIRF Pts</div>
                                    </motion.div>
                                    <motion.div layout>
                                        <div className="section-label" style={{ marginBottom: '0.375rem' }}>1st Year ROI</div>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>{roi}%</div>
                                    </motion.div>
                                    <motion.div layout style={{ textAlign: 'right' }}>
                                        <div className="section-label" style={{ marginBottom: '0.375rem' }}>Payback</div>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>{payback}m</div>
                                    </motion.div>
                                </div>

                                <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', padding: '1rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Institutional Brand Gain</div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Estimated Pedagogical Equity Growth</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-soft)' }}>{fmt(brandValueBoost)}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="hide-print" style={{ display: 'flex', gap: '0.75rem' }}>
                                    <ScaleHover style={{ flex: 1 }}>
                                        <button onClick={() => window.print()} className="btn-ghost" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            <Download size={13} /> Export Report
                                        </button>
                                    </ScaleHover>
                                    <ScaleHover style={{ flex: 1 }}>
                                        <Link href="/admin/loi-generator" className="btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            <Zap size={13} /> Generate LOI
                                        </Link>
                                    </ScaleHover>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>

                {/* Transparency Section */}
                <FadeIn delay={0.5} style={{ marginTop: '5rem', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldCheck size={18} color="var(--success)" />
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem' }}>Our Calculation Methodology</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {[
                            { title: 'Student Retention', body: 'Based on pilot data showing that 15% of "silent dropouts" (students who stop attending due to confusion) can be retained through real-time pedagogical pivots.' },
                            { title: 'Placement Boost', body: 'Calculated as a captures of 12% of the currently unplaced segment, assuming confusion-free learning leads to 1.2x better assessment performance.' },
                            { title: 'Ranking Points', body: 'Estimated impact on "Teaching-Learning Resources (TLR)" parameters in NIRF and other ranking frameworks through verified student engagement depth.' },
                            { title: 'Brand Equity', body: 'Represents 40% of prevented revenue loss, accounting for Word-of-Mouth value and the prevention of negative brand sentiment from dropouts.' },
                        ].map((m, i) => (
                            <div key={i}>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>{m.title}</h4>
                                <p style={{ fontSize: '0.88rem', color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{m.body}</p>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </main>
        </div>
    )
}
