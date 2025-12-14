import { Navigate, Route, Routes, type RouteProps } from 'react-router-dom'
import AdminLayout from '@/layouts/AdminLayout'
import AuthLayout from '@/layouts/AuthLayout'
import { appRoutes, authRoutes, catchAllRoute } from '@/routes/index'
import { useAuthContext } from '@/context/useAuthContext'

const AppRouter = (props: RouteProps) => {
  const { isAuthenticated } = useAuthContext()
  return (
    <Routes>
      {/* Auth routes (sign-in, sign-up, etc.) - no auth required */}
      {(authRoutes || []).map((route, idx) => (
        <Route key={idx + route.name} path={route.path} element={<AuthLayout {...props}>{route.element}</AuthLayout>} />
      ))}

      {/* App routes - auth required */}
      {(appRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={
            isAuthenticated ? (
              <AdminLayout {...props}>{route.element}</AdminLayout>
            ) : (
              <Navigate
                to={{
                  pathname: '/auth/sign-in',
                  search: 'redirectTo=' + route.path,
                }}
              />
            )
          }
        />
      ))}

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
  )
}

export default AppRouter
