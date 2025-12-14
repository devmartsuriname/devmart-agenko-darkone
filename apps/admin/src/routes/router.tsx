import { Navigate, Route, Routes, type RouteProps } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';
import { appRoutes, authRoutes, catchAllRoute } from '@/routes/index';
import { useAuthContext } from '@/context/useAuthContext';
import { RequireAuth, RequireGuest, getRequiredRolesForPath } from '@/components/guards/RequireAuth';
import FallbackLoading from '@/components/FallbackLoading';

const AppRouter = (props: RouteProps) => {
  const { authState } = useAuthContext();

  // Show loading state while checking auth
  if (authState === 'loading') {
    return <FallbackLoading />;
  }

  return (
    <Routes>
      {/* Auth routes (sign-in, sign-up, etc.) - no auth required */}
      {/* Redirect authenticated users away from auth pages */}
      {(authRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={
            route.path === '/auth/sign-in' || route.path === '/auth/sign-up' ? (
              <RequireGuest>
                <AuthLayout {...props}>{route.element}</AuthLayout>
              </RequireGuest>
            ) : (
              <AuthLayout {...props}>{route.element}</AuthLayout>
            )
          }
        />
      ))}

      {/* App routes - auth required with RBAC */}
      {(appRoutes || []).map((route, idx) => {
        const requiredRoles = getRequiredRolesForPath(route.path || '');
        
        return (
          <Route
            key={idx + route.name}
            path={route.path}
            element={
              <RequireAuth requiredRoles={requiredRoles}>
                <AdminLayout {...props}>{route.element}</AdminLayout>
              </RequireAuth>
            }
          />
        );
      })}

      {/* 
        CATCH-ALL 404 ROUTE (no auth required)
        Must be last. Unknown paths show 404 page, not login redirect.
        This ensures /demo-library/* shows 404 in production (not login).
      */}
      <Route
        key="catch-all-404"
        path={catchAllRoute.path}
        element={<AuthLayout {...props}>{catchAllRoute.element}</AuthLayout>}
      />
    </Routes>
  );
};

export default AppRouter;
