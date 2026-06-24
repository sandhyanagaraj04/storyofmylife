import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Cloud mode is active only when both env vars are present. */
export const isCloud = Boolean(url && anonKey)

/** The Supabase client, or null in local-only mode. */
export const supabase: SupabaseClient | null = isCloud
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null
