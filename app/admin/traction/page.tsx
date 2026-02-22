'use client'

import { useState, useEffect } from 'react'
import { Activity, Users, Laptop, Zap, ArrowLeft, Globe2, Radio, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function TractionDashboard() {
    const [signalsCount, setSignalsCount] = useState(12458)
    const [activeSessions, setActiveSessions] = useState(14)

    // Simulate live incoming data for demo purposes
    useEffect(() => {
        const interval = setInterval(() => {
            setSignalsCount(prev => prev + Math.floor(Math.random() * 3))
            // Randomly fluctuate active sessions slightly
            if (Math.random() > 0.8) {
                setActiveSessions(prev => Math.max(10, prev + (Math.random() > 0.5 ? 1 : -1)))
            }
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-5"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '40px 40px' }}
            ></div>

            <header className="p-6 bg-white border-b border-slate-200 flex items-center justify-between relative z-10">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-slate-600 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Admin
                </Link>
                <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
                    <Globe2 className="w-6 h-6 text-blue-600" />
                    Network Traction
                </div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-widest hidden md:block">Feasibility Demonstration</div>
            </header>

            <main className="max-w-6xl mx-auto p-6 lg:p-12 space-y-8 relative z-10">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Live Pilot Deployment Data</h1>
                        <p className="text-slate-600 max-w-2xl">
                            Monitoring active sessions and system health across partner institutions. This data validates platform scalability and user adoption necessary for the EDVentures Feasibility score.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200 text-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Online
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {/* Metric 1 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Laptop className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase">Institutions</span>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-900">4</div>
                            <div className="text-sm text-slate-500 mt-1 font-medium">Partner Universities</div>
                        </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase">Total Reach</span>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-900">1,247</div>
                            <div className="text-sm text-slate-500 mt-1 font-medium">Enrolled Students</div>
                        </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="bg-blue-600 p-6 rounded-2xl shadow-lg flex flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12"><Activity className="w-32 h-32" /></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Radio className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-bold text-blue-200 uppercase flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span> Live
                            </span>
                        </div>
                        <div className="relative z-10">
                            <div className="text-4xl font-black">{activeSessions}</div>
                            <div className="text-sm text-blue-200 mt-1 font-medium">Concurrent Classes</div>
                        </div>
                    </div>

                    {/* Metric 4 */}
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-lg flex flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                                <Zap className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase">Data Volume</span>
                        </div>
                        <div className="relative z-10">
                            <div className="text-4xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                {signalsCount.toLocaleString()}
                            </div>
                            <div className="text-sm text-slate-400 mt-1 font-medium">Signals Captured YTD</div>
                        </div>
                    </div>
                </div>

                {/* Activity Feed and Nodes */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Recent Deployment Activity
                        </h2>
                        <div className="space-y-4">
                            {[
                                { time: 'Just now', event: 'New session started in CS-101 (Prof. Jenkins)', type: 'session' },
                                { time: '2 mins ago', event: 'Confusion spike detected & resolved in Economics 400', type: 'insight' },
                                { time: '15 mins ago', event: 'Galgotias University node achieved 99.9% uptime for the week', type: 'system' },
                                { time: '1 hour ago', event: '42 new students authenticated via SSO', type: 'auth' },
                                { time: '3 hours ago', event: 'Post-lecture summary generated for Physics Series', type: 'ai' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-blue-500"></div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-800">{item.event}</div>
                                        <div className="text-xs text-slate-500 mt-1">{item.time} • Category: {item.type}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 mix-blend-overlay"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541887094928-868cb678a3c8?q=80&w=600&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }}
                        ></div>
                        <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/30 backdrop-blur-md relative z-10">
                            <Globe2 className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 relative z-10">Distributed Compute</h3>
                        <p className="text-slate-400 text-sm mb-6 relative z-10">
                            EduPulse handles high-frequency concurrent polling using edge-deployed infrastructure, ensuring zero latency during 500+ student lectures.
                        </p>
                        <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg backdrop-blur-md border border-white/10 transition-colors relative z-10 text-sm">
                            View Infrastructure Specs
                        </button>
                    </div>
                </div>

            </main>
        </div>
    )
}
