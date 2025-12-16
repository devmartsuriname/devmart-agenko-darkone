import { lazy } from 'react'
import { Navigate, type RouteProps } from 'react-router-dom'

const Dashboards = lazy(() => import('@/app/(admin)/dashboards/page'))

// Base UI Routes
const Accordions = lazy(() => import('@/app/(admin)/base-ui/accordion/page'))
const Alerts = lazy(() => import('@/app/(admin)/base-ui/alerts/page'))
const Avatars = lazy(() => import('@/app/(admin)/base-ui/avatar/page'))
const Badges = lazy(() => import('@/app/(admin)/base-ui/badge/page'))
const Breadcrumb = lazy(() => import('@/app/(admin)/base-ui/breadcrumb/page'))
const Buttons = lazy(() => import('@/app/(admin)/base-ui/buttons/page'))
const Cards = lazy(() => import('@/app/(admin)/base-ui/cards/page'))
const Carousel = lazy(() => import('@/app/(admin)/base-ui/carousel/page'))
const Collapse = lazy(() => import('@/app/(admin)/base-ui/collapse/page'))
const Dropdowns = lazy(() => import('@/app/(admin)/base-ui/dropdown/page'))
const ListGroup = lazy(() => import('@/app/(admin)/base-ui/list-group/page'))
const Modals = lazy(() => import('@/app/(admin)/base-ui/modals/page'))
const Tabs = lazy(() => import('@/app/(admin)/base-ui/tabs/page'))
const Offcanvas = lazy(() => import('@/app/(admin)/base-ui/offcanvas/page'))
const Pagination = lazy(() => import('@/app/(admin)/base-ui/pagination/page'))
const Placeholders = lazy(() => import('@/app/(admin)/base-ui/placeholders/page'))
const Popovers = lazy(() => import('@/app/(admin)/base-ui/popovers/page'))
const Progress = lazy(() => import('@/app/(admin)/base-ui/progress/page'))
const Spinners = lazy(() => import('@/app/(admin)/base-ui/spinners/page'))
const Toasts = lazy(() => import('@/app/(admin)/base-ui/toasts/page'))
const Tooltips = lazy(() => import('@/app/(admin)/base-ui/tooltips/page'))

// Charts and Maps Routes
const Apex = lazy(() => import('@/app/(admin)/apex-chart/page'))
const GoogleMaps = lazy(() => import('@/app/(admin)/maps/google/page'))
const VectorMaps = lazy(() => import('@/app/(admin)/maps/vector/page'))

// Forms Routes
const Basic = lazy(() => import('@/app/(admin)/forms/basic/page'))
const FlatPicker = lazy(() => import('@/app/(admin)/forms/flat-picker/page'))
const Validation = lazy(() => import('@/app/(admin)/forms/validation/page'))
const FileUploads = lazy(() => import('@/app/(admin)/forms/file-uploads/page'))
const Editors = lazy(() => import('@/app/(admin)/forms/editors/page'))

// Form Routes
const BasicTable = lazy(() => import('@/app/(admin)/tables/basic/page'))
const GridjsTable = lazy(() => import('@/app/(admin)/tables/gridjs/page'))

// Icon Routes
const BoxIcons = lazy(() => import('@/app/(admin)/icons/boxicons/page'))
const SolarIcons = lazy(() => import('@/app/(admin)/icons/solaricons/page'))

// Auth Routes
const AuthSignIn = lazy(() => import('@/app/(other)/auth/sign-in/page'))
const AuthSignUp = lazy(() => import('@/app/(other)/auth/sign-up/page'))
const ResetPassword = lazy(() => import('@/app/(other)/auth/reset-password/page'))
const LockScreen = lazy(() => import('@/app/(other)/auth/lock-screen/page'))
const Error404 = lazy(() => import('@/app/(other)/error-pages/pages-404/page'))
const ErrorAlt = lazy(() => import('@/app/(admin)/pages-404-alt/page'))

// Layouts Routes
const DarkSideNav = lazy(() => import('@/app/(admin)/(layouts)/dark-sidenav/page'))
const DarkTopNav = lazy(() => import('@/app/(admin)/(layouts)/dark-topnav/page'))
const SmallSideNav = lazy(() => import('@/app/(admin)/(layouts)/small-sidenav/page'))
const HiddenSideNav = lazy(() => import('@/app/(admin)/(layouts)/hidden-sidenav/page'))
const DarkMode = lazy(() => import('@/app/(admin)/(layouts)/dark-mode/page'))

