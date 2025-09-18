// Create a mock client for development when credentials are missing
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Mock implementation that accepts a callback
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signUp: (credentials: any) => Promise.resolve({ data: null, error: { message: 'Authentication not configured' } }),
    signInWithPassword: (credentials: any) => Promise.resolve({ data: null, error: { message: 'Authentication not configured' } }),
    signOut: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: (email: string, options?: any) => Promise.resolve({ error: { message: 'Authentication not configured' } }),
  }
});

// For now, use mock client to avoid Supabase validation issues
console.log('Using mock Supabase client for development');
export const supabase = createMockClient();

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