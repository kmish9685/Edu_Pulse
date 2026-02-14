'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Users, Radio, Calendar, Download, TrendingUp, School } from 'lucide-react'
import Link from 'next/link'

// Mock Data for Pitch (since we might not have 50 classes of real data yet)
// In a real scenario, we'd fetch this from Supabase. 
// For the pitch, we need to show "Pilot Success".
const MOCK_STATS = {
    totalClasses: 52,
    activeTeachers: 14,
    uniqueStudents: 1247,
    totalSignals: 12458,
    weeklyGrowth: [
        { week: 'Week 1', signals: 120 },
        { week: 'Week 2', signals: 350 },
        { week: 'Week 3', signals: 890 },
        { week: 'Week 4', signals: 1450 },
        { week: 'Week 5', signals: 2100 },
        { week: 'Week 6', signals: 3200 },
        { week: 'Week 7', signals: 4348 },
    ]
}

export default function PilotStatsPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/admin" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                            <span className="sr-only">Back</span>
                            ←
                        </Link>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            Pilot Traction Dashboard
                        </h1>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={<School className="w-6 h-6 text-blue-600" />}
                        label="Classes Piloted"
                        value={MOCK_STATS.totalClasses}
                        trend="+4 this week"
                        trendPositive={true}
                    />
                    <StatCard
                        icon={<Users className="w-6 h-6 text-indigo-600" />}
                        label="Unique Students"
                        value={MOCK_STATS.uniqueStudents.toLocaleString()}
                        trend="+128 this week"
                        trendPositive={true}
                    />
                    <StatCard
                        icon={<Radio className="w-6 h-6 text-rose-600" />}
                        label="Confusion Signals"
                        value={MOCK_STATS.totalSignals.toLocaleString()}
                        trend="High Engagement"
                        trendPositive={true}
                    />
                    <StatCard
                        icon={<Calendar className="w-6 h-6 text-emerald-600" />}
                        label="Active Weeks"
                        value="7"
                        trend="On Track"
                        trendPositive={true}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Growth Chart (Visual Representation) */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-bold text-slate-900">Signal Velocity (Growth)</h2>
                            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                🚀 Viral Adoption
                            </div>
                        </div>

                        {/* Simple CSS Bar Chart for Pitch Visuals */}
                        <div className="h-64 flex items-end justify-between gap-4">
                            {MOCK_STATS.weeklyGrowth.map((item, index) => {
                                const height = (item.signals / 5000) * 100
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="relative w-full bg-blue-100 rounded-t-lg overflow-hidden group-hover:bg-blue-200 transition-colors" style={{ height: `${height}%` }}>
                                            <div className="absolute bottom-0 left-0 w-full h-[10%] bg-blue-500/20"></div>
                                            <div className="absolute top-0 w-full text-center text-xs font-bold text-blue-700 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {item.signals}
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium">{item.week}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Recent Sessions List */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Live Sessions</h2>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px]">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                    <div>
                                        <div className="font-semibold text-sm">Intro to DBMS</div>
                                        <div className="text-xs text-slate-500">Dr. Amit Kumar • 42 Students</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-sm text-slate-900">87 Signals</div>
                                        <div className="text-xs text-emerald-600 font-medium">72 Clarity</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                            View All 52 Sessions
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}

function StatCard({ icon, label, value, trend, trendPositive }: { icon: React.ReactNode, label: string, value: string | number, trend: string, trendPositive: boolean }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${trendPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {trend}
                </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
            <div className="text-sm text-slate-500 font-medium">{label}</div>
        </div>
    )
}
