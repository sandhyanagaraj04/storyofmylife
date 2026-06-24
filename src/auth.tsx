import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { isCloud, supabase } from './lib/supabase'

interface AuthCtx {
  mode: 'local' | 'cloud'
  loading: boolean
  /** truthy when the user may use the app (real session, or local mode) */
  authed: boolean
  userId: string | null
  email: string | null
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(isCloud)

  useEffect(() => {
    if (!isCloud || !supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthCtx>(() => {
    if (!isCloud) {
      // local-only mode: no real auth, everyone is "in"
      return {
        mode: 'local',
        loading: false,
        authed: true,
        userId: null,
        email: null,
        signIn: async () => ({ error: null }),
        signUp: async () => ({ error: null }),
        signOut: async () => {},
      }
    }
    return {
      mode: 'cloud',
      loading,
      authed: !!session,
      userId: session?.user.id ?? null,
      email: session?.user.email ?? null,
      signIn: async (email, password) => {
        const { error } = await supabase!.auth.signInWithPassword({ email, password })
        return { error: error?.message ?? null }
      },
      signUp: async (email, password, name) => {
        const { data, error } = await supabase!.auth.signUp({
          email,
          password,
          options: { data: { name } },
        })
        if (error) return { error: error.message }
        // if email confirmation is on, there's no session yet
        if (!data.session) {
          return { error: 'Check your inbox to confirm your email, then sign in.' }
        }
        return { error: null }
      },
      signOut: async () => {
        await supabase!.auth.signOut()
      },
    }
  }, [loading, session])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
