'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, ArrowRight, QrCode, Globe } from 'lucide-react'

const translations = {
    en: { join: 'Join your class session.', desc: 'Enter the 4-digit PIN your educator posted on the board, or scan the QR code.', fast: 'Fastest way: Scan the QR', fastDesc: 'No app needed! Just open your phone\'s built-in camera app and point it at the board.', orEnter: 'or enter PIN', placeholder: 'ABCD', joinBtn: 'Join Session', joining: 'Joining...', anon: '100% Anonymous · No Account Required', back: 'Back to home', error: 'Please enter a valid 4-character session PIN.', lang: 'English' },
    hi: { join: 'अपनी क्लास में शामिल हों।', desc: 'अपने शिक्षक द्वारा बोर्ड पर पोस्ट किया गया 4-अंकीय PIN दर्ज करें, या QR कोड स्कैन करें।', fast: 'सबसे तेज़ तरीका: QR स्कैन करें', fastDesc: 'किसी ऐप की आवश्यकता नहीं! बस अपने फोन का कैमरा खोलें और बोर्ड की ओर करें।', orEnter: 'या PIN दर्ज करें', placeholder: 'ABCD', joinBtn: 'क्लास में शामिल हों', joining: 'शामिल हो रहे हैं...', anon: '100% अज्ञात · कोई खाता आवश्यक नहीं', back: 'होम पर वापस जाएं', error: 'कृपया एक वैध 4-अक्षरीय सत्र PIN दर्ज करें।', lang: 'हिंदी' },
    es: { join: 'Únete a tu clase.', desc: 'Ingresa el PIN de 4 dígitos que tu educador publicó en la pizarra, o escanea el código QR.', fast: 'Más rápido: Escanear el QR', fastDesc: '¡Sin aplicaciones! Abre la cámara de tu teléfono y apúntala a la pizarra.', orEnter: 'o ingresar el PIN', placeholder: 'ABCD', joinBtn: 'Unirse a la Sesión', joining: 'Uniéndose...', anon: '100% Anónimo · Sin Cuenta Requerida', back: 'Volver al inicio', error: 'Por favor, ingresa un PIN válido de 4 caracteres.', lang: 'Español' },
    fr: { join: 'Rejoignez votre classe.', desc: 'Entrez le PIN à 4 chiffres affiché au tableau, ou scannez le QR.', fast: 'Le plus rapide: Scanner le QR', fastDesc: 'Pas d\'application! Ouvrez l\'appareil photo de votre téléphone et pointez-le vers le tableau.', orEnter: 'ou entrer le PIN', placeholder: 'ABCD', joinBtn: 'Rejoindre la Session', joining: 'Connexion...', anon: '100% Anonyme · Aucun Compte Requis', back: 'Retour à l\'accueil', error: 'Veuillez entrer un PIN de session valide.', lang: 'Français' },
    zh: { join: '加入您的课堂。', desc: '输入黑板上的 4 位 PIN 码，或扫描二维码。', fast: '最快方式：扫描二维码', fastDesc: '无需下载应用！只需打开手机相机，对准黑板即可。', orEnter: '或输入 PIN', placeholder: 'ABCD', joinBtn: '加入会话', joining: '加入中...', anon: '100% 匿名 · 无需账号', back: '返回首页', error: '请输入有效的会话 PIN 码。', lang: '中文' },
    ar: { join: 'انضم إلى فصلك.', desc: 'أدخل رمز الـ PIN المكون من 4 أرقام الموجود على السبورة، أو امسح الرمز.', fast: 'أسرع طريقة: امسح الرمز', fastDesc: 'لا حاجة لتطبيق! افتح كاميرا هاتفك ووجهها نحو السبورة.', orEnter: 'أو أدخل الرمز', placeholder: 'ABCD', joinBtn: 'انضم للجلسة', joining: 'جاري الانضمام...', anon: '100% مجهول · لا حساب مطلوب', back: 'الرئيسية', error: 'يرجى إدخال رمز جلسة صحيح.', lang: 'العربية' }
}

