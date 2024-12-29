import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = getSupabaseClient();