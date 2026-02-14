'use client'

import { useState, useEffect } from 'react'
import { Bell, ChevronDown, LayoutDashboard, Settings, LogOut, Users, FileText, Activity, Zap, MapPin, TrendingDown, TrendingUp, Sparkles, Brain, Radio, Layers } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function Dashboard() {
    const [pulseValue, setPulseValue] = useState(0)
    const [signals, setSignals] = useState<number[]>(new Array(12).fill(0))
    const [recentSignals, setRecentSignals] = useState<any[]>([])
    const [stats, setStats] = useState<Record<string, number>>({})
    const [aiInsight, setAiInsight] = useState("Initializing AI Analysis...")
    const [primaryConfusion, setPrimaryConfusion] = useState<{
        type: string,
        count: number,
        percentage: number,
        severity: 'Minor' | 'Moderate' | 'Major Learning Gap'
    } | null>(null)
    const [clarityScore, setClarityScore] = useState<{
        score: number,
        status: 'Clear' | 'Watch' | 'Struggling' | 'Critical'
    }>({ score: 100, status: 'Clear' })
    const [recommendedAction, setRecommendedAction] = useState<{
        action: string,
        reason: string
    }>({ action: "Monitor student signals.", reason: "Waiting for data stream." })
    const [timelineData, setTimelineData] = useState<{ time: string; count: number }[]>([])
    const [recurringGaps, setRecurringGaps] = useState<{ topic: string, days: number, severity: 'Emerging' | 'Persistent' | 'Critical' }[]>([])
    const [interventionImpact, setInterventionImpact] = useState<{ improvement: number, clarityChange: number } | null>(null)
    const [isDemoMode, setIsDemoMode] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
    }, [])

    async function fetchData() {
        const { data: settings } = await supabase.from('campus_settings').select('demo_mode').single()
        if (settings?.demo_mode) setIsDemoMode(true)
        else setIsDemoMode(false)

        const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600000).toISOString()

        const { data: allSignals } = await supabase
            .from('signals')
            .select('*')
            .gte('created_at', oneHourAgo)
            .order('created_at', { ascending: true })

        if (!allSignals) return

        const { data: historySignals } = await supabase
            .from('signals')
            .select('type, created_at')
            .gte('created_at', sevenDaysAgo)

        if (historySignals) {
            const topicDays: Record<string, Set<string>> = {}
            historySignals.forEach(s => {
                const day = new Date(s.created_at).toDateString()
                if (!topicDays[s.type]) topicDays[s.type] = new Set()
                topicDays[s.type].add(day)
            })

            const gaps = Object.entries(topicDays).map(([topic, daysSet]) => {
                const days = daysSet.size
                let severity: 'Emerging' | 'Persistent' | 'Critical' = 'Emerging'
                if (days > 5) severity = 'Critical'
                else if (days >= 4) severity = 'Persistent'
                return { topic, days, severity }
            })
                .filter(gap => gap.days >= 3)
                .sort((a, b) => b.days - a.days)
            setRecurringGaps(gaps)
        }

        const recentFirstSignals = [...allSignals].reverse()
        setRecentSignals(recentFirstSignals.slice(0, 5))

        const counts: Record<string, number> = {}
        allSignals.forEach(s => counts[s.type] = (counts[s.type] || 0) + 1)
        setStats(counts)

        let currentSeverity: 'Minor' | 'Moderate' | 'Major Learning Gap' = 'Minor'
        let currentType = ''

        if (allSignals.length > 0) {
            const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1])
            const topSignal = sortedCounts[0]
            const type = topSignal[0]
            const count = topSignal[1]
            const percentage = Math.round((count / allSignals.length) * 100)

            if (percentage >= 60) currentSeverity = 'Major Learning Gap'
            else if (percentage >= 30) currentSeverity = 'Moderate'
            currentType = type

            setPrimaryConfusion({ type, count, percentage, severity: currentSeverity })
        } else {
            setPrimaryConfusion(null)
        }

        const fiveMinsAgo = new Date(Date.now() - 300000).toISOString()
        const recentCount = allSignals.filter(s => s.created_at >= fiveMinsAgo).length
        const totalStudents = 42
        const pulse = Math.min(100, Math.round((recentCount / totalStudents) * 100))
        setPulseValue(pulse)

        const signalCount = allSignals.length
        const rawScore = 100 - ((signalCount / totalStudents) * 100)
        const score = Math.max(0, Math.round(rawScore))

        let status: 'Clear' | 'Watch' | 'Struggling' | 'Critical' = 'Clear'
        if (score < 40) status = 'Critical'
        else if (score < 60) status = 'Struggling'
        else if (score < 80) status = 'Watch'

        setClarityScore({ score, status })

        let action = "Monitor signal stream."
        let reason = "Data accumulation in progress."

        if (currentSeverity === 'Major Learning Gap' && score < 60) {
            action = "Micro-Pause Recommended (2m)"
            reason = `Critical density in "${currentType}". Clarity compromised.`
        } else if (currentSeverity === 'Moderate') {
            action = "Clarify Context / Example"
            reason = "Moderate confusion clustering detected."
        } else if (currentSeverity === 'Minor' && score > 80) {
            action = "Maintain Current Pacing"
            reason = "Cognitive load appears optimal."
        }
        setRecommendedAction({ action, reason })

        const buckets = new Array(12).fill(0)
        recentFirstSignals.forEach(s => {
            const minutesAgo = (Date.now() - new Date(s.created_at).getTime()) / 60000
            const bucketIndex = 11 - Math.floor(minutesAgo / 5)
            if (bucketIndex >= 0 && bucketIndex < 12) buckets[bucketIndex]++
        })
        setSignals(buckets)

        const timelineBuckets: Record<string, number> = {}
        const now = new Date()
        const timeLabels: string[] = []

        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 5 * 60000)
            const label = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            timelineBuckets[label] = 0
            timeLabels.push(label)
        }

        allSignals.forEach(signal => {
            const date = new Date(signal.created_at)
            const roundedMin = Math.floor(date.getMinutes() / 5) * 5
            date.setMinutes(roundedMin)
            const bucketLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            if (timeLabels.includes(bucketLabel)) timelineBuckets[bucketLabel] = (timelineBuckets[bucketLabel] || 0) + 1
        })

        const timelineArray = timeLabels.map(time => ({ time, count: timelineBuckets[time] || 0 }))
        setTimelineData(timelineArray)

        let maxSpike = 0
        let spikeIndex = -1
        timelineArray.forEach((point, index) => {
            if (point.count > maxSpike) {
                maxSpike = point.count
                spikeIndex = index
            }
        })

        const currentBucket = timelineArray[timelineArray.length - 1]
        const currentCount = currentBucket?.count || 0

        if (maxSpike > 3 && spikeIndex < timelineArray.length - 1) {
            const improvement = Math.round(((maxSpike - currentCount) / maxSpike) * 100)
            const clarityChange = Math.round(improvement / 5)
            setInterventionImpact({ improvement: Math.max(0, improvement), clarityChange: Math.max(0, clarityChange) })
        } else {
            setInterventionImpact(null)
        }

        generateInsight(allSignals)
    }

    function generateInsight(data: any[]) {
        if (data.length === 0) {
            setAiInsight("Signal channel clear. No active anomalies.")
            return
        }
        const locationClusters: Record<string, number> = {}
        const typeClusters: Record<string, number> = {}
        data.forEach(s => {
            if (s.block_room) locationClusters[s.block_room] = (locationClusters[s.block_room] || 0) + 1
            typeClusters[s.type] = (typeClusters[s.type] || 0) + 1
        })
        const sortedLocs = Object.entries(locationClusters).sort((a, b) => b[1] - a[1])
        const sortedTypes = Object.entries(typeClusters).sort((a, b) => b[1] - a[1])

        if (sortedLocs.length > 0 && sortedLocs[0][1] > 2) {
            setAiInsight(`Localized anomaly: ${sortedTypes[0][0]} signals clustering in ${sortedLocs[0][0]}. Possible environmental factor.`)
        } else if (sortedTypes.length > 0 && sortedTypes[0][0] === "Too Fast" && sortedTypes[0][1] > 3) {
            setAiInsight("Velocity Warning: Multiple 'Too Fast' flags. Deceleration advised.")
        } else {
            setAiInsight("Distributed signals detected. Concept reinforcement suggested.")
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col md:flex-row overflow-hidden selection:bg-indigo-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[120px] animate-float" />
            </div>

            {/* Glass Sidebar */}
            <aside className="w-full md:w-20 lg:w-64 glass-panel z-50 flex flex-col h-screen sticky top-0 border-r border-white/5 bg-slate-900/80">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-white text-lg tracking-tight hidden lg:block">EduPulse <span className="text-indigo-400 text-xs align-top">AI</span></span>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <Link href="/educator/dashboard" className="flex items-center gap-3 px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 shadow-sm backdrop-blur-sm group transition-all hover:bg-white/10 hover:border-indigo-500/50 hover:shadow-indigo-500/10">
                        <LayoutDashboard className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                        <span className="hidden lg:block font-medium">Dashboard</span>
                    </Link>
                    <Link href="/educator/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Layers className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
                        <span className="hidden lg:block">Analysis</span>
                    </Link>
                    <Link href="/educator/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Radio className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
                        <span className="hidden lg:block">Live Feed</span>
                    </Link>
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Settings className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
                        <span className="hidden lg:block">Settings</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-red-400/80 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all">
                        <LogOut className="w-5 h-5" />
                        <span className="hidden lg:block">End Session</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {/* Header Section */}
                <div className="flex justify-between items-end mb-8 relative">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">Live Session // ID: CS101</span>
                            {isDemoMode && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse uppercase tracking-widest">
                                    Demo Mode
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl font-light text-white tracking-tight">Introduction to <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Algorithms</span></h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse box-shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">System Active</span>
                        </div>
                        <div className="h-10 w-10 glass-panel rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border hover:border-indigo-500/50">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 shadow-inner"></div>
                    </div>
                </div>

                {/* Top Quick Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="glass-card p-4 rounded-xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                        <div>
                            <div className="text-slate-500 text-xs uppercase font-semibold tracking-wider mb-1">Students</div>
                            <div className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">42 <span className="text-xs font-normal text-slate-500">/ 45</span></div>
                        </div>
                        <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-indigo-400" />
                        </div>
                    </div>
                    {/* Additional quick stats could go here */}
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* REAL-TIME PULSE */}
                    <div className="lg:col-span-2 glass-card p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-500/10 transition-all duration-700"></div>

                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-indigo-400" />
                                    Live Confusion Pulse
                                </h2>
                                <p className="text-xs text-slate-400">Real-time signal density (Last 5m)</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <div className="text-xs text-slate-500 uppercase font-bold">Current Spike</div>
                                    <div className={`text-xl font-bold ${pulseValue > 15 ? 'text-red-400 text-glow' : 'text-emerald-400'}`}>{pulseValue}%</div>
                                </div>
                            </div>
                        </div>

                        {/* Equalizer Chart */}
                        <div className="h-48 flex items-end justify-between gap-1 relative z-10 box-border px-2">
                            {signals.map((val, i) => {
                                const height = Math.max(5, Math.min(100, val * 8)); // Scale for visibility
                                return (
                                    <div key={i} className="w-full bg-slate-800/50 rounded-t-sm relative group/bar h-full flex items-end overflow-hidden">
                                        <div
                                            className={`w-full transition-all duration-700 ease-out rounded-t-sm ${height > 40 ? 'bg-gradient-to-t from-red-900/80 to-red-500' : 'bg-gradient-to-t from-indigo-900/80 to-indigo-500'}`}
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="w-full h-full opacity-0 group-hover/bar:opacity-30 bg-white transition-opacity"></div>
                                        </div>
                                        {/* Tooltip */}
                                        <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded border border-white/10 pointer-events-none transition-opacity whitespace-nowrap z-20">
                                            {val} Signals
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent mt-0" />
                        <div className="mt-2 flex justify-between text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                            <span>-5m</span>
                            <span>Live</span>
                        </div>
                    </div>

                    {/* AI INSIGHT SADDLE */}
                    <div className="space-y-6">
                        {/* Clarity Score Radial */}
                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Session Clarity</h3>
                            <div className="flex items-center gap-6">
                                <div className="relative w-24 h-24 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
                                            className={`${clarityScore.status === 'Critical' ? 'text-red-500' : clarityScore.status === 'Watch' ? 'text-amber-500' : 'text-emerald-500'} transition-all duration-1000`}
                                            strokeDasharray={251.2}
                                            strokeDashoffset={251.2 - (251.2 * clarityScore.score) / 100}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold text-white">{clarityScore.score}</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className={`text-lg font-bold mb-1 ${clarityScore.status === 'Critical' ? 'text-red-400' : clarityScore.status === 'Watch' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                        {clarityScore.status}
                                    </div>
                                    <div className="text-xs text-slate-500">Benchmark: <span className="text-slate-300">Top 10%</span></div>
                                    <div className="text-xs text-slate-500">Trend: <span className="text-emerald-400">+2.4%</span></div>
                                </div>
                            </div>
                        </div>

                        {/* AI Action Card */}
                        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-900 shadow-lg shadow-indigo-500/20 relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-900 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-700"></div>
                            <div className="bg-slate-950/90 rounded-[15px] p-5 h-full relative backdrop-blur-xl">
                                <div className="flex items-start gap-3 mb-3">
                                    <Sparkles className="w-5 h-5 text-indigo-300 animate-pulse" />
                                    <div>
                                        <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">AI Recommendation</h3>
                                    </div>
                                </div>
                                <div className="text-lg font-medium text-white mb-3">
                                    {recommendedAction.action}
                                </div>
                                <div className="text-xs text-indigo-200/60 font-mono border-l-2 border-indigo-500/30 pl-3">
                                    {recommendedAction.reason}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONFUSION TIMELINE & RECURRING GAPS */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Primary Confusion Area */}
                    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-slate-800/50 rounded-full blur-2xl group-hover:bg-slate-700/50 transition-colors"></div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Primary Confusion Zone</h3>

                        {primaryConfusion ? (
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-xl font-bold text-white">{primaryConfusion.type}</h4>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${primaryConfusion.severity === 'Major Learning Gap' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                        primaryConfusion.severity === 'Moderate' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                            'bg-slate-700 text-slate-300'
                                        }`}>{primaryConfusion.severity}</span>
                                </div>
                                <div className="flex items-end gap-2 mb-4">
                                    <span className="text-4xl font-bold text-slate-200">{primaryConfusion.percentage}%</span>
                                    <span className="text-sm text-slate-500 mb-1">of total signals</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-1000 ${primaryConfusion.severity === 'Major Learning Gap' ? 'bg-red-500' : 'bg-amber-500'
                                        }`} style={{ width: `${primaryConfusion.percentage}%` }}></div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-24 flex items-center justify-center text-slate-600 italic text-sm">
                                No active confusion zones.
                            </div>
                        )}
                    </div>

                    {/* Timeline Graph */}
                    <div className="md:col-span-2 glass-card p-6 rounded-2xl relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Session Timeline</h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Interventions
                                </div>
                            </div>
                        </div>

                        <div className="h-40 w-full relative">
                            {timelineData.length > 1 ? (
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="chartGradientDark" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d={`M 0 100 ${timelineData.map((d, i) => {
                                            const x = (i / (timelineData.length - 1)) * 100
                                            const y = 100 - (d.count / (Math.max(...timelineData.map(t => t.count)) || 1) * 80)
                                            return `L ${x} ${y}`
                                        }).join(' ')} L 100 100 Z`}
                                        fill="url(#chartGradientDark)"
                                    />
                                    <path
                                        d={`M 0 ${100 - (timelineData[0].count / (Math.max(...timelineData.map(t => t.count)) || 1) * 80)} ${timelineData.map((d, i) => {
                                            const x = (i / (timelineData.length - 1)) * 100
                                            const y = 100 - (d.count / (Math.max(...timelineData.map(t => t.count)) || 1) * 80)
                                            return `L ${x} ${y}`
                                        }).join(' ')}`}
                                        fill="none"
                                        stroke="#818cf8"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    {/* Intervention Points */}
                                    {timelineData.map((d, i) => {
                                        const prev = timelineData[i - 1]?.count || 0
                                        const isDrop = i > 0 && (prev - d.count) > 2
                                        const x = (i / (timelineData.length - 1)) * 100
                                        const y = 100 - (d.count / (Math.max(...timelineData.map(t => t.count)) || 1) * 80)

                                        return isDrop ? (
                                            <g key={i}>
                                                <circle cx={x} cy={y} r="3" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
                                                <circle cx={x} cy={y} r="6" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.3" />
                                            </g>
                                        ) : null
                                    })}
                                </svg>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-600 text-sm italic">Initializing Visualizer...</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Insight Footer */}
                <div className="mt-6 glass-card p-4 rounded-xl border-l-4 border-indigo-500 bg-indigo-900/10 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Brain className="w-5 h-5 text-indigo-400 mt-1" />
                    <div>
                        <h4 className="text-sm font-bold text-indigo-300 mb-1">Live Intelligence</h4>
                        <p className="text-sm text-indigo-200/80 italic">"{aiInsight}"</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
