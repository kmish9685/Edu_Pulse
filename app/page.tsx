'use client'

import Link from 'next/link'
import { ArrowRight, BarChart3, Zap, TrendingUp, BookOpen, Activity, ChevronRight, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', minHeight: '100vh', overflowX: 'hidden', fontFamily: 'var(--font-body)' }}>

      {/* ── Ambient orbs ─────────────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-5%', width: '55%', height: '60%', background: 'radial-gradient(ellipse, rgba(124,92,246,0.15) 0%, transparent 70%)', animation: 'orb-drift 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '45%', height: '50%', background: 'radial-gradient(ellipse, rgba(94,92,246,0.10) 0%, transparent 70%)', animation: 'orb-drift 22s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '45%', left: '40%', width: '35%', height: '35%', background: 'radial-gradient(ellipse, rgba(167,139,250,0.07) 0%, transparent 70%)', animation: 'orb-drift 28s ease-in-out infinite 5s' }} />
      </div>

      {/* ── Nav ──────────────────────────────────────────── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--glass-border)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(6,6,10,0.75)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#7C5CF6,#5E5CF6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(124,92,246,0.35)' }}>
              <Zap size={15} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.04em' }}>EduPulse</span>
          </div>

          {/* Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            <Link href="/how-it-works" className="nav-link">How It Works</Link>
            <Link href="/pitch/comparison" className="nav-link">Compare</Link>
            <Link href="/pitch/roi-calculator" className="nav-link">ROI</Link>
            <div style={{ width: 1, height: 18, background: 'var(--glass-border)' }} />
            <Link href="/educator/login" className="nav-link">Educator Login</Link>
            <Link href="/join/demo" className="btn-primary btn-sm">Student Access</Link>
          </nav>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Hero ─────────────────────────────────────────── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '7rem 1.5rem 5rem' }}>
          <div style={{ maxWidth: 760 }}>
            {/* Pill badge */}
            <div className="lx-badge lx-badge-accent animate-fade-up" style={{ marginBottom: '1.75rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite' }} />
              Pilot running at 3 institutions — EDVentures 2026 Finalist
              <Sparkles size={11} />
            </div>

            {/* Headline */}
            <h1 className="gradient-text animate-fade-up-delay-1" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.25rem)', fontFamily: 'var(--font-display)', fontWeight: 900, marginBottom: '1.375rem' }}>
              Real-time classroom<br />intelligence.
            </h1>
            <p className="animate-fade-up-delay-2" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2.25rem', maxWidth: 540, fontFamily: 'var(--font-body)' }}>
              Students tap once to signal confusion. Teachers see it live — correlated to what they were teaching. Anonymous. Instant. No apps needed.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up-delay-3" style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/educator/login" className="btn-primary">
                Launch Live Demo <ArrowRight size={16} />
              </Link>
              <Link href="/how-it-works" className="btn-ghost">
                See How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 4rem' }}>
          <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
            {[
              { num: '60%', label: 'of students never raise their hand in class', tag: 'RESEARCH' },
              { num: '₹2.1Cr', label: 'annual revenue lost per college to early dropout', tag: 'COST' },
              { num: '48hrs', label: 'before confusion becomes a permanent knowledge gap', tag: 'SCIENCE' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '2.25rem 2rem', borderRight: i < 2 ? '1px solid var(--glass-border)' : 'none' }}>
                <div className="section-label" style={{ marginBottom: '0.75rem' }}>{s.tag}</div>
                <div className="lx-stat-number gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{s.num}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 4rem' }}>
          <div style={{ marginBottom: '2.25rem' }}>
            <div className="section-label" style={{ marginBottom: '0.625rem' }}>How It Works</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>Three steps. Zero overhead.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { n: '01', title: 'Teacher opens launchpad', body: 'One click generates a session QR code and 4-digit PIN. Project it on screen. Zero setup for students.' },
              { n: '02', title: 'Students scan and signal', body: 'Phone camera scan → anonymous tap. "I\'m confused" or "Too fast." No account. No data stored about them.' },
              { n: '03', title: 'Teacher acts on insight', body: 'Live confusion graph updates every 3 seconds. Spike at 11:42 AM? That\'s your recursion explanation. Fix it now.' },
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.75rem' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '1rem', letterSpacing: '0.02em' }}>{s.n}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.625rem', letterSpacing: '-0.02em' }}>{s.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pitch Tools ──────────────────────────────────── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 5rem' }}>
          <div style={{ marginBottom: '2.25rem' }}>
            <div className="section-label" style={{ marginBottom: '0.625rem' }}>For Institutions</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>Everything your Dean needs to say yes.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {[
              { href: '/pitch/roi-calculator', Icon: BarChart3, title: 'ROI Calculator', desc: 'Show exact revenue protected, cost of EduPulse, net return per semester.' },
              { href: '/pitch/comparison', Icon: TrendingUp, title: 'Competitive Analysis', desc: 'Feature-by-feature vs Mentimeter and Blackboard — we win on every axis.' },
              { href: '/admin/outcomes', Icon: BookOpen, title: 'Learning Outcomes', desc: 'Measurable student performance improvement data from real pilot sessions.' },
              { href: '/admin/traction', Icon: Activity, title: 'Traction Dashboard', desc: 'Live session volume, signal count, institutions — all pulling real data.' },
            ].map(({ href, Icon, title, desc }, i) => (
              <Link key={i} href={href} className="glass-card feature-card-link" style={{ display: 'flex', gap: '1.125rem', padding: '1.625rem', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color="#A78BFA" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
                    {title} <ChevronRight size={13} color="var(--text-tertiary)" />
                  </div>
                  <div style={{ fontSize: '0.857rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 6rem' }}>
          <div className="glass-card" style={{ padding: '3.5rem 2.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(124,92,246,0.08), rgba(94,92,246,0.04))', borderColor: 'rgba(124,92,246,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-30%', left: '20%', width: '60%', height: '80%', background: 'radial-gradient(ellipse, rgba(124,92,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <h2 className="gradient-text-shimmer" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: '1rem' }}>
                Ready to transform your classroom?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
                Join the pilot. No installation. No accounts for students. Live signal data in under 60 seconds.
              </p>
              <Link href="/educator/login" className="btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
                Start Your First Session <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer style={{ borderTop: '1px solid var(--glass-border)', padding: '2rem 1.5rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg,#7C5CF6,#5E5CF6)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={11} color="#fff" fill="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>EduPulse</span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                ['/how-it-works', 'How It Works'],
                ['/admin', 'Admin'],
                ['/educator/login', 'Educator'],
                ['/pitch/roi-calculator', 'ROI'],
                ['/pitch/comparison', 'Compare'],
                ['/admin/loi-generator', 'LOI Generator'],
              ].map(([href, label]) => (
                <Link key={href} href={href} style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }}>{label}</Link>
              ))}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>SDG-4 · EDVentures 2026</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
