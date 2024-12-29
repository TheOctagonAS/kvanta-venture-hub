import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase konfigurasjon mangler. Vennligst koble til Supabase via integrasjonsmenyen øverst til høyre.');
  throw new Error('Vennligst koble til Supabase via integrasjonsmenyen øverst til høyre for å fortsette.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);