// ============================================================================
// CMS PLACEHOLDER ROUTES (PRODUCTION)
// These are the new CMS module routes for production use.
// ============================================================================
const ContentPages = lazy(() => import('@/app/(admin)/content/pages/page'))
const ContentBlog = lazy(() => import('@/app/(admin)/content/blog/page'))
const ContentProjects = lazy(() => import('@/app/(admin)/content/projects/page'))
const ContentServices = lazy(() => import('@/app/(admin)/content/services/page'))
const ContentTeam = lazy(() => import('@/app/(admin)/content/team/page'))
const ContentTestimonials = lazy(() => import('@/app/(admin)/content/testimonials/page'))
const ContentAwards = lazy(() => import('@/app/(admin)/content/awards/page'))
const ContentFaqs = lazy(() => import('@/app/(admin)/content/faqs/page'))
const ContentMedia = lazy(() => import('@/app/(admin)/content/media/page'))
const CrmClients = lazy(() => import('@/app/(admin)/crm/clients/page'))
const CrmPartners = lazy(() => import('@/app/(admin)/crm/partners/page'))
const CrmContactSubmissions = lazy(() => import('@/app/(admin)/crm/contact-submissions/page'))
const MarketingNewsletter = lazy(() => import('@/app/(admin)/marketing/newsletter/page'))
const MarketingSeo = lazy(() => import('@/app/(admin)/marketing/seo/page'))
const SystemUsers = lazy(() => import('@/app/(admin)/system/users/page'))
const SystemRoles = lazy(() => import('@/app/(admin)/system/roles/page'))
const SystemSettings = lazy(() => import('@/app/(admin)/system/settings/page'))
const SystemAuditLogs = lazy(() => import('@/app/(admin)/system/audit-logs/page'))

// ============================================================================
// DEV ONLY — DO NOT SHIP
// Demo Library routes are conditionally loaded only in development builds.
// In production: demoLibraryRoutes = [] (empty array, routes do not exist)
// Production safety: navigating to /demo-library/* results in 404
// ============================================================================
const DemoLibraryIndex = import.meta.env.DEV ? lazy(() => import('@/app/(admin)/demo-library/page')) : null
const DemoLibraryCharts = import.meta.env.DEV ? lazy(() => import('@/app/(admin)/demo-library/charts/page')) : null
const DemoLibraryForms = import.meta.env.DEV ? lazy(() => import('@/app/(admin)/demo-library/forms/page')) : null
const DemoLibraryTables = import.meta.env.DEV ? lazy(() => import('@/app/(admin)/demo-library/tables/page')) : null
const DemoLibraryIcons = import.meta.env.DEV ? lazy(() => import('@/app/(admin)/demo-library/icons/page')) : null
const DemoLibraryModalsToasts = import.meta.env.DEV ? lazy(() => import('@/app/(admin)/demo-library/modals-toasts/page')) : null
const DemoLibraryLayouts = import.meta.env.DEV ? lazy(() => import('@/app/(admin)/demo-library/layouts/page')) : null

export type RoutesProps = {
  path: RouteProps['path']
  name: string
  element: RouteProps['element']
  exact?: boolean
}

const initialRoutes: RoutesProps[] = [
  {
    path: '/',
    name: 'root',
    element: <Navigate to="/dashboards" />,
  },
]

const generalRoutes: RoutesProps[] = [
  {
    path: '/dashboards',
    name: 'Dashboards',
    element: <Dashboards />,
  },
]

