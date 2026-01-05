'use client'

import { useState, useEffect } from 'react'
import { Bell, ChevronDown, LayoutDashboard, Settings, LogOut, Users, FileText, Activity, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
    const [pulseValue, setPulseValue] = useState(12)
    const [signals, setSignals] = useState<number[]>([5, 8, 12, 4, 3, 15, 22, 18, 5, 2, 4, 8])

    // Simulate live data
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly update current pulse
            const newValue = Math.floor(Math.random() * 25)
            setPulseValue(newValue)

            // Update chart array (shift left, add new)
            setSignals(prev => [...prev.slice(1), newValue])
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0">
                <div className="p-6 border-b border-slate-800">
                    <span className="font-bold text-white text-xl tracking-tight">EduPulse</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 bg-slate-800 text-white rounded-lg">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                        Session History
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 hover:text-white transition-colors">
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors">
                        <LogOut className="w-5 h-5" />
                        End Session
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">CS101: Intro to Algorithms</h1>
                        <p className="text-slate-500">Live Session • 42 Students Online</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            System Active
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-600">
                            <Bell className="w-6 h-6" />
                        </button>
                        <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                    </div>
                </div>

                {/* Live Pulse Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-slate-500" />
                                Live Confusion Pulse
                            </h2>
                            <span className="text-xs text-slate-400 uppercase font-semibold">Real-time (Last 5m)</span>
                        </div>

                        {/* CSS Bar Chart */}
                        <div className="h-64 flex items-end justify-between gap-2">
                            {signals.map((val, i) => (
                                <div key={i} className="w-full bg-slate-100 rounded-t-sm relative group">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-slate-900 transition-all duration-1000 rounded-t-sm opacity-80 group-hover:opacity-100"
                                        style={{ height: `${val * 3}%` }} // Scale mock data
                                    ></div>
                                    {/* Tooltip */}
                                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                                        {val} Signals
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-between text-xs text-slate-400 font-medium">
                            <span>5 mins ago</span>
                            <span>Now</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Current Status */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Current Confusion Level</h3>
                            <div className="flex items-end gap-2">
                                <span className={`text-5xl font-bold ${pulseValue > 15 ? 'text-red-500' : 'text-slate-900'}`}>{pulseValue}%</span>
                                <span className="text-slate-400 mb-2">of class signaled</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${pulseValue > 15 ? 'bg-red-500' : 'bg-slate-900'}`}
                                    style={{ width: `${pulseValue}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* AI Insight */}
                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                            <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> AI Insight
                            </h3>
                            <p className="text-indigo-800 text-sm leading-relaxed">
                                Momentum has slowed. <strong className="font-semibold">6 students</strong> flagged "Too Fast" in the last minute. Consider summarizing the last key point before moving on.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tag Distribution */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Signal Breakdown</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">"I'm Confused" (Generic)</span>
                                    <span className="font-semibold">65%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full">
                                    <div className="bg-slate-800 h-2 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">"Too Fast"</span>
                                    <span className="font-semibold">25%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full">
                                    <div className="bg-slate-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">"Need Example"</span>
                                    <span className="font-semibold">10%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full">
                                    <div className="bg-slate-400 h-2 rounded-full" style={{ width: '10%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Recent Feedback</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-slate-600 p-2 bg-slate-50 rounded-lg">
                                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                Signal from Anonymous Student
                                <span className="ml-auto text-xs text-slate-400">Just now</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600 p-2 bg-slate-50 rounded-lg">
                                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                Signal from Anonymous Student
                                <span className="ml-auto text-xs text-slate-400">12s ago</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600 p-2 bg-slate-50 rounded-lg">
                                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                "Too Fast" Signal
                                <span className="ml-auto text-xs text-slate-400">45s ago</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    )
}
