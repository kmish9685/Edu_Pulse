'use client'

import { useState, useEffect } from 'react'
import { RotateCcw, Shield, Users, CheckCircle2, Plus, Trash2, X, AlertTriangle, TrendingUp, Activity, MessageSquareQuote, FileText, BarChart3, QrCode, ExternalLink, Zap } from 'lucide-react'
import Link from 'next/link'
import { verifyAdminPassword, resetAllData, addSignalType } from '@/app/actions/admin'
import { createClient } from '@/utils/supabase/client'

interface RealMetrics {
    totalSignals: number
    activeSessions: string[]
    signalBreakdown: { type: string; count: number }[]
}

export default function AdminPage() {
    const [resetParams, setResetParams] = useState(false)
    const [showResetModal, setShowResetModal] = useState(false)
    const [password, setPassword] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [error, setError] = useState('')
    const [signalTypes, setSignalTypes] = useState<{ id: number, label: string }[]>([])
    const [newSignalLabel, setNewSignalLabel] = useState('')
    const [metrics, setMetrics] = useState<RealMetrics>({ totalSignals: 0, activeSessions: [], signalBreakdown: [] })
    const [loadingMetrics, setLoadingMetrics] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        fetchSignalTypes()
        fetchRealMetrics()

        // Poll every 10 seconds for live metrics
        const interval = setInterval(fetchRealMetrics, 10000)
        return () => clearInterval(interval)
    }, [])

    async function fetchRealMetrics() {
        // Get signals from the last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

        const { data: signals } = await supabase
            .from('signals')
            .select('id, type, block_room, created_at')
            .gte('created_at', twentyFourHoursAgo)
            .order('created_at', { ascending: false })

        if (signals) {
            // Count unique sessions (stored in block_room field)
            const sessions = [...new Set(signals.map(s => s.block_room).filter(Boolean))]

            // Breakdown by type
            const breakdown: Record<string, number> = {}
            signals.forEach(s => {
                breakdown[s.type] = (breakdown[s.type] || 0) + 1
            })
            const signalBreakdown = Object.entries(breakdown).map(([type, count]) => ({ type, count }))

            setMetrics({
                totalSignals: signals.length,
                activeSessions: sessions,
                signalBreakdown
            })
        }
        setLoadingMetrics(false)
    }

    async function fetchSignalTypes() {
        const { data } = await supabase.from('signal_types').select('*').eq('is_active', true)
        if (data) setSignalTypes(data)
    }

    const handleResetRequest = () => { setShowResetModal(true); setError(''); setPassword('') }

    const handleConfirmReset = async () => {
        setIsVerifying(true); setError('')
        const verification = await verifyAdminPassword(password)
        if (verification.success) {
            const reset = await resetAllData()
            if (reset.success) {
                setResetParams(true)
                setShowResetModal(false)
                setTimeout(() => setResetParams(false), 3000)
                fetchRealMetrics() // Refresh after reset
            } else setError(reset.error || 'Failed to reset data')
        } else setError(verification.error || 'Invalid password')
        setIsVerifying(false)
    }

    const handleAddSignalType = async () => {
        if (!newSignalLabel) return
        const res = await addSignalType(newSignalLabel)
        if (res.success) { setNewSignalLabel(''); fetchSignalTypes() }
    }

    const handleDeleteSignalType = async (id: number) => {
        await supabase.from('signal_types').update({ is_active: false }).eq('id', id)
        fetchSignalTypes()
    }

    const subPages = [
        { href: '/educator/start', icon: QrCode, title: 'Start a Class', desc: 'Generate QR code & PIN for a live session', color: 'blue' },
        { href: '/admin/outcomes', icon: TrendingUp, title: 'Learning Outcomes', desc: 'View student performance improvements', color: 'emerald' },
        { href: '/admin/traction', icon: Activity, title: 'Traction Dashboard', desc: 'Live pilot metrics and session volume', color: 'indigo' },
        { href: '/admin/testimonials', icon: MessageSquareQuote, title: 'Testimonials', desc: 'Educator feedback and reviews', color: 'purple' },
        { href: '/admin/loi-generator', icon: FileText, title: 'LOI Generator', desc: 'Generate Letters of Intent for pilots', color: 'amber' },
        { href: '/pitch/roi-calculator', icon: BarChart3, title: 'ROI Calculator', desc: 'Show financial impact to institutions', color: 'rose' },
        { href: '/pitch/comparison', icon: BarChart3, title: 'Competitive Analysis', desc: 'Compare vs Mentimeter, Blackboard', color: 'orange' },
    ]

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-8">
            <header className="max-w-5xl mx-auto mb-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 text-white rounded-lg">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">EduPulse Admin</h1>
                        <p className="text-slate-500 text-sm">System Command Center</p>
                    </div>
                </div>
                <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                    Exit to Home
                </Link>
            </header>

            <main className="max-w-5xl mx-auto space-y-8">

                {/* Quick Navigation Panel */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-slate-500" />
                        All Platform Sections
                    </h2>
                    <p className="text-slate-500 text-sm mb-6">Access every feature of the EduPulse platform from here.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {subPages.map((page) => (
                            <Link
                                key={page.href}
                                href={page.href}
                                className="flex flex-col gap-2 p-4 rounded-xl border bg-slate-50 border-slate-200 hover:border-slate-400 hover:bg-slate-100 hover:shadow-sm transition-all group"
                            >
                                <page.icon className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
                                <div className="font-bold text-sm text-slate-800">{page.title}</div>
                                <div className="text-xs text-slate-500 leading-relaxed">{page.desc}</div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Real System Overview */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">System Overview — Last 24 Hours</h2>
                        {!loadingMetrics && (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                Live Data
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-sm text-slate-500 mb-1">Active Sessions (24h)</div>
                            <div className="text-3xl font-black text-slate-900">
                                {loadingMetrics ? <span className="text-slate-300 animate-pulse">—</span> : metrics.activeSessions.length}
                            </div>
                            {metrics.activeSessions.length > 0 && (
                                <div className="text-xs text-slate-400 mt-1 font-mono truncate">
                                    PINs: {metrics.activeSessions.slice(0, 3).join(', ')}{metrics.activeSessions.length > 3 ? '...' : ''}
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-sm text-slate-500 mb-1">Total Signals (24h)</div>
                            <div className="text-3xl font-black text-slate-900">
                                {loadingMetrics ? <span className="text-slate-300 animate-pulse">—</span> : metrics.totalSignals.toLocaleString()}
                            </div>
                            {metrics.totalSignals === 0 && !loadingMetrics && (
                                <div className="text-xs text-slate-400 mt-1">No signals yet — start a session</div>
                            )}
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-sm text-slate-500 mb-1">Top Signal Type</div>
                            <div className="text-2xl font-black text-slate-900">
                                {loadingMetrics ? <span className="text-slate-300 animate-pulse">—</span> :
                                    metrics.signalBreakdown.length > 0
                                        ? metrics.signalBreakdown.sort((a, b) => b.count - a.count)[0].type
                                        : 'No data'
                                }
                            </div>
                        </div>
                    </div>

                    {/* Signal breakdown bar */}
                    {metrics.signalBreakdown.length > 0 && (
                        <div className="mt-6 space-y-2">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Signal Breakdown</div>
                            {metrics.signalBreakdown.sort((a, b) => b.count - a.count).map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-slate-700 w-32 shrink-0">{item.type}</span>
                                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-700"
                                            style={{ width: `${(item.count / metrics.totalSignals) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 w-8 text-right">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Active Sessions — Real */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Active Session PINs (24h)</h2>
                        <Link href="/educator/start" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                            <Zap className="w-3 h-3" /> + Start New Session
                        </Link>
                    </div>
                    {loadingMetrics ? (
                        <div className="text-slate-400 text-sm py-4">Loading session data...</div>
                    ) : metrics.activeSessions.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                            <QrCode className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                            <div className="font-semibold text-slate-500">No sessions in the last 24 hours</div>
                            <div className="text-sm text-slate-400 mt-1">Go to "Start a Class" to begin</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {metrics.activeSessions.map((pin) => (
                                <Link
                                    key={pin}
                                    href={`/educator/dashboard?session=${pin}`}
                                    className="flex flex-col items-center justify-center gap-1 p-4 bg-blue-50 border border-blue-100 rounded-xl hover:border-blue-300 hover:bg-blue-100 transition-all group"
                                >
                                    <div className="text-2xl font-black font-mono text-blue-900">{pin}</div>
                                    <div className="text-xs text-blue-500 font-medium group-hover:underline">View Dashboard →</div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* Signal Management */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-green-600" />
                        Signal Button Management
                    </h2>
                    <p className="text-slate-500 text-sm mb-6">Customize the buttons students see when they join a session. Changes apply immediately.</p>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="New signal label (e.g. Too Noisy, Audio Issue)"
                                value={newSignalLabel}
                                onChange={(e) => setNewSignalLabel(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSignalType()}
                                className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none font-medium"
                            />
                            <button
                                onClick={handleAddSignalType}
                                className="px-5 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 active:scale-95 transition-all"
                            >
                                Add
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {signalTypes.map((type) => (
                                <div key={type.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl group hover:border-slate-300 transition-colors">
                                    <span className="text-sm font-semibold text-slate-700">{type.label}</span>
                                    <button
                                        onClick={() => handleDeleteSignalType(type.id)}
                                        className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-red-600">Danger Zone</h2>
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl">
                        <div>
                            <div className="font-semibold text-red-900">Reset All Signal Data</div>
                            <div className="text-sm text-red-700">Clears all signals from the last 24 hours and beyond. Cannot be undone.</div>
                        </div>
                        <button
                            onClick={handleResetRequest}
                            disabled={resetParams}
                            className="px-4 py-2 bg-white border border-red-200 text-red-700 font-bold rounded-xl hover:bg-red-50 active:scale-95 transition-all flex items-center gap-2 shadow-sm shrink-0 ml-4"
                        >
                            {resetParams ? (<><CheckCircle2 className="w-4 h-4" /> Reset Done</>) : (<><RotateCcw className="w-4 h-4" /> Reset Data</>)}
                        </button>
                    </div>
                </section>

                {/* Reset Modal */}
                {showResetModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-red-600">
                                        <AlertTriangle className="w-6 h-6" />
                                        <h3 className="text-xl font-bold">Confirm Reset</h3>
                                    </div>
                                    <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
                                </div>
                                <p className="text-slate-600 mb-6 bg-red-50 p-3 rounded-lg border border-red-100 text-sm">
                                    <strong>Warning:</strong> This permanently deletes all signal data. Re-enter your admin password to confirm.
                                </p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Admin Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                                            placeholder="••••••••"
                                            autoFocus
                                        />
                                    </div>
                                    {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                                    <div className="flex gap-3 pt-2">
                                        <button onClick={() => setShowResetModal(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">Cancel</button>
                                        <button onClick={handleConfirmReset} disabled={isVerifying || !password} className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50">
                                            {isVerifying ? 'Verifying...' : 'Reset Data'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-center text-xs text-slate-400 mt-8">
                    EduPulse Admin Panel • Restricted Access
                </div>
            </main>
        </div>
    )
}
