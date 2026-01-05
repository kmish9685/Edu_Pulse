import { ArrowLeft, BookOpen, Globe, Heart } from "lucide-react";
import Link from "next/link";

export default function ImpactPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <header className="p-6 border-b border-slate-100">
                <div className="container mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>
            </header>

            <main className="py-20">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h1 className="text-4xl font-bold mb-8 text-slate-800">
                        Aligned with SDG-4
                    </h1>

                    <div className="prose prose-slate prose-lg">
                        <p className="lead text-xl text-slate-600 mb-12">
                            EduPulse is built to address <strong>Sustainable Development Goal 4: Quality Education</strong>, specifically focusing on equity, inclusion, and effective learning environments.
                        </p>

                        <div className="grid gap-8 mb-16">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 shrink-0 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Inclusion & Equity</h3>
                                    <p className="text-slate-600">
                                        Traditional classrooms favor extroverted students and native speakers. EduPulse levels the playing field by giving a voice to shy, anxious, or non-native speaking students through anonymous signaling.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 shrink-0 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Reducing Dropout Rates</h3>
                                    <p className="text-slate-600">
                                        Confusion accumulation is the #1 predictor of course dropouts. By catching confusion early, educators can intervene before students disengage completely.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 shrink-0 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Data-Driven Pedagogy</h3>
                                    <p className="text-slate-600">
                                        Moving away from intuition-based teaching to evidence-based adjustments. EduPulse provides the granular data needed to improve curriculum design.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
                            <h2 className="text-2xl font-bold mb-4">Why this matters for EDVentures 2026</h2>
                            <p className="text-slate-600 mb-0">
                                We aren't building just another LMS. We are building a "hearing aid" for education—amplifying the silent signals that usually go unnoticed until exam day failure.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