export default function StudentEntryPage() {
    const [pin, setPin] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [lang, setLang] = useState<keyof typeof translations>('en')
    const router = useRouter()

    useEffect(() => {
        const saved = localStorage.getItem('edupulse_lang') as keyof typeof translations
        if (saved && translations[saved]) setLang(saved)
    }, [])

    const handleLangChange = (newLang: keyof typeof translations) => {
        setLang(newLang)
        localStorage.setItem('edupulse_lang', newLang)
    }

    const t = translations[lang]

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault()
        const cleaned = pin.trim().toUpperCase()
        if (cleaned.length !== 4 || !/^[A-Z0-9]{4}$/.test(cleaned)) {
            setError(t.error)
            return
        }
        setLoading(true)
        router.push(`/join/${cleaned}`)
    }

    const handlePinChange = (v: string) => {
        const chars = v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4)
        setPin(chars)
        if (error) setError('')
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--student-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden' }}>

            {/* Ambient glow */}
            <div style={{ position: 'fixed', top: '-20%', left: '10%', width: '80%', height: '60%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Header / Logo + Lang Toggle */}
            <div style={{ position: 'absolute', top: '1.75rem', left: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={11} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>EduPulse</span>
                </div>
                
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 100, padding: '0.2rem 0.6rem' }}>
                    <Globe size={14} color="var(--text-tertiary)" style={{ position: 'absolute', left: '0.6rem', pointerEvents: 'none' }} />
                    <select
                        value={lang}
                        onChange={e => handleLangChange(e.target.value as any)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, appearance: 'none', outline: 'none', paddingLeft: '1.4rem', paddingRight: '0.5rem', cursor: 'pointer' }}
                    >
                        {Object.entries(translations).map(([k, v]) => (
                            <option key={k} value={k} style={{ background: '#111', color: '#fff' }}>{v.lang}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ width: '100%', maxWidth: 360, position: 'relative', zIndex: 1 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 1.1, marginBottom: '0.875rem' }}>
                        {t.join.split(' ').slice(0, 2).join(' ')}<br />
                        {t.join.split(' ').slice(2).join(' ')}
                    </h1>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                        {t.desc}
                    </p>
                </div>

                {/* QR Scan Hint */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.125rem', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 12, marginBottom: '1.5rem' }}>
                    <div style={{ width: 40, height: 40, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <QrCode size={18} color="var(--accent-soft)" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.857rem', marginBottom: '0.15rem' }}>
                            {t.fast}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {t.fastDesc}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t.orEnter}</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                </div>

                {/* PIN Form */}
                <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            maxLength={4}
                            value={pin}
                            onChange={e => handlePinChange(e.target.value)}
                            placeholder={t.placeholder}
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                textAlign: 'center',
                                fontFamily: 'var(--font-display)',
                                fontSize: '3rem',
                                fontWeight: 700,
                                letterSpacing: '0.3em',
                                color: 'var(--text-primary)',
                                background: 'rgba(255,255,255,0.04)',
                                border: `1px solid ${error ? 'var(--danger)' : pin.length === 4 ? 'var(--border-accent)' : 'rgba(255,255,255,0.10)'}`,
                                borderRadius: 14,
                                outline: 'none',
                                transition: 'border-color 0.15s, box-shadow 0.15s',
                                caretColor: 'var(--accent)',
                            }}
                            onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.18)'; e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border-accent)' }}
                            onBlur={e => { e.currentTarget.style.boxShadow = 'none' }}
                        />
                        {/* 4-dot progress indicators */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.625rem' }}>
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i < pin.length ? 'var(--accent)' : 'rgba(255,255,255,0.12)', transition: 'background 0.15s' }} />
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--danger)', textAlign: 'center', animation: 'fadeUp 0.2s ease' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={pin.length !== 4 || loading}
                        className="btn-primary"
                        style={{ justifyContent: 'center', padding: '0.875rem', fontSize: '1rem', borderRadius: 12, opacity: pin.length !== 4 ? 0.45 : 1, width: '100%', marginTop: '0.25rem' }}
                    >
                        {loading ? t.joining : <>{t.joinBtn} <ArrowRight size={16} /></>}
                    </button>
                </form>

                {/* Trust text */}
                <div style={{ marginTop: '2.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        100% Anonymous · No Account Required
                    </span>
                </div>

                {/* Back link */}
                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                    <Link href="/" style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textDecoration: 'none', transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
