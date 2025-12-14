import type { Session, User } from '@supabase/supabase-js';
import type { AppRole } from '@/lib/supabase';

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type AuthUser = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  roles: AppRole[];
};

// Legacy type for compatibility (deprecated - use AuthUser instead)
export type UserType = {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
};

export type { Session, User };
