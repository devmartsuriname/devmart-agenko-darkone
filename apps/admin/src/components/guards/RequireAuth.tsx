import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext, type AuthContextType } from '@/context/useAuthContext';
import type { AppRole } from '@/lib/supabase';
import FallbackLoading from '@/components/FallbackLoading';

type RequireAuthProps = {
  children: React.ReactNode;
  requiredRoles?: AppRole[];
};

/**
 * RequireAuth Component
 * 
 * Wraps protected routes with authentication and role-based access control.
 * 
 * Behavior:
 * - Loading state → Shows FallbackLoading
 * - Unauthenticated → Redirects to /auth/sign-in with redirectTo param
 * - Authenticated but missing role → Redirects to /error-pages/pages-404 (NOT login)
 * - Authenticated with role → Renders children
 * 
 * @param requiredRoles - Optional array of roles. User must have at least one.
 *                        If empty/undefined, only authentication is required.
 */
export function RequireAuth({ children, requiredRoles }: RequireAuthProps) {
  const { authState, hasAnyRole } = useAuthContext();
  const location = useLocation();

  // Still loading auth state
  if (authState === 'loading') {
    return <FallbackLoading />;
  }

  // Not authenticated → redirect to sign-in
  if (authState === 'unauthenticated') {
    return (
      <Navigate
        to={{
          pathname: '/auth/sign-in',
          search: `redirectTo=${encodeURIComponent(location.pathname)}`,
        }}
        replace
      />
    );
  }

  // Authenticated but role check required
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = hasAnyRole(requiredRoles);
    
    // No required role → redirect to 404 (NOT login)
    if (!hasRequiredRole) {
      return <Navigate to="/error-pages/pages-404" replace />;
    }
  }

  // Authenticated (and has role if required) → render children
  return <>{children}</>;
}

/**
 * RequireGuest Component
 * 
 * Wraps auth pages (sign-in, sign-up) to redirect authenticated users away.
 * 
 * Behavior:
 * - Loading state → Shows FallbackLoading
 * - Authenticated → Redirects to /dashboards
 * - Unauthenticated → Renders children
 */
export function RequireGuest({ children }: { children: React.ReactNode }) {
  const { authState } = useAuthContext();

  // Still loading auth state
  if (authState === 'loading') {
    return <FallbackLoading />;
  }

  // Authenticated → redirect to dashboard
  if (authState === 'authenticated') {
    return <Navigate to="/dashboards" replace />;
  }

  // Unauthenticated → render children
  return <>{children}</>;
}

// =============================================================================
// ROUTE ROLE REQUIREMENTS
// Define which roles can access which route prefixes
// =============================================================================

export type RouteRoleConfig = {
  pathPrefix: string;
  roles: AppRole[];
};

/**
 * Route Role Requirements
 * 
 * Defines access control for route groups:
 * - /system/* → admin only
 * - /content/* → admin + editor
 * - /crm/* → admin + editor
 * - /marketing/* → admin + editor
 * - /dashboards → all authenticated (no role restriction)
 */
export const ROUTE_ROLE_REQUIREMENTS: RouteRoleConfig[] = [
  { pathPrefix: '/system', roles: ['admin'] },
  { pathPrefix: '/content', roles: ['admin', 'editor'] },
  { pathPrefix: '/crm', roles: ['admin', 'editor'] },
  { pathPrefix: '/marketing', roles: ['admin', 'editor'] },
  // /dashboards has no entry = any authenticated user
];

/**
 * Get required roles for a given path
 * Returns undefined if no role restriction (any authenticated user can access)
 */
export function getRequiredRolesForPath(path: string): AppRole[] | undefined {
  for (const config of ROUTE_ROLE_REQUIREMENTS) {
    if (path.startsWith(config.pathPrefix)) {
      return config.roles;
    }
  }
  return undefined; // No role restriction
}
