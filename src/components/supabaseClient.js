// src/components/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yxfzbjtgzdzilleajfzc.supabase.co' // ← bunu öz URL-inlə əvəz et
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4ZnpianRnemR6aWxsZWFqZnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjc5ODEsImV4cCI6MjA1OTk0Mzk4MX0.IHs-kBCmQJyygIjBWg0Chg_dVDQkXC-mPPUsLbrBJBM' // ← buraya `anon` key-ni qoy

export const supabase = createClient(supabaseUrl, supabaseKey)
