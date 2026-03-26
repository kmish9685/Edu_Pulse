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

    // Generate or retrieve a persistent anonymous identity
    const getOrCreateIdentity = (): { id: string, name: string } => {
        const idKey = 'edupulse_device_id'
        const nameKey = 'edupulse_student_identity'
        
        let id = localStorage.getItem(idKey)
        let name = localStorage.getItem(nameKey)
        
        if (!id) {
            id = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36)
            localStorage.setItem(idKey, id)
        }
        
        if (!name) {
            const adjectives = ['Cosmic', 'Neon', 'Lunar', 'Alpha', 'Swift', 'Golden', 'Electric', 'Arctic', 'Vibrant', 'Silent']
            const animals = ['Panda', 'Fox', 'Eagle', 'Owl', 'Wolf', 'Lion', 'Tiger', 'Dolphin', 'Koala', 'Falcon']
            name = adjectives[Math.floor(Math.random() * adjectives.length)] + ' ' + animals[Math.floor(Math.random() * animals.length)]
            localStorage.setItem(nameKey, name)
        }
        
        return { id, name }
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
    const [deepDoubtMsg, setDeepDoubtMsg] = useState('')            // Success feedback for deep doubt
    const [enhancingPendingDoubt, setEnhancingPendingDoubt] = useState(false)
    const [enhancingDeepDoubt, setEnhancingDeepDoubt] = useState(false)
    const [currentSessionTopic, setCurrentSessionTopic] = useState<string | null>(null)
    const [studentIdentity, setStudentIdentity] = useState('Joining...')


    
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
            if (res.active && res.roomId) {
                setRoomId(res.roomId)
                if (res.agenda) setSessionAgenda(res.agenda)
                
                // Initialize Identity
                const { name } = getOrCreateIdentity()
                setStudentIdentity(name)

                // Initialize Persistent Signal Counts for this room
                const savedCounts = localStorage.getItem(`topic_counts_${res.roomId}`)
                if (savedCounts) {
                    try {
                        const parsed = JSON.parse(savedCounts)
                        setTopicSignalCounts(parsed)
                        // If already spammed in this room, set rate limit
                        if (parsed['General'] >= 3) setRateLimited(true)
                    } catch(e) {}
                }
            }
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

        // Check cooldown from localStorage (using absolute end time)
        const cooldownEnd = localStorage.getItem(`edupulse_cooldown_end_${sessionId}`)
        if (cooldownEnd) {
            const remaining = Math.ceil((parseInt(cooldownEnd) - Date.now()) / 1000)
            if (remaining > 0) {
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

        return () => clearInterval(topicPoller)
    }, [sessionId, router])

    const handleSignal = async (type: string, realType: string) => {
        if (cooldown || submitting || rateLimited) return
        setSubmitting(type)
        setError(null)
        setDropdownOpen(false)
        const { id: deviceId } = getOrCreateIdentity()
        const combinedText = [optionalText, quickComment].filter(Boolean).join(' | ')
        const activeTopic = optionalText || 'General'

        try {
            const res = await submitSignal({ 
                type: realType, 
                block_room: roomId || sessionId, 
                additional_text: `[${studentIdentity}] ${combinedText}`, 
                device_id: deviceId 
            })
            
            if (res.success) {
                // Increment per-topic signal count
                setTopicSignalCounts(prev => {
                    const updated = { ...prev, [activeTopic]: (prev[activeTopic] || 0) + 1 }
                    localStorage.setItem(`edupulse_topic_counts_${sessionId}`, JSON.stringify(updated))
                    return updated
                })

                // Persist new counts to localStorage to prevent refresh-based spamming
                const currentCounts = { ...topicSignalCounts, [activeTopic]: (topicSignalCounts[activeTopic] || 0) + 1 }
                localStorage.setItem(`topic_counts_${roomId}`, JSON.stringify(currentCounts))

                // Penalty triggers on the 4th signal within the same topic (current count 3)
                const isSpamming = (currentCounts[activeTopic] || 0) >= 3
                const duration = isSpamming ? 180 : 120 // Unified 120s cooldown, 180s for spam
                if (isSpamming) setRateLimited(true)
                setSignaled(true)
                setCooldown(true)
                setCooldownSecs(duration)
                setOptionalText('')
                setQuickComment('')
                setOffNetwork(!!(res as any).offNetwork)
                
                const endTime = Date.now() + (duration * 1000)
                localStorage.setItem(`edupulse_cooldown_end_${sessionId}`, endTime.toString())
                
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

        try {
            const res = await submitSignal({ 
                type: 'Deep Doubt', 
                block_room: roomId || sessionId, 
                additional_text: `[${studentIdentity}] ${deepDoubt}`, 
                device_id: getOrCreateIdentity().id 
            })
            
            if (res.success) {
                setDeepDoubt('')
                setDeepDoubtMsg('✅ Question sent! Your teacher will see it shortly.')
                setDoubtCooldown(true)
                setDoubtCooldownSecs(120) // Unified cooldown for doubts too
                const doubtTimer = setInterval(() => {
                    setDoubtCooldownSecs(s => {
                        if (s <= 1) { clearInterval(doubtTimer); setDoubtCooldown(false); return 0 }
                        return s - 1
                    })
                }, 1000)
                // Clear success message after 5s
                setTimeout(() => setDeepDoubtMsg(''), 5000)
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
        setPendingDoubtMsg('Checking your doubt...')

        // ── Always validate with AI before submitting (even without Polish) ──
        try {
            const spamCheck = await enhanceDoubt(pendingDoubt)
            // enhanceDoubt returns { success: false, error: "REJECT: ..." } for spam/gibberish
            if (!spamCheck.success) {
                setPendingDoubtStatus('rejected')
                setPendingDoubtMsg(`❌ This doesn't look like a genuine academic doubt. Please describe your actual question clearly.`)
                setTimeout(() => {
                    setPendingDoubtStatus('idle')
                    setPendingDoubtMsg('')
                }, 6000)
                return
            }
        } catch {
            // If AI check fails, allow through (fail-open)
        }

        setPendingDoubtMsg('')
        const activeTopic = optionalText || 'General'
        const res = await submitPendingDoubt({
            sessionId: roomId || sessionId,
            deviceId: getOrCreateIdentity().id,
            topic: activeTopic,
            doubtText: `[${studentIdentity}] ${pendingDoubt}`,
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

    // ── Unified Doubt Interface (Normal or Spam) ──
    const renderDoubtInterface = () => (
        <div style={{ width: '100%', background: 'var(--bg-surface)', border: `1px solid ${rateLimited ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`, borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                <div style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={16} color="var(--accent-soft)" />
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: rateLimited ? 'var(--accent-soft)' : 'var(--text-primary)' }}>
                    {rateLimited ? "🎯 Priority Academic Doubt" : "Ask a Specific Doubt"}
                </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {rateLimited 
                    ? "Since pulse buttons are paused for spamming, please describe your doubt below. These are prioritized for the teacher." 
                    : "Type your question below. It will be sent directly to your teacher, even if pulses are on cooldown."}
            </p>
            
            <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>{rateLimited ? "Describe your doubt:" : "My question:"}</label>
                    <button 
                        onClick={handleEnhanceDeep}
                        disabled={!deepDoubt && !pendingDoubt || enhancingDeepDoubt}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'linear-gradient(to right, rgba(99,102,241,0.1), rgba(168,85,247,0.1))', border: '1px solid rgba(139,92,246,0.3)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: '0.4rem 0.8rem', borderRadius: 8 }}
                    >
                        {enhancingDeepDoubt ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                        {enhancingDeepDoubt ? 'Polishing...' : '✨ Polish with AI'}
                    </button>
                </div>
                
                {(deepDoubtMsg || pendingDoubtMsg) && (
                    <div style={{ padding: '0.625rem 1rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, fontSize: '0.82rem', color: 'var(--success)', fontWeight: 600, marginBottom: '1rem' }}>
                        {deepDoubtMsg || pendingDoubtMsg}
                    </div>
                )}

                <textarea 
                    value={rateLimited ? pendingDoubt : deepDoubt}
                    onChange={(e) => rateLimited ? setPendingDoubt(e.target.value) : setDeepDoubt(e.target.value)}
                    placeholder={rateLimited ? "e.g., 'I don't understand how X relates to Y...'" : "e.g., 'What does the X axis represent?'"}
                    style={{
                        width: '100%', padding: '0.875rem', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 12,
                        fontSize: '0.85rem', fontFamily: 'inherit', resize: 'none', outline: 'none', minHeight: 80, marginBottom: '0.75rem', boxSizing: 'border-box'
                    }}
                />
                <button 
                    onClick={rateLimited ? handlePendingDoubt : handleDoubt}
                    disabled={rateLimited ? (pendingDoubtStatus === 'submitting' || !pendingDoubt.trim()) : (!deepDoubt.trim() || submitting === 'Deep Doubt' || doubtCooldown)}
                    style={{
                        width: '100%', padding: '0.75rem', background: rateLimited ? 'var(--accent-soft)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                        opacity: (rateLimited ? (pendingDoubtStatus === 'submitting' || !pendingDoubt.trim()) : (!deepDoubt.trim() || submitting === 'Deep Doubt' || doubtCooldown)) ? 0.5 : 1
                    }}
                >
                    {rateLimited 
                        ? (pendingDoubtStatus === 'submitting' ? 'Submitting...' : 'Submit Priority Doubt')
                        : (submitting === 'Deep Doubt' ? 'Submitting...' : doubtCooldown ? `Wait ${doubtCooldownSecs}s...` : 'Submit Question')}
                </button>
            </div>
        </div>
    )

    const [enhancingQuickComment, setEnhancingQuickComment] = useState(false)

    const handleEnhanceQuick = async () => {
        if (!quickComment.trim() || enhancingQuickComment) return
        setEnhancingQuickComment(true)
        try {
            const res = await enhanceDoubt(quickComment)
            if (res.success && res.data) {
                setQuickComment(res.data)
            } else if (!res.success && res.error) {
                setError(res.error)
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
            } else if (!res.success && res.error) {
                setPendingDoubtMsg(`❌ ${res.error}`)
            }
        } catch (err) {
            console.error('Enhance error:', err)
        } finally {
            setEnhancingPendingDoubt(false)
        }
    }

    // ── Polish handler — works for BOTH deepDoubt (normal) and pendingDoubt (rate-limited) ──
    const handleEnhanceDeep = async () => {
        const textToEnhance = rateLimited ? pendingDoubt : deepDoubt
        if (!textToEnhance.trim() || enhancingDeepDoubt) return
        setEnhancingDeepDoubt(true)
        try {
            const res = await enhanceDoubt(textToEnhance)
            if (res.success && res.data) {
                // Update the correct state based on current mode
                if (rateLimited) {
                    setPendingDoubt(res.data)
                } else {
                    setDeepDoubt(res.data)
                }
            } else if (!res.success && res.error) {
                const msg = `❌ ${res.error}`
                if (rateLimited) {
                    setPendingDoubtMsg(msg)
                } else {
                    setDeepDoubtMsg(msg)
                }
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



    // ── Pre-calculate Signal Sent View (Used inside main return) ──
    const signalSentContent = (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: 380, animation: 'enter-fade 0.5s ease-out', marginBottom: '2rem' }}>
            <div style={{ width: 80, height: 80, background: offNetwork ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${offNetwork ? 'rgba(245,158,11,0.25)' : 'rgba(34,197,94,0.25)'}`, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: offNetwork ? '0 0 48px rgba(245,158,11,0.18)' : '0 0 48px rgba(34,197,94,0.18)' }}>
                <CheckCircle size={38} color={offNetwork ? '#F59E0B' : '#22C55E'} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.625rem', color: 'var(--text-primary)' }}>
                {t.received}
            </h2>

            {offNetwork ? (
                <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>📶</span>
                        <span style={{ fontWeight: 700, color: '#F59E0B', fontSize: '0.9rem' }}>Campus WiFi Recommended</span>
                    </div>
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
        </div>
    )

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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.6rem', background: 'rgba(99,102,241,0.06)', borderRadius: 100, border: '1px solid rgba(99,102,241,0.1)' }}>
                            <div style={{ width: 8, height: 8, background: 'var(--accent-soft)', borderRadius: '50%', boxShadow: '0 0 4px var(--accent-dim)' }} />
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-soft)', letterSpacing: '0.01em' }}>You are: {studentIdentity}</span>
                        </div>
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

                    {/* Student Benefits Banner (Trojan Horse) */}
                    <div className="glass-card" style={{ background: 'linear-gradient(to right, rgba(99,102,241,0.08), rgba(168,85,247,0.08))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '2rem', textAlign: 'left', display: 'flex', gap: '0.875rem', alignItems: 'flex-start', boxShadow: '0 4px 12px rgba(139,92,246,0.08)' }}>
                        <div style={{ background: 'rgba(139,92,246,0.15)', padding: '0.5rem', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: '1.25rem' }}>🎁</span>
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '0.85rem', marginBottom: '0.2rem', letterSpacing: '-0.01em' }}>Attendance Logged & Reward Pending</div>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                                By keeping this screen open, your attendance is actively tied to this session. After class, you will exclusively unlock the <strong style={{ color: 'var(--accent-soft)' }}>AI-generated Study Guide</strong>!
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

                {/* Error Banner */}
                {error && (
                    <div style={{ width: '100%', maxWidth: 420, marginBottom: '1.25rem', padding: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-lg)', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', animation: 'enter-fade 0.3s ease-out' }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Signals or Success Message */}
                <div style={{ width: '100%', maxWidth: 420 }}>
                    {signaled && cooldown ?
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {signalSentContent}
                            <div style={{ animation: 'enter-fade 0.5s ease-out' }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-soft)', marginBottom: '1rem', textAlign: 'center' }}>
                                    {rateLimited ? "🎯 Priority Academic Doubt Box" : "💡 Ask a Specific Doubt Instead"}
                                </h3>
                                {renderDoubtInterface()}
                            </div>
                        </div>
                    :
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Optional Context Field (Dropdown) - Hidden when rate-limited to reduce clutter */}
                    {!rateLimited && (
                        <>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.625rem', textAlign: 'center' }}>
                                    {t.optional}
                                </label>

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
                                                        >
                                                            🎯 {topic}
                                                        </button>
                                                    ))}
                                                    <div style={{ height: 1, background: 'var(--border)', margin: '0.25rem 0' }} />
                                                </>
                                            )}

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
                                                >
                                                    {opt.icon} {opt.label}
                                                </button>
                                            ))}
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
                        </>
                    )}

                    {/* Rate-Limited UI or Normal Buttons */}
                    {rateLimited ? (
                        <div style={{ animation: 'enter-fade 0.4s ease-out' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1.25rem', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-xl)', marginBottom: '1.25rem' }}>
                                <div style={{ fontSize: '1.75rem' }}>🎯</div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '0.95rem', marginBottom: '0.2rem' }}>You're clearly engaged!</div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                        Pulse buttons are paused for "General" due to spamming. <strong>Please type your specific doubt below</strong> — these go directly to your teacher.
                                    </div>
                                </div>
                            </div>
                            {renderDoubtInterface()}
                        </div>
                    ) : (
                        <>
                            {SIGNAL_TYPES.map(sig => (
                                <button
                                    key={sig.id}
                                    disabled={submitting !== null || cooldown}
                                    onClick={() => handleSignal(sig.label, sig.realType)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1.25rem',
                                        background: cooldown ? 'var(--bg-base)' : sig.bg,
                                        border: `1px solid var(--border)`, borderRadius: 'var(--radius-xl)',
                                        color: cooldown ? 'var(--text-tertiary)' : sig.color,
                                        fontSize: '1.125rem', fontWeight: 600, cursor: cooldown ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                                        opacity: cooldown ? 0.6 : 1
                                    }}
                                >
                                    <span style={{ fontSize: '1.5rem', filter: cooldown ? 'grayscale(100%)' : 'none' }}>{submitting === sig.label ? <Loader2 size={24} className="animate-spin" /> : sig.emoji}</span>
                                    {submitting === sig.label ? t.sending : sig.label}
                                </button>
                            ))}
                            <div style={{ marginTop: '1.5rem' }}>
                                {renderDoubtInterface()}
                            </div>
                        </>
                    )
                }
            </div>
        }
    </div>

                {/* Cooldown state */}
                {cooldown && !signaled && (
                    <div style={{ marginTop: '2.5rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ width: '100%', maxWidth: 420 }}>
                            <div style={{ padding: '1rem', background: 'linear-gradient(to right, rgba(99,102,241,0.06), rgba(168,85,247,0.06))', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', textAlign: 'center' }}>
                                <div style={{ fontWeight: 800, color: 'var(--accent-soft)', fontSize: '0.88rem', marginBottom: '0.2rem' }}>{rateLimited ? "🎯 Penalty Active: Please Use Doubt Box" : "💡 Signal Cooldown Active"}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>You can still send specific academic doubts directly to your teacher below.</div>
                            </div>
                            {renderDoubtInterface()}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.125rem', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border)', borderRadius: 100, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
                            <Clock size={14} />
                            {t.waitCooldown.replace('{s}', cooldownSecs.toString())}
                        </div>
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
