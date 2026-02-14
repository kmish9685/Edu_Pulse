'use client'

import { useState } from 'react'
import { Plus, Trash2, TrendingUp, GraduationCap, ArrowRight, Download } from 'lucide-react'
import Link from 'next/link'

// Types
type OutcomeEntry = {
    id: number
    course: string
    assessment: string
    controlScore: number
    eduPulseScore: number
    date: string
}

// Seed Data for Pitch
const INITIAL_DATA: OutcomeEntry[] = [
    { id: 1, course: 'Database Systems', assessment: 'Quiz 1', controlScore: 68.0, eduPulseScore: 74.2, date: '2026-02-10' },
    { id: 2, course: 'Data Structures', assessment: 'Midterm', controlScore: 71.5, eduPulseScore: 78.9, date: '2026-02-12' },
    { id: 3, course: 'Linear Algebra', assessment: 'Test 2', controlScore: 62.4, eduPulseScore: 70.1, date: '2026-02-14' },
]

export default function OutcomesPage() {
    const [entries, setEntries] = useState<OutcomeEntry[]>(INITIAL_DATA)
    const [isAdding, setIsAdding] = useState(false)

    // Form State
    const [newItem, setNewItem] = useState<Partial<OutcomeEntry>>({
        course: 'Intro to AI',
        assessment: 'Final Exam',
        controlScore: 70,
        eduPulseScore: 80,
        date: new Date().toISOString().split('T')[0]
    })

    const handleAdd = () => {
        if (!newItem.course || !newItem.assessment) return

        const entry: OutcomeEntry = {
            id: Date.now(),
            course: newItem.course,
            assessment: newItem.assessment,
            controlScore: Number(newItem.controlScore),
            eduPulseScore: Number(newItem.eduPulseScore),
            date: newItem.date!
        }

        setEntries([entry, ...entries])
        setIsAdding(false)
    }

    const handleDelete = (id: number) => {
        setEntries(entries.filter(e => e.id !== id))
    }

    const averageImprovement = entries.length > 0
        ? (entries.reduce((acc, curr) => acc + (curr.eduPulseScore - curr.controlScore), 0) / entries.length).toFixed(1)
        : '0.0'

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/admin" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                            <span className="sr-only">Back</span>
                            ←
                        </Link>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-indigo-600" />
                            Learning Outcomes Tracker
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Impact Statement */}
                <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200 mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Proven Social Impact</h2>
                        <p className="text-indigo-100 max-w-xl text-lg">
                            Comparing standardized assessment scores between EduPulse-enabled classes and control groups.
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center min-w-[200px]">
                        <div className="text-sm font-bold text-indigo-200 uppercase tracking-widest mb-1">Avg. Improvement</div>
                        <div className="text-5xl font-black">+{averageImprovement}%</div>
                        <div className="text-xs text-indigo-200 mt-2">p &lt; 0.05 (Significant)</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Visual Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-lg text-slate-800">Performance Comparison</h3>
                            <button
                                onClick={() => setIsAdding(!isAdding)}
                                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add Data Point
                            </button>
                        </div>

                        {/* Add Form */}
                        {isAdding && (
                            <div className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input placeholder="Course Name" className="p-2 rounded border" value={newItem.course} onChange={e => setNewItem({ ...newItem, course: e.target.value })} />
                                <input placeholder="Assessment (e.g. Quiz 1)" className="p-2 rounded border" value={newItem.assessment} onChange={e => setNewItem({ ...newItem, assessment: e.target.value })} />
                                <input type="number" placeholder="Control Score %" className="p-2 rounded border" value={newItem.controlScore} onChange={e => setNewItem({ ...newItem, controlScore: Number(e.target.value) })} />
                                <input type="number" placeholder="EduPulse Score %" className="p-2 rounded border" value={newItem.eduPulseScore} onChange={e => setNewItem({ ...newItem, eduPulseScore: Number(e.target.value) })} />
                                <button onClick={handleAdd} className="col-span-2 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700">Save Entry</button>
                            </div>
                        )}

                        {/* Comparison Bars */}
                        <div className="space-y-6">
                            {entries.map((entry) => (
                                <div key={entry.id} className="relative">
                                    <div className="flex justify-between text-sm font-medium mb-1">
                                        <span className="text-slate-900">{entry.course} - <span className="text-slate-500">{entry.assessment}</span></span>
                                        <span className="text-emerald-600 font-bold">+{(entry.eduPulseScore - entry.controlScore).toFixed(1)}%</span>
                                    </div>
                                    <div className="h-8 flex rounded-full overflow-hidden bg-slate-100">
                                        {/* Control Bar (Gray) */}
                                        <div className="bg-slate-300 h-full flex items-center justify-end px-2 text-[10px] font-bold text-slate-600" style={{ width: `${entry.controlScore}%` }}>
                                            {entry.controlScore}%
                                        </div>
                                        {/* Improvement Bar (Green) */}
                                        <div className="bg-emerald-500 h-full flex items-center justify-end px-2 text-[10px] font-bold text-white relative" style={{ width: `${entry.eduPulseScore - entry.controlScore}%` }}>
                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Data Table Side Panel */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-0 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-700">Raw Data</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {entries.map((entry) => (
                                <div key={entry.id} className="p-4 hover:bg-slate-50 group flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-sm text-slate-900">{entry.assessment}</div>
                                        <div className="text-xs text-slate-500">{entry.date}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-indigo-600">{entry.eduPulseScore}%</div>
                                            <div className="text-xs text-slate-400">vs {entry.controlScore}%</div>
                                        </div>
                                        <button onClick={() => handleDelete(entry.id)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50">
                            <button className="w-full flex items-center justify-center gap-2 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-white transition-colors">
                                <Download className="w-4 h-4" /> Export CSV
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
