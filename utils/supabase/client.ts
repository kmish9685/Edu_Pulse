import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
        throw new Error(
            'Missing Supabase environment variables. ' +
            'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local and Vercel settings.'
        )
    }

    // If we're on the client (browser), we MUST route through our own domain's proxy
    // to bypass ISP/DNS blocks (like Jio in India blocking .supabase.co).
    // The next.config.ts rewrites this path to the actual Supabase server.
    const isBrowser = typeof window !== 'undefined'
    const finalUrl = isBrowser ? `${window.location.origin}/supabase-api` : url

    return createBrowserClient(finalUrl, key, {
        cookieOptions: {
            name: 'sb-edupulse-auth-token'
        }
    })
}
