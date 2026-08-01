import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase keys from LocalStorage (or env vars)
const getSupabaseConfig = () => {
  const url = localStorage.getItem('hub_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '';
  const key = localStorage.getItem('hub_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return { url, key };
};

const { url, key } = getSupabaseConfig();

export const isLiveSupabase = Boolean(url && key);
export const supabase = isLiveSupabase ? createClient(url, key) : null;

export const saveSupabaseCredentials = (newUrl, newKey) => {
  if (newUrl && newKey) {
    localStorage.setItem('hub_supabase_url', newUrl);
    localStorage.setItem('hub_supabase_key', newKey);
  } else {
    localStorage.removeItem('hub_supabase_url');
    localStorage.removeItem('hub_supabase_key');
  }
  window.location.reload();
};
