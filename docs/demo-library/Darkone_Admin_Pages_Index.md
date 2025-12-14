# Darkone Admin Pages Index

> **⚠️ DEV ONLY — DO NOT SHIP**
> 
> Maps all admin pages to their Demo Library Registry IDs.

## Quick Reference

| Page | Route | Registry ID | Reuse Mode |
|------|-------|-------------|------------|
| Dashboard | `/` | `dashboard__main_page` | REFERENCE_ONLY |
| Apex Charts | `/apex-chart` | `charts__apex_all` | REFERENCE_ONLY |
| Accordion | `/base-ui/accordion` | `base-ui__accordion` | REFERENCE_ONLY |
| Alerts | `/base-ui/alerts` | `base-ui__alerts` | REFERENCE_ONLY |
| Avatars | `/base-ui/avatar` | `base-ui__avatars` | REFERENCE_ONLY |
| Badges | `/base-ui/badges` | `base-ui__badges` | REFERENCE_ONLY |
| Breadcrumb | `/base-ui/breadcrumb` | `base-ui__breadcrumb` | REFERENCE_ONLY |
| Buttons | `/base-ui/buttons` | `base-ui__buttons` | REFERENCE_ONLY |
| Cards | `/base-ui/cards` | `base-ui__cards` | REFERENCE_ONLY |
| Carousel | `/base-ui/carousel` | `base-ui__carousel` | REFERENCE_ONLY |
| Collapse | `/base-ui/collapse` | `base-ui__collapse` | REFERENCE_ONLY |
| Dropdown | `/base-ui/dropdown` | `base-ui__dropdown` | REFERENCE_ONLY |
| List Group | `/base-ui/list-group` | `base-ui__list_group` | REFERENCE_ONLY |
| Modals | `/base-ui/modals` | `base-ui__modals` | COPY_SNIPPET |
| Navbar | `/base-ui/navbar` | `base-ui__navbar` | REFERENCE_ONLY |
| Offcanvas | `/base-ui/offcanvas` | `base-ui__offcanvas` | COPY_SNIPPET |
| Pagination | `/base-ui/pagination` | `base-ui__pagination` | REFERENCE_ONLY |
| Popovers | `/base-ui/popovers` | `base-ui__popovers` | REFERENCE_ONLY |
| Progress | `/base-ui/progress` | `base-ui__progress` | REFERENCE_ONLY |
| Spinners | `/base-ui/spinners` | `base-ui__spinners` | REFERENCE_ONLY |
| Toasts | `/base-ui/toasts` | `base-ui__toasts` | COPY_SNIPPET |
| Tooltips | `/base-ui/tooltips` | `base-ui__tooltips` | REFERENCE_ONLY |
| Boxicons | `/icons/boxicons` | `icons__boxicons` | REFERENCE_ONLY |
| Solar Icons | `/icons/solar` | `icons__solar` | REFERENCE_ONLY |
| Basic Forms | `/forms/basic` | `forms__basic_inputs` | REFERENCE_ONLY |
| Flatpickr | `/forms/flatepicker` | `forms__flatpickr_datetime` | COPY_SNIPPET |
| Validation | `/forms/validation` | `forms__validation` | COPY_SNIPPET |
| File Upload | `/forms/file-upload` | `forms__file_upload` | COPY_SNIPPET |
| Editors | `/forms/editors` | `forms__quill_editor` | COPY_SNIPPET |
| Basic Tables | `/tables/basic` | `tables__basic` | REFERENCE_ONLY |
| GridJS Tables | `/tables/gridjs` | `tables__gridjs_datatable` | COPY_SNIPPET |
| Google Maps | `/maps/google` | `maps__google` | REFERENCE_ONLY |
| Vector Maps | `/maps/vector` | `maps__vector` | REFERENCE_ONLY |
| Sign In | `/auth/sign-in` | `auth__sign_in` | REFERENCE_ONLY |
| Sign Up | `/auth/sign-up` | `auth__sign_up` | REFERENCE_ONLY |
| Reset Password | `/auth/reset-password` | `auth__reset_password` | REFERENCE_ONLY |
| Lock Screen | `/auth/lock-screen` | `auth__lock_screen` | REFERENCE_ONLY |
| 404 Page | `/error-pages/pages-404` | `empty-states__404` | REFERENCE_ONLY |
| 404 Alt | `/error-pages/pages-404-alt` | `empty-states__404_alt` | REFERENCE_ONLY |

