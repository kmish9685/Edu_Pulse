'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Play, Link as LinkIcon, Users, QrCode, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function EducatorStart() {
    const [sessionId, setSessionId] = useState('')
    const [joinUrl, setJoinUrl] = useState('')
    const router = useRouter()

    useEffect(() => {
        // Generate a random 4 digit PIN
        const pin = Math.floor(1000 + Math.random() * 9000).toString()
        setSessionId(pin)

        // In local dev, use localhost. In prod, use window.location.origin
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://edupulse.com'
        setJoinUrl(`${baseUrl}/join/${pin}`)
    }, [])

    return (
        <div className="min-h-screen bg-slate-900 font-sans text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center">

                <div className="space-y-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold rounded-full text-sm mb-6">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            Ready to Broadcast
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Zero-Friction Connections.</h1>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Students do not need an app or an account. Display this code on your projector. They scan, tap, and instantly join your live intelligence stream.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-slate-300 bg-white/5 p-4 border border-white/10 rounded-xl">
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                <QrCode className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="font-bold text-white">1. Screen Projection</div>
                                <div className="text-sm">Display the QR code on your main display</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-300 bg-white/5 p-4 border border-white/10 rounded-xl">
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="font-bold text-white">2. Student Scan</div>
                                <div className="text-sm">Students scan using their default camera</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push(`/educator/dashboard?session=${sessionId}`)}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/50 transition-all flex items-center justify-center gap-2 group"
                    >
                        Initialize Dashboard
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <Link href="/admin" className="block text-center text-sm font-semibold text-slate-500 hover:text-white transition-colors">
                        Cancel and return to Admin
                    </Link>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center text-slate-900 transform md:rotate-2 hover:rotate-0 transition-transform duration-500 border-8 border-slate-800">
                    <div className="mb-6 text-center">
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Join Session</div>
                        <div className="text-5xl font-black font-mono tracking-widest text-slate-900">{sessionId}</div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 mb-8 w-full flex justify-center">
                        {joinUrl && (
                            <QRCodeSVG
                                value={joinUrl}
                                size={240}
                                bgColor={"#ffffff"}
                                fgColor={"#0f172a"}
                                level={"H"}
                                marginSize={1}
                            />
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-full w-full justify-center">
                        <LinkIcon className="w-4 h-4" />
                        edupulse.com/join/{sessionId}
                    </div>
                </div>

            </div>
        </div>
    )
}
