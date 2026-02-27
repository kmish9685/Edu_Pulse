'use client'

import { useState } from 'react'
import { FileText, Download, Send, ArrowLeft, Building2, UserCircle, Calculator, CheckCircle2, Loader2, Zap } from 'lucide-react'
import Link from 'next/link'

export default function LOIGenerator() {
    const [formData, setFormData] = useState({ institution: '', contactName: '', role: '', students: 5000, amount: 250000 })
    const [isGenerating, setIsGenerating] = useState(false)
    const [isGenerated, setIsGenerated] = useState(false)

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault()
        setIsGenerating(true)
        setTimeout(() => { setIsGenerating(false); setIsGenerated(true) }, 1500)
    }

    const fields = [
        { label: 'Institution Name', key: 'institution', placeholder: 'e.g. Galgotias University', icon: Building2, type: 'text' },
        { label: 'Contact Person (Signatory)', key: 'contactName', placeholder: 'e.g. Dr. K. Mallik', icon: UserCircle, type: 'text' },
        { label: 'Signatory Role', key: 'role', placeholder: 'e.g. Dean of Academics', icon: null, type: 'text' },
    ]

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>

            {/* Ambient orb */}
            <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: '45%', height: '50%', background: 'radial-gradient(ellipse, rgba(124,92,246,0.09) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            {/* Header */}
            <header style={{ borderBottom: '1px solid var(--glass-border)', height: 56, display: 'flex', alignItems: 'center', padding: '0 1.75rem', gap: '1rem', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(6,6,10,0.85)' }}>
                <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.857rem', fontWeight: 500 }}>
                    <ArrowLeft size={14} /> Admin
                </Link>
                <span style={{ color: 'var(--border)', fontSize: '1rem' }}>/</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileText size={14} color="var(--accent)" />
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem' }}>LOI Generator</span>
                </div>
                <div style={{ flex: 1 }} />
                <div className="section-label">Sales Operations</div>
            </header>

            <main style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.75rem', position: 'relative', zIndex: 1 }}>

                {/* Hero */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.875rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 100, marginBottom: '1.25rem' }}>
                        <Zap size={12} color="#A78BFA" />
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, color: '#A78BFA', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Letter of Intent Automation</span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
                        Generate your <span className="gradient-text">Pilot LOI</span> instantly.
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, maxWidth: 520, margin: '0 auto' }}>
                        Legally-compliant Letters of Intent to secure pilot commitments and demonstrate B2B traction to EDVentures judges.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '2rem', alignItems: 'start' }}>

                    {/* Form */}
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Building2 size={16} color="#A78BFA" />
                            </div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>Institution Details</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Fill in the signing party info</div>
                            </div>
                        </div>

                        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                            {fields.map(f => (
                                <div key={f.key}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{f.label}</label>
                                    <input
                                        type={f.type}
                                        required
                                        placeholder={f.placeholder}
                                        value={(formData as any)[f.key]}
                                        onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                                        className="lx-input"
                                    />
                                </div>
                            ))}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                {[
                                    { label: 'Students', key: 'students', prefix: '' },
                                    { label: 'Deal Value (₹)', key: 'amount', prefix: '₹' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{f.label}</label>
                                        <input
                                            type="number"
                                            required
                                            value={(formData as any)[f.key]}
                                            onChange={e => setFormData(prev => ({ ...prev, [f.key]: parseInt(e.target.value) || 0 }))}
                                            className="lx-input"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                type="submit"
                                disabled={isGenerating || !formData.institution || !formData.contactName}
                                className="btn-primary"
                                style={{ justifyContent: 'center', marginTop: '0.5rem', opacity: (!formData.institution || !formData.contactName) ? 0.5 : 1 }}>
                                {isGenerating ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : 'Generate LOI Draft'}
                            </button>
                        </form>
                    </div>

                    {/* Preview */}
                    <div>
                        {isGenerated ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Success banner */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', background: 'var(--success-dim)', border: '1px solid rgba(62,207,142,0.25)', borderRadius: 'var(--radius-lg)', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.857rem', color: 'var(--success)' }}>
                                        <CheckCircle2 size={16} /> LOI Successfully Generated
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => window.print()}
                                            className="btn-ghost btn-sm"
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                                        >
                                            <Download size={13} /> PDF
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                const btn = e.currentTarget;
                                                const originalHtml = btn.innerHTML;
                                                btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending...`;
                                                btn.style.opacity = '0.7';
                                                btn.style.pointerEvents = 'none';
                                                setTimeout(() => {
                                                    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Sent!`;
                                                    btn.style.background = 'var(--success)';
                                                    btn.style.borderColor = 'var(--success)';
                                                    btn.style.opacity = '1';
                                                    setTimeout(() => {
                                                        btn.innerHTML = originalHtml;
                                                        btn.style.background = '';
                                                        btn.style.borderColor = '';
                                                        btn.style.pointerEvents = 'auto';
                                                    }, 3000);
                                                }, 1500);
                                            }}
                                            className="btn-primary btn-sm"
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                                        >
                                            <Send size={13} /> Send for Sign
                                        </button>
                                    </div>
                                </div>

                                <style dangerouslySetInnerHTML={{
                                    __html: `
                                    @media print {
                                        body * { visibility: hidden; margin: 0; padding: 0; }
                                        #printable-loi, #printable-loi * { visibility: visible; }
                                        #printable-loi { 
                                            position: absolute; 
                                            left: 0; 
                                            top: 0; 
                                            width: 100%; 
                                            padding: 1in !important; 
                                            margin: 0 !important;
                                            box-shadow: none !important; 
                                            border: none !important; 
                                            background: white !important;
                                        }
                                        /* Hide the Next Steps / Button sidebar during print */
                                        aside { display: none !important; }
                                    }
                                `}} />

                                {/* LOI document — white paper look */}
                                <div id="printable-loi" style={{ background: '#FAFAFA', borderRadius: 'var(--radius-xl)', padding: '3rem', boxShadow: '0 32px 80px -16px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', fontFamily: 'Georgia, serif', color: '#1a1a2e' }}>
                                    {/* Watermark */}
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-30deg)', opacity: 0.04, fontSize: '5rem', fontWeight: 900, whiteSpace: 'nowrap', pointerEvents: 'none', color: '#000' }}>DRAFT LOI</div>

                                    <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #e5e5e5' }}>
                                        <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', marginBottom: '0.25rem' }}>EduPulse AI · Institutional Division</div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#111', margin: '0.5rem 0 0.25rem' }}>Letter of Intent</h2>
                                        <p style={{ fontSize: '0.8rem', color: '#999' }}>Non-Binding Memorandum of Understanding</p>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', lineHeight: 1.8, color: '#333', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        <p>This NON-BINDING LETTER OF INTENT outlines the mutual intention between <strong>EduPulse AI</strong> ("Provider") and <strong>{formData.institution}</strong> ("Institution") to implement a comprehensive Institutional Learning Intelligence system.</p>
                                        <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '0.875rem' }}>
                                            <strong style={{ display: 'block', marginBottom: '0.375rem', color: '#111' }}>1. Scope of Pilot</strong>
                                            <p>The Institution intends to deploy EduPulse covering approximately <strong>{formData.students.toLocaleString()} students</strong> to track real-time learning gaps and protect tuition revenue from systemic dropouts.</p>
                                        </div>
                                        <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '0.875rem' }}>
                                            <strong style={{ display: 'block', marginBottom: '0.375rem', color: '#111' }}>2. Financial Provisions</strong>
                                            <p>Subject to successful 60-day trial completion, the Institution anticipates a formal licensing agreement estimated at <strong>₹{formData.amount.toLocaleString()} per annum</strong>.</p>
                                        </div>
                                        <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '0.875rem' }}>
                                            <strong style={{ display: 'block', marginBottom: '0.375rem', color: '#111' }}>3. Next Steps</strong>
                                            <p>Signatures below indicate intent to proceed with technical integration within 14 business days.</p>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e5e5' }}>
                                            <div><div style={{ borderBottom: '2px solid #ccc', marginBottom: '0.5rem', height: '2rem' }} /><strong style={{ fontSize: '0.8rem', color: '#111' }}>EduPulse Representative</strong><p style={{ fontSize: '0.75rem', color: '#666' }}>Authorized Signatory</p></div>
                                            <div><div style={{ borderBottom: '2px solid #ccc', marginBottom: '0.5rem', height: '2rem' }} /><strong style={{ fontSize: '0.8rem', color: '#111' }}>{formData.contactName}</strong><p style={{ fontSize: '0.75rem', color: '#666' }}>{formData.role}</p><p style={{ fontSize: '0.75rem', color: '#666' }}>{formData.institution}</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', height: '100%', minHeight: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Calculator size={24} color="#A78BFA" />
                                </div>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.025em' }}>Document Preview</div>
                                <div style={{ fontSize: '0.857rem', color: 'var(--text-secondary)', maxWidth: 280, lineHeight: 1.6 }}>Fill in the institution details on the left. Your LOI will appear here, ready to download or send for e-signature.</div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
