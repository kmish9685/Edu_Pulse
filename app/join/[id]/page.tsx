'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { submitSignal, validateSession } from '@/app/actions/signals'
import { CheckCircle, Clock, Loader2, Zap, WifiOff, Radio, Globe } from 'lucide-react'

const translations = {
    en: {
        joining: 'Joining session…',
        noSession: 'No active session',
        noSessionDesc: "Session PIN {pin} doesn't have an active class right now. Your teacher may not have started yet.",
        checkAgain: 'Check Again',
        checking: 'Checking...',
        tryDiff: 'Try a Different PIN',
        received: 'Signal received! ✓',
        notified: 'Your teacher has been notified anonymously. You can signal again after the cooldown.',
        signalAgain: 'Signal again in {s}s',
        session: 'Session',
        live: 'Live',
        classInSession: 'Class in session',
        howKeepingUp: 'How are you keeping up?',
        howKeepingUpBr: '',
        feedbackDesc: "Tap a button below. Your feedback is 100% anonymous — your teacher won't know it's you.",
        optional: 'Optional: What specifically is confusing?',
        selectReason: 'Select a reason...',
        opt1: 'I missed the last explanation',
        opt2: "I don't understand the core concept",
        opt3: 'The math/formula is confusing',
        opt4: 'The slide changed too fast',
        opt5: 'I need an example to understand',
        opt6: 'Other / Not listed',
        sigConfused: "I'm Confused",
        sigFast: 'Too Fast',
        sending: 'Sending...',
        waitCooldown: 'Wait {s}s before signaling again',
        anonFooter: '🔒 No account needed · Fully anonymous · No data linked to you',
        lang: 'English'
    },
    hi: {
        joining: 'सत्र में शामिल हो रहे हैं…',
        noSession: 'कोई सक्रिय सत्र नहीं',
        noSessionDesc: 'सत्र PIN {pin} में अभी कोई क्लास नहीं है। हो सकता है शिक्षक ने अभी शुरू न किया हो।',
        checkAgain: 'फिर से जांचें',
        checking: 'जांच की जा रही है...',
        tryDiff: 'दूसरा PIN आज़माएं',
        received: 'सिग्नल प्राप्त हुआ! ✓',
        notified: 'आपके शिक्षक को गुमनाम रूप से सूचित कर दिया गया है। आप प्रतीक्षा के बाद फिर से सिग्नल दे सकते हैं।',
        signalAgain: '{s}s में फिर सिग्नल दें',
        session: 'सत्र',
        live: 'लाइव',
        classInSession: 'क्लास चल रही है',
        howKeepingUp: 'आपको कैसा समझ आ रहा है?',
        howKeepingUpBr: '',
        feedbackDesc: 'नीचे बटन टैप करें। फ़ीडबैक 100% गुमनाम है — शिक्षक को नहीं पता चलेगा कि यह आप हैं।',
        optional: 'वैकल्पिक: विशेष रूप से क्या भ्रमित करने वाला है?',
        selectReason: 'एक कारण चुनें...',
        opt1: 'मैं पिछला स्पष्टीकरण चूक गया',
        opt2: 'मुझे मुख्य अवधारणा समझ नहीं आ रही है',
        opt3: 'गणित/सूत्र भ्रमित करने वाला है',
        opt4: 'स्लाइड बहुत तेज़ी से बदल गई',
        opt5: 'समझने के लिए मुझे एक उदाहरण चाहिए',
        opt6: 'अन्य / सूची में नहीं',
        sigConfused: 'मैं भ्रमित हूँ',
        sigFast: 'बहुत तेज़',
        sending: 'भेजा जा रहा है...',
        waitCooldown: 'फिर से सिग्नल देने से पहले {s}s प्रतीक्षा करें',
        anonFooter: '🔒 कोई खाता आवश्यक नहीं · पूरी तरह गुमनाम · आपसे कोई डेटा लिंक नहीं',
        lang: 'हिंदी'
    },
    es: {
        joining: 'Uniéndose a la sesión…',
        noSession: 'Sin sesión activa',
        noSessionDesc: 'El PIN {pin} no tiene una clase activa. Es posible que tu profesor aún no haya comenzado.',
        checkAgain: 'Comprobar de nuevo',
        checking: 'Comprobando...',
        tryDiff: 'Probar un PIN Diferente',
        received: '¡Señal recibida! ✓',
        notified: 'Tu profesor ha sido notificado anónimamente. Puedes volver a enviar después de la pausa.',
        signalAgain: 'Enviar en {s}s',
        session: 'Sesión',
        live: 'En vivo',
        classInSession: 'Clase en curso',
        howKeepingUp: '¿Cómo vas',
        howKeepingUpBr: 'entendiendo?',
        feedbackDesc: 'Toca un botón. Tu feedback es 100% anónimo — tu profesor no sabrá que fuiste tú.',
        optional: 'Opcional: ¿Qué es exactamente lo que te confunde?',
        selectReason: 'Selecciona una razón...',
        opt1: 'Me perdí la última explicación',
        opt2: 'No entiendo el concepto principal',
        opt3: 'La fórmula me confunde',
        opt4: 'Lá diapositiva cambió muy rápido',
        opt5: 'Necesito un ejemplo para entender',
        opt6: 'Otro / No en la lista',
        sigConfused: 'Estoy confundido',
        sigFast: 'Muy rápido',
        sending: 'Enviando...',
        waitCooldown: 'Espera {s}s antes de enviar otra vez',
        anonFooter: '🔒 Sin cuenta · Totalmente anónimo · Sin datos enlazados a ti',
        lang: 'Español'
    },
    fr: {
        joining: 'Connexion à la session…',
        noSession: 'Aucune session active',
        noSessionDesc: "Le code PIN {pin} n'a pas de cours actif. Votre professeur n'a peut-être pas encore commencé.",
        checkAgain: 'Vérifier de nouveau',
        checking: 'Vérification...',
        tryDiff: 'Essayer un autre PIN',
        received: 'Signal reçu ! ✓',
        notified: 'Votre professeur a été notifié anonymement. Vous pourrez renvoyer un signal bientôt.',
        signalAgain: 'Relancer dans {s}s',
        session: 'Session',
        live: 'En direct',
        classInSession: 'Cours en session',
        howKeepingUp: 'Comment',
        howKeepingUpBr: 'suivez-vous ?',
        feedbackDesc: "Appuyez sur un bouton. Vos retours sont 100% anonymes — le professeur ne saura pas que c'est vous.",
        optional: 'Optionnel : Qu\'est-ce qui est confus ?',
        selectReason: 'Sélectionnez une raison...',
        opt1: 'J\'ai raté la dernière explication',
        opt2: 'Je ne comprends pas le concept principal',
        opt3: 'La formule est confuse',
        opt4: 'La diapositive a changé trop vite',
        opt5: 'J\'ai besoin d\'un exemple pour comprendre',
        opt6: 'Autre / Non listé',
        sigConfused: 'Je suis perdu(e)',
        sigFast: 'Trop rapide',
        sending: 'Envoi...',
        waitCooldown: 'Attendez {s}s avant de renvoyer',
        anonFooter: '🔒 Pas de compte requis · Totalement anonyme',
        lang: 'Français'
    },
    zh: {
        joining: '正在加入会话…',
        noSession: '没有活跃的会话',
        noSessionDesc: 'PIN 码 {pin} 目前没有活跃的课程。老师可能还没有开始。',
        checkAgain: '再次检查',
        checking: '检查中...',
        tryDiff: '尝试不同的 PIN',
        received: '已收到信号！✓',
        notified: '您的老师已收到匿名通知。冷却时间后您可以再次发送信号。',
        signalAgain: '{s}秒后再次发送',
        session: '会话',
        live: '实时',
        classInSession: '上课中',
        howKeepingUp: '您跟得上吗？',
        howKeepingUpBr: '',
        feedbackDesc: '点击下方按钮。您的反馈是100%匿名的 — 老师不会知道是您。',
        optional: '可选：具体哪里难懂？',
        selectReason: '选择一个原因...',
        opt1: '我错过了最后的解释',
        opt2: '我不明白核心概念',
        opt3: '公式部分让人困惑',
        opt4: 'PPT切换太快了',
        opt5: '我需要一个例子来理解',
        opt6: '其他 / 未列出',
        sigConfused: '我没听懂',
        sigFast: '太快了',
        sending: '发送中...',
        waitCooldown: '请等待 {s} 秒再次发送',
        anonFooter: '🔒 无需账号 · 完全匿名 · 无个人数据追踪',
        lang: '中文'
    },
    ar: {
        joining: 'جاري الانضمام...',
        noSession: 'لا توجد جلسة نشطة',
        noSessionDesc: 'رمز الجلسة {pin} ليس به فصل نشط الآن. ربما لم يبدأ المعلم بعد.',
        checkAgain: 'تحقق مرة أخرى',
        checking: 'تحقق...',
        tryDiff: 'جرب رمز مختلف',
        received: 'تم تلقي الإشارة! ✓',
        notified: 'تم إخطار معلمك بشكل مجهول. يمكنك إرسال إشارة مرة أخرى قريباً.',
        signalAgain: 'أرسل إشارة في {s}ث',
        session: 'جلسة',
        live: 'مباشر',
        classInSession: 'الفصل قيد الانعقاد',
        howKeepingUp: 'كيف تتابع الشرح؟',
        howKeepingUpBr: '',
        feedbackDesc: 'اضغط زراً. ملاحظاتك مجهولة 100٪ - لن يعرف المعلم أنك أنت.',
        optional: 'اختياري: ما الذي يربكك تحديدًا؟',
        selectReason: 'اختر سببًا...',
        opt1: 'فاتني الشرح الأخير',
        opt2: 'لا أفهم المفهوم الأساسي',
        opt3: 'المعادلة مربكة',
        opt4: 'تغيرت الشريحة بسرعة كبيرة',
        opt5: 'أحتاج إلى مثال للفهم',
        opt6: 'غير ذلك / غير مدرج',
        sigConfused: 'أنا مرتبك',
        sigFast: 'سريع جداً',
        sending: 'جاري الإرسال...',
        waitCooldown: 'انتظر {s}ث قبل الإرسال',
        anonFooter: '🔒 لا حساب · مجهول تمامًا · لا بيانات مرتبطة بك',
        lang: 'العربية'
    }
}

