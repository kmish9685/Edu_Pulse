'use client'

import { useState } from 'react'
import { Star, School, Quote, Send, CheckCircle2, User } from 'lucide-react'
import Link from 'next/link'

// Mock Data for Pitch
const TESTIMONIALS = [
    {
        id: 1,
        name: "Dr. Amit Kumar",
        role: "Associate Professor, Computer Science",
        institution: "Galgotias University",
        text: "I used to think my class was following along. EduPulse showed me that 40% were lost by slide 10. It completely changed how I teach Database Systems. The real-time feedback is invaluable.",
        rating: 5,
        image: null // Placeholder for avatar
    },
    {
        id: 2,
        name: "Prof. Sarah Jenkins",
        role: "Head of Engineering",
        institution: "IIT Delhi (Pilot)",
        text: "The 'Recurring Gap Detection' is a game changer. We found that students were consistently struggling with Recursion across 3 different courses. We adjusted the curriculum immediately.",
        rating: 5,
        image: null
    },
    {
        id: 3,
        name: "Dr. Rajesh Singh",
        role: "Lecturer, Physics",
        institution: "Galgotias University",
        text: "Finally, a tool that students actually use. They don't have to download anything or login, so adoption was 100% in my first lecture. The anonymity makes them feel safe to admit confusion.",
        rating: 5,
        image: null
    },
    {
        id: 4,
        name: "Dean Patel",
        role: "Dean of Student Affairs",
        institution: "Bennett University",
        text: "We are looking for retention solutions. EduPulse's ROI model makes financial sense, but the social impact of helping quiet students is what really convinced us to start a pilot.",
        rating: 5,
        image: null
    }
]

export default function TestimonialsPage() {
    const [isSubmitted, setIsSubmitted] = useState(false)

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[150px] animate-pulse-glow" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
            </div>

            <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
                        ← Back to Home
                    </Link>
                </div>
            </header>

            <main className="relative z-10 container mx-auto px-6 py-16 max-w-6xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <Quote className="w-3 h-3" /> Faculty Feedback
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Educators</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        See why professors at top institutions are switching from verbal feedback to EduPulse.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    {TESTIMONIALS.map((t) => (
                        <div key={t.id} className="glass-card p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors relative group">
                            <Quote className="absolute top-8 right-8 w-8 h-8 text-white/5 group-hover:text-white/10 transition-colors" />

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center border border-white/10 text-slate-400">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{t.name}</h3>
                                    <div className="text-sm text-slate-400">{t.role}</div>
                                    <div className="text-xs text-blue-400 flex items-center gap-1 mt-0.5">
                                        <School className="w-3 h-3" /> {t.institution}
                                    </div>
                                </div>
                            </div>

                            <p className="text-slate-300 leading-relaxed italic mb-6">
                                "{t.text}"
                            </p>

                            <div className="flex gap-1">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submission Form */}
                <div className="max-w-2xl mx-auto">
                    <div className="glass-card p-1 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-white/5">
                        <div className="bg-slate-950/95 rounded-[22px] p-8 md:p-12 backdrop-blur-xl">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Share Your Experience</h2>
                                <p className="text-slate-400">Help us improve education by sharing your feedback.</p>
                            </div>

                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                                    <p className="text-slate-400">Your specific feedback helps us maximize our impact on SDG-4.</p>
                                    <button onClick={() => setIsSubmitted(false)} className="mt-6 text-blue-400 hover:text-blue-300 text-sm font-medium">
                                        Submit another
                                    </button>
                                </div>
                            ) : (
                                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                                            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Dr. Jane Doe" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Institution</label>
                                            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="University Name" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Role</label>
                                        <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Professor of Mathematics" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Testimonial</label>
                                        <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="How has EduPulse impacted your classroom?" required></textarea>
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
                                        <Send className="w-4 h-4" /> Submit Testimonial
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
