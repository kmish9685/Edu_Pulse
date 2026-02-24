'use client'

import Link from 'next/link'
import { ArrowLeft, QrCode, ScanLine, Activity, Brain, Shield, BarChart3, Zap, BookOpen, Clock, Tag, AlertTriangle, Check, Users, ChevronRight } from 'lucide-react'

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
            {/* Nav */}
            <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-semibold">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <Link href="/educator/start" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm transition-colors">
                        Start a Class Now →
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16 space-y-24">

                {/* Hero */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <BookOpen className="w-3 h-3" /> Complete Walkthrough
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">How EduPulse Works</h1>
                    <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        Exactly what happens from the moment a teacher opens their laptop to the moment a confused student gets help — step by step, no theory.
                    </p>
                </div>

                {/* ─── FOR TEACHERS ─── */}
                <section>
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-black text-white">The Teacher's Journey</h2>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                step: "01", icon: QrCode, color: "blue",
                                title: "Open the Educator Launchpad",
                                detail: "Before class, the teacher goes to /educator/start on their laptop or tablet. Instantly, a unique 4-digit PIN (e.g. 4972) and a large QR code are generated. No setup. No configuration needed.",
                                action: "Project this screen on the classroom display or whiteboard. Students will see it as they walk in.",
                                link: { href: "/educator/start", label: "Open Educator Launchpad →" }
                            },
                            {
                                step: "02", icon: Tag, color: "indigo",
                                title: "Tag Your Topics During the Lecture",
                                detail: "Once the dashboard is open, there is a Topic Annotation bar at the top. As the teacher changes topics, they type 'Slide 5: Recursion' or 'Live coding: Binary Search' and hit Enter. This drops a timestamp marker on the confusion timeline graph.",
                                action: "Now when you see a spike at 10:22 AM, you know it was during the Recursion explanation — not just 'sometime in class.'"
                            },
                            {
                                step: "03", icon: Activity, color: "purple",
                                title: "Watch the Intelligence Dashboard",
                                detail: "The timeline graph updates every 3 seconds. The teacher sees a smooth area graph. When confusion is low, it's flat. When multiple students signal within 2 minutes, the graph spikes and the AI assistant changes color from blue to amber.",
                                action: "The color change alone is the signal. No need to stop and read long alerts mid-lecture."
                            },
                            {
                                step: "04", icon: Brain, color: "emerald",
                                title: "Respond — Without Breaking Your Flow",
                                detail: "When the AI assistant turns amber, the teacher makes one of two choices: (A) Quick fix — say 'I'll rephrase that last point' and continue. (B) Log it — click 'Mark for Post-Class Review' to revisit after the lecture ends with the full signal data and topic context.",
                                action: "The teacher never has to stop, ask the class 'does everyone understand?', and sit in awkward silence."
                            },
                        ].map((item, i) => (
                            <div key={i} className={`flex gap-6 p-8 rounded-2xl bg-slate-900 border border-white/5 hover:border-${item.color}-500/20 transition-colors`}>
                                <div className={`w-12 h-12 bg-${item.color}-500/10 rounded-xl flex items-center justify-center shrink-0 border border-${item.color}-500/20`}>
                                    <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`text-xs font-black text-${item.color}-500 uppercase tracking-widest`}>Step {item.step}</span>
                                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                    </div>
                                    <p className="text-slate-400 leading-relaxed mb-4">{item.detail}</p>
                                    <div className={`p-4 bg-${item.color}-500/5 border border-${item.color}-500/15 rounded-xl text-sm text-${item.color}-200 font-medium`}>
                                        💡 {item.action}
                                    </div>
                                    {item.link && (
                                        <Link href={item.link.href} className={`inline-flex items-center gap-2 mt-4 text-${item.color}-400 font-bold hover:underline text-sm`}>
                                            {item.link.label} <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── FOR STUDENTS ─── */}
                <section>
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                            <ScanLine className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-black text-white">The Student's Journey</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { icon: ScanLine, color: "emerald", title: "Scan the QR Code", desc: "Open your phone camera and point it at the QR code on the classroom screen. No app download needed. You'll land directly on the signal page." },
                            { icon: Shield, color: "blue", title: "You are 100% Anonymous", desc: "The system never records your name, ID, or device. Not even the teacher can trace who sent which signal. Shy students signal exactly as often as confident ones." },
                            { icon: Zap, color: "indigo", title: "Tap Your Feeling", desc: "Two buttons: 'I'm Confused' and 'Too Fast'. That's it. One tap. Your signal hits the teacher's dashboard within 1 second. No explanation needed." },
                            { icon: Clock, color: "purple", title: "60-Second Cooldown", desc: "After sending a signal, you must wait 60 seconds before sending another. This prevents spam and ensures the data is meaningful. The countdown is displayed on your screen." },
                        ].map((item, i) => (
                            <div key={i} className={`p-6 rounded-2xl bg-slate-900 border border-${item.color}-500/10 hover:border-${item.color}-500/30 transition-colors`}>
                                <div className={`w-10 h-10 bg-${item.color}-500/10 rounded-lg flex items-center justify-center mb-4`}>
                                    <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                                </div>
                                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── Common Questions ─── */}
                <section>
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-black text-white">Every Concern, Answered Directly</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Does this give teachers extra work hours?",
                                a: "No. EduPulse is designed to eliminate re-teaching time. Because you catch confusion during the lecture, you don't have to revisit it in the next class when quiz marks come back bad. You save 1 preparation hour for every hour of active monitoring."
                            },
                            {
                                q: "What if only ONE shy student is lost?",
                                a: "Their signal is logged in the system and attached to the topic you were teaching. It does NOT trigger a class-wide alert. After class, you can view the log and send that student a supplementary resource or a personal email. EduPulse handles both the systemic situation (many students confused) and the individual one (one student lost)."
                            },
                            {
                                q: "What if a student tries to spam the button?",
                                a: "They literally cannot. A hardware-level 60-second cooldown is enforced in the browser's localStorage. Even if they clear the storage, a single student's 2-3 signals will never mathematically trigger a class-wide alert unless there are 3+ students signaling simultaneously. The AI filters isolated noise automatically."
                            },
                            {
                                q: "How does the teacher know what topic caused a spike if they're talking?",
                                a: "Two ways: (1) The Topic Annotation bar lets the teacher type their current slide name at any time. A timestamp marker is dropped on the confusion graph. (2) Even without annotations, the graph shows the exact minute of the spike — the teacher can cross-reference it with their lesson plan or slide deck timestamps."
                            },
                            {
                                q: "What if the student doesn't have a smartphone?",
                                a: "Students can also type the 4-digit PIN manually at edupulse.com/join and it loads the same anonymous signal page. Any device with a browser works — no app installation, no account."
                            },
                            {
                                q: "Who owns the classroom data?",
                                a: "The institution owns all data. It is stored in a private Supabase database and is never shared with third parties. Individual student responses are cryptographically anonymized at submission — they cannot be de-anonymized even with full database access."
                            }
                        ].map((item, i) => (
                            <details key={i} className="group bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
                                <summary className="p-6 font-bold text-white list-none cursor-pointer flex items-center justify-between gap-4">
                                    <span>{item.q}</span>
                                    <ChevronRight className="w-5 h-5 text-slate-500 group-open:rotate-90 transition-transform shrink-0" />
                                </summary>
                                <div className="px-6 pb-6">
                                    <p className="text-slate-400 leading-relaxed border-t border-white/5 pt-4">{item.a}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="text-center bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-12 border border-white/5">
                    <h2 className="text-3xl font-black text-white mb-4">Ready to try it for real?</h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">Open the Educator Launchpad, project the QR code, and ask someone to scan it. The confusion timeline updates in 3 seconds.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/educator/start" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-blue-900/30">
                            Start a Session →
                        </Link>
                        <Link href="/pitch/roi-calculator" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-colors">
                            Calculate Your ROI
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    )
}
