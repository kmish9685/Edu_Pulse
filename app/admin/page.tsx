'use client'

import { useState, useEffect } from 'react'
import { RotateCcw, Shield, Users, CheckCircle2, MapPin, Plus, Trash2, X, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { verifyAdminPassword, resetAllData, updateCampusSettings, addSignalType } from '@/app/actions/admin'
import { createClient } from '@/utils/supabase/client'

export default function AdminPage() {
    const [resetParams, setResetParams] = useState(false)
    const [showResetModal, setShowResetModal] = useState(false)
    const [password, setPassword] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [error, setError] = useState('')

    // Campus Settings State
    const [campus, setCampus] = useState({ latitude: 0, longitude: 0, radius_meters: 500, demo_mode: false })
    const [isSavingCampus, setIsSavingCampus] = useState(false)

    // Signal Types State
    const [signalTypes, setSignalTypes] = useState<{ id: number, label: string }[]>([])
    const [newSignalLabel, setNewSignalLabel] = useState('')

    const supabase = createClient()

    useEffect(() => {
        fetchSettings()
        fetchSignalTypes()
    }, [])

    async function fetchSettings() {
        const { data } = await supabase.from('campus_settings').select('*').single()
        if (data) setCampus({ latitude: data.latitude, longitude: data.longitude, radius_meters: data.radius_meters, demo_mode: data.demo_mode || false })
    }

    async function fetchSignalTypes() {
        const { data } = await supabase.from('signal_types').select('*').eq('is_active', true)
        if (data) setSignalTypes(data)
    }

    const handleResetRequest = () => {
        setShowResetModal(true)
        setError('')
        setPassword('')
    }

    const handleConfirmReset = async () => {
        setIsVerifying(true)
        setError('')

        const verification = await verifyAdminPassword(password)
        if (verification.success) {
            const reset = await resetAllData()
            if (reset.success) {
                setResetParams(true)
                setShowResetModal(false)
                setTimeout(() => setResetParams(false), 3000)
            } else {
                setError(reset.error || 'Failed to reset data')
            }
        } else {
            setError(verification.error || 'Invalid password')
        }
        setIsVerifying(false)
    }

    const handleSaveCampus = async () => {
        setIsSavingCampus(true)
        await updateCampusSettings(campus)
        setIsSavingCampus(false)
    }

    const handleAddSignalType = async () => {
        if (!newSignalLabel) return
        const res = await addSignalType(newSignalLabel)
        if (res.success) {
            setNewSignalLabel('')
            fetchSignalTypes()
        }
    }

    const handleDeleteSignalType = async (id: number) => {
        await supabase.from('signal_types').update({ is_active: false }).eq('id', id)
        fetchSignalTypes()
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

                {/* Campus Location Setup */}
                <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Campus Geofencing
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Latitude</label>
                            <input
                                type="number"
                                value={campus.latitude}
                                onChange={(e) => setCampus({ ...campus, latitude: parseFloat(e.target.value) })}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Longitude</label>
                            <input
                                type="number"
                                value={campus.longitude}
                                onChange={(e) => setCampus({ ...campus, longitude: parseFloat(e.target.value) })}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Radius (meters)</label>
                            <input
                                type="number"
                                value={campus.radius_meters}
                                onChange={(e) => setCampus({ ...campus, radius_meters: parseInt(e.target.value) })}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${campus.demo_mode ? 'bg-amber-500' : 'bg-slate-300'}`} onClick={() => setCampus({ ...campus, demo_mode: !campus.demo_mode })}>
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${campus.demo_mode ? 'translate-x-4' : ''}`} />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-800">Enable Demo Mode</div>
                                <div className="text-xs text-slate-500">Bypass geofence for off-campus demonstrations</div>
                            </div>
                        </div>

                        <button
                            onClick={handleSaveCampus}
                            disabled={isSavingCampus}
                            className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            {isSavingCampus ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </section>

                {/* Signal Buttons Management */}
                <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-green-600" />
                        Signal Management
                    </h2>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="New signal label (e.g. Too Noisy)"
                                value={newSignalLabel}
                                onChange={(e) => setNewSignalLabel(e.target.value)}
                                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                            />
                            <button
                                onClick={handleAddSignalType}
                                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 active:scale-95 transition-all"
                            >
                                Add Signal
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {signalTypes.map((type) => (
                                <div key={type.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg group">
                                    <span className="text-sm font-medium text-slate-700">{type.label}</span>
                                    <button
                                        onClick={() => handleDeleteSignalType(type.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Data Controls */}
                <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-red-600">Danger Zone</h2>
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-lg">
                        <div>
                            <div className="font-semibold text-red-900">Reset All Demo Data</div>
                            <div className="text-sm text-red-700">Permanently deletes all session data. This cannot be undone.</div>
                        </div>
                        <button
                            onClick={handleResetRequest}
                            disabled={resetParams}
                            className="px-4 py-2 bg-white border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-50 active:scale-95 transition-all flex items-center gap-2"
                        >
                            {resetParams ? (
                                <><CheckCircle2 className="w-4 h-4" /> Data Reset</>
                            ) : (
                                <><RotateCcw className="w-4 h-4" /> Reset Data</>
                            )}
                        </button>
                    </div>
                </section>

                {/* Reset Confirmation Modal */}
                {showResetModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-red-600">
                                        <AlertTriangle className="w-6 h-6" />
                                        <h3 className="text-xl font-bold">Confirm Reset</h3>
                                    </div>
                                    <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-slate-600">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <p className="text-slate-600 mb-6 bg-red-50 p-3 rounded-lg border border-red-100 text-sm">
                                    <strong>Warning:</strong> This action permanently deletes all session data. Please re-enter your admin password to proceed.
                                </p>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase">Admin Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                            placeholder="••••••••"
                                            autoFocus
                                        />
                                    </div>
                                    {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => setShowResetModal(false)}
                                            className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmReset}
                                            disabled={isVerifying || !password}
                                            className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:scale-95 disabled:opacity-50 transition-all shadow-sm shadow-red-200"
                                        >
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
        </div >
    )
}
