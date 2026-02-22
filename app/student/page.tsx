'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle2, HelpCircle, Zap, MapPin, MessageSquare, Building2 } from 'lucide-react'
import Link from 'next/link'
import { submitSignal, getCampusSettings, getSignalTypes } from '@/app/actions/signals'

export default function StudentPage() {
    const [signaled, setSignaled] = useState(false)
    const [loading, setLoading] = useState(true)
    const [cooldown, setCooldown] = useState(false)

    // Config
    const [signalTypes, setSignalTypes] = useState<{ id: number, label: string }[]>([])
    const [campus, setCampus] = useState<any>(null)

    // Student State
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [isWithinRange, setIsWithinRange] = useState(false)

    // Optional Context
    const [blockRoom, setBlockRoom] = useState('')
    const [additionalText, setAdditionalText] = useState('')

    useEffect(() => {
        init()
    }, [])

    const init = async () => {
        const [types, settings] = await Promise.all([
            getSignalTypes(),
            getCampusSettings()
        ])
        if (types.success && types.data) setSignalTypes(types.data as { id: number, label: string }[])
        if (settings.success && settings.data) setCampus(settings.data)
        setLoading(false)

        // Force within range since geolocation is disabled for demo
        setIsWithinRange(true)

        // Check local cooldown
        const lastSignal = localStorage.getItem('last_signal_time')
        if (lastSignal) {
            const diff = Date.now() - parseInt(lastSignal)
            if (diff < 60000) { // 1 minute cooldown
                setCooldown(true)
                setTimeout(() => setCooldown(false), 60000 - diff)
            }
        }
    }

    const handleSignal = async (type: string) => {
        if (cooldown) return
        if (!isWithinRange) return

        const res = await submitSignal({
            type,
            lat: userLocation?.lat,
            lng: userLocation?.lng,
            block_room: blockRoom,
            additional_text: additionalText
        })

        if (res.success) {
            setSignaled(true)
            setCooldown(true)
            localStorage.setItem('last_signal_time', Date.now().toString())

            // Clear inputs
            setAdditionalText('')
            setBlockRoom('')

            setTimeout(() => {
                setSignaled(false)
            }, 3000)

            setTimeout(() => setCooldown(false), 60000) // 1 minute cooldown
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <header className="p-6 flex justify-center border-b border-slate-200 bg-white">
                <Link href="/" className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-slate-900" />
                    <span className="font-semibold text-slate-900">EduPulse Student View</span>
                </Link>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
                {signaled ? (
                    <div className="animate-in fade-in zoom-in duration-300 text-center">
                        <div className="w-24 h-24 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Signal Sent</h2>
                        <p className="text-slate-500">Your feedback is anonymous.</p>
                    </div>
                ) : (
                    <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {cooldown && (
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-center text-xs font-medium text-blue-700">
                                Cooldown active. You can send another signal in a moment.
                            </div>
                        )}

                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-slate-900">How are you following?</h1>
                            <p className="text-slate-500">Your feedback helps improve this session.</p>
                        </div>

                        {/* Main Signal Button */}
                        <button
                            onClick={() => handleSignal("I'm Confused")}
                            disabled={!isWithinRange || cooldown || loading}
                            className="w-full aspect-square bg-slate-900 hover:bg-slate-800 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all rounded-3xl shadow-lg flex flex-col items-center justify-center gap-4 group"
                        >
                            <AlertCircle className="w-24 h-24 text-red-400 group-hover:text-red-300 transition-colors" />
                            <span className="text-3xl font-bold text-white tracking-wide">I'm Confused</span>
                        </button>

                        {/* Additional Signal Types */}
                        <div className="grid grid-cols-2 gap-4">
                            {signalTypes.filter(t => t.label !== "I'm Confused").map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleSignal(type.label)}
                                    disabled={!isWithinRange || cooldown || loading}
                                    className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-400 disabled:opacity-50 transition-colors text-slate-700 font-medium flex flex-col items-center gap-2 shadow-sm"
                                >
                                    <Zap className="w-5 h-5 text-slate-400" />
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        {/* Optional Context Section */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Building2 className="w-4 h-4" /> Optional Context
                            </h3>

                            <div className="space-y-3">
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Block / Room (e.g. C-101)"
                                        value={blockRoom}
                                        onChange={(e) => setBlockRoom(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <textarea
                                        placeholder="Brief details (max 120 chars)"
                                        maxLength={120}
                                        value={additionalText}
                                        onChange={(e) => setAdditionalText(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all min-h-[80px] resize-none"
                                    />
                                    <div className="absolute right-2 bottom-2 text-[10px] text-slate-400">
                                        {additionalText.length}/120
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                            Anonymized • Secure
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}
