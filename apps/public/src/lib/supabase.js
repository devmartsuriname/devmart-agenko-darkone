/**
 * Supabase Client for Public Frontend
 * 
 * READ-ONLY data consumption for Creative Agency website.
 * Uses the same Supabase project as the Admin app.
 */
import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials (shared project)
// These are public/anon keys - safe to expose in frontend
const SUPABASE_URL = 'https://pqpgurfagrpwzqzrbmeo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcGd1cmZhZ3Jwd3pxenJibWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NTM1NTMsImV4cCI6MjA4MTMyOTU1M30.qDpIkwSRS_KbB0KCTXoZ6z9Yn9Lc1QaMxHeMMu0oeUE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('[Public Frontend] Supabase client initialized');
