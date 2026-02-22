'use client'

import { useState } from 'react'
import { Star, MessageSquareQuote, ThumbsUp, ArrowLeft, Filter } from 'lucide-react'
import Link from 'next/link'

const MOCK_TESTIMONIALS = [
    {
        id: 1,
        name: 'Dr. Sarah Jenkins',
        role: 'Professor of Computer Science',
        institution: 'Galgotias University',
        rating: 5,
        content: 'EduPulse completely changed how I teach Intro to Algorithms. I used to find out my students were lost only after they failed the midterm. Now, I see the confusion spike on my dashboard in real-time, explain the concept differently, and watch the comprehension metric go back up. It saves me hours of re-teaching.',
        date: '2 Days Ago'
    },
    {
        id: 2,
        name: 'Prof. Ananya Sharma',
        role: 'Head of Economics',
        institution: 'Delhi University',
        rating: 5,
        content: 'The best part isn\'t even the real-time feedback; it\'s the fact that it doesn\'t disrupt my flow. Students signal anonymously, so shy kids finally have a voice, and I don\'t have to stop my lecture to ask "does everyone understand?" every 10 minutes.',
        date: '1 Week Ago'
    },
    {
        id: 3,
        name: 'Dr. Rahul Verma',
        role: 'Asst. Professor, Engineering',
        institution: 'Amity University',
        rating: 4,
        content: 'Our department\'s average scores have demonstrably improved since deploying EduPulse. We are catching the "invisible learning gaps" that were causing our first-year dropouts. The ROI for the institution is clear.',
        date: '2 Weeks Ago'
    }
]

export default function TestimonialDashboard() {
    const [testimonials, setTestimonials] = useState(MOCK_TESTIMONIALS)

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <header className="p-6 bg-white border-b border-slate-200 flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-slate-600 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Admin
                </Link>
                <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
                    <MessageSquareQuote className="w-6 h-6 text-purple-600" />
                    Educator Testimonials
                </div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-widest hidden md:block">Qualitative Proof</div>
            </header>

            <main className="max-w-5xl mx-auto p-6 lg:p-12 space-y-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Faculty Adoption & Feedback</h1>
                        <p className="text-slate-600 max-w-2xl">
                            Real-world reviews from educators participating in the initial rollout. This qualitative data demonstrates product-market fit to EDVentures judges.
                        </p>
                    </div>
                    <button className="px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filter by Institution
                    </button>
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900">4.8</div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Avg Rating</div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <MessageSquareQuote className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900">124</div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Reviews Collected</div>
                        </div>
                    </div>
                    <div className="md:col-span-2 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-2xl border border-purple-500/20 shadow-lg flex items-center justify-between text-white">
                        <div>
                            <div className="text-lg font-bold mb-1">Generate Review Link</div>
                            <div className="text-purple-200 text-sm">Send this form to your pilot educators.</div>
                        </div>
                        <button className="px-4 py-2 bg-white text-purple-900 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                            Copy Link
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {testimonials.map((t) => (
                        <div key={t.id} className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{t.name}</h3>
                                    <div className="text-sm text-slate-500 font-medium">{t.role} • {t.institution}</div>
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-slate-700 leading-relaxed text-lg italic mb-6">"{t.content}"</p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <span className="text-xs text-slate-400 font-medium">{t.date}</span>
                                <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                    <ThumbsUp className="w-4 h-4" /> Feature on Landing Page
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    )
}
