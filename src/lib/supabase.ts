import { createClient } from '@supabase/supabase-js'
import { Session } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// User registration data type
interface UserRegistrationData {
  username?: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  [key: string]: unknown
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Auth helpers
export const auth = {
  signUp: async (
    email: string,
    password: string,
    userData?: UserRegistrationData
  ) => {
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

  onAuthStateChange: (
    callback: (event: string, session: Session | null) => void
  ) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// Database operations are now handled by the backend API
// Use the apiClient from './api-client' for all database operations

export default supabase
