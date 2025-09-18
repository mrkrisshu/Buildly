import { createClient } from '@supabase/supabase-js';

// Create a function to get the supabase client safely
export const getSupabaseClient = () => {
  // Only run on client side
  if (typeof window === 'undefined') {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_url' || supabaseAnonKey === 'your_supabase_anon_key') {
    console.warn('Supabase environment variables are not set. Authentication features will be disabled.');
    return null;
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
    return null;
  }
};

// Export the client for backward compatibility - lazy initialization
export const supabase = null; // Will be initialized when getSupabaseClient() is called

export type User = {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
};

export type AuthError = {
  message: string;
  status?: number;
};