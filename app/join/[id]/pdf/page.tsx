'use client'

import { useEffect, useState, use } from 'react'
import { getSessionRemediation } from '@/app/actions/signals'
import { Sparkles, Loader2, BookOpen, Lightbulb, HelpCircle, FileText, Brain } from 'lucide-react'

function parseRemediationSections(text: string) {
    const sections: Record<string, string> = {}
    const markers = [
        { key: 'summary',   emoji: '📚' },
        { key: 'confused',  emoji: '🔴' },
        { key: 'review',    emoji: '📖' },
        { key: 'analogies', emoji: '💡' },
        { key: 'resources', emoji: '🎥' },
        { key: 'questions', emoji: '❓' },
        { key: 'recall',    emoji: '🧠' },
    ]
    let remaining = text
    for (let i = 0; i < markers.length; i++) {
        const start = remaining.indexOf(markers[i].emoji)
        if (start === -1) continue
        const nextEmoji = markers.slice(i + 1).map(m => remaining.indexOf(m.emoji, start + 1)).find(idx => idx > start)
        const end = nextEmoji !== undefined && nextEmoji > -1 ? nextEmoji : remaining.length
        sections[markers[i].key] = remaining.slice(start, end).trim()
    }
    return sections
}

export default function StudyPackPDF({ params }: { params: Promise<{ id: string }> }) {
    const { id: sessionId } = use(params)
    const [remediation, setRemediation] = useState<string | null>(null)
    const [topic, setTopic] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchMaterial() {
            setLoading(true)
            const res = await getSessionRemediation(sessionId)
            if (res.success && res.data?.remediation_material) {
                setRemediation(res.data.remediation_material)
                setTopic(res.data.current_topic)
            }
            setLoading(false)
            
            // Auto open print dialog when content is ready
            if (res.success && res.data?.remediation_material) {
                setTimeout(() => {
                    window.print()
                }, 800)
            }
        }
        fetchMaterial()
    }, [sessionId])

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#666', fontFamily: 'system-ui, sans-serif' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ marginLeft: 12, letterSpacing: '0.05em' }}>Preparing Document...</span>
            </div>
        )
    }

    if (!remediation) {
        return (
            <div style={{ padding: '3rem', fontFamily: 'system-ui, sans-serif', color: '#111' }}>
                <h2>Document Not Available</h2>
                <p>The study pack for this session has not been published yet.</p>
            </div>
        )
    }

    const sections = parseRemediationSections(remediation)

    // A4 Portrait Print Styles
    return (
        <>
            <style jsx global>{`
                @media print {
                    @page { size: A4 portrait; margin: 15mm 20mm; }
                    body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    .page-break { page-break-before: always; }
                    .avoid-break { page-break-inside: avoid; }
                }
                body { background: #f3f4f6; margin: 0; padding: 2rem 0; font-family: 'Inter', system-ui, sans-serif; }
                .document-container {
                    background: white;
                    max-width: 210mm; /* A4 width */
                    min-height: 297mm; /* A4 height */
                    margin: 0 auto;
                    padding: 40px 50px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    color: #111827;
                    line-height: 1.6;
                }
                .brand-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .brand-title {
                    font-size: 24px;
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    color: #111827;
                    margin: 0 0 5px 0;
                }
                .doc-type {
                    font-size: 14px;
                    font-weight: 700;
                    color: #4F46E5; /* Indigo 600 */
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .meta-badge {
                    background: #f3f4f6;
                    border: 1px solid #e5e7eb;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 12px;
                    color: #4b5563;
                }
                
                .section-box {
                    margin-bottom: 25px;
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid #e5e7eb;
                }
                .box-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 12px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 12px;
                }
                .box-content {
                    font-size: 14px;
                    color: #374151; /* Gray 700 */
                    white-space: pre-wrap;
                }
                
                h3 { margin-top: 0; font-size: 16px; color: #111827; }
            `}</style>
            
            <div className="no-print" style={{ textAlign: 'center', marginBottom: 20 }}>
                <button 
                    onClick={() => window.print()}
                    style={{ background: '#4F46E5', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(79,70,229,0.2)' }}
                >
                    Print or Save as PDF
                </button>
            </div>

            <div className="document-container">
                {/* Header */}
                <header className="brand-header">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <div style={{ background: '#4F46E5', borderRadius: 4, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sparkles size={12} color="white" />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em' }}>EduPulse</span>
                        </div>
                        <h1 className="brand-title">{topic || 'Session Study Pack'}</h1>
                        <div className="doc-type">Official Revision Guide</div>
                    </div>
                    <div className="meta-badge">
                        <div>SESSION_ID: {sessionId}</div>
                        <div>GENERATED: {new Date().toLocaleDateString()}</div>
                    </div>
                </header>

                {/* Summary */}
                {sections.summary && (
                    <div className="section-box avoid-break" style={{ background: '#F9FAFB' }}>
                        <div className="box-content" style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>
                            {sections.summary}
                        </div>
                    </div>
                )}

                {/* Most Confused */}
                {sections.confused && (
                    <div className="section-box avoid-break" style={{ borderColor: '#FCA5A5', background: '#FEF2F2' }}>
                        <div className="box-title" style={{ color: '#DC2626' }}>
                            <span>🔴</span> Classroom Friction Points
                        </div>
                        <div className="box-content" style={{ color: '#991B1B' }}>
                            {sections.confused.replace('🔴 Most confused topics:', '').trim()}
                        </div>
                    </div>
                )}

                {/* Key Points */}
                {sections.review && (
                    <div className="section-box avoid-break" style={{ borderColor: '#A5B4FC', background: '#EEF2FF' }}>
                        <div className="box-title" style={{ color: '#4F46E5' }}>
                            <BookOpen size={16} /> Key Concepts Explained
                        </div>
                        <div className="box-content" style={{ color: '#3730A3' }}>
                            {sections.review.replace('📖 Key points to review:', '').trim()}
                        </div>
                    </div>
                )}

                {/* Concept Analogies */}
                {sections.analogies && (
                    <div className="section-box avoid-break" style={{ borderColor: '#FCD34D', background: '#FFFBEB' }}>
                        <div className="box-title" style={{ color: '#D97706' }}>
                            <Lightbulb size={16} /> Real-World Analogies 
                        </div>
                        <div className="box-content" style={{ color: '#92400E' }}>
                            {sections.analogies.replace('💡 Concept Analogies (Real-World Examples):', '').trim()}
                        </div>
                    </div>
                )}

                {/* Practice Questions */}
                {sections.questions && (
                    <div className="section-box avoid-break" style={{ borderColor: '#C4B5FD', background: '#F5F3FF' }}>
                        <div className="box-title" style={{ color: '#6D28D9' }}>
                            <HelpCircle size={16} /> Self-Assessment
                        </div>
                        <div className="box-content" style={{ color: '#5B21B6' }}>
                            {sections.questions.replace('❓ Practice questions:', '').trim()}
                        </div>
                    </div>
                )}

                {/* Resources */}
                {sections.resources && (
                    <div className="section-box avoid-break" style={{ borderColor: '#A7F3D0', background: '#ECFDF5' }}>
                        <div className="box-title" style={{ color: '#059669' }}>
                            <FileText size={16} /> Further Reading
                        </div>
                        <div className="box-content" style={{ color: '#065F46' }}>
                            {sections.resources.replace('🎥 Helpful resources:', '').trim()}
                        </div>
                    </div>
                )}
                
                {/* Active Recall */}
                {sections.recall && (
                    <div className="section-box avoid-break" style={{ border: '2px solid #10B981' }}>
                         <div className="box-title" style={{ color: '#10B981' }}>
                            <Brain size={16} /> Final Challenge
                        </div>
                        <div className="box-content" style={{ fontWeight: 600 }}>
                            {sections.recall.replace('🧠 Try to explain it:', '').trim()}
                        </div>
                    </div>
                )}

                {/* Unparsed Fallback */}
                {!sections.summary && remediation && (
                    <div className="section-box" style={{ background: '#F9FAFB' }}>
                        <div className="box-content">{remediation}</div>
                    </div>
                )}

                {/* Brand Footer */}
                <footer style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace' }}>
                    GENERATED BY EDUPULSE AI · PEDAGOGICAL INTELLIGENCE LABS 2026<br/>
                    100% ANONYMOUS STUDENT FEEDBACK SYSTEM
                </footer>
            </div>
        </>
    )
}
