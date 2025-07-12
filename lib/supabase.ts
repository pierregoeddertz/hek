import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables are not configured. Database features will be disabled.');
}

// Create a mock client that implements the Supabase query builder pattern
const createMockClient = () => {
  const createMockQueryBuilder = () => {
    let queryChain: any = {
      select: () => queryChain,
      insert: () => queryChain,
      update: () => queryChain,
      delete: () => queryChain,
      eq: () => queryChain,
      order: () => queryChain,
      limit: () => queryChain,
      single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    };

    // Make the query chain thenable (Promise-like)
    queryChain.then = (resolve: any) => {
      resolve({ data: [], error: null });
    };

    return queryChain;
  };

  return {
    from: () => createMockQueryBuilder(),
    auth: {
      signIn: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
  };
};

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

export const isSupabaseEnabled = isSupabaseConfigured; 