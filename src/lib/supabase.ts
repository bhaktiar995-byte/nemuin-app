import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing. Check your environment variables.');
}

/**
 * Supabase client for client-side and server-side usage.
 * Note: For production, ensure Row Level Security (RLS) is enabled in Supabase.
 */
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
