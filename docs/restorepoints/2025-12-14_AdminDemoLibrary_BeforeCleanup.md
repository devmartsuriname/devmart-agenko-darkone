# Restore Point: Admin Demo Library - Before Cleanup

**Date:** 2025-12-14  
**Phase:** Phase 0 - Before Demo Library Creation  
**Purpose:** Capture complete Admin app state before Demo Library implementation

---

## Routes Inventory (45+ routes)

### Auth Routes (authRoutes)
| Path | Name | File |
|------|------|------|
| `/auth/sign-in` | Sign In | `apps/admin/src/app/(other)/auth/sign-in/page.tsx` |
| `/auth/sign-up` | Sign Up | `apps/admin/src/app/(other)/auth/sign-up/page.tsx` |
| `/auth/reset-password` | Reset Password | `apps/admin/src/app/(other)/auth/reset-password/page.tsx` |
| `/auth/lock-screen` | Lock Screen | `apps/admin/src/app/(other)/auth/lock-screen/page.tsx` |

### Error Routes (authRoutes)
| Path | Name | File |
|------|------|------|
| `/error-pages/pages-404` | Error 404 | `apps/admin/src/app/(other)/error-pages/pages-404/page.tsx` |
| `/error-pages/pages-404-alt` | Error 404 Alt | `apps/admin/src/app/(other)/error-pages/pages-404-alt/page.tsx` |

### App Routes (appRoutes) - Protected
| Path | Name | File |
|------|------|------|
| `/` | Dashboard | `apps/admin/src/app/(admin)/dashboards/page.tsx` |
| `/apex-chart` | Apex Chart | `apps/admin/src/app/(admin)/apex-chart/page.tsx` |
| `/base-ui/accordion` | Accordion | `apps/admin/src/app/(admin)/base-ui/accordion/page.tsx` |
| `/base-ui/alerts` | Alerts | `apps/admin/src/app/(admin)/base-ui/alerts/page.tsx` |
| `/base-ui/avatar` | Avatar | `apps/admin/src/app/(admin)/base-ui/avatar/page.tsx` |
| `/base-ui/badges` | Badges | `apps/admin/src/app/(admin)/base-ui/badges/page.tsx` |
| `/base-ui/breadcrumb` | Breadcrumb | `apps/admin/src/app/(admin)/base-ui/breadcrumb/page.tsx` |
| `/base-ui/buttons` | Buttons | `apps/admin/src/app/(admin)/base-ui/buttons/page.tsx` |
| `/base-ui/cards` | Cards | `apps/admin/src/app/(admin)/base-ui/cards/page.tsx` |
| `/base-ui/carousel` | Carousel | `apps/admin/src/app/(admin)/base-ui/carousel/page.tsx` |
| `/base-ui/collapse` | Collapse | `apps/admin/src/app/(admin)/base-ui/collapse/page.tsx` |
| `/base-ui/dropdown` | Dropdown | `apps/admin/src/app/(admin)/base-ui/dropdown/page.tsx` |
| `/base-ui/list-group` | List Group | `apps/admin/src/app/(admin)/base-ui/list-group/page.tsx` |
| `/base-ui/modals` | Modals | `apps/admin/src/app/(admin)/base-ui/modals/page.tsx` |
| `/base-ui/navbar` | Navbar | `apps/admin/src/app/(admin)/base-ui/navbar/page.tsx` |
| `/base-ui/offcanvas` | Offcanvas | `apps/admin/src/app/(admin)/base-ui/offcanvas/page.tsx` |
| `/base-ui/pagination` | Pagination | `apps/admin/src/app/(admin)/base-ui/pagination/page.tsx` |
| `/base-ui/popovers` | Popovers | `apps/admin/src/app/(admin)/base-ui/popovers/page.tsx` |
| `/base-ui/progress` | Progress | `apps/admin/src/app/(admin)/base-ui/progress/page.tsx` |
| `/base-ui/spinners` | Spinners | `apps/admin/src/app/(admin)/base-ui/spinners/page.tsx` |
| `/base-ui/toasts` | Toasts | `apps/admin/src/app/(admin)/base-ui/toasts/page.tsx` |
| `/base-ui/tooltips` | Tooltips | `apps/admin/src/app/(admin)/base-ui/tooltips/page.tsx` |
| `/icons/boxicons` | Boxicons | `apps/admin/src/app/(admin)/icons/boxicons/page.tsx` |
| `/icons/solar` | Solar Icons | `apps/admin/src/app/(admin)/icons/solar/page.tsx` |
| `/forms/basic` | Basic Forms | `apps/admin/src/app/(admin)/forms/basic/page.tsx` |
| `/forms/flatepicker` | Flatpickr | `apps/admin/src/app/(admin)/forms/flatepicker/page.tsx` |
| `/forms/validation` | Validation | `apps/admin/src/app/(admin)/forms/validation/page.tsx` |
| `/forms/file-upload` | File Upload | `apps/admin/src/app/(admin)/forms/file-upload/page.tsx` |
| `/forms/editors` | Editors | `apps/admin/src/app/(admin)/forms/editors/page.tsx` |
| `/tables/basic` | Basic Tables | `apps/admin/src/app/(admin)/tables/basic/page.tsx` |
| `/tables/gridjs` | GridJS Tables | `apps/admin/src/app/(admin)/tables/gridjs/page.tsx` |
| `/maps/google` | Google Maps | `apps/admin/src/app/(admin)/maps/google/page.tsx` |
| `/maps/vector` | Vector Maps | `apps/admin/src/app/(admin)/maps/vector/page.tsx` |
| `/dark-sidenav` | Dark Sidenav | `apps/admin/src/app/(admin)/(layouts)/dark-sidenav/page.tsx` |
| `/dark-topnav` | Dark Topnav | `apps/admin/src/app/(admin)/(layouts)/dark-topnav/page.tsx` |
| `/light` | Light Mode | `apps/admin/src/app/(admin)/(layouts)/light/page.tsx` |
| `/small-sidenav` | Small Sidenav | `apps/admin/src/app/(admin)/(layouts)/small-sidenav/page.tsx` |
| `/rtl` | RTL | `apps/admin/src/app/(admin)/(layouts)/rtl/page.tsx` |

