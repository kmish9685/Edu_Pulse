'use client'

import { useState, useEffect } from 'react'
import { submitSignal } from '@/app/actions/signals'
import { AlertCircle, CheckCircle2, Navigation, Send, Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

export default function StudentJoin() {
    const params = useParams()
    const router = useRouter()
    const sessionId = params.id as string

    const [signaled, setSignaled] = useState(false)
    const [cooldown, setCooldown] = useState(false)
    const [types, setTypes] = useState([
        { id: 1, label: "I'm Confused" },
        { id: 2, label: "Too Fast" },
    ])

    // Auto-join the session conceptually. For the demo, we assume the session is valid
    // if a user lands here with a 4-digit PIN.

    useEffect(() => {
        // Enforce basic PIN validation for the demo
        if (!sessionId || sessionId.length !== 4) {
            router.push('/')
        }

        const lastSignal = localStorage.getItem('last_signal_time')
        if (lastSignal) {
            const diff = Date.now() - parseInt(lastSignal)
            if (diff < 60000) { // 1 minute cooldown
                setCooldown(true)
                setTimeout(() => setCooldown(false), 60000 - diff)
            }
        }
    }, [sessionId, router])

    const handleSignal = async (type: string) => {
        if (cooldown) return

        // Submit signal with session ID attached as block_room to avoid DB schema changes
        const res = await submitSignal({
            type,
            block_room: sessionId,
            additional_text: ''
        })

        if (res.success) {
            setSignaled(true)
            setCooldown(true)
            localStorage.setItem('last_signal_time', Date.now().toString())

            setTimeout(() => {
                setSignaled(false)
            }, 3000)

            setTimeout(() => setCooldown(false), 60000) // 1 minute cooldown
        }
    }

    if (!sessionId || sessionId.length !== 4) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>

    return (
        <div className="min-h-screen bg-slate-900 font-sans text-slate-100 flex flex-col pt-[5vh] items-center px-6 relative overflow-hidden">

            {/* Background blur */}
            <div className="absolute top-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-40">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[50%] bg-blue-600 blur-[120px] rounded-full"></div>
            </div>

            <main className="w-full max-w-sm flex flex-col items-center z-10 space-y-8">

                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-slate-300 backdrop-blur-md mb-6 border border-white/5">
                        <Navigation className="w-3 h-3 text-blue-400" />
                        Connected to Session {sessionId}
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">EduPulse</h1>
                    <p className="text-slate-400 text-sm">Anonymous Real-Time Feedback</p>
                </div>

                {/* Status Card */}
                <div className={`w-full p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3
                    ${signaled
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100'
                        : cooldown
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200/80'
                            : 'bg-white/5 border-white/10 text-slate-300'
                    } backdrop-blur-md shadow-xl`}
                >
                    {signaled ? (
                        <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400 mt-1" />
                    ) : (
                        <AlertCircle className={`w-6 h-6 shrink-0 mt-1 ${cooldown ? 'text-amber-400/80' : 'text-blue-400'}`} />
                    )}
                    <div>
                        <h2 className="font-bold text-md mb-1">
                            {signaled ? "Signal Delivered Successfully" : cooldown ? "Cooldown Active" : "Ready to Send"}
                        </h2>
                        <p className="text-sm opacity-80 leading-relaxed font-medium">
                            {signaled
                                ? "Your teacher has been notified anonymously. Thank you."
                                : cooldown
                                    ? "To prevent spam, you can only send one signal per minute. Please wait."
                                    : "Tap a button below if you are feeling lost. Your identity is 100% hidden."
                            }
                        </p>
                    </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="w-full space-y-4">
                    {types.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => handleSignal(type.label)}
                            disabled={cooldown}
                            className={`w-full relative overflow-hidden group p-6 rounded-[2rem] text-left transition-all duration-300
                                ${cooldown
                                    ? 'bg-white/5 opacity-50 cursor-not-allowed border-transparent'
                                    : 'bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] border-t border-white/20'
                                }
                            `}
                        >
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <span className={`block font-black text-2xl mb-1 ${cooldown ? 'text-white' : 'text-white'}`}>{type.label}</span>
                                    <span className={`text-sm font-medium ${cooldown ? 'text-slate-400' : 'text-blue-100'}`}>Notify teacher instantly</span>
                                </div>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 ${cooldown ? 'bg-white/10' : 'bg-white/20 group-hover:scale-110 group-hover:bg-white/30'}`}>
                                    <Send className={`w-5 h-5 ${cooldown ? 'text-white/50' : 'text-white'}`} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Trust Footer */}
                <div className="mt-8 text-center text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    100% Anonymous Encryption
                </div>

            </main>
        </div>
    )
}
