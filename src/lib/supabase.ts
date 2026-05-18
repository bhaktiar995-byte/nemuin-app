import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://syxlqiuylwhyzzkkwwlv.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_ZkPLix3_LVd2DMRhQi5jLA_Xb68hoik';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);