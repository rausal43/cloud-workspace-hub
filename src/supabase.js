import { createClient } from '@supabase/supabase-js';

// Retrieve credentials strictly from environment variables (.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isLiveSupabase = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isLiveSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;
