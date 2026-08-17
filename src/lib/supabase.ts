import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || '';
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if both URL and key are provided and not placeholder values
export const supabase = (url && anonKey && anonKey !== 'PASTE_YOUR_ANON_KEY_HERE')
  ? createClient(url, anonKey, {
    auth: { persistSession: false },
  })
  : null;
