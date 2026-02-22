import Link from 'next/link'
import { ArrowRight, BarChart3, Users, Zap, Check, X, TrendingUp, Calculator, Shield, Brain } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-200 bg-slate-950 selection:bg-indigo-500/30">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Zap className="text-white w-6 h-6 fill-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">EduPulse</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#problem" className="text-slate-400 hover:text-white transition-colors">The Crisis</Link>
            <Link href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">How it Works</Link>
            <Link href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
            <div className="h-4 w-px bg-white/10"></div>
            <Link href="/educator/login" className="text-white hover:text-blue-400 transition-colors">Educator Login</Link>
            <Link href="/student" className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-semibold transition-all">
              Student Access
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-5xl text-center">

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 animate-float">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              EDVentures 2026 Finalist
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8 leading-tight">
              See learning gaps <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                before they fail you.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              EduPulse is <span className="text-white font-semibold">not a polling tool</span>. It's an institutional intelligence platform that stops dropout rates by detecting confusion in real-time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/educator/dashboard" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 text-lg group">
                Launch Live Demo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/pitch/roi-calculator" className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-lg backdrop-blur-sm">
                <Calculator className="w-5 h-5 text-slate-400" /> Calculate ROI
              </Link>
            </div>

            {/* Social Proof Strip */}
            <div className="border-y border-white/5 py-8 bg-black/20 backdrop-blur-sm">
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-slate-500 font-semibold text-sm uppercase tracking-widest">
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 50+ Classes</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 1,200+ Students</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 12k+ Signals</span>
              </div>
            </div>
          </div>
        </section>

        {/* Differentiation Banner */}
        <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-y border-white/5">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="glass-card p-1 rounded-3xl bg-gradient-to-r from-red-500/20 to-blue-500/20">
              <div className="bg-slate-950/90 backdrop-blur-xl rounded-[22px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <X className="w-6 h-6 text-red-500" /> We are NOT "Poll Everywhere"
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-6">
                    Traditional tools wait for you to ask questions. <strong className="text-white">EduPulse doesn't wait.</strong> We passively detect confusion using anonymity and AI, identifying learning gaps you didn't even know existed.
                  </p>
                  <Link href="/pitch/comparison" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors">
                    See the Full Comparison <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="flex-1 w-full max-w-sm">
                  <div className="bg-slate-900 rounded-xl p-6 border border-white/10 relative">
                    <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full border-4 border-slate-950">VS</div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center opacity-50">
                        <span className="text-sm font-medium">Clickers / Polls</span>
                        <span className="text-xs bg-slate-800 px-2 py-1 rounded">Active</span>
                      </div>
                      <div className="h-px bg-white/10"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-white flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500" /> EduPulse Real-Time</span>
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30">Passive & AI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Addressing Concerns / FAQ */}
        <section id="how-it-works" className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">You have questions. We have data.</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Addressing the most common concerns from administrators, educators, and IT departments.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Concern 1: Extra Time */}
              <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 hover:bg-slate-900 transition-colors">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Does this require teachers to teach extra hours?</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  <strong className="text-slate-200">No. EduPulse is an in-lecture steering wheel, not an after-class review tool.</strong> Because feedback is real-time, teachers clarify doubts instantly. This prevents the need to re-teach entire concepts next week when students fail their quizzes. We make the existing 50-minute lecture more efficient.
                </p>
              </div>

              {/* Concern 2: Anti-Spam */}
              <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 hover:bg-slate-900 transition-colors">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                  <Shield className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">How do you prevent students from spamming?</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  <strong className="text-slate-200">Hard-coded 60-second cooldowns and device fingerprinting.</strong> A student literally cannot spam the system. Furthermore, the teacher's dashboard only triggers a 'Confusion Spike' alert if multiple different students signal simultaneously, filtering out isolated noise.
                </p>
              </div>

              {/* Concern 3: Context */}
              <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 hover:bg-slate-900 transition-colors">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 border border-purple-500/20">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">How does the teacher know WHAT is confusing?</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  <strong className="text-slate-200">Time-series correlation.</strong> If there is a massive spike in confusion at exactly 10:14 AM, the teacher knows exactly what topic they were teaching at that moment. Students don't need to type long essays; the timing of the signal provides the context automatically.
                </p>
              </div>

              {/* Concern 4: Single Student */}
              <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 hover:bg-slate-900 transition-colors">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">What if only ONE shy student is lost?</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  <strong className="text-slate-200">EduPulse targets systemic curriculum failures, not 1-on-1 tutoring.</strong> The teacher shouldn't stop 59 students for 1 confused student. However, that signal is logged. The dashboard shows it as a minor event, allowing the teacher to send supplementary material after class without derailing the live lecture.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 relative">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Institutional-Grade Pricing</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Flexible tiers designed for departments, campuses, and full university networks.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Tier 1 */}
              <div className="glass-card p-8 rounded-2xl flex flex-col border border-white/5 hover:border-white/10 transition-colors relative group">
                <div className="mb-6">
                  <div className="text-blue-400 font-bold text-sm uppercase tracking-wider mb-2">Department Pilot</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">₹50k</span>
                    <span className="text-slate-500">/ semester</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <Check className="w-5 h-5 text-blue-500 shrink-0" /> 10-15 Active Classes
                  </li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <Check className="w-5 h-5 text-blue-500 shrink-0" /> Basic Analytics
                  </li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <Check className="w-5 h-5 text-blue-500 shrink-0" /> Email Support
                  </li>
                </ul>
                <button className="w-full py-3 rounded-xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-colors">Start Pilot</button>
              </div>

              {/* Tier 2 (Popular) */}
              <div className="glass-card p-1 rounded-2xl bg-gradient-to-b from-blue-500 to-indigo-600 relative shadow-2xl shadow-blue-900/30 transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>
                <div className="bg-slate-950/95 rounded-[14px] p-8 h-full flex flex-col backdrop-blur-xl">
                  <div className="mb-6">
                    <div className="text-indigo-400 font-bold text-sm uppercase tracking-wider mb-2">School / Campus</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">₹2.0L</span>
                      <span className="text-slate-500">/ year</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-start gap-3 text-white text-sm font-medium">
                      <Check className="w-5 h-5 text-indigo-400 shrink-0" /> 50-100 Classes
                    </li>
                    <li className="flex items-start gap-3 text-white text-sm font-medium">
                      <Check className="w-5 h-5 text-indigo-400 shrink-0" /> <span className="text-indigo-300">Recurring Gap Detection</span> (AI)
                    </li>
                    <li className="flex items-start gap-3 text-white text-sm font-medium">
                      <Check className="w-5 h-5 text-indigo-400 shrink-0" /> Outcomes Tracker
                    </li>
                    <li className="flex items-start gap-3 text-white text-sm font-medium">
                      <Check className="w-5 h-5 text-indigo-400 shrink-0" /> Branding Customization
                    </li>
                  </ul>
                  <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25">Get Full Access</button>
                </div>
              </div>

              {/* Tier 3 */}
              <div className="glass-card p-8 rounded-2xl flex flex-col border border-white/5 hover:border-white/10 transition-colors">
                <div className="mb-6">
                  <div className="text-purple-400 font-bold text-sm uppercase tracking-wider mb-2">University Enterprise</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">₹8.0L</span>
                    <span className="text-slate-500">/ year</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <Check className="w-5 h-5 text-purple-500 shrink-0" /> Unlimited Classes
                  </li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <Check className="w-5 h-5 text-purple-500 shrink-0" /> Full Institutional Intelligence
                  </li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <Check className="w-5 h-5 text-purple-500 shrink-0" /> LMS Integration
                  </li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <Check className="w-5 h-5 text-purple-500 shrink-0" /> Dedicated Success Manager
                  </li>
                </ul>
                <button className="w-full py-3 rounded-xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-colors">Contact Sales</button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/5 bg-slate-950 py-12 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-50">
            <Shield className="w-5 h-5" />
            <span className="font-bold tracking-tight">EduPulse AI</span>
          </div>
          <p className="text-slate-500 text-sm mb-2">
            Designed for <strong className="text-slate-400">UN SDG-4: Quality Education</strong>
          </p>
          <p className="text-slate-600 text-xs">
            © 2026 EduPulse Team • Built for EDVentures
          </p>
        </div>
      </footer>
    </div>
  )
}
