'use client'

import { useState } from 'react'
import { Calculator, TrendingUp, AlertTriangle, ShieldCheck, Download, ArrowLeft, Zap } from 'lucide-react'
import Link from 'next/link'

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

    const lost = Math.floor(students * (dropout / 100))
    const lostRev = lost * tuition
    const retained = Math.floor(lost * 0.10)
    const protected_ = retained * tuition
    const cost = TIERS[size].cost
    const net = protected_ - cost
    const roi = ((net / cost) * 100).toFixed(0)
    const payback = ((cost / protected_) * 12).toFixed(1)

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>

            {/* Orbs */}
            <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: '55%', height: '60%', background: 'radial-gradient(ellipse, rgba(239,68,68,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: '45%', height: '50%', background: 'radial-gradient(ellipse, rgba(124,92,246,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            {/* Header */}
            <header style={{ borderBottom: '1px solid var(--glass-border)', height: 56, display: 'flex', alignItems: 'center', padding: '0 1.75rem', gap: '0.75rem', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(6,6,10,0.85)' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.857rem', fontWeight: 500 }}>
                    <ArrowLeft size={14} /> Home
                </Link>
                <span style={{ color: 'var(--text-tertiary)' }}>/</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calculator size={14} color="#A78BFA" />
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.03em' }}>ROI Projector</span>
                </div>
                <div style={{ flex: 1 }} />
                <div className="section-label">For Institutional Pitch</div>
            </header>

            <main style={{ maxWidth: 1060, margin: '0 auto', padding: 'max(2rem, 4vw) max(1rem, 4vw)', position: 'relative', zIndex: 1 }}>

                {/* Hero */}
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 700, letterSpacing: '-0.045em', marginBottom: '1rem' }}>
                        The true cost of the <span className="gradient-text">invisible gap.</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, maxWidth: 500, margin: '0 auto' }}>
                        Calculate the financial impact of preventing student dropouts through real-time learning intelligence.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>

                    {/* Inputs */}
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Calculator size={15} color="#A78BFA" />
                            </div>
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.025em' }}>Institution Metrics</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Tier */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.625rem' }}>Institution Scale</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                    {(Object.keys(TIERS) as Array<keyof typeof TIERS>).map(k => (
                                        <button key={k} onClick={() => { setSize(k); setStudents(k === 'small' ? 3000 : k === 'medium' ? 10000 : 20000) }}
                                            style={{ padding: '0.625rem', fontSize: '0.8rem', fontWeight: 700, borderRadius: 'var(--radius)', border: `1px solid ${size === k ? 'var(--border-accent)' : 'var(--glass-border)'}`, background: size === k ? 'var(--accent-dim)' : 'var(--glass-bg)', color: size === k ? '#A78BFA' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'center' }}>
                                            <div>{TIERS[k].name}</div>
                                            <div style={{ fontWeight: 400, fontSize: '0.67rem', opacity: 0.7, marginTop: '0.1rem' }}>{TIERS[k].label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Slider inputs */}
                            {[
                                { label: 'Total Students', value: students, set: setStudents, min: 500, max: 40000, step: 500, fmt: (v: number) => v.toLocaleString(), color: '#A78BFA' },
                                { label: 'Annual Dropout Rate', value: dropout, set: setDropout, min: 5, max: 40, step: 1, fmt: (v: number) => `${v}%`, color: '#EF4444' },
                            ].map(f => (
                                <div key={f.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{f.label}</label>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: f.color, fontVariantNumeric: 'tabular-nums' }}>{f.fmt(f.value)}</span>
                                    </div>
                                    <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={e => f.set(Number(e.target.value))}
                                        style={{ width: '100%', accentColor: f.color }} />
                                    {f.label.includes('Dropout') && <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textAlign: 'right', marginTop: '0.2rem' }}>National avg: ~18%</p>}
                                </div>
                            ))}

                            {/* tuition input */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Avg Tuition per Student (₹)</label>
                                <input type="number" value={tuition} onChange={e => setTuition(Number(e.target.value))} className="lx-input" />
                            </div>
                        </div>
                    </div>

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
                                .glass-card { border: 1px solid #ccc !important; background: white !important; }
                                .gradient-text { background: none !important; -webkit-text-fill-color: black !important; color: black !important; }
                                .hide-print { display: none !important; }
                            }
                        `}} />

                        {/* Loss box */}
                        <div className="glass-card" style={{ padding: '1.75rem', borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: 'var(--danger)', borderRadius: 0 }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                <AlertTriangle size={15} color="var(--danger)" />
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--danger)', letterSpacing: '-0.02em' }}>Current Financial Exposure</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <div className="section-label" style={{ marginBottom: '0.375rem' }}>Students Lost / Year</div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums' }}>{lost.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="section-label" style={{ marginBottom: '0.375rem' }}>Annual Revenue Lost</div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.05em', color: 'var(--danger)', fontVariantNumeric: 'tabular-nums' }}>{fmt(lostRev)}</div>
                                </div>
                            </div>
                        </div>

                        {/* EduPulse value box */}
                        <div className="glass-card" style={{ padding: '2rem', borderColor: 'rgba(124,92,246,0.25)', background: 'linear-gradient(135deg, rgba(124,92,246,0.08), rgba(94,92,246,0.04))', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: '50%', height: '80%', background: 'radial-gradient(ellipse, rgba(124,92,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                            <div style={{ position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    <ShieldCheck size={15} color="#A78BFA" />
                                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.02em' }}>EduPulse Impact Analysis</span>
                                    <span style={{ marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-tertiary)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.625rem', borderRadius: 100 }}>10% conservative improvement</span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '1.5rem' }}>
                                    {[
                                        { l: 'Students Retained', v: `+${retained}`, c: 'var(--text-primary)' },
                                        { l: 'Revenue Protected', v: fmt(protected_), c: 'var(--success)' },
                                    ].map(s => (
                                        <div key={s.l}>
                                            <div className="section-label" style={{ marginBottom: '0.375rem' }}>{s.l}</div>
                                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.05em', color: s.c, fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <div className="section-label" style={{ marginBottom: '0.375rem' }}>License Cost</div>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>{TIERS[size].badge}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div className="section-label" style={{ marginBottom: '0.375rem' }}>First Year ROI</div>
                                        <div className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.06em', fontVariantNumeric: 'tabular-nums' }}>{roi}%</div>
                                        <div style={{ fontSize: '0.78rem', color: '#A78BFA', marginTop: '0.2rem' }}>Pays back in {payback} months</div>
                                    </div>
                                </div>

                                <div className="hide-print" style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button onClick={() => window.print()} className="btn-ghost flex-1 justify-center relative overflow-hidden group" style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                        <Download size={13} /> Export Report
                                    </button>
                                    <Link href="/admin/loi-generator" className="btn-primary" style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                        <Zap size={13} /> Generate LOI
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
