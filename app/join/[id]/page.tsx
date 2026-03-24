'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { validateSession, submitSignal, submitPendingDoubt } from '@/app/actions/signals_fix'
import { enhanceDoubt } from '@/app/actions/ai'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle, Clock, Loader2, Zap, WifiOff, Radio, Globe, Sparkles, BookOpen } from 'lucide-react'
import Link from 'next/link'

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
        sigConfused: 'Need Clarification',
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
        optional: 'वैकल्पिक: विशेष रूप से क्या स्पष्ट नहीं है?',
        selectReason: 'एक कारण चुनें...',
        opt1: 'मैं पिछला स्पष्टीकरण चूक गया',
        opt2: 'मुझे मुख्य अवधारणा समझ नहीं आ रही है',
        opt3: 'गणित/सूत्र स्पष्ट नहीं है',
        opt4: 'स्लाइड बहुत तेज़ी से बदल गई',
        opt5: 'समझने के लिए मुझे एक उदाहरण चाहिए',
        opt6: 'अन्य / सूची में नहीं',
        sigConfused: 'स्पष्टीकरण चाहिए',
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
        optional: 'Opcional: ¿Qué es exactamente lo que no está claro?',
        selectReason: 'Selecciona una razón...',
        opt1: 'Me perdí la última explicación',
        opt2: 'No entiendo el concepto principal',
        opt3: 'La fórmula no está clara',
        opt4: 'Lá diapositiva cambió muy rápido',
        opt5: 'Necesito un ejemplo para entender',
        opt6: 'Otro / No en la lista',
        sigConfused: 'Necesito claridad',
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
        optional: 'Optionnel : Qu\'est-ce qui n\'est pas clair ?',
        selectReason: 'Sélectionnez une raison...',
        opt1: 'J\'ai raté la dernière explication',
        opt2: 'Je ne comprends pas le concept principal',
        opt3: 'Le concept n\'est pas clair',
        opt4: 'La diapositive a changé trop vite',
        opt5: 'J\'ai besoin d\'un exemple pour comprendre',
        opt6: 'Autre / Non listé',
        sigConfused: 'Besoin de clarté',
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
        optional: '可选：具体哪里需要解释？',
        selectReason: '选择一个原因...',
        opt1: '我错过了最后的解释',
        opt2: '我不明白核心概念',
        opt3: '概念不够清晰',
        opt4: 'PPT切换太快了',
        opt5: '我需要一个例子来理解',
        opt6: '其他 / 未列出',
        sigConfused: '需要解释',
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
        optional: 'اختياري: ما الذي يحتاج توضيحًا؟',
        selectReason: 'اختر سببًا...',
        opt1: 'فاتني الشرح الأخير',
        opt2: 'لا أفهم المفهوم الأساسي',
        opt3: 'المفهوم غير واضح',
        opt4: 'تغيرت الشريحة بسرعة كبيرة',
        opt5: 'أحتاج إلى مثال للفهم',
        opt6: 'غير ذلك / غير مدرج',
        sigConfused: 'أحتاج توضيح',
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
    const [quickComment, setQuickComment] = useState('')
    const [deepDoubt, setDeepDoubt] = useState('')
    const [cooldown, setCooldown] = useState(false)
    const [cooldownSecs, setCooldownSecs] = useState(0)
    const [submitting, setSubmitting] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [lang, setLang] = useState<keyof typeof translations>('en')
    const [sessionAgenda, setSessionAgenda] = useState<string[]>([])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [offNetwork, setOffNetwork] = useState(false)
    const [doubtCooldown, setDoubtCooldown] = useState(false)
    const [doubtCooldownSecs, setDoubtCooldownSecs] = useState(0)

    // ── Smart Rate-Limiting (Topic-aware) ─────────────────────────
    // Tracks how many signals sent per-topic in this session
    const [topicSignalCounts, setTopicSignalCounts] = useState<Record<string, number>>({})
    const [rateLimited, setRateLimited] = useState(false)          // Buttons paused?
    const [pendingDoubt, setPendingDoubt] = useState('')            // Text in the pending doubt box
    const [pendingDoubtStatus, setPendingDoubtStatus] = useState<'idle' | 'submitting' | 'sent' | 'rejected'>('idle')
    const [pendingDoubtMsg, setPendingDoubtMsg] = useState('')      // Feedback message to student
    const [enhancingPendingDoubt, setEnhancingPendingDoubt] = useState(false)
    const [enhancingDeepDoubt, setEnhancingDeepDoubt] = useState(false)
    const [currentSessionTopic, setCurrentSessionTopic] = useState<string | null>(null)
    const [vibeCheckActive, setVibeCheckActive] = useState(false)

    useEffect(() => {
        if (!roomId) return;
        const supabase = createClient()
        
        const channel = supabase.channel(`vibe_check_${roomId}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'active_sessions', filter: `id=eq.${roomId}` },
                (payload: any) => {
                    const newTs = payload.new?.metadata?.vibe_check_timestamp;
                    const oldTs = payload.old?.metadata?.vibe_check_timestamp;
                    if (newTs && newTs !== oldTs && (Date.now() - newTs < 60000)) {
                        setVibeCheckActive(true);
                    }
                }
            )
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [roomId])
    
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
        { id: 'confused', label: t.sigConfused, realType: "Need Clarification", emoji: '🤔', color: '#334155', border: '#E2E8F0', bg: '#F8FAFC' },
        { id: 'too_fast', label: t.sigFast, realType: 'Too Fast', emoji: '⚡', color: '#334155', border: '#E2E8F0', bg: '#F8FAFC' },
    ]

    // Validate session on load + check cooldown
    useEffect(() => {
        if (!sessionId || sessionId.length !== 4) {
            router.push('/student')
            return
        }

        // Check session validity and detect topic changes
        validateSession(sessionId).then(res => {
            setSessionValid(res.active)
            if (res.active && res.roomId) setRoomId(res.roomId)
            if (res.agenda && res.agenda.length > 0) setSessionAgenda(res.agenda)
        })

        // Poll for topic changes every 15s — reset rate limit per topic
        const topicPoller = setInterval(async () => {
            const res = await validateSession(sessionId)
            if (res.active) {
                // If the topic changed, reset the rate limit
                // (We use optionalText as a proxy for the currently selected topic)
                // The actual topic comes from the server via optionalText selection choices
                setCurrentSessionTopic(prev => {
                    // We can't get topic here directly, so we reset rateLimited
                    // when the student manually changes topic (handled in handleSignal)
                    return prev
                })
            }
        }, 15000)

        // Check cooldown from localStorage
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

        // Restore topic signal counts from localStorage
        const topicKey = `edupulse_topic_counts_${sessionId}`
        const stored = localStorage.getItem(topicKey)
        if (stored) {
            try { setTopicSignalCounts(JSON.parse(stored)) } catch {}
        }

        return () => clearInterval(topicPoller)
    }, [sessionId, router])

    const handleSignal = async (type: string, realType: string) => {
        if (cooldown || submitting || rateLimited) return
        setSubmitting(type)
        setError(null)
        setDropdownOpen(false)
        const deviceId = getOrCreateDeviceId()
        const combinedText = [optionalText, quickComment].filter(Boolean).join(' | ')
        const activeTopic = optionalText || 'General'

        try {
            const res = await submitSignal({ 
                type: realType, 
                block_room: roomId || sessionId, 
                additional_text: combinedText, 
                device_id: deviceId 
            })
            
            if (res.success) {
                // Increment per-topic signal count
                setTopicSignalCounts(prev => {
                    const updated = { ...prev, [activeTopic]: (prev[activeTopic] || 0) + 1 }
                    localStorage.setItem(`edupulse_topic_counts_${sessionId}`, JSON.stringify(updated))
                    if (updated[activeTopic] >= 3) setRateLimited(true)
                    return updated
                })

                setSignaled(true)
                setCooldown(true)
                setCooldownSecs(60)
                setOptionalText('')
                setQuickComment('')
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
        } catch (err) {
            console.error('[Submit Signal Error]', err)
            setError('Connection error. Please try again.')
        } finally {
            setSubmitting(null)
        }
    }

    const handleDoubt = async () => {
        if (!deepDoubt.trim() || (submitting && submitting !== 'Deep Doubt') || doubtCooldown) return
        setSubmitting('Deep Doubt')
        setError(null)
        const deviceId = getOrCreateDeviceId()

        try {
            const res = await submitSignal({ 
                type: 'Deep Doubt', 
                block_room: roomId || sessionId, 
                additional_text: deepDoubt, 
                device_id: deviceId 
            })
            
            if (res.success) {
                setDeepDoubt('')
                setDoubtCooldown(true)
                setDoubtCooldownSecs(10)
                const doubtTimer = setInterval(() => {
                    setDoubtCooldownSecs(s => {
                        if (s <= 1) { clearInterval(doubtTimer); setDoubtCooldown(false); return 0 }
                        return s - 1
                    })
                }, 1000)
            } else {
                setError(res.error || 'Failed to send doubt')
            }
        } catch (err) {
            console.error('[Submit Doubt Error]', err)
            setError('Connection error. Please try again.')
        } finally {
            setSubmitting(null)
        }
    }

    // ── Handler for the Rate-Limited Pending Doubt (AI-validated) ──
    const handlePendingDoubt = async () => {
        if (!pendingDoubt.trim() || pendingDoubtStatus === 'submitting') return
        setPendingDoubtStatus('submitting')
        setPendingDoubtMsg('')
        const deviceId = getOrCreateDeviceId()
        const activeTopic = optionalText || 'General'
        const res = await submitPendingDoubt({
            sessionId: roomId || sessionId,
            deviceId,
            topic: activeTopic,
            doubtText: pendingDoubt,
        })
        if (res.success) {
            setPendingDoubt('')
            setPendingDoubtStatus('sent')
            const conf = res.data?.confidence || 0
            setPendingDoubtMsg(`✅ Your doubt has been queued. Your teacher will review it after the session. (AI confidence: ${conf}%)`)
        } else {
            const wasRejected = res.data?.rejected
            setPendingDoubtStatus('rejected')
            setPendingDoubtMsg(wasRejected
                ? `❌ ${res.error}`
                : `⚠️ ${res.error || 'Failed to submit. Please try again.'}`
            )
            // After 5s, reset so they can try again
            setTimeout(() => setPendingDoubtStatus('idle'), 5000)
        }
        setSubmitting(null)
    }

    const [enhancingQuickComment, setEnhancingQuickComment] = useState(false)

    const handleEnhanceQuick = async () => {
        if (!quickComment.trim() || enhancingQuickComment) return
        setEnhancingQuickComment(true)
        try {
            const res = await enhanceDoubt(quickComment)
            if (res.success && res.data) {
                setQuickComment(res.data)
            }
        } catch (err) {
            console.error('Enhance error:', err)
        } finally {
            setEnhancingQuickComment(false)
        }
    }

    const handleEnhancePending = async () => {
        if (!pendingDoubt.trim() || enhancingPendingDoubt) return
        setEnhancingPendingDoubt(true)
        try {
            const res = await enhanceDoubt(pendingDoubt)
            if (res.success && res.data) {
                setPendingDoubt(res.data)
            }
        } catch (err) {
            console.error('Enhance error:', err)
        } finally {
            setEnhancingPendingDoubt(false)
        }
    }

    const handleEnhanceDeep = async () => {
        if (!deepDoubt.trim() || enhancingDeepDoubt) return
        setEnhancingDeepDoubt(true)
        try {
            const res = await enhanceDoubt(deepDoubt)
            if (res.success && res.data) {
                setDeepDoubt(res.data)
            }
        } catch (err) {
            console.error('Enhance error:', err)
        } finally {
            setEnhancingDeepDoubt(false)
        }
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

    // ── No active session → Study Pack Entry Point ─────────────────
    if (!sessionValid) {
        return (
            <div style={pageShell}>
                <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Study Pack CTA — primary */}
                    <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(79,70,229,0.06))', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 24, padding: '2rem', textAlign: 'center' }}>
                        <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #6366F1, #4F46E5)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 40px rgba(99,102,241,0.3)' }}>
                            <BookOpen size={30} color="#fff" />
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.625rem' }}>
                            Class is over 🎓
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
                            Your AI-generated Study Pack is ready — concept analogies, examples, practice questions with answers, and more.
                        </p>
                        <button
                            onClick={() => router.push(`/join/${sessionId}/remedy`)}
                            style={{ width: '100%', padding: '1rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 14, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(99,102,241,0.3)', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.4)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.3)' }}
                        >
                            <Sparkles size={18} />
                            Open Study Pack
                        </button>
                    </div>

                    {/* Secondary: check if session restarted */}
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 40, height: 40, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <WifiOff size={18} color="#EF4444" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.2rem' }}>{t.noSession}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>PIN: {sessionId}</div>
                        </div>
                        <button
                            onClick={async (e) => {
                                const btn = e.currentTarget
                                btn.textContent = t.checking
                                btn.style.opacity = '0.7'
                                const r = await validateSession(sessionId)
                                setSessionValid(r.active)
                                if (r.active && r.roomId) setRoomId(r.roomId)
                                btn.textContent = t.checkAgain
                                btn.style.opacity = '1'
                            }}
                            style={{ padding: '0.5rem 1rem', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 10, color: 'var(--accent-soft)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                        >
                            {t.checkAgain}
                        </button>
                    </div>

                    <button onClick={() => router.push('/student')}
                        style={{ padding: '0.875rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 14, color: 'var(--text-tertiary)', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {t.tryDiff}
                    </button>
                </div>
            </div>
        )
    }

    // ── Vibe Check Modal ──────────────────────────────────────────
    if (vibeCheckActive) {
        return (
            <div style={{ ...pageShell, justifyContent: 'center' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '2.5rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxWidth: 400, width: '100%', zIndex: 100, animation: 'enter-scale 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>👀</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Quick Vibe Check!</h2>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.5 }}>
                        Your teacher wants to know if you're following the current topic.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {[
                            { label: 'Got it perfectly', type: 'Vibe: Got It', color: '#22C55E', emoji: '🟢', bg: 'rgba(34,197,94,0.1)', hover: 'rgba(34,197,94,0.15)' },
                            { label: 'Need a quick review', type: 'Vibe: Review', color: '#EAB308', emoji: '🟡', bg: 'rgba(234,179,8,0.1)', hover: 'rgba(234,179,8,0.15)' },
                            { label: 'Completely lost', type: 'Vibe: Lost', color: '#EF4444', emoji: '🔴', bg: 'rgba(239,68,68,0.1)', hover: 'rgba(239,68,68,0.15)' }
                        ].map(opt => (
                            <button
                                key={opt.type}
                                onClick={async () => {
                                    setVibeCheckActive(false);
                                    await submitSignal({ type: opt.type, block_room: roomId || sessionId, device_id: getOrCreateDeviceId() });
                                }}
                                style={{ width: '100%', padding: '1.25rem', background: opt.bg, border: `1px solid ${opt.color}40`, borderRadius: '16px', fontSize: '1.05rem', fontWeight: 700, color: opt.color, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 16px ${opt.color}25`; e.currentTarget.style.background = opt.hover; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = opt.bg; }}
                            >
                                <span style={{ fontSize: '1.3rem' }}>{opt.emoji}</span> {opt.label}
                            </button>
                        ))}
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
                                <span style={{ fontWeight: 700, color: '#F59E0B', fontSize: '0.9rem' }}>Campus WiFi Recommended</span>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                Your signal was successfully received! 
                                If possible, connecting to the <strong style={{ color: 'var(--text-primary)' }}>same campus WiFi</strong> as your teacher helps us ensure the best experience.
                            </p>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.75rem', padding: '0 0.5rem' }}>
                            {t.notified}
                        </p>
                    )}

                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 100, fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, marginBottom: '2rem' }}>
                        <Clock size={14} />
                        {t.signalAgain.replace('{s}', cooldownSecs.toString())}
                    </div>

                    {/* Deep Doubt Form */}
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', textAlign: 'left', animation: 'enter-fade 0.5s ease-out' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                            <div style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sparkles size={16} color="var(--accent-soft)" />
                            </div>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Still Confused?</h3>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                            Your teacher values your clarity. If the last explanation didn&apos;t clear your doubt, tell them exactly what&apos;s blocking you.
                        </p>
                        
                        <div style={{ position: 'relative' }}>
                            <textarea 
                                value={deepDoubt}
                                onChange={(e) => setDeepDoubt(e.target.value)}
                                placeholder="Describe your doubt here (e.g., 'How did we get that formula?')..."
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: 'var(--bg-base)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 12,
                                    fontSize: '0.85rem',
                                    fontFamily: 'inherit',
                                    resize: 'none',
                                    outline: 'none',
                                    minHeight: 80,
                                    marginBottom: '0.75rem',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                            />
                            <button 
                                onClick={handleDoubt}
                                disabled={!deepDoubt.trim() || (submitting !== null && submitting !== 'Deep Doubt') || doubtCooldown}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'var(--accent)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 10,
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    cursor: (!deepDoubt.trim() || (submitting !== null && submitting !== 'Deep Doubt') || doubtCooldown) ? 'default' : 'pointer',
                                    opacity: (!deepDoubt.trim() || (submitting !== null && submitting !== 'Deep Doubt') || doubtCooldown) ? 0.5 : 1,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {submitting === 'Deep Doubt' ? 'Submitting...' : 
                                 doubtCooldown ? `Wait ${doubtCooldownSecs}s...` : 'Submit Specific Doubt'}
                            </button>
                        </div>
                        <Link 
                            href={`/join/${sessionId}/remedy`}
                            style={{ 
                                display: 'block', 
                                textAlign: 'center', 
                                marginTop: '1rem', 
                                fontSize: '0.75rem', 
                                color: 'var(--accent-soft)', 
                                fontWeight: 600, 
                                textDecoration: 'none' 
                            }}
                        >
                            View Post-Session Remedy Hub →
                        </Link>
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
            <header style={{ borderBottom: '1px solid var(--border)', height: 56, display: 'flex', alignItems: 'center', padding: '0 1.25rem', gap: '0.75rem', background: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ width: 24, height: 24, background: '#0F172A', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={13} color="#fff" fill="#fff" />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>EduPulse</span>
                <div style={{ flex: 1 }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', padding: '0.25rem 0.625rem', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>{sessionId}</span>
                <div style={{ flex: 1 }} />
                
                {/* Language Picker */}
                <select
                    value={lang}
                    onChange={e => handleLangChange(e.target.value as any)}
                    style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 600, outline: 'none', padding: '0.15rem 0.5rem', cursor: 'pointer', appearance: 'none' }}
                >
                    {Object.keys(translations).map(k => (
                        <option key={k} value={k} style={{ background: '#fff' }}>{k.toUpperCase()}</option>
                    ))}
                </select>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.2rem 0.625rem', background: 'var(--success-dim)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 100, flexShrink: 0 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite' }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t.live}</span>
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

                    {/* Pre-signal WiFi Warning */}
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '2rem', textAlign: 'left', display: 'flex', gap: '0.875rem', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ background: 'rgba(245,158,11,0.15)', padding: '0.4rem', borderRadius: 8 }}>
                            <span style={{ fontSize: '1rem' }}>📶</span>
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, color: '#F59E0B', fontSize: '0.85rem', marginBottom: '0.15rem' }}>Campus WiFi Recommended</div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                                It works best if you connect to the <strong style={{ color: 'var(--text-primary)' }}>same WiFi as your educator</strong>, if possible.
                            </p>
                        </div>
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
                                            overflowY: 'auto',
                                            maxHeight: '40vh',
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
                                            onMouseEnter={e => { if (optionalText !== opt.value) e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
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

                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Tell us more (Optional):</label>
                            <button 
                                onClick={handleEnhanceQuick}
                                disabled={!quickComment.trim() || enhancingQuickComment}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'linear-gradient(to right, rgba(99,102,241,0.1), rgba(168,85,247,0.1))', border: '1px solid rgba(139,92,246,0.3)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700, cursor: !quickComment.trim() ? 'not-allowed' : 'pointer', padding: '0.35rem 0.6rem', borderRadius: 8, transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(139,92,246,0.15)', opacity: !quickComment.trim() ? 0.6 : 1 }}
                                onMouseEnter={e => { if(quickComment.trim()) e.currentTarget.style.background = 'linear-gradient(to right, rgba(99,102,241,0.15), rgba(168,85,247,0.15))' }}
                                onMouseLeave={e => { if(quickComment.trim()) e.currentTarget.style.background = 'linear-gradient(to right, rgba(99,102,241,0.1), rgba(168,85,247,0.1))' }}
                            >
                                {enhancingQuickComment ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                                {enhancingQuickComment ? 'Polishing...' : '✨ Polish this'}
                            </button>
                        </div>
                        <textarea
                            value={quickComment}
                            onChange={(e) => setQuickComment(e.target.value)}
                            disabled={submitting !== null}
                            placeholder="Type a short comment..."
                            rows={2}
                            maxLength={80}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem',
                                fontFamily: 'inherit',
                                outline: 'none',
                                resize: 'none',
                                transition: 'all 0.2s',
                                boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.02)'
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-soft)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(79,70,229,0.1)' }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'inset 0 2px 4px 0 rgba(0,0,0,0.02)' }}
                        />
                    </div>

                    {/* Rate-Limited UI — shown when student has sent 3+ signals on same topic */}
                    {rateLimited ? (
                        <div style={{ animation: 'enter-fade 0.4s ease-out' }}>
                            {/* Paused state indicator */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', padding: '1.125rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-xl)', marginBottom: '1.25rem' }}>
                                <span style={{ fontSize: '1.375rem' }}>⏸️</span>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 700, color: '#D97706', fontSize: '0.9rem', marginBottom: '0.1rem' }}>Pulse buttons paused for this topic</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>You've sent 3+ signals on this topic. If it's still confusing, type your doubt below — we'll show it to the teacher after class.</div>
                                </div>
                            </div>

                            {/* Pending Doubt Box */}
                            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
                                    <div style={{ width: 32, height: 32, background: 'rgba(245,158,11,0.12)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '1rem' }}>📬</span>
                                    </div>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Still confused? Tell us specifically.</h3>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                                    Describe exactly what's confusing you. Your teacher will review this after the session ends. Genuine academic doubts will be shown to them.
                                </p>

                                {/* Feedback message */}
                                {pendingDoubtMsg && (
                                    <div style={{ padding: '0.75rem 1rem', background: pendingDoubtStatus === 'sent' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${pendingDoubtStatus === 'sent' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`, borderRadius: 10, fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                        {pendingDoubtMsg}
                                    </div>
                                )}

                                {pendingDoubtStatus !== 'sent' && (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Your message:</label>
                                            <button 
                                                onClick={handleEnhancePending}
                                                disabled={!pendingDoubt.trim() || enhancingPendingDoubt}
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'linear-gradient(to right, rgba(99,102,241,0.1), rgba(168,85,247,0.1))', border: '1px solid rgba(139,92,246,0.3)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700, cursor: !pendingDoubt.trim() ? 'not-allowed' : 'pointer', padding: '0.4rem 0.8rem', borderRadius: 8, transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(139,92,246,0.15)', opacity: !pendingDoubt.trim() ? 0.6 : 1 }}
                                                onMouseEnter={e => { if(pendingDoubt.trim()) e.currentTarget.style.background = 'linear-gradient(to right, rgba(99,102,241,0.15), rgba(168,85,247,0.15))' }}
                                                onMouseLeave={e => { if(pendingDoubt.trim()) e.currentTarget.style.background = 'linear-gradient(to right, rgba(99,102,241,0.1), rgba(168,85,247,0.1))' }}
                                            >
                                                {enhancingPendingDoubt ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                                                {enhancingPendingDoubt ? 'Polishing...' : '✨ Help me phrase this'}
                                            </button>
                                        </div>
                                        <textarea
                                            value={pendingDoubt}
                                            onChange={(e) => setPendingDoubt(e.target.value)}
                                            placeholder="e.g., 'I don't understand how integration changes polynomial degree — can you give an example?'"
                                            maxLength={500}
                                            style={{
                                                width: '100%',
                                                padding: '0.875rem',
                                                background: 'var(--bg-base)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 12,
                                                fontSize: '0.85rem',
                                                fontFamily: 'inherit',
                                                resize: 'none',
                                                outline: 'none',
                                                minHeight: 90,
                                                marginBottom: '0.75rem',
                                                transition: 'border-color 0.2s',
                                                boxSizing: 'border-box',
                                                color: 'var(--text-primary)'
                                            }}
                                            onFocus={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)'}
                                            onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{pendingDoubt.length}/500</span>
                                        </div>
                                        <button
                                            onClick={handlePendingDoubt}
                                            disabled={!pendingDoubt.trim() || pendingDoubtStatus === 'submitting'}
                                            style={{
                                                width: '100%',
                                                padding: '0.875rem',
                                                background: pendingDoubt.trim() ? 'rgba(245,158,11,0.9)' : 'var(--bg-hover)',
                                                color: pendingDoubt.trim() ? '#fff' : 'var(--text-tertiary)',
                                                border: 'none',
                                                borderRadius: 12,
                                                fontSize: '0.9rem',
                                                fontWeight: 700,
                                                cursor: !pendingDoubt.trim() || pendingDoubtStatus === 'submitting' ? 'not-allowed' : 'pointer',
                                                opacity: !pendingDoubt.trim() || pendingDoubtStatus === 'submitting' ? 0.6 : 1,
                                                transition: 'all 0.2s',
                                                fontFamily: 'inherit',
                                            }}
                                        >
                                            {pendingDoubtStatus === 'submitting' ? '🤖 AI is checking your doubt...' : '📬 Submit for Teacher Review'}
                                        </button>
                                    </>
                                )}

                                <div style={{ marginTop: '0.875rem', padding: '0.625rem 0.875rem', background: 'var(--accent-dim)', borderRadius: 8, fontSize: '0.73rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                                    🤖 <strong>AI Guard:</strong> Only genuine academic questions reach the teacher. Offensive or off-topic messages are automatically rejected.
                                </div>
                            </div>
                        </div>
                    ) : (
                    <>{SIGNAL_TYPES.map(sig => {
                        const isSubmittingThis = submitting === sig.label
                        return (
                            <button
                                key={sig.id}
                                disabled={submitting !== null || cooldown}
                                onClick={() => handleSignal(sig.label, sig.realType)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '1rem',
                                    padding: '1.25rem',
                                    background: cooldown
                                        ? 'var(--bg-base)'
                                        : isSubmittingThis
                                            ? 'var(--bg-hover)'
                                            : sig.bg,
                                    border: `1px solid ${cooldown ? 'var(--border)' : 'var(--border)'}`,
                                    borderRadius: 'var(--radius-xl)',
                                    color: cooldown ? 'var(--text-tertiary)' : sig.color,
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    cursor: cooldown ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                    boxShadow: !cooldown && !isSubmittingThis ? 'var(--shadow-md)' : 'none',
                                    transform: isSubmittingThis ? 'translateY(1px)' : 'scale(1)',
                                    opacity: cooldown ? 0.6 : 1,
                                }}
                                onMouseEnter={e => { if (!cooldown && !isSubmittingThis) { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                                onMouseLeave={e => { if (!cooldown && !isSubmittingThis) { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
                            >
                                <span style={{ fontSize: '1.5rem', filter: cooldown ? 'grayscale(100%)' : 'none', opacity: cooldown ? 0.5 : 1 }}>
                                    {isSubmittingThis ? <Loader2 size={24} style={{ animation: 'spin 1.5s linear infinite' }} /> : sig.emoji}
                                </span>
                                {isSubmittingThis ? t.sending : sig.label}
                            </button>
                        )
                    })}
                    </>
                    )}
                </div>

                {/* Always-on Deep Doubt Area */}
                <div style={{ width: '100%', maxWidth: 420, marginTop: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                        <div style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={16} color="var(--accent-soft)" />
                        </div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Ask a Specific Doubt</h3>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        Type your question below. It will be sent directly to your teacher, even if pulses are on cooldown.
                    </p>
                    <div style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>My question:</label>
                            <button 
                                onClick={handleEnhanceDeep}
                                disabled={!deepDoubt.trim() || enhancingDeepDoubt}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'linear-gradient(to right, rgba(99,102,241,0.1), rgba(168,85,247,0.1))', border: '1px solid rgba(139,92,246,0.3)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700, cursor: !deepDoubt.trim() ? 'not-allowed' : 'pointer', padding: '0.4rem 0.8rem', borderRadius: 8, transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(139,92,246,0.15)', opacity: !deepDoubt.trim() ? 0.6 : 1 }}
                                onMouseEnter={e => { if(deepDoubt.trim()) e.currentTarget.style.background = 'linear-gradient(to right, rgba(99,102,241,0.15), rgba(168,85,247,0.15))' }}
                                onMouseLeave={e => { if(deepDoubt.trim()) e.currentTarget.style.background = 'linear-gradient(to right, rgba(99,102,241,0.1), rgba(168,85,247,0.1))' }}
                            >
                                {enhancingDeepDoubt ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                                {enhancingDeepDoubt ? 'Clarifying...' : '✨ Let AI phrase it'}
                            </button>
                        </div>
                        <textarea 
                            value={deepDoubt}
                            onChange={(e) => setDeepDoubt(e.target.value)}
                            placeholder="e.g., 'What does the X axis represent in this chart?'"
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                background: 'var(--bg-base)',
                                border: '1px solid var(--border)',
                                borderRadius: 12,
                                fontSize: '0.85rem',
                                fontFamily: 'inherit',
                                resize: 'none',
                                outline: 'none',
                                minHeight: 80,
                                marginBottom: '0.75rem',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        />
                        <button 
                            onClick={handleDoubt}
                            disabled={!deepDoubt.trim() || (submitting !== null && submitting !== 'Deep Doubt') || doubtCooldown}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--accent)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 10,
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                cursor: (!deepDoubt.trim() || (submitting !== null && submitting !== 'Deep Doubt') || doubtCooldown) ? 'default' : 'pointer',
                                opacity: (!deepDoubt.trim() || (submitting !== null && submitting !== 'Deep Doubt') || doubtCooldown) ? 0.5 : 1,
                                transition: 'all 0.2s'
                            }}
                        >
                            {submitting === 'Deep Doubt' ? 'Submitting...' : 
                             doubtCooldown ? `Wait ${doubtCooldownSecs}s...` : 'Submit Question'}
                        </button>
                    </div>
                </div>

                {/* Cooldown state */}
                {cooldown && !signaled && (
                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.125rem', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border)', borderRadius: 100, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
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