---

## By Category

### Layout Components

| Registry ID | Component | Reuse Mode |
|-------------|-----------|------------|
| `layout__admin_wrapper` | AdminLayout | REUSE_COMPONENT |
| `layout__auth_wrapper` | AuthLayout | REUSE_COMPONENT |
| `layout__page_title` | PageTitle | REUSE_COMPONENT |
| `layout__component_container` | ComponentContainerCard | REUSE_COMPONENT |
| `layout__iconify_wrapper` | IconifyIcon | REUSE_COMPONENT |

### Navigation

| Registry ID | Component | Reuse Mode |
|-------------|-----------|------------|
| `navigation__vertical_sidebar` | VerticalNavigationBar | REFERENCE_ONLY |
| `navigation__top_bar` | TopNavigationBar | REFERENCE_ONLY |

### Dashboard

| Registry ID | Component | Reuse Mode |
|-------------|-----------|------------|
| `dashboard__main_page` | Dashboard Page | REFERENCE_ONLY |
| `dashboard__stat_cards` | Stat Cards | COPY_SNIPPET |

### Charts (COPY_SNIPPET)

| Registry ID | Chart Type |
|-------------|------------|
| `charts__line_basic` | Basic Line |
| `charts__line_data_labels` | Line with Data Labels |
| `charts__line_zoomable` | Zoomable Time Series |
| `charts__area_basic` | Basic Area |
| `charts__area_stacked` | Stacked Area |
| `charts__column_basic` | Basic Column |
| `charts__column_stacked` | Stacked Column |
| `charts__bar_basic` | Basic Bar |
| `charts__mixed_line_area` | Mixed Line & Area |
| `charts__pie_basic` | Basic Pie |
| `charts__donut_basic` | Basic Donut |
| `charts__radial_basic` | Basic Radial |
| `charts__candlestick` | Candlestick |
| `charts__scatter_basic` | Basic Scatter |
| `charts__heatmap` | Heatmap |
| `charts__treemap` | Treemap |
| `charts__sparkline` | Sparkline |

### Forms (COPY_SNIPPET unless noted)

| Registry ID | Component | Reuse Mode |
|-------------|-----------|------------|
| `forms__basic_inputs` | Basic Form Elements | REFERENCE_ONLY |
| `forms__flatpickr_datetime` | Flatpickr Date Picker | COPY_SNIPPET |
| `forms__validation` | Form Validation | COPY_SNIPPET |
| `forms__file_upload` | File Upload Dropzone | COPY_SNIPPET |
| `forms__quill_editor` | Quill Rich Text | COPY_SNIPPET |

### Tables

| Registry ID | Component | Reuse Mode |
|-------------|-----------|------------|
| `tables__basic` | Basic Tables | REFERENCE_ONLY |
| `tables__gridjs_datatable` | GridJS DataTable | COPY_SNIPPET |

### Base UI (REFERENCE_ONLY unless noted)

| Registry ID | Component | Reuse Mode |
|-------------|-----------|------------|
| `base-ui__modals` | Modal Dialogs | COPY_SNIPPET |
| `base-ui__offcanvas` | Offcanvas Panels | COPY_SNIPPET |
| `base-ui__toasts` | Toast Notifications | COPY_SNIPPET |
| All others | Various UI Components | REFERENCE_ONLY |

### Auth Pages (REFERENCE_ONLY)

All auth pages are `REFERENCE_ONLY` — they will be connected to Supabase Auth.

### Error Pages (REFERENCE_ONLY)

Error pages are for reference structure only.

---

## Usage Notes

### REUSE_COMPONENT
Import directly in your code:
```tsx
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
```

### COPY_SNIPPET
Copy the relevant code pattern:
```tsx
// Example: Copy chart options from AllApexChart.tsx
const chartOptions = {
  chart: { type: 'line', height: 350 },
  series: [{ name: 'Data', data: [10, 20, 30] }],
  colors: ['#7e67fe']
}
```

### REFERENCE_ONLY
View and understand the pattern, but don't copy directly. These are:
- Tightly coupled to demo data
- Complex page layouts
- Will be replaced with CMS functionality

---

*Last updated: 2025-12-14*
