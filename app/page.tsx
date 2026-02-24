import Link from 'next/link'
import { ArrowRight, BarChart3, Zap, TrendingUp, QrCode, Shield, BookOpen, Activity, ChevronRight } from 'lucide-react'

export default function Home() {
  return (
    <div style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <header style={{ borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)', background: 'rgba(9,9,14,0.85)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>EduPulse</span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/how-it-works" style={{ color: 'var(--text-secondary)', fontSize: '0.857rem', fontWeight: 500, textDecoration: 'none' }}>How It Works</Link>
            <Link href="/pitch/comparison" style={{ color: 'var(--text-secondary)', fontSize: '0.857rem', fontWeight: 500, textDecoration: 'none' }}>Compare</Link>
            <Link href="/pitch/roi-calculator" style={{ color: 'var(--text-secondary)', fontSize: '0.857rem', fontWeight: 500, textDecoration: 'none' }}>ROI</Link>
            <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
            <Link href="/educator/login" style={{ color: 'var(--text-secondary)', fontSize: '0.857rem', fontWeight: 500, textDecoration: 'none' }}>Educator Login</Link>
            <Link href="/join/demo" className="lx-btn lx-btn-primary" style={{ fontSize: '0.8rem', padding: '0.375rem 0.875rem' }}>Student Access</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 1.5rem 4rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 680 }}>
          <div className="lx-badge" style={{ marginBottom: '1.5rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
            Pilot running at 3 institutions — EDVentures 2026 Finalist
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Real-time classroom intelligence.<br />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>No apps. No friction. No noise.</span>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '2rem', maxWidth: 520 }}>
            Students tap once to signal confusion. Teachers see it in real-time on a live graph, correlated with what they were teaching — anonymously, instantly.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/educator/login" className="lx-btn lx-btn-primary" style={{ padding: '0.625rem 1.25rem', fontSize: '0.9rem' }}>
              Launch Live Demo <ArrowRight size={15} />
            </Link>
            <Link href="/how-it-works" className="lx-btn lx-btn-ghost" style={{ padding: '0.625rem 1.25rem', fontSize: '0.9rem' }}>
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-surface)' }}>
          {[
            { num: '60%', label: 'of students never raise their hand in class', note: 'RESEARCH FINDING' },
            { num: '₹2.1Cr', label: 'annual revenue lost per college to early dropout', note: 'INSTITUTIONAL COST' },
            { num: '48hrs', label: 'before confusion becomes permanent knowledge gap', note: 'LEARNING SCIENCE' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '2rem', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>{s.note}</div>
              <div className="lx-stat-number">{s.num}</div>
              <div style={{ fontSize: '0.857rem', color: 'var(--text-secondary)', marginTop: '0.375rem', lineHeight: 1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>How It Works</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Three steps. Zero overhead.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}>
          {[
            { n: '01', title: 'Teacher opens launchpad', body: 'One click generates a session QR code and 4-digit PIN. Project it. No setup, no login for students.' },
            { n: '02', title: 'Students scan and signal', body: 'Phone camera scan → anonymous tap. "I\'m confused" or "Too fast." No account. No data stored about them.' },
            { n: '03', title: 'Teacher acts on insight', body: 'Live confusion graph updates every 3 seconds. Spike at 11:42 AM? That\'s your recursion example. Fix it now.' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-surface)', padding: '1.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums', marginBottom: '0.875rem', letterSpacing: '0.02em' }}>{s.n}</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem', letterSpacing: '-0.015em' }}>{s.title}</div>
              <div style={{ fontSize: '0.857rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pitch Tools Grid */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>For Institutions</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Everything your Dean needs to say yes.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'var(--border)' }}>
          {[
            { href: '/pitch/roi-calculator', icon: BarChart3, title: 'ROI Calculator', desc: 'Show exact financial impact: revenue protected, cost of EduPulse, net return.' },
            { href: '/pitch/comparison', icon: TrendingUp, title: 'Competitive Analysis', desc: 'Feature-by-feature comparison against Mentimeter and Blackboard.' },
            { href: '/admin/outcomes', icon: BookOpen, title: 'Learning Outcomes', desc: 'Measurable student performance improvement data from pilot sessions.' },
            { href: '/admin/traction', icon: Activity, title: 'Traction Dashboard', desc: 'Live-updating pilot metrics. Session volume, signal count, institutions.' },
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{ background: 'var(--bg-surface)', padding: '1.75rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', textDecoration: 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-surface)')}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border-accent)' }}>
                <item.icon size={15} color="var(--accent)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', letterSpacing: '-0.015em', color: 'var(--text-primary)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  {item.title} <ChevronRight size={13} color="var(--text-tertiary)" />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 22, height: 22, background: 'var(--accent)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={11} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.857rem', color: 'var(--text-secondary)' }}>EduPulse</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { href: '/how-it-works', label: 'How It Works' },
              { href: '/admin', label: 'Admin' },
              { href: '/educator/login', label: 'Educator' },
              { href: '/pitch/roi-calculator', label: 'ROI Calculator' },
              { href: '/pitch/comparison', label: 'Compare' },
              { href: '/admin/loi-generator', label: 'LOI Generator' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500 }}>{l.label}</Link>
            ))}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>SDG-4 Aligned · EDVentures 2026</div>
        </div>
      </footer>
    </div>
  )
}
