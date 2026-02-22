'use client'

import { useState, useEffect } from 'react'
import { Bell, ChevronDown, LayoutDashboard, Settings, LogOut, Users, FileText, Activity, Zap, MapPin } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function Dashboard() {
    const [pulseValue, setPulseValue] = useState(0)
    const [signals, setSignals] = useState<number[]>(new Array(12).fill(0))
    const [recentSignals, setRecentSignals] = useState<any[]>([])
    const [stats, setStats] = useState<Record<string, number>>({})
    const [aiInsight, setAiInsight] = useState("Gathering data for insights...")

    const supabase = createClient()

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 5000) // Poll every 5s for simplicity
        return () => clearInterval(interval)
    }, [])

    async function fetchData() {
        // Fetch last hour of signals
        const oneHourAgo = new Date(Date.now() - 3600000).toISOString()

        const { data: allSignals } = await supabase
            .from('signals')
            .select('*')
            .gte('created_at', oneHourAgo)
            .order('created_at', { ascending: false })

        if (!allSignals) return

        setRecentSignals(allSignals.slice(0, 5))

        // Calculate Stats
        const counts: Record<string, number> = {}
        allSignals.forEach(s => {
            counts[s.type] = (counts[s.type] || 0) + 1
        })
        setStats(counts)

        // Calculate Pulse (signals in last 5 mins relative to total assumed students)
        const fiveMinsAgo = new Date(Date.now() - 300000).toISOString()
        const recentCount = allSignals.filter(s => s.created_at >= fiveMinsAgo).length
        const totalStudents = 42 // Mock total
        const pulse = Math.min(100, Math.round((recentCount / totalStudents) * 100))
        setPulseValue(pulse)

        // Update Pulse Chart (historical trend for last hour in 5-min buckets)
        const buckets = new Array(12).fill(0)
        allSignals.forEach(s => {
            const minutesAgo = (Date.now() - new Date(s.created_at).getTime()) / 60000
            const bucketIndex = 11 - Math.floor(minutesAgo / 5)
            if (bucketIndex >= 0 && bucketIndex < 12) {
                buckets[bucketIndex]++
            }
        })
        setSignals(buckets)

        generateInsight(allSignals)
    }

    function generateInsight(data: any[]) {
        if (data.length === 0) {
            setAiInsight("Classroom signal is quiet. Students appear to be following.")
            return
        }

        // Logic: Correlate signals and locations
        const locationClusters: Record<string, number> = {}
        const typeClusters: Record<string, number> = {}

        data.forEach(s => {
            if (s.block_room) locationClusters[s.block_room] = (locationClusters[s.block_room] || 0) + 1
            typeClusters[s.type] = (typeClusters[s.type] || 0) + 1
        })

        // Find most common location and type
        const sortedLocs = Object.entries(locationClusters).sort((a, b) => b[1] - a[1])
        const sortedTypes = Object.entries(typeClusters).sort((a, b) => b[1] - a[1])

        if (sortedLocs.length > 0 && sortedLocs[0][1] > 2) {
            const loc = sortedLocs[0][0]
            const type = sortedTypes[0][0]
            setAiInsight(`${type} signals are concentrated in ${loc}. This may indicate environmental disruption in that area rather than instructional issues.`)
        } else if (sortedTypes.length > 0 && sortedTypes[0][0] === "Too Fast" && sortedTypes[0][1] > 3) {
            setAiInsight("Momentum has slowed. Multiple students flagged 'Too Fast'. Consider summarizing the last key point.")
        } else {
            setAiInsight("Signals are distributed across the class. A general re-explanation of the current concept might be helpful.")
        }
    }

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
                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 animate-in slide-in-from-right-4 duration-500">
                            <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> AI Insight
                            </h3>
                            <p className="text-indigo-800 text-sm leading-relaxed italic">
                                "{aiInsight}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tag Distribution */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Signal Breakdown (Last Hr)</h3>
                        <div className="space-y-4">
                            {Object.entries(stats).length === 0 ? (
                                <p className="text-sm text-slate-400 italic">No signals recorded yet.</p>
                            ) : (
                                Object.entries(stats).map(([type, count]) => {
                                    const total = Object.values(stats).reduce((a, b) => a + b, 0)
                                    const percentage = Math.round((count / total) * 100)
                                    return (
                                        <div key={type}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-600">"{type}"</span>
                                                <span className="font-semibold">{percentage}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full">
                                                <div
                                                    className="bg-slate-800 h-2 rounded-full transition-all duration-1000"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
                        <ul className="space-y-3">
                            {recentSignals.map((signal) => (
                                <li key={signal.id} className="flex flex-col gap-1 p-2 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-all">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <span className={`w-2 h-2 rounded-full ${signal.type === "I'm Confused" ? 'bg-red-400' : 'bg-orange-400'}`}></span>
                                        <span className="font-medium text-slate-800">{signal.type}</span>
                                        <span className="ml-auto text-[10px] text-slate-400 uppercase font-bold">
                                            {new Date(signal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    {signal.block_room && (
                                        <div className="flex items-center gap-1 text-[10px] text-slate-500 ml-5">
                                            <MapPin className="w-3 h-3" /> {signal.block_room}
                                        </div>
                                    )}
                                    {signal.additional_text && (
                                        <p className="text-[11px] text-slate-500 ml-5 italic line-clamp-1 border-l-2 border-slate-200 pl-2">
                                            "{signal.additional_text}"
                                        </p>
                                    )}
                                </li>
                            ))}
                            {recentSignals.length === 0 && (
                                <li className="text-center text-sm text-slate-400 py-4 italic">No recent activity</li>
                            )}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    )
}
