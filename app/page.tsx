import Link from 'next/link'
import { ArrowRight, BarChart3, Users, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">EduPulse</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="#problem" className="text-slate-600 hover:text-slate-900">Problem</Link>
            <Link href="#how-it-works" className="text-slate-600 hover:text-slate-900">How it Works</Link>
            <Link href="/impact" className="text-slate-600 hover:text-slate-900">SDG-4 Impact</Link>
            <Link href="/educator/login" className="text-slate-600 hover:text-slate-900">Educator Login</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-8 border border-blue-100">
              PROTOTYPE v1.0 • EDVENTURES 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              See learning gaps <br className="hidden md:block" /> as they happen.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              EduPulse helps educators understand student confusion in real time—without forcing students to speak. A silent signal for better equity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/student" className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm">
                Enter as Student <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/educator/dashboard" className="w-full sm:w-auto px-8 py-3 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                View Dashboard
              </Link>
            </div>
            <p className="mt-6 text-xs text-slate-400 uppercase tracking-wider font-semibold">
              No Login Required for Students • Anonymous • Secure
            </p>
          </div>
        </section>

        {/* The Problem Section */}
        <section id="problem" className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">The "Silent Classroom" Problem</h2>
                <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                  <p>
                    In large lecture halls and online sessions, <strong className="text-slate-900">80% of confused students never ask a question</strong>.
                  </p>
                  <p>
                    Fear of judgment, language barriers, and fast pacing create an invisible gap between teaching and learning. Educators fly blind, assuming silence means understanding.
                  </p>
                  <div className="p-6 bg-red-50 border border-red-100 rounded-xl mt-6">
                    <p className="text-red-800 text-base font-medium">
                      "I didn't want to slow down the class, so I just stopped listening."
                    </p>
                    <p className="text-red-600 text-sm mt-2">— 1st Year Engineering Student</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200 aspect-square flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-2 p-4 opacity-50">
                  {[...Array(36)].map((_, i) => (
                    <div key={i} className={`rounded-full ${i % 7 === 0 ? 'bg-red-200' : 'bg-slate-200'}`}></div>
                  ))}
                </div>
                <div className="relative z-10 bg-white p-6 shadow-sm border border-slate-200 rounded-lg text-center max-w-xs">
                  <span className="block text-4xl font-bold text-slate-900 mb-1">40%</span>
                  <span className="text-sm text-slate-500">of the class is lost right now.</span>
                  <div className="mt-2 text-xs text-red-500 font-medium">The teacher doesn't know.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">A Simple, Silent Feedback Loop</h2>
              <p className="text-slate-600 mt-4 max-w-2xl mx-auto">No complex LMS. No download. Just a browser tab.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Students Verify</h3>
                <p className="text-slate-600">Students join a session link. No login required to ensure full anonymity and safety.</p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. One-Click Verification</h3>
                <p className="text-slate-600">If confused, a student taps the big button. The signal is sent instantly to the dashboard.</p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Educator Adjusts</h3>
                <p className="text-slate-600">The teacher sees a spike in signals and pauses to re-explain the concept immediately.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          <p className="mb-2"><strong>EduPulse</strong> • EDVentures 2026 Competition Entry</p>
          <p>Designed for SDG-4: Quality Education, Equity, and Inclusion.</p>
        </div>
      </footer>
    </div>
  )
}
