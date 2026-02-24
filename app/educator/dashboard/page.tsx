'use client'

import { useState, useEffect, Suspense } from 'react'
import { Bell, LayoutDashboard, Settings, LogOut, FileText, Activity, Zap, MapPin, Download, Tag, Plus, Clock } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts'

function DashboardContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const sessionId = searchParams.get('session')

    const [pulseValue, setPulseValue] = useState(0)
    const [chartData, setChartData] = useState<any[]>([])
    const [recentSignals, setRecentSignals] = useState<any[]>([])
    const [stats, setStats] = useState<Record<string, number>>({})
    const [aiInsight, setAiInsight] = useState("Gathering data for insights...")
    // Topic Annotation State
    const [currentTopicInput, setCurrentTopicInput] = useState('')
    const [topicLog, setTopicLog] = useState<{ time: string; label: string }[]>([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), label: 'Session Started' }])

    const supabase = createClient()

    useEffect(() => {
        if (!sessionId || sessionId.length !== 4) {
            router.push('/educator/start')
            return
        }

        fetchData()
        const interval = setInterval(fetchData, 3000) // Poll every 3s
        return () => clearInterval(interval)
    }, [sessionId])

    async function fetchData() {
        if (!sessionId) return

        // Fetch last hour of signals for this specific session
        const oneHourAgo = new Date(Date.now() - 3600000).toISOString()

        const { data: allSignals } = await supabase
            .from('signals')
            .select('*')
            .eq('block_room', sessionId) // We repurposed block_room as session_id mapped via the join QR
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

        // Calculate Pulse (signals in last 2 mins relative to estimated chunk)
        const twoMinsAgo = new Date(Date.now() - 120000).toISOString()
        const recentCount = allSignals.filter(s => s.created_at >= twoMinsAgo).length
        const totalEstimatedStudents = 60
        const pulse = Math.min(100, Math.round((recentCount / totalEstimatedStudents) * 100))
        setPulseValue(pulse)

        // Generate Time-Series Data for Recharts
        // We will group signals by minute for the last 30 minutes
        const timeSeriesMap = new Map()
        const nowMs = Date.now()

        // Initialize last 30 minutes with 0
        for (let i = 29; i >= 0; i--) {
            const timeLabel = new Date(nowMs - (i * 60000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            timeSeriesMap.set(timeLabel, { time: timeLabel, signals: 0 })
        }

        allSignals.forEach(s => {
            const signalMs = new Date(s.created_at).getTime()
            // Only count if within last 30 mins
            if (nowMs - signalMs <= 30 * 60000) {
                const timeLabel = new Date(signalMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                if (timeSeriesMap.has(timeLabel)) {
                    timeSeriesMap.get(timeLabel).signals += 1
                }
            }
        })

        setChartData(Array.from(timeSeriesMap.values()))
        generateInsight(allSignals, recentCount)
    }

    function generateInsight(data: any[], recentCount: number) {
        if (data.length === 0) {
            setAiInsight("Classroom signal is quiet. Students appear to be following the lecture pace.")
            return
        }

        // Smart Spam Filtering logic applied to insights
        if (recentCount === 1) {
            setAiInsight("Isolated confusion logged. Proceed with lecture—this does not indicate a systemic gap.")
            return
        }

        if (recentCount >= 5) {
            setAiInsight("⚠️ MASSIVE SPIKE DETECTED. Five or more students signaled simultaneously. Immediately recap the concept from the last 2 minutes.")
            return
        }

        const typeClusters: Record<string, number> = {}
        data.forEach(s => { typeClusters[s.type] = (typeClusters[s.type] || 0) + 1 })

        const sortedTypes = Object.entries(typeClusters).sort((a, b) => b[1] - a[1])

        if (sortedTypes.length > 0 && sortedTypes[0][0] === "Too Fast" && sortedTypes[0][1] > 3) {
            setAiInsight("Momentum has slowed. Multiple students flagged 'Too Fast'. Consider summarizing the last key point.")
        } else {
            setAiInsight("Signals are compounding. Notice the timeline graph for exact correlation to your lecture script.")
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 hidden md:flex">
                <div className="p-6 border-b border-slate-800">
                    <span className="font-bold text-white text-xl tracking-tight">EduPulse</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-600/20 text-blue-400 font-bold rounded-xl border border-blue-500/30">
                        <LayoutDashboard className="w-5 h-5" />
                        Live Session
                    </Link>
                    <Link href="/admin/outcomes" className="flex items-center gap-3 px-4 py-3 hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                        Outcomes Tracker
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={() => router.push('/educator/start')} className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:text-red-300 transition-colors font-bold rounded-lg hover:bg-slate-800">
                        <LogOut className="w-5 h-5" />
                        End Session
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {/* Topic Annotation Bar */}
                <div className="mb-6 bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center shrink-0 border border-indigo-500/20">
                            <Tag className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-1">Current Topic / Slide</div>
                            <input
                                type="text"
                                value={currentTopicInput}
                                onChange={(e) => setCurrentTopicInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && currentTopicInput.trim()) {
                                        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        setTopicLog(prev => [...prev, { time, label: currentTopicInput.trim() }])
                                        setCurrentTopicInput('')
                                    }
                                }}
                                placeholder="e.g. Slide 4: Recursion, Live Code: Binary Search..."
                                className="w-full bg-transparent text-white font-semibold placeholder:text-indigo-400/40 outline-none text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                if (currentTopicInput.trim()) {
                                    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    setTopicLog(prev => [...prev, { time, label: currentTopicInput.trim() }])
                                    setCurrentTopicInput('')
                                }
                            }}
                            className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 font-bold rounded-lg text-sm transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Log Topic
                        </button>
                    </div>
                    {topicLog.length > 0 && (
                        <div className="flex flex-wrap gap-2 border-t border-indigo-500/10 pt-3 mt-1 md:hidden">
                            {topicLog.slice(-3).map((entry, i) => (
                                <span key={i} className="flex items-center gap-1 text-xs bg-indigo-500/10 text-indigo-300 px-2 py-1 rounded-lg border border-indigo-500/10">
                                    <Clock className="w-3 h-3" />{entry.time}: {entry.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-slate-900">Lecture Intelligence Stream</h1>
                            <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-full border border-slate-300">
                                PIN: {sessionId}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium tracking-wide text-sm">Real-time gap detection via QR deployment</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold flex items-center gap-2 border border-emerald-200">
                            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                            System Active
                        </div>
                        <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors flex items-center gap-2 font-bold px-4 border border-slate-200 bg-white">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Recharts Timeline Graph */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/20 pointer-events-none"></div>
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                    Time-Series Confusion Matrix
                                </h2>
                                <p className="text-xs text-slate-500">Correlate spikes directly to your lecture script.</p>
                            </div>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-100 uppercase tracking-widest">
                                Last 30 Mins
                            </span>
                        </div>

                        <div className="h-72 w-full relative z-10 border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSignals" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} tickMargin={10} axisLine={false} tickLine={false} minTickGap={30} />
                                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                                        labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="signals"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorSignals)"
                                        animationDuration={1000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Current Status */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Current Confusion Load</h3>
                            <div className="flex items-end gap-1 relative z-10">
                                <span className={`text-6xl font-black ${pulseValue > 15 ? 'text-red-500' : 'text-slate-900 tracking-tight'}`}>{pulseValue}%</span>
                            </div>
                            <div className="text-slate-500 font-medium text-sm mt-1 mb-6 relative z-10">of active participants signaling</div>

                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden relative z-10">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${pulseValue > 15 ? 'bg-red-500' : 'bg-slate-900'}`}
                                    style={{ width: `${pulseValue}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* AI Insight */}
                        <div className={`p-6 rounded-2xl border flex flex-col justify-center h-48 transition-colors duration-500 ${pulseValue > 5 ? 'bg-amber-50 border-amber-200 shadow-inner' : 'bg-indigo-50 border-indigo-100'}`}>
                            <h3 className={`font-bold mb-3 flex items-center gap-2 ${pulseValue > 5 ? 'text-amber-800' : 'text-indigo-900'}`}>
                                <Zap className="w-5 h-5" /> Real-time Assistant
                            </h3>
                            <p className={`text-sm leading-relaxed font-medium ${pulseValue > 5 ? 'text-amber-900' : 'text-indigo-800'}`}>
                                {aiInsight}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tag Distribution */}
                <div className="grid md:grid-cols-5 gap-6">
                    <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6 text-lg">Signal Breakdown</h3>
                        <div className="space-y-5">
                            {Object.entries(stats).length === 0 ? (
                                <p className="text-sm text-slate-400 font-medium p-4 bg-slate-50 rounded-lg text-center border border-slate-100">No signals recorded yet in this session.</p>
                            ) : (
                                Object.entries(stats).map(([type, count]) => {
                                    const total = Object.values(stats).reduce((a, b) => a + b, 0)
                                    const percentage = Math.round((count / total) * 100)
                                    return (
                                        <div key={type}>
                                            <div className="flex justify-between text-sm mb-2 font-bold">
                                                <span className="text-slate-700">{type}</span>
                                                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{percentage}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-3 space-y-6">
                        {/* Topic Annotation Log */}
                        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
                            <h3 className="font-bold text-indigo-900 text-sm uppercase tracking-widest mb-4 flex items-center gap-2"><Tag className="w-4 h-4" /> Topic Timeline Annotations</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {topicLog.map((entry, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm">
                                        <span className="font-mono font-bold text-indigo-400 shrink-0">{entry.time}</span>
                                        <span className="w-px h-4 bg-indigo-200 shrink-0"></span>
                                        <span className={`font-semibold ${i === topicLog.length - 1 ? 'text-indigo-900' : 'text-indigo-400'}`}>{entry.label}</span>
                                        {i === topicLog.length - 1 && <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full font-bold">CURRENT</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Audit Log */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-900 text-lg">Audit Log</h3>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live</span>
                            </div>
                            <ul className="space-y-3">
                                {recentSignals.map((signal) => (
                                    <li key={signal.id} className="flex gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                            <div className={`w-3 h-3 rounded-full ${signal.type === "Too Fast" ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-slate-800">{signal.type}</span>
                                                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                                                    {new Date(signal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium">Anonymous encrypted signal logged.</p>
                                        </div>
                                    </li>
                                ))}
                                {recentSignals.length === 0 && (
                                    <li className="text-center text-sm text-slate-400 py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 font-medium">Waiting for incoming secure signals...</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function Dashboard() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading Session...</div>}>
            <DashboardContent />
        </Suspense>
    )
}
