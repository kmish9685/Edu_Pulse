'use client'

import { useState } from 'react'
import { RotateCcw, Shield, Users, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
    const [resetParams, setResetParams] = useState(false)

    const handleReset = () => {
        setResetParams(true)
        setTimeout(() => setResetParams(false), 2000)
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-8">
            <header className="max-w-4xl mx-auto mb-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 text-white rounded-lg">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold">EduPulse Admin</h1>
                </div>
                <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                    Exit to Home
                </Link>
            </header>

            <main className="max-w-4xl mx-auto space-y-8">
                {/* System Overview */}
                <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold mb-6">System Overview</h2>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="text-sm text-slate-500 mb-1">Active Classes</div>
                            <div className="text-3xl font-bold">12</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="text-sm text-slate-500 mb-1">Total Signals (Last Hr)</div>
                            <div className="text-3xl font-bold">1,420</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="text-sm text-slate-500 mb-1">Avg Response Time</div>
                            <div className="text-3xl font-bold">2.4s</div>
                        </div>
                    </div>
                </section>

                {/* Active Classes List */}
                <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Active Sessions</h2>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Live
                        </span>
                    </div>

                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border-b border-slate-100 last:border-0 hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">CS10{i}: Intro to Algorithmic Thinking</div>
                                        <div className="text-xs text-slate-500">Prof. Sarah Jenkins • 42 Students</div>
                                    </div>
                                </div>
                                <div className="font-mono text-sm font-semibold text-slate-600">
                                    {12 + i * 5}% Confusion
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Data Controls */}
                <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-red-600">Danger Zone</h2>
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-lg">
                        <div>
                            <div className="font-semibold text-red-900">Reset All Demo Data</div>
                            <div className="text-sm text-red-700">Clears all active signals and resets dashboard counters.</div>
                        </div>
                        <button
                            onClick={handleReset}
                            disabled={resetParams}
                            className="px-4 py-2 bg-white border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-50 active:scale-95 transition-all flex items-center gap-2"
                        >
                            {resetParams ? (
                                <><CheckCircle2 className="w-4 h-4" /> Resetting...</>
                            ) : (
                                <><RotateCcw className="w-4 h-4" /> Reset Data</>
                            )}
                        </button>
                    </div>
                </section>

                <div className="text-center text-xs text-slate-400 mt-8">
                    EduPulse Admin Panel • Restricted Access
                </div>
            </main>
        </div>
    )
}