---

## Sidebar/Menu Inventory

**Source:** `apps/admin/src/assets/data/menu-items.ts`

### Main Menu Structure
```
MENU
├── Dashboard (icon: mingcute:home-5-line)
│
├── Base UI (icon: mingcute:widget-5-line) [21 children]
│   ├── Accordions
│   ├── Alerts
│   ├── Avatars
│   ├── Badges
│   ├── Breadcrumb
│   ├── Buttons
│   ├── Cards
│   ├── Carousel
│   ├── Collapse
│   ├── Dropdown
│   ├── List Group
│   ├── Modals
│   ├── Navbar
│   ├── Offcanvas
│   ├── Pagination
│   ├── Popovers
│   ├── Progress
│   ├── Spinners
│   ├── Toasts
│   └── Tooltips
│
├── Charts (icon: mingcute:chart-pie-line)
│   └── Apex Charts
│
├── Forms (icon: mingcute:edit-line)
│   ├── Basic Elements
│   ├── Flatpickr Date-time
│   ├── Form Validation
│   ├── File Uploads
│   └── Editors (Quill)
│
├── Icons (icon: mingcute:seal-fill)
│   ├── Boxicons
│   └── Solar
│
├── Tables (icon: mingcute:table-2-line)
│   ├── Basic
│   └── DataTable (GridJs)
│
├── Maps (icon: mingcute:map-fill)
│   ├── Google Maps
│   └── Vector Maps
│
CUSTOM
├── Authentication (icon: mingcute:user-3-line)
│   ├── Sign In
│   ├── Sign Up
│   ├── Reset Password
│   └── Lock Screen
│
├── Error Pages (icon: mingcute:alert-diamond-line)
│   ├── 404 Page
│   └── 404 Alt Page
│
├── Layouts (icon: mingcute:layout-leftbar-close-line)
│   ├── Dark Side Nav
│   ├── Dark Top Nav
│   ├── Light Mode
│   ├── Small Side Nav
│   └── RTL
│
├── Nested Menu Item (icon: mingcute:menu-fill)
│   ├── Level One
│   │   └── Level Two
│   │       └── Level Three
│
└── Disabled Item (disabled: true)
```

