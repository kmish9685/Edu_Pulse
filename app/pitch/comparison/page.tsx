'use client'

import { Check, X, Shield, ArrowLeft, Info } from 'lucide-react'
import Link from 'next/link'

export default function CompetitiveComparison() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <header className="p-6 bg-white border-b border-slate-200 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-slate-600 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </Link>
                <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
                    <Shield className="w-6 h-6 text-indigo-600" />
                    EduPulse Moat Analysis
                </div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-widest hidden md:block">For Institutional Pitch</div>
            </header>

            <main className="max-w-6xl mx-auto p-6 lg:p-12">
                <div className="mb-12 text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold uppercase tracking-widest mb-4">
                        Competitive Positioning
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Why we are playing a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">completely different game.</span>
                    </h1>
                    <p className="text-lg text-slate-600 mt-4">
                        Mentimeter and Poll Everywhere are "event tools." EduPulse is an institutional learning intelligence platform designed to protect revenue and guarantee educational outcomes.
                    </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-12">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-6 font-bold text-slate-400 uppercase tracking-wider text-sm w-1/4">
                                        Core Capability
                                    </th>
                                    <th className="p-6 w-1/4 border-l border-slate-200 bg-white">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl mb-3 shadow-lg shadow-blue-500/20">
                                                <Shield className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="font-bold text-xl text-slate-900">EduPulse</span>
                                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full mt-2">Institutional Platform</span>
                                        </div>
                                    </th>
                                    <th className="p-6 w-1/4 border-l border-slate-200 text-center opacity-70 hover:opacity-100 transition-opacity">
                                        <div className="font-bold text-slate-600 mb-2">Polling Tools</div>
                                        <div className="text-xs text-slate-400 font-medium">(Mentimeter, Slido)</div>
                                    </th>
                                    <th className="p-6 w-1/4 border-l border-slate-200 text-center opacity-70 hover:opacity-100 transition-opacity">
                                        <div className="font-bold text-slate-600 mb-2">Traditional LMS</div>
                                        <div className="text-xs text-slate-400 font-medium">(Blackboard, Canvas)</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {/* Row 1 */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="font-bold text-slate-900 mb-1">Feedback Mechanism</div>
                                        <div className="text-sm text-slate-500">How feedback is collected</div>
                                    </td>
                                    <td className="p-6 border-l border-slate-200 bg-indigo-50/10 text-center">
                                        <div className="inline-flex items-center gap-2 text-indigo-700 font-bold bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                                            Passive & Real-time
                                        </div>
                                    </td>
                                    <td className="p-6 border-l border-slate-200 text-center text-slate-500 font-medium">
                                        Active (Must ask Qs)
                                    </td>
                                    <td className="p-6 border-l border-slate-200 text-center text-slate-500 font-medium">
                                        Post-event Surveys
                                    </td>
                                </tr>

                                {/* Row 2 */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="font-bold text-slate-900 mb-1">Identity Safety</div>
                                        <div className="text-sm text-slate-500">Protection for shy students</div>
                                    </td>
                                    <td className="p-6 border-l border-slate-200 bg-indigo-50/10 text-center">
                                        <div className="flex justify-center"><Check className="w-6 h-6 text-emerald-500" /></div>
                                        <div className="text-xs font-semibold text-slate-600 mt-1">100% Anonymous</div>
                                    </td>
                                    <td className="p-6 border-l border-slate-200 text-center">
                                        <div className="flex justify-center"><Check className="w-6 h-6 text-emerald-500" /></div>
                                        <div className="text-xs text-slate-400 mt-1">Anonymous</div>
                                    </td>
                                    <td className="p-6 border-l border-slate-200 text-center">
                                        <div className="flex justify-center"><X className="w-6 h-6 text-red-400" /></div>
                                        <div className="text-xs text-slate-400 mt-1">Identity Linked</div>
                                    </td>
                                </tr>

                                {/* Row 3 */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="font-bold text-slate-900 mb-1">Time-Series Context</div>
                                        <div className="text-sm text-slate-500">Pinpointing exact confusion metrics</div>
                                    </td>
                                    <td className="p-6 border-l border-slate-200 bg-indigo-50/10 text-center">
                                        <div className="flex justify-center"><Check className="w-6 h-6 text-emerald-500" /></div>
                                        <div className="text-xs font-semibold text-slate-600 mt-1">Timeline Graphing</div>
                                    </td>
                                    <td className="p-6 border-l border-slate-200 text-center">
                                        <div className="flex justify-center"><X className="w-6 h-6 text-red-400" /></div>
                                        <div className="text-xs text-slate-400 mt-1">Static Aggregation</div>
                                    </td>
                                    <td className="p-6 border-l border-slate-200 text-center">
                                        <div className="flex justify-center"><X className="w-6 h-6 text-red-400" /></div>
                                    </td>
                                </tr>

                                {/* Row 4 */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="font-bold text-slate-900 mb-1">Business Value (ROI)</div>
                                        <div className="text-sm text-slate-500">Value to administration</div>
                                    </td>
                                    <td className="p-6 border-l border-slate-200 bg-indigo-50/10 text-center">
                                        <div className="flex justify-center"><Check className="w-6 h-6 text-emerald-500" /></div>
                                        <div className="text-xs font-semibold text-slate-600 mt-1">Dropout Prevention</div>
                                    </td>
                                    <td className="p-6 border-l border-slate-200 text-center">
                                        <div className="flex justify-center"><X className="w-6 h-6 text-red-400" /></div>
                                        <div className="text-xs text-slate-400 mt-1">None</div>
                                    </td>
                                    <td className="p-6 border-l border-slate-200 text-center">
                                        <div className="flex justify-center"><Check className="w-6 h-6 text-emerald-500" /></div>
                                        <div className="text-xs text-slate-400 mt-1">Grade Tracking</div>
                                    </td>
                                </tr>

                                {/* Row 5 */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="font-bold text-slate-900 mb-1">Spam Prevention</div>
                                        <div className="text-sm text-slate-500">Protecting class flow</div>
                                    </td>
                                    <td className="p-6 border-l border-slate-200 bg-indigo-50/10 text-center">
                                        <div className="flex justify-center"><Check className="w-6 h-6 text-emerald-500" /></div>
                                        <div className="text-xs font-semibold text-slate-600 mt-1">Hardware Cooldowns</div>
                                    </td>
                                    <td className="p-6 border-l border-slate-200 text-center">
                                        <div className="flex justify-center"><X className="w-6 h-6 text-red-400" /></div>
                                        <div className="text-xs text-slate-400 mt-1">Open Submission</div>
                                    </td>
                                    <td className="p-6 border-l border-slate-200 text-center">
                                        <div className="text-slate-400 font-medium">N/A</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 md:p-8 flex items-start gap-4">
                    <Info className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-bold text-blue-900 mb-2">The "So What?" for Judges</h3>
                        <p className="text-blue-800 leading-relaxed font-medium">
                            Polling tools are B2C products bought by individual teachers for ₹800/month. EduPulse is a B2B platform bought by the Dean for ₹8,000,000/year to protect ₹2.1 Crore in at-risk tuition. <strong className="font-black text-blue-900">We don't sell quizzes; we sell institutional retention.</strong>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