// ============================================================================
// CMS MODULE ROUTES (PRODUCTION)
// These routes are always available in both DEV and PROD.
// ============================================================================
const cmsRoutes: RoutesProps[] = [
  // Content
  {
    path: '/content/pages',
    name: 'Content - Pages',
    element: <ContentPages />,
  },
  {
    path: '/content/blog',
    name: 'Content - Blog',
    element: <ContentBlog />,
  },
  {
    path: '/content/projects',
    name: 'Content - Projects',
    element: <ContentProjects />,
  },
  {
    path: '/content/services',
    name: 'Content - Services',
    element: <ContentServices />,
  },
  {
    path: '/content/team',
    name: 'Content - Team',
    element: <ContentTeam />,
  },
  {
    path: '/content/testimonials',
    name: 'Content - Testimonials',
    element: <ContentTestimonials />,
  },
  {
    path: '/content/awards',
    name: 'Content - Awards',
    element: <ContentAwards />,
  },
  {
    path: '/content/faqs',
    name: 'Content - FAQs',
    element: <ContentFaqs />,
  },
  {
    path: '/content/media',
    name: 'Content - Media',
    element: <ContentMedia />,
  },
  // CRM
  {
    path: '/crm/clients',
    name: 'CRM - Clients',
    element: <CrmClients />,
  },
  {
    path: '/crm/partners',
    name: 'CRM - Partners',
    element: <CrmPartners />,
  },
  {
    path: '/crm/contact-submissions',
    name: 'CRM - Contact Submissions',
    element: <CrmContactSubmissions />,
  },
  // Marketing
  {
    path: '/marketing/newsletter',
    name: 'Marketing - Newsletter',
    element: <MarketingNewsletter />,
  },
  {
    path: '/marketing/seo',
    name: 'Marketing - SEO',
    element: <MarketingSeo />,
  },
  // System
  {
    path: '/system/users',
    name: 'System - Users',
    element: <SystemUsers />,
  },
  {
    path: '/system/roles',
    name: 'System - Roles',
    element: <SystemRoles />,
  },
  {
    path: '/system/settings',
    name: 'System - Settings',
    element: <SystemSettings />,
  },
  {
    path: '/system/audit-logs',
    name: 'System - Audit Logs',
    element: <SystemAuditLogs />,
  },
]

export const authRoutes: RoutesProps[] = [
  {
    name: 'Sign In',
    path: '/auth/sign-in',
    element: <AuthSignIn />,
  },
  {
    name: 'Sign Up',
    path: '/auth/sign-up',
    element: <AuthSignUp />,
  },
  {
    name: 'Reset Password',
    path: '/auth/reset-password',
    element: <ResetPassword />,
  },
  {
    name: 'Lock Screen',
    path: '/auth/lock-screen',
    element: <LockScreen />,
  },
  {
    name: '404 Error',
    path: '/error-pages/pages-404',
    element: <Error404 />,
  },
]

const baseUIRoutes: RoutesProps[] = [
  {
    name: 'Accordions',
    path: '/base-ui/accordion',
    element: <Accordions />,
  },
  {
    name: 'Alerts',
    path: '/base-ui/alerts',
    element: <Alerts />,
  },
  {
    name: 'Avatars',
    path: '/base-ui/avatar',
    element: <Avatars />,
  },
  {
    name: 'Badges',
    path: '/base-ui/badge',
    element: <Badges />,
  },
  {
    name: 'Breadcrumb',
    path: '/base-ui/breadcrumb',
    element: <Breadcrumb />,
  },
  {
    name: 'Buttons',
    path: '/base-ui/buttons',
    element: <Buttons />,
  },
  {
    name: 'Cards',
    path: '/base-ui/cards',
    element: <Cards />,
  },
  {
    name: 'Carousel',
    path: '/base-ui/carousel',
    element: <Carousel />,
  },
  {
    name: 'Collapse',
    path: '/base-ui/collapse',
    element: <Collapse />,
  },
  {
    name: 'Dropdowns',
    path: '/base-ui/dropdown',
    element: <Dropdowns />,
  },
  {
    name: 'List Group',
    path: '/base-ui/list-group',
    element: <ListGroup />,
  },
  {
    name: 'Modals',
    path: '/base-ui/modals',
    element: <Modals />,
  },
  {
    name: 'Tabs',
    path: '/base-ui/tabs',
    element: <Tabs />,
  },
  {
    name: 'Offcanvas',
    path: '/base-ui/offcanvas',
    element: <Offcanvas />,
  },
  {
    name: 'Pagination',
    path: '/base-ui/pagination',
    element: <Pagination />,
  },
  {
    name: 'Placeholders',
    path: '/base-ui/placeholders',
    element: <Placeholders />,
  },
  {
    name: 'Popovers',
    path: '/base-ui/popovers',
    element: <Popovers />,
  },
  {
    name: 'Progress',
    path: '/base-ui/progress',
    element: <Progress />,
  },
  {
    name: 'Spinners',
    path: '/base-ui/spinners',
    element: <Spinners />,
  },
  {
    name: 'Toasts',
    path: '/base-ui/toasts',
    element: <Toasts />,
  },
  {
    name: 'Tooltips',
    path: '/base-ui/tooltips',
    element: <Tooltips />,
  },
]