---

## Key Files Inventory

### Layout & Structure
| File | Purpose |
|------|---------|
| `apps/admin/src/layouts/AdminLayout.tsx` | Main admin wrapper |
| `apps/admin/src/layouts/AuthLayout.tsx` | Auth pages wrapper |
| `apps/admin/src/components/layout/VerticalNavigationBar/page.tsx` | Sidebar component |
| `apps/admin/src/components/layout/TopNavigationBar.tsx` | Top navigation |
| `apps/admin/src/components/layout/Footer.tsx` | Footer component |
| `apps/admin/src/routes/index.tsx` | Route definitions |
| `apps/admin/src/routes/router.tsx` | Route rendering |

### Core Components
| File | Purpose |
|------|---------|
| `apps/admin/src/components/PageTitle.tsx` | Page header with breadcrumbs |
| `apps/admin/src/components/ComponentContainerCard.tsx` | Demo section wrapper |
| `apps/admin/src/components/wrapper/IconifyIcon.tsx` | Icon wrapper |

### Theme & Tokens
| File | Purpose |
|------|---------|
| `apps/admin/src/assets/scss/style.scss` | Main stylesheet |
| `apps/admin/src/assets/scss/config/_variables.scss` | Light mode tokens |
| `apps/admin/src/assets/scss/config/_variables-dark.scss` | Dark mode tokens |
| `apps/admin/src/assets/scss/structure/_sidebar.scss` | Sidebar styles |
| `apps/admin/src/assets/scss/structure/_topbar.scss` | Topbar styles |

### Data & Menu
| File | Purpose |
|------|---------|
| `apps/admin/src/assets/data/menu-items.ts` | Sidebar menu definition |
| `apps/admin/src/context/constants.ts` | App constants |

---

## Folder Tree Snapshot

```
apps/admin/src/
├── app/
│   ├── (admin)/
│   │   ├── (layouts)/           # 5 layout variant pages
│   │   ├── apex-chart/          # Charts showcase
│   │   ├── base-ui/             # 21 UI component pages
│   │   ├── dashboards/          # Dashboard page
│   │   ├── forms/               # 5 form pages
│   │   ├── icons/               # 2 icon pages
│   │   ├── maps/                # 2 map pages
│   │   └── tables/              # 2 table pages
│   └── (other)/
│       ├── auth/                # 4 auth pages
│       └── error-pages/         # 2 error pages
├── assets/
│   ├── data/                    # Menu items, demo data
│   ├── images/                  # Static images
│   └── scss/                    # All SCSS files
├── components/
│   ├── layout/                  # Layout components
│   └── wrapper/                 # Utility wrappers
├── context/                     # React contexts
├── helpers/                     # Helper functions
├── hooks/                       # Custom hooks
├── layouts/                     # Layout wrappers
├── routes/                      # Routing
├── types/                       # TypeScript types
└── utils/                       # Utilities
```

---

## Preview Verification

**Status:** ✅ Working  
**Route:** `/auth/sign-in`  
**Verified:** Admin app loads correctly in Lovable preview

---

## Restoration Instructions

If Phase 1 fails, revert using git:
```bash
# Restore to this point
git checkout HEAD~1 -- apps/admin/src/routes/
git checkout HEAD~1 -- apps/admin/src/assets/data/menu-items.ts

# Remove Demo Library files
rm -rf docs/demo-library/
rm -rf apps/admin/src/app/(admin)/demo-library/
rm -rf packages/shared/ui/
```

---

*Created: 2025-12-14 - Phase 0 Restore Point*
