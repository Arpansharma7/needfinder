import { createClient } from '@supabase/supabase-js';

// Cache bust comment to force Next.js to recompile this file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://unconfigured-supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'unconfigured_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
