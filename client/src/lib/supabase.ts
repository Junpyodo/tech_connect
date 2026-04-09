import { createClient } from '@supabase/supabase-js';

// Vercel 환경변수에서 가져오기 (Vite 프로젝트라면 VITE_ 접두사가 필요할 수 있습니다)
const supabaseUrl = import.meta.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.SUPABASE_API_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Key is missing. Check your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseApiKey);
