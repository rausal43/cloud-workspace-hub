import { createClient } from '@supabase/supabase-js';

// Supabase Credentials with production build fallbacks
const SUPABASE_URL_DEFAULT = 'https://papumbyxmywgmgrfoltt.supabase.co';
const SUPABASE_ANON_KEY_DEFAULT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhcHVtYnl4bXl3Z21ncmZvbHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1NzczNDksImV4cCI6MjEwMTE1MzM0OX0.UEg0Ncf_E74JmzTQc-F3zBy-y6xUAw3hur5QGubA6f8';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL_DEFAULT;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY_DEFAULT;

export const isLiveSupabase = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isLiveSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;
