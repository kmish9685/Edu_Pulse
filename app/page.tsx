'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, BarChart3, Zap, TrendingUp, BookOpen, Activity, Sparkles, QrCode, Brain, Bell, Shield, Users, Clock, ChevronRight } from 'lucide-react'

// ─── Scroll Reveal Hook ────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── Counting Number ───────────────────────────────────────────
function CountingNumber({ target, suffix = '', prefix = '' }: { target: number, suffix?: string, prefix?: string }) {
  const [value, setValue] = useState(0)
  const { ref, visible } = useScrollReveal(0.2)
  useEffect(() => {
    if (!visible) return
    let start = 0
    const duration = 900
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [visible, target])
  return <span ref={ref}>{prefix}{value}{suffix}</span>
}

// ─── Persona Switcher ──────────────────────────────────────────
const PERSONAS = [
  {
    role: 'Educators',
    Icon: Users,
    headline: 'Stop Teaching Into the Void',
    desc: 'Know exactly which concept lost the class — in real time, while you can still do something about it. Live confusion graph. AI-generated insight. Zero guesswork.',
    cta: 'Open Live Dashboard',
    href: '/educator/login',
  },
  {
    role: 'Dept. Heads',
    Icon: BarChart3,
    headline: 'Evidence-Based Pedagogy Data',
    desc: 'Track confusion rates by course, identify struggling sections before dropout happens, and present actual classroom intelligence to your board — not surveys filled out a week later.',
    cta: 'See Outcomes Data',
    href: '/admin/outcomes',
  },
  {
    role: 'Institutions',
    Icon: TrendingUp,
    headline: 'Protect Tuition Revenue',
    desc: 'Every confused student who stays confused becomes a dropout risk. EduPulse gives institutions measurable ROI on teaching quality — calculate your exact return before committing.',
    cta: 'Calculate ROI',
    href: '/pitch/roi-calculator',
  },
]

// ─── Main Component ────────────────────────────────────────────
export default function Home() {
  const [activePersona, setActivePersona] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const dashPreview = useScrollReveal(0.1)
  const statsReveal = useScrollReveal(0.2)
  const howReveal = useScrollReveal(0.1)
  const featReveal = useScrollReveal(0.1)
  const personaReveal = useScrollReveal(0.1)
  const ctaReveal = useScrollReveal(0.1)

  return (
    <div style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', minHeight: '100vh', overflowX: 'hidden', fontFamily: 'var(--font-body)' }}>

      {/* ── Ambient Orbs ──────────────────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.11) 0%, transparent 70%)', animation: 'orb-drift 22s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '50%', height: '55%', background: 'radial-gradient(ellipse, rgba(79,70,229,0.07) 0%, transparent 70%)', animation: 'orb-drift 28s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '50%', left: '35%', width: '35%', height: '35%', background: 'radial-gradient(ellipse, rgba(129,140,248,0.05) 0%, transparent 70%)', animation: 'orb-drift 34s ease-in-out infinite 10s' }} />
      </div>

      {/* ── Nav ───────────────────────────────────────────────── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: `1px solid ${scrolled ? 'var(--border-strong)' : 'var(--border)'}`, backdropFilter: 'blur(24px)', background: 'rgba(7,7,12,0.82)', transition: 'border-color 0.3s' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.75rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #6366F1, #4F46E5)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,0.35)' }}>
              <Zap size={14} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.05em' }}>EduPulse</span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            <Link href="/how-it-works" className="nav-link">How It Works</Link>
            <Link href="/pitch/comparison" className="nav-link">Compare</Link>
            <Link href="/pitch/roi-calculator" className="nav-link">ROI</Link>
            <Link href="/admin" className="nav-link">Admin</Link>
            <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
            <Link href="/educator/login" className="nav-link" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Educator Login</Link>
            <Link href="/join/demo" className="btn-primary btn-sm">Try as Student</Link>
          </nav>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ══ SECTION 01 — TENSION STATEMENT HERO ══════════════ */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '96px 1.75rem 64px' }}>

          {/* Rotated vertical label */}
          <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)' }}>
            <span className="rotated-label">[ Live Intelligence ]</span>
          </div>

          {/* Center content */}
          <div style={{ textAlign: 'center', maxWidth: 900 }}>

            {/* Oversize tension statement */}
            <h1
              className="animate-fade-up"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 9vw, 144px)',
                fontWeight: 700,
                letterSpacing: '-0.06em',
                lineHeight: 0.92,
                marginBottom: '2.5rem',
                color: 'var(--text-primary)',
              }}
            >
              Your students<br />
              are confused<br />
              <span className="gradient-text" style={{ display: 'inline-block' }}>right now.</span>
            </h1>

            {/* Rule + tagline */}
            <div style={{ width: 60, height: 1, background: 'var(--border-strong)', margin: '0 auto 1.5rem' }} />
            <p
              className="animate-fade-up-delay-1"
              style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 520, margin: '0 auto 2.5rem' }}
            >
              EduPulse tells you exactly when, and about what —<br />
              so you can act before confusion hardens into a knowledge gap.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up-delay-2" style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem' }}>
              <Link href="/educator/login" className="btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
                Start a Free Session <ArrowRight size={16} />
              </Link>
              <Link href="/how-it-works" className="btn-ghost" style={{ fontSize: '0.95rem', padding: '0.75rem 1.5rem' }}>
                See How It Works
              </Link>
            </div>

            {/* Trust badges */}
            <div className="animate-fade-up-delay-3" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['No student accounts', 'Anonymous by design', 'SDG-4 Aligned', 'Live at 3 institutions'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', opacity: 0.4 }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Scroll</span>
            <div style={{ width: 1, height: 24, background: 'var(--text-tertiary)' }} />
          </div>
        </section>

        {/* ══ SECTION 02 — DASHBOARD PREVIEW ══════════════════ */}
        <section style={{ padding: '0 2rem 6rem' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div className="section-label" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Live Classroom Intelligence</div>
            <div
              ref={dashPreview.ref}
              className="glass-card"
              style={{
                padding: '1.5rem',
                borderColor: 'rgba(99,102,241,0.18)',
                boxShadow: '0 60px 120px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.1)',
                transform: dashPreview.visible ? 'translateY(0)' : 'translateY(48px)',
                opacity: dashPreview.visible ? 1 : 0,
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
              }}
            >
              {/* Mock topbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', paddingBottom: '0.875rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Live Session · PIN 2847</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>3s ago</span>
              </div>

              {/* Mock confusion bar chart */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div className="section-label" style={{ marginBottom: '0.625rem' }}>Confusion Timeline · Last 30 min</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: 80 }}>
                  {[12, 8, 6, 14, 22, 18, 10, 8, 6, 10, 42, 38, 30, 16, 10, 8, 6, 8, 12, 10, 8, 14, 26, 18, 12, 8].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${(h / 42) * 100}%`, background: h > 30 ? 'var(--danger)' : h > 18 ? 'var(--warning)' : 'var(--accent)', borderRadius: '3px 3px 0 0', opacity: h > 30 ? 1 : 0.5, minHeight: 2, transition: 'height 0.3s ease' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>10:30 AM</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Now</span>
                </div>
              </div>

              {/* AI alert */}
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '0.75rem', marginBottom: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <Bell size={14} color="var(--danger)" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.1rem' }}>Spike detected · 11:04 AM</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>4+ students signaled "I'm Confused" in the last 60 seconds. Pause and recap the last concept.</div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
                {[{ n: '28', l: 'Students' }, { n: '14', l: 'Signals' }, { n: '2.3%', l: 'Confusion' }].map(s => (
                  <div key={s.l} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 10, padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.04em', marginBottom: '0.15rem' }}>{s.n}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ SECTION 03 — STATS (3 numbers) ══════════════════ */}
        <section
          ref={statsReveal.ref}
          style={{
            maxWidth: 1200, margin: '0 auto', padding: '0 1.75rem 7rem',
            opacity: statsReveal.visible ? 1 : 0,
            transform: statsReveal.visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { target: 60, suffix: '%', label: 'of students never raise their hand in a lecture hall', sub: 'Source: Active Learning Research' },
              { prefix: '₹', target: 21, suffix: 'M+', label: 'annual revenue at risk per institution from preventable dropout', sub: 'Based on 2024 AICTE data' },
              { target: 48, suffix: 'hrs', label: 'before confusion hardens into a permanent knowledge gap', sub: 'Cognitive Load Theory' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '2.5rem 2rem', borderLeft: i > 0 ? '1px solid var(--border)' : 'none' }}>
                <div className="section-label" style={{ marginBottom: '0.875rem' }}>Insight {String(i + 1).padStart(2, '0')}</div>
                <div className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: '2.75rem', fontWeight: 700, letterSpacing: '-0.05em', marginBottom: '0.625rem' }}>
                  <CountingNumber target={s.target} suffix={s.suffix} prefix={s.prefix} />
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.5rem' }}>{s.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ SECTION 04 — HOW IT WORKS (editorial rows) ══════ */}
        <section
          ref={howReveal.ref}
          style={{
            maxWidth: 1200, margin: '0 auto', padding: '0 1.75rem 7rem',
            opacity: howReveal.visible ? 1 : 0,
            transition: 'opacity 0.6s ease 0.1s',
          }}
        >
          <div className="section-label" style={{ marginBottom: '3rem' }}>How It Works</div>

          {[
            { n: '01', Icon: QrCode, title: 'Open your launchpad', body: 'One click generates a session QR code and a 4-digit PIN. Set your lecture agenda in advance — no mid-class typing.' },
            { n: '02', Icon: Bell, title: 'Students signal anonymously', body: '"I\'m Confused" or "Too Fast" — one tap. No app download. No account. Phone camera + browser is all they need.' },
            { n: '03', Icon: Brain, title: 'Act on live intelligence', body: 'Your confusion graph updates every 3 seconds. Topic annotations let you correlate every spike to your exact slide.' },
          ].map(({ n, Icon, title, body }, i) => (
            <div key={n}>
              <div style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr', gap: '4rem', alignItems: 'center', padding: '3rem 0' }}>
                {/* Step number side */}
                {i % 2 === 0 ? (
                  <>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '7rem', fontWeight: 700, letterSpacing: '-0.05em', color: 'var(--border-strong)', lineHeight: 1, marginBottom: '1.5rem' }}>{n}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>Step {n}</div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', letterSpacing: '-0.04em', marginBottom: '0.875rem' }}>{title}</h3>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 440 }}>{body}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{ width: 72, height: 72, borderRadius: 18, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={30} color="var(--accent-soft)" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div style={{ width: 72, height: 72, borderRadius: 18, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={30} color="var(--accent-soft)" />
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '7rem', fontWeight: 700, letterSpacing: '-0.05em', color: 'var(--border-strong)', lineHeight: 1, marginBottom: '1.5rem' }}>{n}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>Step {n}</div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', letterSpacing: '-0.04em', marginBottom: '0.875rem' }}>{title}</h3>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 440, marginLeft: 'auto' }}>{body}</p>
                    </div>
                  </>
                )}
              </div>
              {i < 2 && <div style={{ height: 1, background: 'var(--border)' }} />}
            </div>
          ))}
        </section>

        {/* ══ SECTION 05 — FEATURES (asymmetric grid) ══════════ */}
        <section
          ref={featReveal.ref}
          style={{
            maxWidth: 1200, margin: '0 auto', padding: '0 1.75rem 7rem',
            opacity: featReveal.visible ? 1 : 0,
            transform: featReveal.visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        >
          <div style={{ marginBottom: '3rem' }}>
            <div className="section-label" style={{ marginBottom: '0.875rem' }}>Core Features</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.04em' }}>
              Built for the realities of a classroom.
            </h2>
          </div>

          {/* Assymetric grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: 1, background: 'var(--border)', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)' }}>

            {/* Row 1 */}
            <div style={{ padding: '2rem', background: 'var(--bg-surface)' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-soft)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>01</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em', marginBottom: '0.625rem' }}>AI-Powered Insight Engine</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>The system detects whether a spike is isolated noise or a real class-wide confusion moment. One student panicking ≠ the same response as five students panicking simultaneously.</p>
            </div>
            <div style={{ padding: '2rem', background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-soft)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>02</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Pre-set Lecture Agenda</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>Add topics before class. Hit "Next Topic" once. Every signal timestamped and correlated.</p>
            </div>

            {/* Row 2 — flipped col widths */}
            <div style={{ gridColumn: '1 / -1', height: 1, background: 'var(--border)' }} />

            <div style={{ padding: '2rem', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              {/* TYPE-ONLY pull quote cell */}
              <p className="pull-quote">
                "Five students confused simultaneously is a classroom event.<br />
                One student is a personal moment."
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>— EduPulse Signal Intelligence</div>
            </div>
            <div style={{ padding: '2rem', background: 'var(--bg-surface)' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-soft)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>03</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Spam-Proof & Anonymous</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>60-second cooldown prevents spam. No accounts. No personal data. PDPA and FERPA-aligned.</p>
            </div>

            <div style={{ gridColumn: '1 / -1', height: 1, background: 'var(--border)' }} />

            {/* Row 3 */}
            <div style={{ padding: '2rem', background: 'var(--bg-surface)' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-soft)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>04</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em', marginBottom: '0.625rem' }}>Institutional Intelligence</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>The admin panel shows cross-session metrics, confusion patterns by topic, and pilot ROI data. Give your head of department a live dashboard that proves impact.</p>
            </div>
            <div style={{ padding: '2rem', background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-soft)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>05</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Zero-Friction for Students</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>Phone camera → scan QR → one tap. No download. No account. Works on 3G.</p>
            </div>
          </div>
        </section>

        {/* ══ SECTION 06 — WHO IT'S FOR (persona switcher) ════ */}
        <section
          ref={personaReveal.ref}
          style={{
            maxWidth: 1200, margin: '0 auto', padding: '0 1.75rem 7rem',
            opacity: personaReveal.visible ? 1 : 0,
            transform: personaReveal.visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        >
          <div style={{ marginBottom: '3rem' }}>
            <div className="section-label" style={{ marginBottom: '0.875rem' }}>Built For</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.04em' }}>
              The whole institution benefits.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '3rem', alignItems: 'start' }}>
            {/* Left rail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {PERSONAS.map((p, i) => (
                <button
                  key={p.role}
                  onClick={() => setActivePersona(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 10,
                    background: activePersona === i ? 'var(--accent-dim)' : 'transparent',
                    border: 'none',
                    borderLeft: `3px solid ${activePersona === i ? 'var(--accent)' : 'transparent'}`,
                    color: activePersona === i ? 'var(--accent-soft)' : 'var(--text-tertiary)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: activePersona === i ? 700 : 500,
                    fontSize: '1rem',
                    letterSpacing: '-0.02em',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <p.Icon size={15} />
                  {p.role}
                </button>
              ))}
            </div>

            {/* Right panel */}
            <div
              key={activePersona}
              className="persona-panel"
              style={{ padding: '2.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16 }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', letterSpacing: '-0.04em', marginBottom: '1rem' }}>
                {PERSONAS[activePersona].headline}
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '2rem' }}>
                {PERSONAS[activePersona].desc}
              </p>
              <Link href={PERSONAS[activePersona].href} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-soft)', textDecoration: 'none', fontFamily: 'var(--font-display)' }}>
                {PERSONAS[activePersona].cta} <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ PITCH TOOLS ══════════════════════════════════════ */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.75rem 7rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div className="section-label" style={{ marginBottom: '0.875rem' }}>Institutional Pitch Kit</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.04em' }}>
              Everything your Dean needs to say yes.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            {[
              { href: '/pitch/roi-calculator', Icon: BarChart3, title: 'ROI Calculator', desc: 'Show exact revenue protected, cost of EduPulse, and net return per semester. Built for institutional budget conversations.' },
              { href: '/pitch/comparison', Icon: TrendingUp, title: 'Competitive Analysis', desc: 'Feature-by-feature comparison against Mentimeter, Poll Everywhere, and Blackboard. We win on every axis.' },
              { href: '/admin/outcomes', Icon: BookOpen, title: 'Learning Outcomes', desc: 'Student performance improvement data from real pilot sessions. Real signals from real classrooms.' },
              { href: '/admin/traction', Icon: Activity, title: 'Traction Dashboard', desc: 'Live-updating pilot metrics: session volume, signal count, institutions onboarded.' },
            ].map(({ href, Icon, title, desc }) => (
              <Link
                key={title}
                href={href}
                className="feature-card-link"
                style={{ display: 'flex', gap: '1.25rem', padding: '1.875rem', background: 'var(--glass-bg)', textDecoration: 'none', color: 'inherit', transition: 'background 0.15s' }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color="var(--accent-soft)" />
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

        {/* ══ SECTION 07 — CTA BANNER ══════════════════════════ */}
        <section
          ref={ctaReveal.ref}
          style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.75rem 8rem' }}
        >
          <div
            className="glass-card"
            style={{
              padding: '5rem 3rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.10), rgba(79,70,229,0.04))',
              borderColor: 'rgba(99,102,241,0.20)',
              position: 'relative',
              overflow: 'hidden',
              transform: ctaReveal.visible ? 'translateY(0)' : 'translateY(32px)',
              opacity: ctaReveal.visible ? 1 : 0,
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Ambient glow inside card */}
            <div style={{ position: 'absolute', top: '-30%', left: '15%', right: '15%', bottom: '-20%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Rotated badge */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '-1.5rem', transform: 'rotate(15deg)', padding: '0.25rem 0.75rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 100, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-soft)', whiteSpace: 'nowrap' }}>
              PILOT PROGRAMME OPEN
            </div>

            <div style={{ position: 'relative' }}>
              <div className="section-label" style={{ marginBottom: '1.25rem' }}>Get Started Today</div>
              <h2 className="gradient-text-shimmer" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '1.25rem' }}>
                Your next lecture could be<br />your best one yet.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 2.75rem' }}>
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
        <footer style={{ borderTop: '1px solid var(--border)', padding: '2.25rem 1.75rem' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={11} color="#fff" fill="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>EduPulse</span>
            </div>
            <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
              {[
                ['/how-it-works', 'How It Works'],
                ['/admin', 'Admin Panel'],
                ['/educator/login', 'Educator Login'],
                ['/pitch/roi-calculator', 'ROI Calculator'],
                ['/pitch/comparison', 'Compare'],
              ].map(([href, label]) => (
                <Link key={href} href={href} style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                >{label}</Link>
              ))}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>SDG-4 Aligned · EDVentures 2026</div>
          </div>
        </footer>

      </div>
    </div>
  )
}
