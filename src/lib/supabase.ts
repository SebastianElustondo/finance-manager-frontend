import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  getSession: async () => {
    return await supabase.auth.getSession()
  },

  getUser: async () => {
    return await supabase.auth.getUser()
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// Database helpers
export const db = {
  // Portfolios
  getPortfolios: async (userId: string) => {
    return await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  createPortfolio: async (portfolio: any) => {
    return await supabase
      .from('portfolios')
      .insert([portfolio])
      .select()
      .single()
  },

  updatePortfolio: async (id: string, updates: any) => {
    return await supabase
      .from('portfolios')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
  },

  deletePortfolio: async (id: string) => {
    return await supabase
      .from('portfolios')
      .delete()
      .eq('id', id)
  },

  // Assets
  getAssets: async (portfolioId: string) => {
    return await supabase
      .from('assets')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('created_at', { ascending: false })
  },

  createAsset: async (asset: any) => {
    return await supabase
      .from('assets')
      .insert([asset])
      .select()
      .single()
  },

  updateAsset: async (id: string, updates: any) => {
    return await supabase
      .from('assets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
  },

  deleteAsset: async (id: string) => {
    return await supabase
      .from('assets')
      .delete()
      .eq('id', id)
  },

  // Alerts
  getAlerts: async (userId: string) => {
    return await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  createAlert: async (alert: any) => {
    return await supabase
      .from('alerts')
      .insert([alert])
      .select()
      .single()
  },

  updateAlert: async (id: string, updates: any) => {
    return await supabase
      .from('alerts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
  },

  deleteAlert: async (id: string) => {
    return await supabase
      .from('alerts')
      .delete()
      .eq('id', id)
  },
}

export default supabase 