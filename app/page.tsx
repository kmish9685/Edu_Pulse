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

        {/* Educator Experience Section */}
        <section id="educator-flow" className="py-24 relative overflow-hidden bg-slate-900 border-t border-white/5">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Protecting the Educator's Flow</h2>
              <p className="text-xl text-slate-400 leading-relaxed">
                Teachers shouldn't have to work extra hours or sacrifice their mental peace to find out what's wrong. EduPulse is designed to make diagnosing confusion effortless, without ever breaking the lecture.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-blue-500/10 hover:border-blue-500/30 transition-all group">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Zero Disruption to Lecture Flow</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  EduPulse acts as an invisible steering wheel. There are no "polls" to launch or questions to type. You teach exactly as you normally do, and the dashboard silently highlights when pacing needs adjustment.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-indigo-500/10 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-7 h-7 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Instant Context via Time-Series</h3>
                <p className="text-slate-400 leading-relaxed">
                  How do you know <em className="text-slate-300">what</em> is confusing? EduPulse links signals to the exact minute of your lecture. A massive spike at 10:14 AM tells you instantly that your explanation of that specific topic missed the mark. No extra questions needed.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-purple-500/10 hover:border-purple-500/30 transition-all group">
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Bulletproof Spam Filtering</h3>
                <p className="text-slate-400 leading-relaxed">
                  What if one kid is just spamming the button? <strong className="text-slate-200 font-medium">They can't.</strong> Hard-coded cooldowns prevent botting. More importantly, isolated single clicks are logged for after-class review but <em className="text-red-300 text-sm bg-red-500/10 px-1 rounded ml-1">DO NOT</em> trigger a class-wide "Confusion Spike", protecting your mental peace from trolls.
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
