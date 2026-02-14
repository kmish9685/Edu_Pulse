'use client'

import { Check, X, Star, Zap, Brain, LayoutDashboard, Clock, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CompetitiveComparison() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[100px]" />
            </div>

            <main className="relative z-10 container mx-auto px-4 py-16 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <Zap className="w-3 h-3" /> Superior By Design
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Why EduPulse <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Wins</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Traditional tools extract data. EduPulse generates intelligence. See how we compare to the status quo.
                    </p>
                </div>

                {/* Comparison Card */}
                <div className="glass-card p-1 rounded-3xl bg-gradient-to-b from-slate-700 to-slate-800 shadow-2xl overflow-hidden">
                    <div className="bg-slate-950/95 rounded-[22px] overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="p-6 md:p-8 min-w-[200px] bg-slate-900/50 backdrop-blur sticky left-0 z-20">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Capabilities</span>
                                    </th>
                                    <th className="p-6 md:p-8 min-w-[150px] text-center">
                                        <div className="text-slate-400 font-semibold mb-1">Verbal Q&A</div>
                                        <div className="text-xs text-slate-600">The "Any Questions?" method</div>
                                    </th>
                                    <th className="p-6 md:p-8 min-w-[150px] text-center bg-slate-900/30">
                                        <div className="text-slate-400 font-semibold mb-1">Poll Everywhere</div>
                                        <div className="text-xs text-slate-600">Clickers & Polls</div>
                                    </th>
                                    <th className="p-6 md:p-8 min-w-[180px] text-center relative bg-indigo-900/10 border-x border-indigo-500/20">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                                        <div className="text-white font-bold text-lg mb-1 flex items-center justify-center gap-2">
                                            EduPulse <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        </div>
                                        <div className="text-xs text-indigo-300">Learning Intelligence</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {/* Participation */}
                                <tr className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 md:p-8 font-medium text-slate-300 sticky left-0 bg-slate-950 group-hover:bg-slate-900 z-10 transition-colors border-r border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded bg-slate-800 text-slate-400"><Users className="w-4 h-4" /></div>
                                            Participation Rate
                                        </div>
                                    </td>
                                    <td className="p-6 text-center text-slate-500">~12%</td>
                                    <td className="p-6 text-center text-slate-400 bg-slate-900/30">~45%</td>
                                    <td className="p-6 text-center relative bg-indigo-900/10 border-x border-indigo-500/20">
                                        <span className="text-2xl font-bold text-emerald-400">74%</span>
                                    </td>
                                </tr>

                                {/* Timeliness */}
                                <tr className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 md:p-8 font-medium text-slate-300 sticky left-0 bg-slate-950 group-hover:bg-slate-900 z-10 transition-colors border-r border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded bg-slate-800 text-slate-400"><Clock className="w-4 h-4" /></div>
                                            Feedback Speed
                                        </div>
                                    </td>
                                    <td className="p-6 text-center text-slate-500">Real-time</td>
                                    <td className="p-6 text-center text-slate-400 bg-slate-900/30">Real-time</td>
                                    <td className="p-6 text-center relative bg-indigo-900/10 border-x border-indigo-500/20">
                                        <span className="font-bold text-white">Real-time</span>
                                    </td>
                                </tr>

                                {/* Specificity */}
                                <tr className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 md:p-8 font-medium text-slate-300 sticky left-0 bg-slate-950 group-hover:bg-slate-900 z-10 transition-colors border-r border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded bg-slate-800 text-slate-400"><Brain className="w-4 h-4" /></div>
                                            Insight Depth
                                        </div>
                                    </td>
                                    <td className="p-6 text-center text-slate-500 text-sm">Vague / None</td>
                                    <td className="p-6 text-center text-slate-400 text-sm bg-slate-900/30">Teacher-defined</td>
                                    <td className="p-6 text-center relative bg-indigo-900/10 border-x border-indigo-500/20">
                                        <span className="font-bold text-indigo-300">AI-Detected Topics</span>
                                    </td>
                                </tr>

                                {/* Setup Time */}
                                <tr className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 md:p-8 font-medium text-slate-300 sticky left-0 bg-slate-950 group-hover:bg-slate-900 z-10 transition-colors border-r border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded bg-slate-800 text-slate-400"><LayoutDashboard className="w-4 h-4" /></div>
                                            Setup Required
                                        </div>
                                    </td>
                                    <td className="p-6 text-center text-emerald-400 font-bold">None</td>
                                    <td className="p-6 text-center text-slate-400 text-sm bg-slate-900/30">5-10 min / class</td>
                                    <td className="p-6 text-center relative bg-indigo-900/10 border-x border-indigo-500/20">
                                        <span className="font-bold text-emerald-400">None (Zero-Touch)</span>
                                    </td>
                                </tr>

                                {/* Institutional Intelligence */}
                                <tr className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 md:p-8 font-medium text-slate-300 sticky left-0 bg-slate-950 group-hover:bg-slate-900 z-10 transition-colors border-r border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded bg-slate-800 text-slate-400"><Zap className="w-4 h-4" /></div>
                                            Institutional Memory
                                        </div>
                                    </td>
                                    <td className="p-6 text-center"><X className="w-5 h-5 text-slate-600 mx-auto" /></td>
                                    <td className="p-6 text-center bg-slate-900/30"><X className="w-5 h-5 text-slate-600 mx-auto" /></td>
                                    <td className="p-6 text-center relative bg-indigo-900/10 border-x border-indigo-500/20">
                                        <div className="flex justify-center"><Check className="w-6 h-6 text-emerald-400" /></div>
                                        <div className="text-[10px] text-emerald-400/80 mt-1 uppercase tracking-wider font-bold">Exclusive</div>
                                    </td>
                                </tr>

                                {/* Cost */}
                                <tr className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 md:p-8 font-medium text-slate-300 sticky left-0 bg-slate-950 group-hover:bg-slate-900 z-10 transition-colors border-r border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded bg-slate-800 text-slate-400">$</div>
                                            Cost / Department
                                        </div>
                                    </td>
                                    <td className="p-6 text-center text-emerald-400 font-bold">Free</td>
                                    <td className="p-6 text-center text-slate-400 bg-slate-900/30">₹1.4 Lakh / yr</td>
                                    <td className="p-6 text-center relative bg-indigo-900/10 border-x border-indigo-500/20">
                                        <span className="font-bold text-white">₹1.0 Lakh / yr</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Key Differentiator Box */}
                <div className="mt-12 glass-card p-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600">
                    <div className="bg-slate-950/90 rounded-[14px] p-8 backdrop-blur-xl flex flex-col md:flex-row items-center gap-8">
                        <div className="p-4 rounded-full bg-indigo-500/20 text-indigo-300 shrink-0">
                            <Brain className="w-8 h-8" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold text-white mb-2">The Critical Difference</h3>
                            <p className="text-slate-300 leading-relaxed">
                                EduPulse is the <span className="text-white font-bold decoration-indigo-500 underline decoration-2 underline-offset-4">ONLY</span> solution with Learning Intelligence.
                                While others just collect signals, we identify recurring confusion patterns across semesters, enabling
                                systemic curriculum improvements that reduce failure rates.
                            </p>
                        </div>
                        <Link href="/educator/dashboard" className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 shrink-0">
                            View Live Demo <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div className="mt-16 text-center border-t border-slate-800/50 pt-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium">
                        Back to Home <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
