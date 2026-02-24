'use client'

import { useState, useEffect } from 'react'
import { RotateCcw, Shield, Users, CheckCircle2, Plus, Trash2, X, AlertTriangle, TrendingUp, Activity, MessageSquareQuote, FileText, BarChart3, QrCode, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { verifyAdminPassword, resetAllData, addSignalType } from '@/app/actions/admin'
import { createClient } from '@/utils/supabase/client'

export default function AdminPage() {
    const [resetParams, setResetParams] = useState(false)
    const [showResetModal, setShowResetModal] = useState(false)
    const [password, setPassword] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [error, setError] = useState('')
    const [signalTypes, setSignalTypes] = useState<{ id: number, label: string }[]>([])
    const [newSignalLabel, setNewSignalLabel] = useState('')

    const supabase = createClient()

    useEffect(() => { fetchSignalTypes() }, [])

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
            if (reset.success) { setResetParams(true); setShowResetModal(false); setTimeout(() => setResetParams(false), 3000) }
            else setError(reset.error || 'Failed to reset data')
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
                                className={`flex flex-col gap-2 p-4 rounded-xl border bg-${page.color}-50 border-${page.color}-100 hover:border-${page.color}-300 hover:shadow-sm transition-all group`}
                            >
                                <page.icon className={`w-5 h-5 text-${page.color}-600`} />
                                <div className={`font-bold text-sm text-${page.color}-900`}>{page.title}</div>
                                <div className="text-xs text-slate-500 leading-relaxed">{page.desc}</div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* System Overview */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold mb-6">System Overview</h2>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="text-sm text-slate-500 mb-1">Active Classes (Simulated)</div>
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
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Active Sessions</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1 border border-green-100">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                Live
                            </span>
                            <Link href="/educator/start" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                + Start New Session
                            </Link>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">CS10{i}: Intro to Algorithmic Thinking</div>
                                        <div className="text-xs text-slate-500">Prof. Sarah Jenkins • 42 Students</div>
                                    </div>
                                </div>
                                <div className={`font-mono text-sm font-bold px-3 py-1 rounded-full ${(12 + i * 5) > 20 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-600'}`}>
                                    {12 + i * 5}% Confusion
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Signal Management */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-green-600" />
                        Signal Button Management
                    </h2>
                    <p className="text-slate-500 text-sm mb-6">Customize the buttons students see when they join a session. Add or remove signal types here.</p>
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
                                Add Signal
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
                            <div className="font-semibold text-red-900">Reset All Demo Data</div>
                            <div className="text-sm text-red-700">Permanently deletes all session signal data. Cannot be undone.</div>
                        </div>
                        <button
                            onClick={handleResetRequest}
                            disabled={resetParams}
                            className="px-4 py-2 bg-white border border-red-200 text-red-700 font-bold rounded-xl hover:bg-red-50 active:scale-95 transition-all flex items-center gap-2 shadow-sm"
                        >
                            {resetParams ? (<><CheckCircle2 className="w-4 h-4" /> Data Reset</>) : (<><RotateCcw className="w-4 h-4" /> Reset Data</>)}
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
                                    <strong>Warning:</strong> This action permanently deletes all session data. Re-enter your admin password to proceed.
                                </p>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Admin Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                                            placeholder="••••••••"
                                            autoFocus
                                        />
                                    </div>
                                    {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                                    <div className="flex gap-3 pt-2">
                                        <button onClick={() => setShowResetModal(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">Cancel</button>
                                        <button onClick={handleConfirmReset} disabled={isVerifying || !password} className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:scale-95 disabled:opacity-50">
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
