'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, HelpCircle, Zap } from 'lucide-react'
import Link from 'next/link'

export default function StudentPage() {
    const [signaled, setSignaled] = useState(false)
    const [feedbackType, setFeedbackType] = useState<string | null>(null)

    const handleSignal = (type: string = 'generic') => {
        setSignaled(true)
        setFeedbackType(type)

        // Reset after 3 seconds
        setTimeout(() => {
            setSignaled(false)
            setFeedbackType(null)
        }, 3000)
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
                    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-slate-900">How are you following?</h1>
                            <p className="text-slate-500">Tap below if you are lost.</p>
                        </div>

                        <button
                            onClick={() => handleSignal('confused')}
                            className="w-full aspect-square bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all rounded-3xl shadow-lg flex flex-col items-center justify-center gap-4 group"
                        >
                            <AlertCircle className="w-24 h-24 text-red-400 group-hover:text-red-300 transition-colors" />
                            <span className="text-3xl font-bold text-white tracking-wide">I'm Confused</span>
                        </button>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleSignal('too_fast')}
                                className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-400 transition-colors text-slate-700 font-medium flex flex-col items-center gap-2"
                            >
                                <Zap className="w-5 h-5 text-slate-400" />
                                Too Fast
                            </button>
                            <button
                                onClick={() => handleSignal('example')}
                                className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-400 transition-colors text-slate-700 font-medium flex flex-col items-center gap-2"
                            >
                                <HelpCircle className="w-5 h-5 text-slate-400" />
                                Need Example
                            </button>
                        </div>

                        <p className="text-center text-xs text-slate-400 mt-8">
                            No login required. Your professor sees only aggregate data.
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}
