/**
 * Supabase Client for Admin App
 * 
 * Environment Variables Required:
 * - VITE_SUPABASE_URL: Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Supabase anon/public key
 * 
 * These are loaded from the root .env file via Vite's envDir config.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Defensive guard: prevent client creation with missing credentials
if (!SUPABASE_URL) {
  console.error('CRITICAL: VITE_SUPABASE_URL is not configured. Check root .env file and Vite envDir setting.');
  throw new Error('Supabase URL is required. Please configure VITE_SUPABASE_URL in your environment.');
}

if (!SUPABASE_ANON_KEY) {
  console.error('CRITICAL: VITE_SUPABASE_ANON_KEY is not configured. Check root .env file and Vite envDir setting.');
  throw new Error('Supabase Anon Key is required. Please configure VITE_SUPABASE_ANON_KEY in your environment.');
}

console.log('[Supabase] Client initialized successfully');

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Type for app roles
export type AppRole = 'admin' | 'editor' | 'viewer';

// Helper to get user roles
export async function getUserRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await supabase.rpc('get_user_roles', { _user_id: userId });
  if (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }
  return (data as AppRole[]) || [];
}

// Helper to check if user has a specific role
export async function hasRole(userId: string, role: AppRole): Promise<boolean> {
  const { data, error } = await supabase.rpc('has_role', { _user_id: userId, _role: role });
  if (error) {
    console.error('Error checking role:', error);
    return false;
  }
  return data === true;
}