const chartsMapsRoutes: RoutesProps[] = [
  {
    path: '/apex-chart',
    name: 'Apex charts',
    element: <Apex />,
  },
  {
    name: 'google',
    path: '/maps/google',
    element: <GoogleMaps />,
  },
  {
    name: 'vectore',
    path: '/maps/vector',
    element: <VectorMaps />,
  },
  {
    name: '404 Error',
    path: '/pages-404-alt',
    element: <ErrorAlt />,
  },
]

const formsRoutes: RoutesProps[] = [
  {
    name: 'Basic Elements',
    path: '/forms/basic',
    element: <Basic />,
  },
  {
    name: 'Flat Picker',
    path: '/forms/flat-picker',
    element: <FlatPicker />,
  },
  {
    name: 'Validation',
    path: '/forms/validation',
    element: <Validation />,
  },
  {
    name: 'File Uploads',
    path: '/forms/file-uploads',
    element: <FileUploads />,
  },
  {
    name: 'Editors',
    path: '/forms/editors',
    element: <Editors />,
  },
]

const tableRoutes: RoutesProps[] = [
  {
    name: 'Basic Tables',
    path: '/tables/basic',
    element: <BasicTable />,
  },
  {
    name: 'Grid JS',
    path: '/tables/gridjs',
    element: <GridjsTable />,
  },
]

const iconRoutes: RoutesProps[] = [
  {
    name: 'Boxicons',
    path: '/icons/boxicons',
    element: <BoxIcons />,
  },
  {
    name: 'SolarIcon',
    path: '/icons/solaricons',
    element: <SolarIcons />,
  },
]

const layoutsRoutes: RoutesProps[] = [
  {
    name: 'dark sidenav',
    path: '/dark-sidenav',
    element: <DarkSideNav />,
  },
  {
    name: 'dark topnav',
    path: '/dark-topnav',
    element: <DarkTopNav />,
  },
  {
    name: 'small sidenav',
    path: '/small-sidenav',
    element: <SmallSideNav />,
  },
  {
    name: 'hidden sidenav',
    path: '/hidden-sidenav',
    element: <HiddenSideNav />,
  },
  {
    name: 'dark mode',
    path: '/dark-mode',
    element: <DarkMode />,
  },
]

// ============================================================================
// DEV ONLY — DO NOT SHIP
// Demo Library routes: empty array in production, populated only in DEV
// Condition: import.meta.env.DEV (Vite environment variable)
// Production behavior: routes don't exist → 404 via catch-all or missing route
// ============================================================================
const demoLibraryRoutes: RoutesProps[] = import.meta.env.DEV && DemoLibraryIndex ? [
  {
    path: '/demo-library',
    name: 'Demo Library',
    element: <DemoLibraryIndex />,
  },
  {
    path: '/demo-library/charts',
    name: 'Demo Library - Charts',
    element: <DemoLibraryCharts />,
  },
  {
    path: '/demo-library/forms',
    name: 'Demo Library - Forms',
    element: <DemoLibraryForms />,
  },
  {
    path: '/demo-library/tables',
    name: 'Demo Library - Tables',
    element: <DemoLibraryTables />,
  },
  {
    path: '/demo-library/icons',
    name: 'Demo Library - Icons',
    element: <DemoLibraryIcons />,
  },
  {
    path: '/demo-library/modals-toasts',
    name: 'Demo Library - Modals & Toasts',
    element: <DemoLibraryModalsToasts />,
  },
  {
    path: '/demo-library/layouts',
    name: 'Demo Library - Layouts',
    element: <DemoLibraryLayouts />,
  },
] : []

// ============================================================================
// CATCH-ALL 404 ROUTE (exported separately for router to handle WITHOUT auth)
// Must be rendered last. Unknown paths show 404 page, not login redirect.
// This ensures /demo-library/* (and any other unknown route) shows 404 in PROD.
// ============================================================================
export const catchAllRoute: RoutesProps = {
  path: '*',
  name: '404 Catch-All',
  element: <Error404 />,
}

export const appRoutes = [
  ...initialRoutes,
  ...generalRoutes,
  ...cmsRoutes, // CMS module routes (PRODUCTION)
  ...baseUIRoutes,
  ...formsRoutes,
  ...chartsMapsRoutes,
  ...layoutsRoutes,
  ...tableRoutes,
  ...iconRoutes,
  ...demoLibraryRoutes, // DEV ONLY — empty in production
  // NOTE: catchAllRoute is NOT included here - router handles it separately
]