export default function StudentJoin() {
    const params = useParams()
    const router = useRouter()
    const sessionId = params.id as string

    // Generate or retrieve a persistent anonymous device ID
    // This never contains any personal info — just a random string
    const getOrCreateDeviceId = (): string => {
        const key = 'edupulse_device_id'
        let id = localStorage.getItem(key)
        if (!id) {
            id = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36)
            localStorage.setItem(key, id)
        }
        return id
    }

    const [sessionValid, setSessionValid] = useState<boolean | null>(null) // null = checking
    const [roomId, setRoomId] = useState<string | null>(null)
    const [signaled, setSignaled] = useState(false)
    const [optionalText, setOptionalText] = useState('')
    const [cooldown, setCooldown] = useState(false)
    const [cooldownSecs, setCooldownSecs] = useState(0)
    const [submitting, setSubmitting] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [lang, setLang] = useState<keyof typeof translations>('en')
    const [sessionAgenda, setSessionAgenda] = useState<string[]>([])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [offNetwork, setOffNetwork] = useState(false)
    
    useEffect(() => {
        const saved = localStorage.getItem('edupulse_lang') as keyof typeof translations
        if (saved && translations[saved]) setLang(saved)
    }, [])

    const handleLangChange = (newLang: keyof typeof translations) => {
        setLang(newLang)
        localStorage.setItem('edupulse_lang', newLang)
    }

    const t = translations[lang]

    const SIGNAL_TYPES = [
        { id: 'confused', label: t.sigConfused, realType: "I'm Confused", emoji: '🤔', color: '#EF4444', glow: 'rgba(239,68,68,0.35)', gradientFrom: 'rgba(239,68,68,0.12)', gradientTo: 'rgba(239,68,68,0.04)' },
        { id: 'too_fast', label: t.sigFast, realType: 'Too Fast', emoji: '⚡', color: '#F59E0B', glow: 'rgba(245,158,11,0.35)', gradientFrom: 'rgba(245,158,11,0.12)', gradientTo: 'rgba(245,158,11,0.04)' },
    ]

    // Validate session on load + check cooldown
    useEffect(() => {
        if (!sessionId || sessionId.length !== 4) {
            router.push('/student')
            return
        }

        // Check session validity
        validateSession(sessionId).then(res => {
            setSessionValid(res.active)
            if (res.active && res.roomId) {
                setRoomId(res.roomId)
            }
            if (res.agenda && res.agenda.length > 0) {
                setSessionAgenda(res.agenda)
            }
        })

        // Check cooldown
        const lastSignal = localStorage.getItem(`edupulse_cooldown_${sessionId}`)
        if (lastSignal) {
            const diff = Date.now() - parseInt(lastSignal)
            if (diff < 60000) {
                const remaining = Math.ceil((60000 - diff) / 1000)
                setCooldown(true)
                setCooldownSecs(remaining)
                const countdown = setInterval(() => {
                    setCooldownSecs(s => {
                        if (s <= 1) { clearInterval(countdown); setCooldown(false); return 0 }
                        return s - 1
                    })
                }, 1000)
                return () => clearInterval(countdown)
            }
        }
    }, [sessionId, router])

    const handleSignal = async (type: string, realType: string) => {
        if (cooldown || submitting) return
        setSubmitting(type)
        setError(null)
        setDropdownOpen(false)
        const deviceId = getOrCreateDeviceId()
        const res = await submitSignal({ type: realType, block_room: roomId || sessionId, additional_text: optionalText, device_id: deviceId })
        if (res.success) {
            setSignaled(true)
            setCooldown(true)
            setCooldownSecs(60)
            setOptionalText('')
            // Check if student is off the campus network
            setOffNetwork(!!(res as any).offNetwork)
            localStorage.setItem(`edupulse_cooldown_${sessionId}`, Date.now().toString())
            const countdown = setInterval(() => {
                setCooldownSecs(s => {
                    if (s <= 1) { clearInterval(countdown); setCooldown(false); return 0 }
                    return s - 1
                })
            }, 1000)
        } else {
            setError(res.error || 'Failed to send signal')
        }
        setSubmitting(null)
    }

    // Shared page shell styles
    const pageShell: React.CSSProperties = {
        minHeight: '100vh',
        background: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: 'var(--font-body)',
    }

    // ── Loading state ──────────────────────────────────────────────
    if (sessionValid === null) {
        return (
            <div style={pageShell}>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-dot 2s infinite', boxShadow: '0 0 32px rgba(99,102,241,0.4)' }}>
                        <Zap size={24} color="#fff" fill="#fff" />
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em' }}>{t.joining}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-tertiary)', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', padding: '0.2rem 0.75rem', borderRadius: 100 }}>PIN: {sessionId}</div>
                </div>
            </div>
        )
    }

    // ── No active session ──────────────────────────────────────────
    if (!sessionValid) {
        return (
            <div style={pageShell}>
                <div style={{ textAlign: 'center', width: '100%', maxWidth: 380 }}>
                    <div style={{ width: 72, height: 72, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 32px rgba(239,68,68,0.1)' }}>
                        <WifiOff size={30} color="#EF4444" />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 5vw, 1.75rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                        {t.noSession}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '2rem', padding: '0 0.5rem' }}>
                        {t.noSessionDesc.replace('{pin}', sessionId)}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                        <button onClick={async (e) => {
                            const btn = e.currentTarget;
                            btn.textContent = t.checking;
                            btn.style.opacity = '0.7';
                            const r = await validateSession(sessionId);
                            setSessionValid(r.active);
                            if (r.active && r.roomId) setRoomId(r.roomId);
                            setTimeout(() => {
                                if (btn) { btn.innerHTML = `<span><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>${t.checkAgain}</span>`; btn.style.opacity = '1'; }
                            }, 500);
                        }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 14, color: 'var(--accent-soft)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s', width: '100%' }}>
                            <Radio size={15} /> {t.checkAgain}
                        </button>
                        <button onClick={() => router.push('/student')}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.875rem 1.5rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 14, color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
                            {t.tryDiff}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ── Signal Sent ────────────────────────────────────────────────
    if (signaled && cooldown) {
        return (
            <div style={pageShell}>
                <div style={{ textAlign: 'center', width: '100%', maxWidth: 380 }}>
                    <div style={{ width: 80, height: 80, background: offNetwork ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${offNetwork ? 'rgba(245,158,11,0.25)' : 'rgba(34,197,94,0.25)'}`, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: offNetwork ? '0 0 48px rgba(245,158,11,0.18)' : '0 0 48px rgba(34,197,94,0.18)' }}>
                        <CheckCircle size={38} color={offNetwork ? '#F59E0B' : '#22C55E'} />
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.625rem', color: 'var(--text-primary)' }}>
                        {t.received}
                    </h2>

                    {/* Off-network WiFi warning */}
                    {offNetwork ? (
                        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '1.1rem' }}>📶</span>
                                <span style={{ fontWeight: 700, color: '#F59E0B', fontSize: '0.9rem' }}>Connect to Campus WiFi</span>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                Your signal was received, but you appear to be on a different network than your teacher. 
                                Please connect to the <strong style={{ color: 'var(--text-primary)' }}>same campus WiFi</strong> as your teacher for your feedback to reach them directly.
                            </p>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.75rem', padding: '0 0.5rem' }}>
                            {t.notified}
                        </p>
                    )}

                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 100, fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>
                        <Clock size={14} />
                        {t.signalAgain.replace('{s}', cooldownSecs.toString())}
                    </div>
                    <div style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        {t.anonFooter}
                    </div>
                </div>
            </div>
        )
    }

    // ── Active session — Signal buttons ────────────────────────────
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>

            {/* Ambient orbs */}
            <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '60%', height: '70%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: '50%', height: '60%', background: 'radial-gradient(ellipse, rgba(79,70,229,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            {/* Header */}
            <header style={{ borderBottom: '1px solid var(--glass-border)', height: 52, display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.5rem', backdropFilter: 'blur(12px)', background: 'rgba(6,6,10,0.85)', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={11} color="#fff" fill="#fff" />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.03em' }}>EduPulse</span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>/</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.session}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem', padding: '0.15rem 0.5rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-soft)', letterSpacing: '0.1em' }}>{sessionId}</span>
                <div style={{ flex: 1 }} />
                
                {/* Language Picker */}
                <select
                    value={lang}
                    onChange={e => handleLangChange(e.target.value as any)}
                    style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 600, outline: 'none', padding: '0.15rem 0.5rem', cursor: 'pointer', appearance: 'none' }}
                >
                    {Object.keys(translations).map(k => (
                        <option key={k} value={k} style={{ background: '#111' }}>{k.toUpperCase()}</option>
                    ))}
                </select>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)', background: 'var(--success-dim)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 100, padding: '0.2rem 0.625rem', flexShrink: 0 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite' }} />
                    {t.live}
                </div>
            </header>

            {/* Main content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem', position: 'relative', zIndex: 1 }}>

                {/* Top text */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: 380, width: '100%' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.875rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 100, marginBottom: '1.25rem' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite' }} />
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-soft)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t.classInSession}</span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 7vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                        {t.howKeepingUp}{t.howKeepingUpBr && <><br/>{t.howKeepingUpBr}</>}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                        {t.feedbackDesc}
                    </p>
                </div>

                {/* Signals */}
                <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Optional Context Field (Dropdown) */}
                    {/* Topic / Reason Picker — Premium Custom Dropdown */}
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.625rem', textAlign: 'center' }}>
                            {t.optional}
                        </label>

                        {/* Custom dropdown trigger */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => !submitting && setDropdownOpen(o => !o)}
                                disabled={submitting !== null}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1.125rem',
                                    background: optionalText ? 'rgba(99,102,241,0.08)' : 'var(--accent-dim)',
                                    border: `1px solid ${optionalText ? 'rgba(99,102,241,0.35)' : 'var(--border)'}`,
                                    borderRadius: dropdownOpen ? '14px 14px 0 0' : 14,
                                    color: optionalText ? 'var(--text-primary)' : 'var(--text-tertiary)',
                                    fontSize: '0.9rem',
                                    fontFamily: 'inherit',
                                    fontWeight: optionalText ? 600 : 400,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'left',
                                }}
                            >
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {optionalText || t.selectReason}
                                </span>
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', opacity: 0.5, transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {/* Dropdown panel */}
                            {dropdownOpen && (
                                <div style={{
                                    position: 'absolute',
                                    left: 0, right: 0,
                                    top: '100%',
                                    zIndex: 50,
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border)',
                                    borderTop: 'none',
                                    borderRadius: '0 0 14px 14px',
                                    overflow: 'hidden',
                                    boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                                }}>
                                    {/* Session topics */}
                                    {sessionAgenda.length > 0 && (
                                        <>
                                            <div style={{ padding: '0.5rem 1rem 0.25rem', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--accent-soft)', textTransform: 'uppercase' }}>
                                                📚 Session Topics
                                            </div>
                                            {sessionAgenda.map((topic, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => { setOptionalText(`Confused about: ${topic}`); setDropdownOpen(false) }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1.125rem',
                                                        background: optionalText === `Confused about: ${topic}` ? 'rgba(99,102,241,0.12)' : 'transparent',
                                                        border: 'none',
                                                        borderLeft: optionalText === `Confused about: ${topic}` ? '3px solid var(--accent)' : '3px solid transparent',
                                                        color: optionalText === `Confused about: ${topic}` ? 'var(--accent-soft)' : 'var(--text-primary)',
                                                        fontSize: '0.88rem',
                                                        fontWeight: 600,
                                                        fontFamily: 'inherit',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s',
                                                        display: 'block',
                                                    }}
                                                    onMouseEnter={e => { if (optionalText !== `Confused about: ${topic}`) e.currentTarget.style.background = 'rgba(99,102,241,0.06)' }}
                                                    onMouseLeave={e => { if (optionalText !== `Confused about: ${topic}`) e.currentTarget.style.background = 'transparent' }}
                                                >
                                                    🎯 {topic}
                                                </button>
                                            ))}
                                            <div style={{ height: 1, background: 'var(--border)', margin: '0.25rem 0' }} />
                                            <div style={{ padding: '0.25rem 1rem 0.25rem', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                                                General reasons
                                            </div>
                                        </>
                                    )}

                                    {/* Generic reasons */}
                                    {[
                                        { value: 'I missed the last explanation', label: t.opt1, icon: '👂' },
                                        { value: "I don't understand the core concept", label: t.opt2, icon: '🧠' },
                                        { value: 'The math/formula is confusing', label: t.opt3, icon: '📐' },
                                        { value: 'The slide changed too fast', label: t.opt4, icon: '⚡' },
                                        { value: 'I need an example to understand', label: t.opt5, icon: '💡' },
                                        { value: 'Other / Not listed', label: t.opt6, icon: '💬' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setOptionalText(opt.value); setDropdownOpen(false) }}
                                            style={{
                                                width: '100%',
                                                padding: '0.7rem 1.125rem',
                                                background: optionalText === opt.value ? 'rgba(99,102,241,0.08)' : 'transparent',
                                                border: 'none',
                                                borderLeft: optionalText === opt.value ? '3px solid var(--accent)' : '3px solid transparent',
                                                color: optionalText === opt.value ? 'var(--accent-soft)' : 'var(--text-secondary)',
                                                fontSize: '0.85rem',
                                                fontFamily: 'inherit',
                                                fontWeight: 500,
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s',
                                                display: 'block',
                                            }}
                                            onMouseEnter={e => { if (optionalText !== opt.value) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                                            onMouseLeave={e => { if (optionalText !== opt.value) e.currentTarget.style.background = 'transparent' }}
                                        >
                                            {opt.icon} {opt.label}
                                        </button>
                                    ))}

                                    {/* Clear option */}
                                    {optionalText && (
                                        <button
                                            onClick={() => { setOptionalText(''); setDropdownOpen(false) }}
                                            style={{ width: '100%', padding: '0.6rem 1.125rem', background: 'transparent', border: 'none', borderTop: '1px solid var(--border)', color: 'var(--text-tertiary)', fontSize: '0.8rem', fontFamily: 'inherit', textAlign: 'center', cursor: 'pointer' }}
                                        >
                                            ✕ Clear selection
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    {SIGNAL_TYPES.map(sig => {
                        const isSubmittingThis = submitting === sig.label
                        return (
                            <button
                                key={sig.id}
                                disabled={submitting !== null}
                                onClick={() => handleSignal(sig.label, sig.realType)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: '1rem',
                                    padding: 'clamp(1.1rem, 4vw, 1.5rem) clamp(1.1rem, 5vw, 1.75rem)',
                                    background: cooldown
                                        ? 'rgba(255,255,255,0.02)'
                                        : isSubmittingThis
                                            ? sig.glow
                                            : `linear-gradient(135deg, ${sig.gradientFrom}, ${sig.gradientTo})`,
                                    border: `1px solid ${cooldown ? 'var(--glass-border)' : sig.glow}`,
                                    borderRadius: 24,
                                    color: cooldown ? 'var(--text-tertiary)' : sig.color,
                                    fontSize: 'clamp(1.1rem, 4.5vw, 1.25rem)',
                                    fontWeight: 700,
                                    cursor: cooldown ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: !cooldown && !isSubmittingThis ? `0 8px 32px ${sig.glow}` : 'none',
                                    transform: isSubmittingThis ? 'scale(0.98)' : 'scale(1)',
                                    opacity: cooldown ? 0.5 : 1,
                                }}
                            >
                                <span style={{ fontSize: '1.75rem', filter: cooldown ? 'grayscale(100%)' : 'none' }}>
                                    {isSubmittingThis ? <Loader2 size={28} style={{ animation: 'spin 1.5s linear infinite' }} /> : sig.emoji}
                                </span>
                                {isSubmittingThis ? t.sending : sig.label}
                            </button>
                        )
                    })}
                </div>

                {/* Cooldown state */}
                {cooldown && !signaled && (
                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.125rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 100, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
                        <Clock size={14} />
                        {t.waitCooldown.replace('{s}', cooldownSecs.toString())}
                    </div>
                )}

                {/* Anon note */}
                <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-tertiary)', lineHeight: 1.65 }}>
                    {t.anonFooter}
                </div>
            </main>
        </div>
    )
}
