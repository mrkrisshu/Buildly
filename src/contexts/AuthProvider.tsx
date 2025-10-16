'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseClient, User } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isPro: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  updateProStatus: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    
    const client = getSupabaseClient();
    if (!client) {
      setLoading(false);
      return;
    }

    // Get initial session
    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session ? ((session as any).user as User) : null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session ? ((session as any).user as User) : null);
      setLoading(false);
    });

    // Check for stored pro status only on client side
    if (typeof window !== 'undefined') {
      const storedProStatus = localStorage.getItem('isPro');
      if (storedProStatus === 'true') {
        setIsPro(true);
      }
    }

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return { error: { message: 'Authentication service not available' } };
    }
    
    const { error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return { error: { message: 'Authentication service not available' } };
    }
    
    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    const client = getSupabaseClient();
    if (!client) return;
    await client.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return { error: { message: 'Authentication service not available' } };
    }
    
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : '',
    });

    return { error };
  };

  const updateProStatus = (status: boolean) => {
    setIsPro(status);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isPro', status.toString());
    }
  };

  const value = {
    user,
    session,
    loading,
    isPro,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}