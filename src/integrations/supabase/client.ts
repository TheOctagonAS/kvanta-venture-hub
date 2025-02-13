import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://mxlfzourqcxnmifmxaks.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bGZ6b3VycWN4bm1pZm14YWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MzA2NTYsImV4cCI6MjA1MTAwNjY1Nn0.vc7x5txTMO-pyDkTiQlsqkdi7fHEaRA8RNR0C48bL4I";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);