'use client'

import { useState } from 'react'
import { FileText, Download, Check, Building2, User, Mail, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function LOIGeneratorPage() {
    const [formData, setFormData] = useState({
        department: 'School of Computing',
        university: 'Galgotias University',
        hodName: 'Dr. S. K. Singh',
        hodTitle: 'Dean',
        date: new Date().toISOString().split('T')[0],
        classes: '15'
    })
    const [isGenerated, setIsGenerated] = useState(false)

    // In a real app, this would generate a PDF blob. 
    // For the demo/pitch, we just show a "Success" state and the preview.
    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault()
        setIsGenerated(true)
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/admin" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                            <span className="sr-only">Back</span>
                            ←
                        </Link>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            LOI Generator
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Form Section */}
                    <div>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Commitment Letter</h2>
                            <p className="text-slate-600">
                                Generate a standardized "Letter of Intent" for departments to sign.
                                This serves as proof of traction for investors and competition judges.
                            </p>
                        </div>

                        <form onSubmit={handleGenerate} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-slate-400" /> Department / School
                                </label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-slate-400" /> University Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.university}
                                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                        <User className="w-4 h-4 text-slate-400" /> Signatory Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.hodName}
                                        onChange={(e) => setFormData({ ...formData, hodName: e.target.value })}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Signatory Title</label>
                                    <input
                                        type="text"
                                        value={formData.hodTitle}
                                        onChange={(e) => setFormData({ ...formData, hodTitle: e.target.value })}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400" /> Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Est. Classes</label>
                                    <input
                                        type="number"
                                        value={formData.classes}
                                        onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                {isGenerated ? <Check className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                {isGenerated ? "Generated Successfully" : "Generate Letter PDF"}
                            </button>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-slate-200 p-8 rounded-xl flex items-center justify-center">
                        <div className="bg-white w-full max-w-md aspect-[1/1.414] shadow-2xl p-8 text-xs md:text-sm flex flex-col relative">
                            {/* Letterhead */}
                            <div className="border-b-2 border-slate-900 pb-4 mb-8">
                                <div className="font-bold text-lg uppercase tracking-wider text-slate-900">{formData.department}</div>
                                <div className="text-slate-500 font-semibold">{formData.university}</div>
                            </div>

                            {/* Body */}
                            <div className="flex-1 space-y-4 text-slate-900">
                                <div className="text-right mb-8">Date: {formData.date}</div>

                                <div>To: The EduPulse Team</div>

                                <div className="font-bold my-4">Subject: Intent to Adopt EduPulse AI Platform</div>

                                <p>To Whom It May Concern,</p>

                                <p>
                                    This letter confirms that the <strong>{formData.department}</strong> at <strong>{formData.university}</strong> intends to adopt the EduPulse AI platform for the upcoming academic semester.
                                </p>

                                <p>
                                    We recognize the critical need for real-time student confusion detection and recurring gap analysis. We plan to pilot this technology in approximately <strong>{formData.classes} classes</strong>, pending final administrative approval.
                                </p>

                                <p>
                                    We look forward to collaborating with your team to improve student retention and learning outcomes using your innovative solution.
                                </p>
                            </div>

                            {/* Signature */}
                            <div className="mt-12">
                                <div className="h-16 w-32 mb-2 relative">
                                    <div className="absolute bottom-0 left-0 text-slate-400 italic text-lg font-handwriting select-none">
                                        Signature
                                    </div>
                                    <div className="border-b border-slate-400 w-full absolute bottom-1"></div>
                                </div>
                                <div className="font-bold">{formData.hodName}</div>
                                <div className="text-slate-600">{formData.hodTitle}</div>
                                <div className="text-slate-600">{formData.department}</div>
                            </div>

                            {/* Download Overlay (Only visible when generated) */}
                            {isGenerated && (
                                <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-sm flex items-center justify-center rounded transition-all">
                                    <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold shadow-xl border border-indigo-100 flex items-center gap-2 hover:scale-105 transition-all">
                                        <Download className="w-5 h-5" /> Download PDF
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
