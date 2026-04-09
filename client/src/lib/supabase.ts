import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase 환경 변수가 비어있습니다. Vercel 설정에서 VITE_ 접두사를 붙였는지 확인하세요!");
}

// supabaseApiKey -> supabaseAnonKey로 수정
export const supabase = createClient(supabaseUrl, supabaseAnonKey);