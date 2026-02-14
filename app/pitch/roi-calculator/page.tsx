'use client'

import { useState, useEffect } from 'react'
import { Calculator, DollarSign, TrendingUp, Download, Mail, ArrowRight, School, Users, Award } from 'lucide-react'
import Link from 'next/link'

export default function ROICalculator() {
    const [institutionSize, setInstitutionSize] = useState<'Small' | 'Medium' | 'Large'>('Medium')
    const [studentCount, setStudentCount] = useState(10000)
    const [dropoutRate, setDropoutRate] = useState(18)
    const [tuition, setTuition] = useState(120000)

    // Derived Metrics
    const [studentsLost, setStudentsLost] = useState(0)
    const [lostRevenue, setLostRevenue] = useState(0)
    const [studentsRetained, setStudentsRetained] = useState(0)
    const [revenueProtected, setRevenueProtected] = useState(0)
    const [eduPulseCost, setEduPulseCost] = useState(0)
    const [netBenefit, setNetBenefit] = useState(0)
    const [roi, setRoi] = useState(0)
    const [paybackPeriod, setPaybackPeriod] = useState(0)

    useEffect(() => {
        // Defaults based on size
        if (institutionSize === 'Small') {
            // setStudentCount(3000) // Keep it manual for flexibility, but could preset
            setEduPulseCost(200000) // 2 Lakh
        } else if (institutionSize === 'Medium') {
            // setStudentCount(10000)
            setEduPulseCost(800000) // 8 Lakh
        } else {
            // setStudentCount(25000)
            setEduPulseCost(1500000) // 15 Lakh
        }
    }, [institutionSize])

    useEffect(() => {
        const lost = Math.round(studentCount * (dropoutRate / 100))
        setStudentsLost(lost)

        const lostRev = lost * tuition
        setLostRevenue(lostRev)

        const retained = Math.round(lost * 0.10) // 10% improvement assumption
        setStudentsRetained(retained)

        const revProt = retained * tuition
        setRevenueProtected(revProt)

        const benefit = revProt - eduPulseCost
        setNetBenefit(benefit)

        const roiVal = eduPulseCost > 0 ? (benefit / eduPulseCost) * 100 : 0
        setRoi(Math.round(roiVal))

        const payback = benefit > 0 ? (eduPulseCost / (revProt / 12)) : 0
        setPaybackPeriod(Number(payback.toFixed(1)))

    }, [studentCount, dropoutRate, tuition, eduPulseCost])

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[150px] animate-pulse-glow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <Calculator className="w-3 h-3" /> ROI Projector
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        The Cost of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Invisible Confusion</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Calculate how much student attrition is costing your institution and the financial impact of deploying EduPulse learning intelligence.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* INPUTS PANEL */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-6 rounded-2xl">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <School className="w-4 h-4" /> Institution Parameters
                            </h3>

                            <div className="space-y-6">
                                {/* Institution Size */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-3">Institution Scale</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['Small', 'Medium', 'Large'] as const).map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setInstitutionSize(size)}
                                                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${institutionSize === size
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400'
                                                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Student Count */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Total Students</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="number"
                                            value={studentCount}
                                            onChange={(e) => setStudentCount(Number(e.target.value))}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Dropout Rate */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-medium text-slate-300">Annual Dropout Rate</label>
                                        <span className="text-sm font-bold text-blue-400">{dropoutRate}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="5"
                                        max="40"
                                        value={dropoutRate}
                                        onChange={(e) => setDropoutRate(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                        <span>5% (Elite)</span>
                                        <span>40% (At Risk)</span>
                                    </div>
                                </div>

                                {/* Tuition */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Avg. Annual Tuition (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-sans">₹</span>
                                        <input
                                            type="number"
                                            value={tuition}
                                            onChange={(e) => setTuition(Number(e.target.value))}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-8 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Projected Cost</h3>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-2xl font-bold text-white">{formatCurrency(eduPulseCost)}</div>
                                    <div className="text-xs text-slate-500 mt-1">Based on {institutionSize} tier pricing</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Year 1 License</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RESULTS PANEL */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Current State Card */}
                        <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 rotate-180" /> Current Annual Loss
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="text-slate-500 text-sm mb-1 uppercase font-semibold tracking-wider">Students Lost</div>
                                    <div className="text-4xl font-light text-white">{studentsLost.toLocaleString()} <span className="text-lg text-slate-600">/ yr</span></div>
                                    <p className="text-xs text-slate-500 mt-2">Based on {dropoutRate}% attrition rate</p>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-sm mb-1 uppercase font-semibold tracking-wider">Revenue Impact</div>
                                    <div className="text-4xl font-bold text-red-500 text-glow-red">{formatCurrency(lostRevenue)}</div>
                                    <p className="text-xs text-red-400/60 mt-2">Direct tuition loss only</p>
                                </div>
                            </div>
                        </div>

                        {/* EduPulse Impact Card */}
                        <div className="glass-card p-1 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-900/20">
                            <div className="bg-slate-950/90 rounded-[22px] p-8 h-full backdrop-blur-xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none"></div>

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10">
                                    <h3 className="text-sm font-bold text-blue-300 uppercase tracking-widest flex items-center gap-2">
                                        <Award className="w-4 h-4" /> EduPulse Advantage (10% Retention Lift)
                                    </h3>
                                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mt-2 md:mt-0">
                                        Conservative Estimate
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 border-b border-white/5 pb-8 mb-8">
                                    <div>
                                        <div className="text-slate-400 text-xs mb-1 uppercase font-semibold">Students Retained</div>
                                        <div className="text-3xl font-bold text-white">{studentsRetained}</div>
                                        <div className="text-emerald-400 text-xs mt-1 flex items-center gap-1">
                                            <Users className="w-3 h-3" /> Saved from attrition
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-400 text-xs mb-1 uppercase font-semibold">Revenue Protected</div>
                                        <div className="text-3xl font-bold text-emerald-400">{formatCurrency(revenueProtected)}</div>
                                        <div className="text-slate-500 text-xs mt-1">Recovered tuition</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-400 text-xs mb-1 uppercase font-semibold">Net Benefit</div>
                                        <div className="text-3xl font-bold text-blue-400 text-glow">{formatCurrency(netBenefit)}</div>
                                        <div className="text-slate-500 text-xs mt-1">After platform cost</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 relative z-10">
                                    <div>
                                        <div className="text-sm text-slate-400 font-medium mb-1">Return on Investment</div>
                                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 tracking-tight">
                                            {roi.toLocaleString()}%
                                        </div>
                                        <div className="text-xs text-blue-500/60 mt-1">In Year 1</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 font-medium mb-1">Payback Period</div>
                                        <div className="text-5xl font-black text-white tracking-tight">
                                            {paybackPeriod} <span className="text-lg font-normal text-slate-500">months</span>
                                        </div>
                                        <div className="text-xs text-slate-600 mt-1">Immediate value realization</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-all border border-slate-700 hover:border-slate-600 group">
                                <Download className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                Export PDF Report
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:translate-y-0.5 hover:-translate-y-0.5">
                                <Mail className="w-5 h-5" />
                                Email to Stakeholders
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center border-t border-slate-800/50 pt-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium">
                        Back to Home <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
