'use client'

import { useState } from 'react'
import { FileText, Download, Send, ArrowLeft, Building2, UserCircle, Calculator, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function LOIGenerator() {
    const [formData, setFormData] = useState({
        institution: '',
        contactName: '',
        role: '',
        students: 5000,
        amount: 250000
    })

    const [isGenerating, setIsGenerating] = useState(false)
    const [isGenerated, setIsGenerated] = useState(false)

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault()
        setIsGenerating(true)
        setTimeout(() => {
            setIsGenerating(false)
            setIsGenerated(true)
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <header className="p-6 bg-white border-b border-slate-200 flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-slate-600 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Admin
                </Link>
                <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
                    <FileText className="w-6 h-6 text-emerald-600" />
                    LOI Generator
                </div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-widest hidden md:block">Sales Operations</div>
            </header>

            <main className="max-w-6xl mx-auto p-6 lg:p-12">

                <div className="mb-12 text-center max-w-3xl mx-auto space-y-4">
                    <h1 className="text-3xl font-bold text-slate-900">Letter of Intent Automation</h1>
                    <p className="text-slate-600">
                        Generate legally compliant Letters of Intent (LOI) to secure pilot commitments and demonstrate B2B sales traction to the EDVentures judges.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Form Section */}
                    <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                            <Building2 className="w-5 h-5 text-emerald-600" /> Institution Details
                        </h2>

                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Institution Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Galgotias University"
                                    value={formData.institution}
                                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Contact Person (Signatory)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserCircle className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Dr. K. Mallik"
                                        value={formData.contactName}
                                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                        className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Signatory Role</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Dean of Academics"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Students</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.students}
                                        onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Deal Value (₹)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">₹</div>
                                        <input
                                            type="number"
                                            required
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                                            className="w-full p-3 pl-8 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isGenerating || !formData.institution || !formData.contactName}
                                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm shadow-slate-200 disabled:opacity-50"
                            >
                                {isGenerating ? 'Drafting Legal Document...' : 'Generate LOI Draft'}
                            </button>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className="lg:col-span-7">
                        {isGenerated ? (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" /> LOI Successfully Generated
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-white text-emerald-700 font-bold rounded-lg border border-emerald-200 hover:bg-emerald-100 flex items-center gap-2 text-sm shadow-sm transition-colors">
                                            <Download className="w-4 h-4" /> PDF
                                        </button>
                                        <button className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 flex items-center gap-2 text-sm shadow-sm transition-colors">
                                            <Send className="w-4 h-4" /> Send Sign Request
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-2xl relative overflow-hidden font-serif">
                                    {/* Watermark */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none rotate-[-30deg]">
                                        <div className="text-8xl font-black whitespace-nowrap">DRAFT LOI</div>
                                    </div>

                                    <div className="text-center mb-10 border-b pb-8">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2 uppercase tracking-widest">Letter of Intent</h2>
                                        <p className="text-slate-500 text-sm">Non-Binding Memorandum of Understanding</p>
                                    </div>

                                    <div className="space-y-6 text-slate-800 leading-loose">
                                        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                                        <p>This NON-BINDING LETTER OF INTENT ("LOI") outlines the mutual intention between <strong>EduPulse AI</strong> ("Provider") and <strong>{formData.institution}</strong> ("Institution") to implement a comprehensive Institutional Learning Intelligence system.</p>

                                        <h3 className="font-bold text-lg pt-4 border-b border-slate-100 pb-2">1. Scope of Pilot</h3>
                                        <p>The Institution intends to deploy EduPulse software covering approximately <strong>{formData.students.toLocaleString()} students</strong> to track real-time learning gaps, protect tuition revenue from systemic dropouts, and improve overall institutional outcomes.</p>

                                        <h3 className="font-bold text-lg pt-4 border-b border-slate-100 pb-2">2. Financial Provisions</h3>
                                        <p>Pending the successful completion of a 60-day trial period, the Institution anticipates entering into a formal licensing agreement estimated at <strong>₹{formData.amount.toLocaleString()} per annum</strong>.</p>

                                        <h3 className="font-bold text-lg pt-4 border-b border-slate-100 pb-2">3. Next Steps</h3>
                                        <p>Signatures below indicate intent to proceed with technical integration and faculty onboarding within the next 14 business days.</p>

                                        <div className="grid grid-cols-2 gap-12 mt-16 pt-8">
                                            <div>
                                                <div className="border-b-2 border-slate-300 mb-2 h-12"></div>
                                                <p className="font-bold text-sm">EduPulse Representative</p>
                                                <p className="text-sm text-slate-500">Authorized Signatory</p>
                                            </div>
                                            <div>
                                                <div className="border-b-2 border-slate-300 mb-2 h-12"></div>
                                                <p className="font-bold text-sm">{formData.contactName}</p>
                                                <p className="text-sm text-slate-500">{formData.role}</p>
                                                <p className="text-sm text-slate-500">{formData.institution}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                                <Calculator className="w-16 h-16 mb-4 text-slate-300" />
                                <h3 className="text-lg font-bold text-slate-500">Document Preview</h3>
                                <p className="text-center text-sm max-w-sm mt-2">Fill out the institution details on the left to generate a preview of the Letter of Intent.</p>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    )
}
