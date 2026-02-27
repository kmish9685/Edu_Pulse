// Supabase Admin Client — SERVER SIDE ONLY, never import in client components
// Uses the service role key which bypasses RLS and can create auth users directly.
// Requires SUPABASE_SERVICE_ROLE_KEY env var (set in Vercel + .env.local).

import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceRoleKey) {
        throw new Error(
            'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
            'Add SUPABASE_SERVICE_ROLE_KEY to your .env.local and Vercel environment variables.'
        )
    }

    // Admin client is server-only, but just to be 100% safe with edge runtimes
    // we route through the same proxy if there's any weird DNS hijacking anywhere.
    const isBrowser = typeof window !== 'undefined'
    const finalUrl = isBrowser ? `${window.location.origin}/supabase-api` : url

    return createClient(finalUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
