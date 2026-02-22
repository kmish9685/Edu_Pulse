'use client'

import { useState } from 'react'
import { Calculator, TrendingUp, AlertTriangle, ShieldCheck, Download, Mail } from 'lucide-react'
import Link from 'next/link'

const TIERS = {
    small: { name: 'Small (<5K)', cost: 200000, label: '₹2 Lakh' },
    medium: { name: 'Medium (5-15K)', cost: 499999, label: '₹5 Lakh' },
    large: { name: 'Large (>15K)', cost: 800000, label: '₹8 Lakh' }
}

export default function ROICalculator() {
    const [institutionSize, setInstitutionSize] = useState<keyof typeof TIERS>('medium')
    const [dropoutRate, setDropoutRate] = useState(18)
    const [tuition, setTuition] = useState(120000)
    const [totalStudents, setTotalStudents] = useState(10000)

    // Calculations
    const studentsLost = Math.floor(totalStudents * (dropoutRate / 100))
    const lostRevenue = studentsLost * tuition
    const studentsRetained = Math.floor(studentsLost * 0.10) // 10% improvement assumption
    const revenueProtected = studentsRetained * tuition
    const eduPulseCost = TIERS[institutionSize].cost
    const netBenefit = revenueProtected - eduPulseCost
    const roiPercentage = ((netBenefit / eduPulseCost) * 100).toFixed(0)
    const paybackMonths = ((eduPulseCost / revenueProtected) * 12).toFixed(1)

    const formatINR = (amount: number) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)} Crore`
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)} Lakh`
        }
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <header className="p-6 bg-white border-b border-slate-200 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    EduPulse ROI Projector
                </Link>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">For Institutional Pitch</div>
            </header>

            <main className="max-w-6xl mx-auto p-6 lg:p-12">
                <div className="mb-12 text-center max-w-3xl mx-auto space-y-4">
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
                        The true cost of the <span className="text-blue-600">invisible gap.</span>
                    </h1>
                    <p className="text-lg text-slate-600">
                        Calculate the immediate financial impact of preventing student dropouts through real-time learning intelligence.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Input Variables */}
                    <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <Calculator className="w-6 h-6 text-slate-700" />
                            <h2 className="text-xl font-bold">Institution Metrics</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-700">Institution Scale</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(Object.keys(TIERS) as Array<keyof typeof TIERS>).map((tierKey) => (
                                        <button
                                            key={tierKey}
                                            onClick={() => {
                                                setInstitutionSize(tierKey)
                                                if (tierKey === 'small') setTotalStudents(3000)
                                                if (tierKey === 'medium') setTotalStudents(10000)
                                                if (tierKey === 'large') setTotalStudents(20000)
                                            }}
                                            className={`p-2 text-sm font-medium rounded-lg border transition-all ${institutionSize === tierKey
                                                ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            {TIERS[tierKey].name.split(' ')[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-700 flex justify-between">
                                    <span>Total Students</span>
                                    <span className="text-blue-600">{totalStudents.toLocaleString()}</span>
                                </label>
                                <input
                                    type="range"
                                    min="500"
                                    max="40000"
                                    step="500"
                                    value={totalStudents}
                                    onChange={(e) => setTotalStudents(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-700 flex justify-between">
                                    <span>Annual Dropout Rate</span>
                                    <span className="text-red-600">{dropoutRate}%</span>
                                </label>
                                <input
                                    type="range"
                                    min="5"
                                    max="40"
                                    value={dropoutRate}
                                    onChange={(e) => setDropoutRate(Number(e.target.value))}
                                    className="w-full accent-red-600"
                                />
                                <p className="text-xs text-slate-500 text-right">National avg: ~18%</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-700">Avg Tuition per Student (₹)</label>
                                <input
                                    type="number"
                                    value={tuition}
                                    onChange={(e) => setTuition(Number(e.target.value))}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Output Analysis */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Current Loss Box */}
                        <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
                            <div className="flex items-center gap-3 mb-6">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                                <h3 className="text-lg font-bold text-slate-800">Current Financial Exposure</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <div className="text-sm font-medium text-slate-500 mb-1">Students Lost / Year</div>
                                    <div className="text-3xl font-bold tracking-tight text-slate-900">{studentsLost.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-500 mb-1">Annual Revenue Lost</div>
                                    <div className="text-3xl font-bold tracking-tight text-red-600">{formatINR(lostRevenue)}</div>
                                </div>
                            </div>
                        </div>

                        {/* EduPulse Value Box */}
                        <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden text-white">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 opacity-20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>

                            <div className="flex items-center gap-3 mb-8 relative z-10">
                                <ShieldCheck className="w-7 h-7 text-blue-400" />
                                <h3 className="text-xl font-bold text-white">EduPulse Impact Analysis</h3>
                                <span className="ml-auto text-xs font-semibold bg-white/10 px-3 py-1 rounded-full text-blue-200">
                                    Based on 10% conservative improvement
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-8 relative z-10 mb-8 pb-8 border-b border-white/10">
                                <div>
                                    <div className="text-sm font-medium text-slate-400 mb-1">Students Retained</div>
                                    <div className="text-3xl font-bold tracking-tight text-white">+{studentsRetained}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-400 mb-1">Revenue Protected</div>
                                    <div className="text-3xl font-bold tracking-tight text-emerald-400">{formatINR(revenueProtected)}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 relative z-10">
                                <div>
                                    <div className="text-sm font-medium text-slate-400 mb-1">License Cost</div>
                                    <div className="text-xl font-bold text-white">{TIERS[institutionSize].label}</div>
                                </div>
                                <div className="col-span-2 text-right">
                                    <div className="text-sm font-medium text-slate-400 mb-1">First Year ROI</div>
                                    <div className="text-5xl font-extrabold tracking-tighter text-blue-400">
                                        {roiPercentage}%
                                    </div>
                                    <div className="text-sm text-blue-200 mt-2">
                                        Pays for itself in {paybackMonths} months
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <Download className="w-5 h-5" />
                                Export Report
                            </button>
                            <button className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-200">
                                <Mail className="w-5 h-5" />
                                Email to Administrator
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
