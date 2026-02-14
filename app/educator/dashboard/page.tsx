'use client'

import { useState, useEffect } from 'react'
import { Bell, ChevronDown, LayoutDashboard, Settings, LogOut, Users, FileText, Activity, Zap, MapPin, TrendingDown, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function Dashboard() {
    const [pulseValue, setPulseValue] = useState(0)
    const [signals, setSignals] = useState<number[]>(new Array(12).fill(0))
    const [recentSignals, setRecentSignals] = useState<any[]>([])
    const [stats, setStats] = useState<Record<string, number>>({})
    const [aiInsight, setAiInsight] = useState("Gathering data for insights...")
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
    }>({ action: "Monitor student signals.", reason: "Waiting for more data." })
    const [timelineData, setTimelineData] = useState<{ time: string; count: number }[]>([])
    const [recurringGaps, setRecurringGaps] = useState<{ topic: string, days: number, severity: 'Emerging' | 'Persistent' | 'Critical' }[]>([])
    const [interventionImpact, setInterventionImpact] = useState<{ improvement: number, clarityChange: number } | null>(null)

    const supabase = createClient()

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 5000) // Poll every 5s for simplicity
        return () => clearInterval(interval)
    }, [])

    async function fetchData() {
        // Fetch last hour of signals for Real-time view
        const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
        // Fetch last 7 days for Recurring view
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600000).toISOString()

        const { data: allSignals } = await supabase
            .from('signals')
            .select('*')
            .gte('created_at', oneHourAgo)
            .order('created_at', { ascending: true }) // Oldest first for timeline

        if (!allSignals) return

        // Calculate Intervention Impact (Feature 6)
        // Logic: Find max spike in last 30 mins, compare to current level

        // 1. Get recent buckets (buckets are already calculated below, but we need raw data first)
        // ... (We need to wait for timelineArray to be generated) ...

        // Let's place the Impact Logic AFTER aggregation (see below in this function)

        // Fetch Historical Data (Separate query to avoid messing up real-time stats)
        const { data: historySignals } = await supabase
            .from('signals')
            .select('type, created_at')
            .gte('created_at', sevenDaysAgo)

        if (historySignals) {
            // Aggregate History Logic
            const topicDays: Record<string, Set<string>> = {}

            historySignals.forEach(s => {
                const day = new Date(s.created_at).toDateString()
                if (!topicDays[s.type]) {
                    topicDays[s.type] = new Set()
                }
                topicDays[s.type].add(day)
            })

            const gaps = Object.entries(topicDays).map(([topic, daysSet]) => {
                const days = daysSet.size
                let severity: 'Emerging' | 'Persistent' | 'Critical' = 'Emerging'

                if (days > 5) severity = 'Critical'
                else if (days >= 4) severity = 'Persistent'

                return { topic, days, severity }
            })
                // Filter: frequency >= 3 sessions/days
                .filter(gap => gap.days >= 3)
                .sort((a, b) => b.days - a.days)

            setRecurringGaps(gaps)
        }


        // For other calculations, we might need newest first, so let's reverse for those or use as is
        const recentFirstSignals = [...allSignals].reverse()

        setRecentSignals(recentFirstSignals.slice(0, 5))

        // Calculate Stats
        const counts: Record<string, number> = {}
        allSignals.forEach(s => {
            counts[s.type] = (counts[s.type] || 0) + 1
        })
        setStats(counts)

        // Calculate Primary Confusion Area and Recommended Action logic variables
        let currentSeverity: 'Minor' | 'Moderate' | 'Major Learning Gap' = 'Minor'
        let currentType = ''

        // Calculate Primary Confusion Area
        if (allSignals.length > 0) {
            const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1])
            const topSignal = sortedCounts[0]
            const type = topSignal[0]
            const count = topSignal[1]
            const percentage = Math.round((count / allSignals.length) * 100)

            if (percentage >= 60) currentSeverity = 'Major Learning Gap'
            else if (percentage >= 30) currentSeverity = 'Moderate'

            currentType = type

            setPrimaryConfusion({
                type,
                count,
                percentage,
                severity: currentSeverity
            })
        } else {
            setPrimaryConfusion(null)
        }

        // Calculate Pulse (signals in last 5 mins relative to total assumed students)
        const fiveMinsAgo = new Date(Date.now() - 300000).toISOString()
        const recentCount = allSignals.filter(s => s.created_at >= fiveMinsAgo).length
        const totalStudents = 42 // Mock total
        const pulse = Math.min(100, Math.round((recentCount / totalStudents) * 100))
        setPulseValue(pulse)

        // Calculate Session Clarity Score
        // Formula: 100 - (confusion_signals / estimated_students) * 100
        const signalCount = allSignals.length
        const rawScore = 100 - ((signalCount / totalStudents) * 100)
        const score = Math.max(0, Math.round(rawScore))

        let status: 'Clear' | 'Watch' | 'Struggling' | 'Critical' = 'Clear'
        if (score < 40) status = 'Critical'
        else if (score < 60) status = 'Struggling'
        else if (score < 80) status = 'Watch'

        setClarityScore({ score, status })

        // Recommended Teaching Action Logic
        let action = "Monitor student signals."
        let reason = "Waiting for more data."

        if (currentSeverity === 'Major Learning Gap' && score < 60) {
            action = "Pause and recap the current concept (2–3 minutes)."
            reason = `High confusion detected in "${currentType}" with low session clarity.`
        } else if (currentSeverity === 'Moderate') {
            action = "Provide one more example or slow pacing briefly."
            reason = "Moderate confusion clustering observed."
        } else if (currentSeverity === 'Minor' && score > 80) {
            action = "Continue teaching normally."
            reason = "Class understanding appears stable."
        }

        setRecommendedAction({ action, reason })

        // Update Pulse Chart (historical trend for last hour in 5-min buckets) (Legacy, keeping for Live Pulse)
        const buckets = new Array(12).fill(0)
        recentFirstSignals.forEach(s => {
            const minutesAgo = (Date.now() - new Date(s.created_at).getTime()) / 60000
            const bucketIndex = 11 - Math.floor(minutesAgo / 5)
            if (bucketIndex >= 0 && bucketIndex < 12) {
                buckets[bucketIndex]++
            }
        })
        setSignals(buckets)

        // Aggregate signals into 5-minute buckets for timeline
        const timelineBuckets: Record<string, number> = {}
        const now = new Date()
        const timeLabels: string[] = []

        // Initialize buckets for last hour
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 5 * 60000)
            const label = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            timelineBuckets[label] = 0
            timeLabels.push(label)
        }

        allSignals.forEach(signal => {
            const date = new Date(signal.created_at)
            // find closest bucket
            // checking simple string match for this MVP
            const label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            // A more robust way would be to round to nearest 5 min, but for now exact string match 
            // of "buckets" above (which are spaced 5 mins) won't work perfectly with random times.
            // Let's just group by rounding Minute to nearest 5
            const roundedMin = Math.floor(date.getMinutes() / 5) * 5
            date.setMinutes(roundedMin)
            const bucketLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

            // Just incement if it matches one of our last-hour buckets
            // Note: This logic is slightly loose on date boundary, assuming today.
            // For production, compare full timestamp.
            if (timeLabels.includes(bucketLabel)) {
                timelineBuckets[bucketLabel] = (timelineBuckets[bucketLabel] || 0) + 1
            }
        })

        const timelineArray = timeLabels.map(time => ({
            time,
            count: timelineBuckets[time] || 0
        }))

        setTimelineData(timelineArray)

        // --- Intervention Impact Logic (Feature 6) ---
        // Find max spike in timeline
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

        // Only calculate impact if:
        // 1. We have a significant spike (> 3 signals)
        // 2. The spike wasn't "just now" (index < length - 1, preferably -2)
        // 3. We have some drop-off
        if (maxSpike > 3 && spikeIndex < timelineArray.length - 1) {
            const improvement = Math.round(((maxSpike - currentCount) / maxSpike) * 100)

            // Mocking clarity change for this MVP based on improvement
            // In real app, we would snapshot clarity at spike time vs now.
            const clarityChange = Math.round(improvement / 5)

            setInterventionImpact({
                improvement: Math.max(0, improvement),
                clarityChange: Math.max(0, clarityChange)
            })
        } else {
            setInterventionImpact(null)
        }
        // ---------------------------------------------

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

                    <div className="space-y-6">
                        {/* Primary Confusion Area Card */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-10 -mt-10 opacity-50"></div>

                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 relative z-10">Primary Confusion Area</h3>

                            {primaryConfusion ? (
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-xl font-bold text-slate-900 leading-tight">
                                            {primaryConfusion.type}
                                        </h4>
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${primaryConfusion.severity === 'Major Learning Gap'
                                            ? 'bg-red-100 text-red-700'
                                            : primaryConfusion.severity === 'Moderate'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {primaryConfusion.severity}
                                        </span>
                                    </div>

                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-3xl font-bold text-slate-800">{primaryConfusion.count}</span>
                                        <span className="text-sm text-slate-500 font-medium">signals</span>
                                        <span className="text-sm text-slate-400 ml-1">({primaryConfusion.percentage}%)</span>
                                    </div>

                                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${primaryConfusion.severity === 'Major Learning Gap' ? 'bg-red-500' :
                                                primaryConfusion.severity === 'Moderate' ? 'bg-amber-500' : 'bg-slate-500'
                                                }`}
                                            style={{ width: `${primaryConfusion.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-slate-400 italic text-sm relative z-10">
                                    Not enough data to determine primary confusion.
                                </div>
                            )}
                        </div>

                        {/* Session Clarity Score Card */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Session Clarity Score</h3>
                            <div className="flex justify-between items-end">
                                <div className="flex items-end gap-2">
                                    <span className={`text-5xl font-bold ${clarityScore.status === 'Critical' ? 'text-red-500' :
                                        clarityScore.status === 'Struggling' ? 'text-orange-500' :
                                            clarityScore.status === 'Watch' ? 'text-amber-500' :
                                                'text-green-500'
                                        }`}>
                                        {clarityScore.score}
                                    </span>
                                    <span className="text-slate-400 mb-2 font-medium">/ 100</span>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-bold border ${clarityScore.status === 'Critical' ? 'bg-red-50 border-red-200 text-red-700' :
                                    clarityScore.status === 'Struggling' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                                        clarityScore.status === 'Watch' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                            'bg-green-50 border-green-200 text-green-700'
                                    }`}>
                                    {clarityScore.status}
                                </div>
                            </div>
                        </div>

                        {/* Recommended Teaching Action Card */}
                        <div className="bg-indigo-600 p-6 rounded-xl border border-indigo-700 shadow-lg relative overflow-hidden text-white">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>

                            <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Zap className="w-3 h-3 text-yellow-300" />
                                Recommended Action
                            </h3>

                            <div className="relative z-10">
                                <p className="text-lg font-bold leading-tight mb-2">
                                    "{recommendedAction.action}"
                                </p>
                                <p className="text-indigo-200 text-xs border-l-2 border-indigo-400 pl-2">
                                    Reason: {recommendedAction.reason}
                                </p>
                            </div>
                        </div>

                        {/* Confusion Timeline Card */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Confusion Timeline (Last Hr)</h3>

                            <div className="h-40 w-full relative">
                                {timelineData.length > 1 ? (
                                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f5f9" strokeWidth="1" />
                                        <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                                        <line x1="0" y1="100" x2="100" y2="100" stroke="#f1f5f9" strokeWidth="1" />

                                        <path
                                            d={`
                                                M 0,100
                                                ${timelineData.map((d, i) => {
                                                const x = (i / (timelineData.length - 1)) * 100;
                                                const max = Math.max(...timelineData.map(d => d.count), 5);
                                                const y = 100 - (d.count / max) * 100;
                                                return `L ${x},${y}`;
                                            }).join(' ')}
                                                L 100,100 Z
                                            `}
                                            fill="rgba(239, 68, 68, 0.1)"
                                        />

                                        <path
                                            d={`
                                                M 0,${100 - (timelineData[0]?.count / Math.max(...timelineData.map(d => d.count), 5)) * 100}
                                                ${timelineData.map((d, i) => {
                                                const x = (i / (timelineData.length - 1)) * 100;
                                                const max = Math.max(...timelineData.map(d => d.count), 5);
                                                const y = 100 - (d.count / max) * 100;
                                                return `L ${x},${y}`;
                                            }).join(' ')}
                                            `}
                                            fill="none"
                                            stroke="#ef4444"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            vectorEffect="non-scaling-stroke"
                                        />

                                        {timelineData.map((d, i) => {
                                            const x = (i / (timelineData.length - 1)) * 100;
                                            const max = Math.max(...timelineData.map(d => d.count), 5);
                                            const y = 100 - (d.count / max) * 100;
                                            return (
                                                <circle key={i} cx={x} cy={y} r="1.5" fill="#ef4444" stroke="#fff" strokeWidth="0.5" />
                                            )
                                        })}
                                    </svg>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                                        Not enough data points for timeline
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-medium">
                                {timelineData.length > 0 && (
                                    <>
                                        <span>{timelineData[0].time}</span>
                                        <span>{timelineData[Math.floor(timelineData.length / 2)]?.time}</span>
                                        <span>{timelineData[timelineData.length - 1].time}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Recurring Learning Gaps - NEW FEATURE (Feature 5) */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Recurring Learning Gaps (7 Days)</h3>

                            {recurringGaps.length > 0 ? (
                                <div className="space-y-3">
                                    {recurringGaps.map((gap, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">{gap.topic}</h4>
                                                <p className="text-xs text-slate-500">
                                                    Appeared in <span className="font-semibold text-slate-700">{gap.days} sessions</span>
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${gap.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                                gap.severity === 'Persistent' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {gap.severity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-slate-400 italic text-sm">
                                    No recurring gaps detected yet. Great job!
                                </div>
                            )}
                        </div>

                        {/* Intervention Impact - NEW FEATURE (Feature 6) */}
                        {interventionImpact && (
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-green-500" /> Intervention Impact
                                </h3>

                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Confusion Reduced by</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-bold text-green-600">
                                                {interventionImpact.improvement}%
                                            </span>
                                            {interventionImpact.improvement > 0 ? (
                                                <TrendingDown className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <TrendingUp className="w-5 h-5 text-red-500" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500 mb-1">Clarity Score Change</p>
                                        <div className="flex items-baseline gap-2 justify-end">
                                            <span className={`text-2xl font-bold ${interventionImpact.clarityChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                {interventionImpact.clarityChange >= 0 ? '+' : ''}{interventionImpact.clarityChange}
                                            </span>
                                            <span className="text-xs text-slate-400">points</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-sm text-green-800 flex items-start gap-2">
                                    <div className="mt-0.5">🎉</div>
                                    <p className="font-medium">
                                        {interventionImpact.improvement > 30
                                            ? "Excellent! Your intervention successfully clarified the concept."
                                            : "Intervention helped, but some confusion remains."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Recent Activity Card */}
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
                </div>
            </main>
        </div>
    )
}
