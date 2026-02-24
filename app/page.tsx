'use client'

import Link from 'next/link'
import { ArrowRight, BarChart3, Zap, TrendingUp, BookOpen, Activity, ChevronRight, Sparkles, QrCode, Brain, Bell, Shield, Users, Clock } from 'lucide-react'

export default function Home() {
  return (
    <div style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', minHeight: '100vh', overflowX: 'hidden', fontFamily: 'var(--font-body)' }}>

      {/* Ambient orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(ellipse, rgba(124,92,246,0.13) 0%, transparent 70%)', animation: 'orb-drift 20s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '50%', height: '55%', background: 'radial-gradient(ellipse, rgba(94,92,246,0.09) 0%, transparent 70%)', animation: 'orb-drift 25s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '50%', left: '35%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 70%)', animation: 'orb-drift 30s ease-in-out infinite 8s' }} />
      </div>

      {/* Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--glass-border)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', background: 'rgba(6,6,10,0.80)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 1.75rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#7C5CF6,#5E5CF6)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(124,92,246,0.4)' }}>
              <Zap size={16} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.05em' }}>EduPulse</span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link href="/how-it-works" className="nav-link">How It Works</Link>
            <Link href="/pitch/comparison" className="nav-link">Compare</Link>
            <Link href="/pitch/roi-calculator" className="nav-link">ROI</Link>
            <Link href="/admin" className="nav-link">Admin</Link>
            <div style={{ width: 1, height: 18, background: 'var(--glass-border)' }} />
            <Link href="/educator/login" className="nav-link" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Educator Login</Link>
            <Link href="/join/demo" className="btn-primary btn-sm">Try as Student</Link>
          </nav>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ══ HERO ════════════════════════════════════════════ */}
        <section style={{ maxWidth: 1140, margin: '0 auto', padding: '8rem 1.75rem 5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div className="lx-badge lx-badge-accent animate-fade-up" style={{ marginBottom: '1.75rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite' }} />
              Live at 3 institutions · EDVentures 2026 Finalist
              <Sparkles size={11} />
            </div>
            <h1 className="animate-fade-up-delay-1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.05em', marginBottom: '1.5rem' }}>
              Know exactly when<br />
              <span className="gradient-text">your class loses you.</span>
            </h1>
            <p className="animate-fade-up-delay-2" style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2.25rem', maxWidth: 460 }}>
              EduPulse lets students send anonymous confusion signals in one tap. Teachers see a live graph of understanding — correlated to what they were teaching — and can act in real time.
            </p>
            <div className="animate-fade-up-delay-3" style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2.5rem' }}>
              <Link href="/educator/login" className="btn-primary">
                Start a Free Session <ArrowRight size={16} />
              </Link>
              <Link href="/how-it-works" className="btn-ghost">
                Watch How It Works
              </Link>
            </div>
            {/* Trust badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {['No student accounts', 'Anonymous by design', 'SDG-4 Aligned'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)' }} />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual — mock dashboard card */}
          <div style={{ position: 'relative' }}>
            <div className="glass-card" style={{ padding: '1.5rem', borderColor: 'rgba(124,92,246,0.2)', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,92,246,0.1)' }}>
              {/* Mock topbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', paddingBottom: '0.875rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Live Session · PIN 2847</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>3s ago</span>
              </div>

              {/* Mock confusion spikes visualizer */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>Confusion Timeline · Last 30 min</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: 72 }}>
                  {[12, 8, 6, 14, 22, 18, 10, 8, 6, 10, 42, 38, 30, 16, 10, 8, 6, 8, 12, 10, 8, 14, 26, 18, 12, 8].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${(h / 42) * 100}%`, background: h > 30 ? 'var(--danger)' : h > 18 ? 'var(--warning)' : 'var(--accent)', borderRadius: '3px 3px 0 0', opacity: h > 30 ? 1 : 0.5, minHeight: 2 }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>10:30 AM</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Now</span>
                </div>
              </div>

              {/* AI alert */}
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '0.75rem', marginBottom: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <Bell size={14} color="var(--danger)" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.1rem' }}>Spike detected · 11:04 AM</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>4+ students signaled "I'm Confused" in the last 60 seconds. Pause and recap the last concept.</div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
                {[{ n: '28', l: 'Students' }, { n: '14', l: 'Signals' }, { n: '2.3%', l: 'Confusion' }].map(s => (
                  <div key={s.l} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 10, padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.04em', marginBottom: '0.15rem' }}>{s.n}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Glow behind card */}
            <div style={{ position: 'absolute', top: '20%', left: '10%', right: '10%', bottom: '0', background: 'radial-gradient(ellipse, rgba(124,92,246,0.2) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }} />
          </div>
        </section>

        {/* ══ STATS ══════════════════════════════════════════ */}
        <section style={{ maxWidth: 1140, margin: '0 auto', padding: '0 1.75rem 5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--glass-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
            {[
              { num: '60%', label: 'of students never raise their hand in a lecture hall', sub: 'Source: Active Learning Research' },
              { num: '₹2.1Cr', label: 'annual revenue lost per institution to preventable dropout', sub: 'Based on 2024 AICTE data' },
              { num: '48 hrs', label: 'before confusion hardens into permanent knowledge gaps', sub: 'Cognitive Load Theory' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '2.25rem 1.75rem', background: 'var(--glass-bg)' }}>
                <div className="section-label" style={{ marginBottom: '0.75rem' }}>Insight {String(i + 1).padStart(2, '0')}</div>
                <div className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.05em', marginBottom: '0.5rem' }}>{s.num}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.5rem' }}>{s.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ HOW IT WORKS ══════════════════════════════════ */}
        <section style={{ maxWidth: 1140, margin: '0 auto', padding: '0 1.75rem 5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>How It Works</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.04em' }}>Up and running in under 60 seconds.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {[
              { n: '01', Icon: QrCode, title: 'Open your launchpad', body: 'One click generates a session QR code and a 4-digit PIN. Set your lecture agenda in advance — no mid-class typing.' },
              { n: '02', Icon: Bell, title: 'Students signal anonymously', body: '"I\'m Confused" or "Too Fast" — one tap. No app download. No account. Phone camera + browser is all they need.' },
              { n: '03', Icon: Brain, title: 'Act on live intelligence', body: 'Your confusion graph updates every 3 seconds. Topic annotations let you correlate every spike to your exact slide.' },
            ].map(({ n, Icon, title, body }) => (
              <div key={n} className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} color="#A78BFA" />
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.04em' }}>STEP {n}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em', marginBottom: '0.625rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ FEATURES ════════════════════════════════════ */}
        <section style={{ maxWidth: 1140, margin: '0 auto', padding: '0 1.75rem 5rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Core Features</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.04em' }}>Built for the realities of a classroom.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--glass-border)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            {[
              { Icon: Brain, title: 'AI-Powered Insight Engine', desc: 'The system detects whether a spike is isolated noise or a real class-wide confusion moment. One student panicking ≠ the same response as five students panicking simultaneously.' },
              { Icon: Clock, title: 'Pre-set Lecture Agenda', desc: 'Add your topics before class. During the lecture, hit "Next Topic" once. Every signal is automatically timestamped and correlated to your curriculum — zero typing mid-session.' },
              { Icon: Shield, title: 'Spam-Proof & Anonymous', desc: 'A 60-second cooldown prevents spam. No student accounts. No personal data stored. Signals are session-scoped and expire — fully PDPA and FERPA-aligned.' },
              { Icon: TrendingUp, title: 'Institutional Intelligence', desc: 'The admin panel shows cross-session metrics, confusion patterns by topic, and pilot ROI data. Give your head of department a live dashboard that proves impact.' },
              { Icon: QrCode, title: 'Zero-Friction for Students', desc: 'Phone camera → scan QR → one tap. That\'s the entire student journey. No download. No account. No friction. Even works on 3G connections.' },
              { Icon: Users, title: 'Scales with Your Cohort', desc: 'From 15-person seminars to 400-seat lecture halls — EduPulse handles it all. Signal aggregation is designed for large class sizes where individual signals would be noise.' },
            ].map(({ Icon, title, desc }, i) => (
              <div key={i} style={{ padding: '2rem', background: 'var(--glass-bg)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon size={16} color="#A78BFA" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.857rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ WHO IS IT FOR ══════════════════════════════════ */}
        <section style={{ maxWidth: 1140, margin: '0 auto', padding: '0 1.75rem 5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Built For</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.04em' }}>The whole institution benefits.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
            {[
              { role: 'Educators', Icon: Users, desc: 'Stop guessing — know in real time which concept lost the class. Reduce re-teaching in the next session by acting now.', href: '/educator/login', cta: 'Open Dashboard' },
              { role: 'Department Heads', Icon: BarChart3, desc: 'Track confusion rates by course, identify struggling sections, and present evidence-based pedagogy data to your board.', href: '/admin/outcomes', cta: 'See Outcomes Data' },
              { role: 'Institutions', Icon: TrendingUp, desc: 'Reduce dropout, protect tuition revenue, and show measurable learning improvement. Calculate your exact ROI before committing.', href: '/pitch/roi-calculator', cta: 'Calculate ROI' },
            ].map(({ role, Icon, desc, href, cta }) => (
              <div key={role} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color="#A78BFA" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>{role}</h3>
                  <p style={{ fontSize: '0.857rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
                </div>
                <Link href={href} style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', fontWeight: 700, color: '#A78BFA', textDecoration: 'none' }}>
                  {cta} <ChevronRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ══ PITCH TOOLS ════════════════════════════════════ */}
        <section style={{ maxWidth: 1140, margin: '0 auto', padding: '0 1.75rem 5rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Institutional Pitch Kit</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.04em' }}>Everything your Dean needs to say yes.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'var(--glass-border)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            {[
              { href: '/pitch/roi-calculator', Icon: BarChart3, title: 'ROI Calculator', desc: 'Show exact revenue protected, cost of EduPulse, and net return per semester. Built for institutional budget conversations.' },
              { href: '/pitch/comparison', Icon: TrendingUp, title: 'Competitive Analysis', desc: 'Feature-by-feature comparison against Mentimeter, Poll Everywhere, and Blackboard Collaborate. We win on every axis.' },
              { href: '/admin/outcomes', Icon: BookOpen, title: 'Learning Outcomes', desc: 'Student performance improvement data from real pilot sessions. Not simulated numbers — real signals from real classrooms.' },
              { href: '/admin/traction', Icon: Activity, title: 'Traction Dashboard', desc: 'Live-updating pilot metrics: session volume, signal count, institutions onboarded. Data that moves as we grow.' },
            ].map(({ href, Icon, title, desc }, i) => (
              <Link key={i} href={href} style={{ display: 'flex', gap: '1.25rem', padding: '1.875rem', background: 'var(--glass-bg)', textDecoration: 'none', color: 'inherit', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--glass-bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--glass-bg)')}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color="#A78BFA" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.025em', marginBottom: '0.4rem' }}>
                    {title} <ChevronRight size={13} color="var(--text-tertiary)" />
                  </div>
                  <div style={{ fontSize: '0.857rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══ CTA BANNER ══════════════════════════════════════ */}
        <section style={{ maxWidth: 1140, margin: '0 auto', padding: '0 1.75rem 7rem' }}>
          <div className="glass-card" style={{ padding: '4rem 2.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(124,92,246,0.09), rgba(94,92,246,0.04))', borderColor: 'rgba(124,92,246,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40%', left: '10%', right: '10%', bottom: '-20%', background: 'radial-gradient(ellipse, rgba(124,92,246,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div className="section-label" style={{ marginBottom: '1rem' }}>Get Started Today</div>
              <h2 className="gradient-text-shimmer" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '1.125rem' }}>
                Your next lecture could be<br />your best one yet.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, maxWidth: 500, margin: '0 auto 2.5rem' }}>
                No installation. No accounts for students. Live signal data in under 60 seconds. Join the pilot programme.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/educator/login" className="btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
                  Start a Free Session <ArrowRight size={17} />
                </Link>
                <Link href="/admin/loi-generator" className="btn-ghost" style={{ fontSize: '0.95rem', padding: '0.75rem 1.5rem' }}>
                  Get a Letter of Intent
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid var(--glass-border)', padding: '2.25rem 1.75rem' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg,#7C5CF6,#5E5CF6)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={12} color="#fff" fill="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>EduPulse</span>
            </div>
            <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
              {['/how-it-works', '/admin', '/educator/login', '/pitch/roi-calculator', '/pitch/comparison', '/admin/loi-generator'].map((href, i) => (
                <Link key={href} href={href} style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500 }}>
                  {['How It Works', 'Admin Panel', 'Educator Login', 'ROI Calculator', 'Compare', 'LOI Generator'][i]}
                </Link>
              ))}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>SDG-4 Aligned · EDVentures 2026</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
