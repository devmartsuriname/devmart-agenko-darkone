/**
 * Supabase Client for Admin App
 * 
 * Environment Variables Required:
 * - VITE_SUPABASE_URL: Supabase project URL
 * - VITE_SUPABASE_PUBLISHABLE_KEY: Supabase anon/public key
 * 
 * These are already set in the root .env file.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Check .env file.');
}

export const supabase = createClient(
  SUPABASE_URL || '',
  SUPABASE_ANON_KEY || '',
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
