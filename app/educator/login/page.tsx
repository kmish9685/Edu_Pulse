'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            // 1. Authenticate with Supabase
            const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) throw authError
            if (!user) throw new Error('No user returned')

            // 2. Check User Role
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profileError) {
                throw new Error('User profile not found. Please contact support.')
            }

            // 3. Redirect based on Role
            if (profile.role === 'admin') {
                router.push('/admin')
            } else if (profile.role === 'educator') {
                router.push('/educator/dashboard')
            } else {
                // Default fallback
                router.push('/educator/dashboard')
            }

            router.refresh()

        } catch (err: any) {
            setError(err.message || 'Authentication failed')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <Link href="/" className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
                            <Zap className="text-white w-5 h-5" />
                        </div>
                        <span className="font-semibold text-lg text-slate-900">EduPulse</span>
                    </div>
                </Link>

                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Educator Login</h1>
                    <p className="text-slate-500 mt-2">Access your classroom dashboard.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
                        <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                            placeholder="professor@university.edu"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center"
                    >
                        {isLoading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing In...</>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-400 mt-6">
                    EduPulse Prototype Access
                </p>
            </div>
        </div>
    )
}
