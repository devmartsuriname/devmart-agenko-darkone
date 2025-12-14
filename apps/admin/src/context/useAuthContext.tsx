import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChildrenType } from '@/types/component-props';
import { supabase, getUserRoles, type AppRole } from '@/lib/supabase';
import type { UserProfile, AuthUser } from '@/types/auth';

export type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: ChildrenType) {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile and roles
  const fetchUserData = async (authUser: User): Promise<AuthUser | null> => {
    try {
      // Fetch profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // Fetch roles (deferred to avoid deadlock)
      const roles = await getUserRoles(authUser.id);

      return {
        id: authUser.id,
        email: authUser.email || '',
        full_name: profile?.full_name || null,
        avatar_url: profile?.avatar_url || null,
        roles,
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return {
        id: authUser.id,
        email: authUser.email || '',
        full_name: null,
        avatar_url: null,
        roles: [],
      };
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        // Synchronous state updates only
        setSession(newSession);
        
        if (newSession?.user) {
          // Defer data fetching to avoid deadlock
          setTimeout(() => {
            fetchUserData(newSession.user).then(setUser);
          }, 0);
        } else {
          setUser(null);
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      if (existingSession?.user) {
        fetchUserData(existingSession.user).then((userData) => {
          setUser(userData);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    navigate('/auth/sign-in');
  };

  const refreshUser = async () => {
    if (session?.user) {
      const userData = await fetchUserData(session.user);
      setUser(userData);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!session,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
