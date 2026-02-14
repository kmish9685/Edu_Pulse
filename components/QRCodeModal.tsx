'use client'

import { useEffect, useState } from 'react'
import { QrCode, X, Copy, Check } from 'lucide-react'
// We'll use a simple lightweight library or an API based approach if library installation is restricted. 
// For this environment, using a public QR API is safest and easiest, or a simple SVG generator.
// Let's use `react-qr-code` if available, or just an image API. 
// Plan: Use `https://api.qrserver.com/v1/create-qr-code/` for simplicity and reliability without npm install.

export default function QRCodeModal({ url, onClose }: { url: string, onClose: () => void }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <QrCode className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Join Session</h3>
                    <p className="text-sm text-slate-500">Scan to enter Student View</p>
                </div>

                <div className="bg-white p-4 rounded-xl border-2 border-slate-100 mb-6 flex justify-center">
                    {/* Using reliable public API for QR generation */}
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`}
                        alt="QR Code"
                        className="w-48 h-48 mix-blend-multiply"
                    />
                </div>

                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <input
                        type="text"
                        value={url}
                        readOnly
                        className="bg-transparent text-sm text-slate-600 w-full outline-none"
                    />
                    <button
                        onClick={handleCopy}
                        className="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center gap-1"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
            </div>
        </div>
    )
}
