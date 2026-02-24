import Link from 'next/link'
import { ArrowRight, BarChart3, Users, Zap, Check, X, TrendingUp, Calculator, Shield, Brain, QrCode, AlertTriangle, BookOpen, Clock, ScanLine, MessageSquareQuote, FileText, Activity, ChevronRight } from 'lucide-react'

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
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#problem" className="text-slate-400 hover:text-white transition-colors">The Crisis</Link>
            <Link href="/how-it-works" className="text-slate-400 hover:text-white transition-colors">How It Works</Link>
            <Link href="/pitch/comparison" className="text-slate-400 hover:text-white transition-colors">Compare</Link>
            <Link href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
            <div className="h-4 w-px bg-white/10"></div>
            <Link href="/educator/login" className="text-white hover:text-blue-400 transition-colors font-semibold">Educator Login</Link>
            <Link href="/join/demo" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 border border-blue-500 rounded-lg text-white font-bold transition-all">
              Student Access
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10">

        {/* ─── Hero ─── */}
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
              EduPulse is <span className="text-white font-semibold">not a polling tool</span>. It's an institutional intelligence platform that stops dropout rates by detecting confusion in real-time — without breaking the teacher's flow.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/educator/start" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 text-lg group">
                Launch Live Demo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-lg backdrop-blur-sm">
                <BookOpen className="w-5 h-5 text-slate-400" /> How It Works
              </Link>
            </div>

            {/* Social Proof */}
            <div className="border-y border-white/5 py-8 bg-black/20 backdrop-blur-sm">
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-slate-500 font-semibold text-sm uppercase tracking-widest">
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 50+ Classes</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 1,200+ Students</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 12k+ Signals</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── The Crisis ─── */}
        <section id="problem" className="py-24 bg-slate-950 border-t border-white/5">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-6">
                <AlertTriangle className="w-3 h-3" /> The Silent Crisis in Classrooms
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Every day, students are lost.<br />Teachers don't know it.</h2>
              <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">Shy students won't raise their hand. The teacher moves on. The confusion compounds. The student disengages. And eventually, they drop out.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { stat: "60%", label: "of confused students never ask for help in class", color: "red" },
                { stat: "₹2.1Cr", label: "in tuition revenue lost per 100 dropouts at a mid-size university", color: "orange" },
                { stat: "48hrs", label: "before a teacher discovers a student was lost — when quiz marks come back", color: "amber" },
              ].map((item, i) => (
                <div key={i} className={`p-8 rounded-2xl bg-${item.color}-500/5 border border-${item.color}-500/20 text-center`}>
                  <div className={`text-5xl font-black text-${item.color}-400 mb-4`}>{item.stat}</div>
                  <p className="text-slate-400 leading-relaxed">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 font-medium">
                EduPulse fixes this. Students signal anonymously. Teachers respond in real-time.
                <Link href="/how-it-works" className="text-blue-400 font-bold hover:underline flex items-center gap-1">See how <ChevronRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── How It Works — 3-Step Visual ─── */}
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-y border-white/5">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Zero Complexity. Real Impact.</h2>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto">No app downloads. No accounts for students. Three steps and the classroom is connected.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* connector line */}
              <div className="hidden md:block absolute top-12 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px bg-gradient-to-r from-blue-500/50 via-indigo-500/50 to-purple-500/50"></div>

              {[
                { step: "01", icon: QrCode, color: "blue", title: "Teacher Opens Session", desc: "The teacher goes to /educator/start and a unique 4-digit PIN + QR Code is instantly generated. They project it on their classroom screen." },
                { step: "02", icon: ScanLine, color: "indigo", title: "Students Scan & Join", desc: "Students simply point their phone camera at the code. No account needed. They land on a clean screen with two anonymous buttons." },
                { step: "03", icon: Activity, color: "purple", title: "Real-Time Intelligence Flows", desc: "Every signal is plotted on the teacher's Time-Series Graph. The AI watches for spikes and alerts the teacher — while they're still teaching the relevant concept." },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center relative">
                  <div className={`w-16 h-16 bg-${item.color}-500/10 border-2 border-${item.color}-500/30 rounded-2xl flex items-center justify-center mb-6 z-10`}>
                    <item.icon className={`w-8 h-8 text-${item.color}-400`} />
                  </div>
                  <div className={`text-xs font-black text-${item.color}-500 uppercase tracking-widest mb-3`}>Step {item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link href="/how-it-works" className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                <BookOpen className="w-5 h-5" /> Full Walkthrough with Screenshots
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Protecting the Educator's Flow ─── */}
        <section className="py-24 bg-slate-900 border-t border-white/5">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Protecting the Educator's Flow</h2>
              <p className="text-xl text-slate-400 leading-relaxed">
                Teachers shouldn't have to work extra hours or sacrifice their mental peace. EduPulse makes diagnosing confusion effortless without ever interrupting the lecture.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-blue-500/10 hover:border-blue-500/30 transition-all group">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Zero Disruption to Lecture Flow</h3>
                <p className="text-slate-400 leading-relaxed">
                  EduPulse acts as an invisible steering wheel. No polls to launch. No questions to type. Teach exactly as you do, and the dashboard silently highlights when pacing needs adjustment.
                </p>
              </div>

              <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-indigo-500/10 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-7 h-7 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Instant Context via Topic Tagging</h3>
                <p className="text-slate-400 leading-relaxed">
                  Teachers can annotate their lecture topics in real-time — "Slide 4: Recursion" — so every confusion spike is automatically correlated to the exact concept being taught. <span className="text-indigo-400 font-medium">No guesswork.</span>
                </p>
              </div>

              <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-purple-500/10 hover:border-purple-500/30 transition-all group">
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Bulletproof Spam Filtering</h3>
                <p className="text-slate-400 leading-relaxed">
                  One bored student clicking won't disrupt anyone. <strong className="text-white">A 60-second cooldown per device is enforced.</strong> Isolated single clicks log silently for after-class review. Only <em className="text-red-300">3+ signals in 2 minutes</em> trigger a live alert.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Not a Polling Tool Banner ─── */}
        <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-y border-white/5">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="glass-card p-1 rounded-3xl bg-gradient-to-r from-red-500/20 to-blue-500/20">
              <div className="bg-slate-950/90 backdrop-blur-xl rounded-[22px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <X className="w-6 h-6 text-red-500" /> We are NOT "Poll Everywhere"
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-6">
                    Traditional tools wait for you to ask questions. <strong className="text-white">EduPulse doesn't wait.</strong> We passively detect confusion using anonymity, time-series AI, and topic correlation — identifying learning gaps you didn't even know existed.
                  </p>
                  <Link href="/pitch/comparison" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors">
                    See the Full Competitive Analysis <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-xs w-full">
                  {[
                    { label: "ROI Calculator", href: "/pitch/roi-calculator", icon: Calculator },
                    { label: "Outcomes Tracker", href: "/admin/outcomes", icon: TrendingUp },
                    { label: "Traction Data", href: "/admin/traction", icon: Activity },
                    { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
                  ].map((item, i) => (
                    <Link key={i} href={item.href} className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center transition-colors group">
                      <item.icon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-slate-300">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Pricing ─── */}
        <section id="pricing" className="py-24 relative">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Institutional-Grade Pricing</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Flexible tiers designed for departments, campuses, and full university networks.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-2xl flex flex-col border border-white/5 hover:border-white/10 transition-colors relative group">
                <div className="mb-6">
                  <div className="text-blue-400 font-bold text-sm uppercase tracking-wider mb-2">Department Pilot</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">₹50k</span>
                    <span className="text-slate-500">/ semester</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-slate-300 text-sm"><Check className="w-5 h-5 text-blue-500 shrink-0" /> 10-15 Active Classes</li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm"><Check className="w-5 h-5 text-blue-500 shrink-0" /> Basic Analytics</li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm"><Check className="w-5 h-5 text-blue-500 shrink-0" /> Email Support</li>
                </ul>
                <Link href="/admin/loi-generator" className="w-full py-3 rounded-xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-colors text-center block">Start Pilot</Link>
              </div>

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
                    <li className="flex items-start gap-3 text-white text-sm font-medium"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> 50-100 Classes</li>
                    <li className="flex items-start gap-3 text-white text-sm font-medium"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> <span className="text-indigo-300">Recurring Gap Detection</span> (AI w/ Topic Tagging)</li>
                    <li className="flex items-start gap-3 text-white text-sm font-medium"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> Outcomes Tracker</li>
                    <li className="flex items-start gap-3 text-white text-sm font-medium"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> Branding Customization</li>
                  </ul>
                  <Link href="/admin/loi-generator" className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25 text-center block">Get Full Access</Link>
                </div>
              </div>

              <div className="glass-card p-8 rounded-2xl flex flex-col border border-white/5 hover:border-white/10 transition-colors">
                <div className="mb-6">
                  <div className="text-purple-400 font-bold text-sm uppercase tracking-wider mb-2">University Enterprise</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">₹8.0L</span>
                    <span className="text-slate-500">/ year</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-slate-300 text-sm"><Check className="w-5 h-5 text-purple-500 shrink-0" /> Unlimited Classes</li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm"><Check className="w-5 h-5 text-purple-500 shrink-0" /> Full Institutional Intelligence</li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm"><Check className="w-5 h-5 text-purple-500 shrink-0" /> LMS Integration</li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm"><Check className="w-5 h-5 text-purple-500 shrink-0" /> Dedicated Success Manager</li>
                </ul>
                <Link href="/admin/loi-generator" className="w-full py-3 rounded-xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-colors text-center block">Contact Sales</Link>
              </div>
            </div>

            {/* ROI link */}
            <div className="text-center mt-12">
              <Link href="/pitch/roi-calculator" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium">
                <Calculator className="w-4 h-4" /> Not sure which tier? Calculate your exact ROI first →
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/5 bg-slate-950 py-12 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white w-4 h-4 fill-white" />
                </div>
                <span className="font-bold text-white">EduPulse</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">Institutional Learning Intelligence for the modern classroom.</p>
            </div>
            <div>
              <div className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-4">Platform</div>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/educator/start" className="hover:text-white transition-colors">Start a Class (QR)</Link></li>
                <li><Link href="/educator/login" className="hover:text-white transition-colors">Educator Login</Link></li>
                <li><Link href="/join/demo" className="hover:text-white transition-colors">Student Access</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-4">Pitch Tools</div>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/pitch/roi-calculator" className="hover:text-white transition-colors">ROI Calculator</Link></li>
                <li><Link href="/pitch/comparison" className="hover:text-white transition-colors">Competitive Analysis</Link></li>
                <li><Link href="/admin/outcomes" className="hover:text-white transition-colors">Outcomes Tracker</Link></li>
                <li><Link href="/admin/traction" className="hover:text-white transition-colors">Traction Data</Link></li>
                <li><Link href="/admin/loi-generator" className="hover:text-white transition-colors">LOI Generator</Link></li>
                <li><Link href="/admin/testimonials" className="hover:text-white transition-colors">Testimonials</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-4">Learn</div>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="#problem" className="hover:text-white transition-colors">The Crisis in Education</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center">
            <p className="text-slate-500 text-sm mb-2">
              Designed for <strong className="text-slate-400">UN SDG-4: Quality Education</strong>
            </p>
            <p className="text-slate-600 text-xs">
              © 2026 EduPulse Team • Built for EDVentures
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
