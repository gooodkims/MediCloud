import { createClient } from '@supabase/supabase-js';

// 킴스님, 아래 URL과 Anon Key는 Supabase 대시보드(Settings > API)에서 확인하여 교체해 주세요.
const supabaseUrl = 'https://tiuagrgpklegqbtinjrx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpdWFncmdwa2xlZ3FidGluanJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NjA2NzUsImV4cCI6MjA4NTMzNjY3NX0.i1cWV3ywPrxi7at2hyVydQRAAVK88ERoDVGbA2z0nk8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
