# Darkone Admin Theme Reference

> **⚠️ DEV ONLY — DO NOT SHIP**
> 
> This document is for development reference. All values are extracted directly from SCSS source files.

## Theme Tokens (Source of Truth)

### Primary Colors
| Token | Value | Source File:Line |
|-------|-------|------------------|
| `$primary` | `#7e67fe` | `_variables.scss:77` |
| `$secondary` | `#5a7bfc` | `_variables.scss:78` |
| `$success` | `#1abc9c` | `_variables.scss:79` |
| `$info` | `#00b8d4` | `_variables.scss:80` |
| `$warning` | `#ffc107` | `_variables.scss:81` |
| `$danger` | `#ef5f5f` | `_variables.scss:82` |
| `$light` | `#f5f5f9` | `_variables.scss:83` |
| `$dark` | `#3a4250` | `_variables.scss:84` |

### Typography
| Token | Value | Source File:Line |
|-------|-------|------------------|
| `$font-family-primary` | `"Play", sans-serif` | `_variables.scss:11` |
| `$font-family-secondary` | `"Play", sans-serif` | `_variables.scss:12` |
| `$font-size-base` | `0.875rem` | `_variables.scss:659` |
| `$font-weight-normal` | `400` | `_variables.scss:667` |
| `$font-weight-semibold` | `600` | `_variables.scss:669` |
| `$font-weight-bold` | `700` | `_variables.scss:670` |
| `$line-height-base` | `1.5` | `_variables.scss:680` |

### Body & Background (Light Mode)
| Token | Value | Source File:Line |
|-------|-------|------------------|
| `$body-bg` | `#f8f7fa` | `_variables.scss:474` |
| `$body-color` | `#5d7186` | `_variables.scss:475` |
| `$card-bg` | `$white` (#fff) | `_variables.scss` |

### Body & Background (Dark Mode)
| Token | Value | Source File:Line |
|-------|-------|------------------|
| `--bs-body-bg` (dark) | `#191e23` | `_variables-dark.scss:43` |
| `--bs-body-color` (dark) | `#aab8c5` | `_variables-dark.scss:42` |
| `--bs-tertiary-bg` (dark) | `#252b30` | `_variables-dark.scss:36` |

### Spacing
| Token | Value | Source File:Line |
|-------|-------|------------------|
| `$spacer` | `1.5rem` | `_variables.scss:447` |
| `$spacer-1` | `$spacer * 0.25` (0.375rem) | Calculated |
| `$spacer-2` | `$spacer * 0.5` (0.75rem) | Calculated |
| `$spacer-3` | `$spacer` (1.5rem) | Calculated |
| `$spacer-4` | `$spacer * 1.5` (2.25rem) | Calculated |
| `$spacer-5` | `$spacer * 3` (4.5rem) | Calculated |

### Border & Radius
| Token | Value | Source File:Line |
|-------|-------|------------------|
| `$border-radius` | `0.35rem` | `_variables.scss:591` |
| `$border-radius-sm` | `0.2rem` | `_variables.scss:592` |
| `$border-radius-lg` | `0.5rem` | `_variables.scss:593` |
| `$border-radius-xl` | `1rem` | `_variables.scss:594` |
| `$border-width` | `1px` | `_variables.scss:579` |
| `$border-color` | `#eef0f7` | `_variables.scss:580` |

### Sidebar
| Token | Value | Source File:Line |
|-------|-------|------------------|
| `$sidebar-width` | `var(--bs-sidebar-width)` | `_variables.scss:19` |
| `$sidebar-collapsed-width` | `70px` | `_sidebar.scss` |
| `$sidebar-bg` | `#ffffff` | `_sidebar.scss` |
| `$sidebar-menu-height` | `42px` | `_sidebar.scss` |

---

## Layout Shell Rules

### Page Wrapper Structure
```html
<div class="wrapper">
  <!-- Sidebar -->
  <div class="main-menu">...</div>
  
  <!-- Main Content -->
  <div class="page-content">
    <Container fluid>
      <PageTitle />
      <!-- Page content here -->
    </Container>
  </div>
  
  <!-- Footer -->
  <Footer />
</div>
```

### Container Width
- Uses `Container fluid` from react-bootstrap (full-width with padding)
- Page padding: `24px` horizontal, `20px` vertical

### Card Spacing
- Card margin bottom: `mb-3` (1rem)
- Card gutter: `gx-3` (1rem between columns)
- Card body padding: `1.25rem`

### Section Headers
- Use `PageTitle` component for consistent breadcrumb pattern
- Props: `title: string`, `breadcrumbs: {name: string, link?: string}[]`

---

## Component Usage Patterns

### Card Pattern
```tsx
import { Card, CardBody, CardTitle } from 'react-bootstrap'

<Card>
  <CardBody>
    <CardTitle as="h5" className="mb-3">Title</CardTitle>
    {/* Content */}
  </CardBody>
</Card>
```

### Page Header Pattern
```tsx
import PageTitle from '@/components/PageTitle'

<PageTitle
  title="Page Name"
  breadcrumbs={[
    { name: 'Dashboard', link: '/' },
    { name: 'Current Page' }
  ]}
/>
```

### Demo Section Pattern
```tsx
import ComponentContainerCard from '@/components/ComponentContainerCard'

<ComponentContainerCard
  title="Section Title"
  description="Optional description text"
>
  {/* Demo content */}
</ComponentContainerCard>
```

### Icon Pattern
```tsx
import IconifyIcon from '@/components/wrapper/IconifyIcon'

// Mingcute icons (primary set)
<IconifyIcon icon="mingcute:home-5-line" />

// Solar icons (secondary set)
<IconifyIcon icon="solar:home-2-bold" />
```

### Button Variants
```tsx
import { Button } from 'react-bootstrap'

<Button variant="primary">Primary</Button>
<Button variant="outline-primary">Outline</Button>
<Button variant="soft-primary">Soft</Button>
```

### Alert Pattern
```tsx
import { Alert } from 'react-bootstrap'

<Alert variant="primary">Primary alert</Alert>
<Alert variant="success" dismissible>Dismissible</Alert>
```

---

## Do/Don't Rules

### ✅ DO

1. **Use react-bootstrap components**
   - Card, Button, Form, Table, Modal, Alert, Badge, Spinner, etc.

2. **Keep the purple primary color `#7e67fe`**
   - Do not introduce new primary colors

3. **Use "Play" font family**
   - All text should use the Play font

4. **Use IconifyIcon wrapper for icons**
   - Never use raw SVGs or other icon libraries

5. **Use PageTitle component for page headers**
   - Maintains consistent breadcrumb styling

6. **Use ComponentContainerCard for showcase sections**
   - Good for settings panels and demo areas

7. **Follow spacing scale**
   - Use Bootstrap spacing utilities (mb-3, p-4, etc.)

8. **Respect dark mode**
   - Use CSS variables that adapt to theme
   - Test both light and dark modes

### ❌ DON'T

1. **Don't mix Tailwind with Darkone SCSS**
   - The Admin app uses Bootstrap/SCSS exclusively

2. **Don't override SCSS without consulting variables**
   - Check `_variables.scss` first

3. **Don't create custom icon components**
   - Use IconifyIcon with mingcute or solar icon sets

4. **Don't use inline styles for theming**
   - Use CSS classes and variables

5. **Don't change card shadow or border-radius**
   - Keep Darkone's subtle shadow style

6. **Don't introduce new color palettes**
   - Stick to the existing theme colors

7. **Don't remove sidebar structure**
   - Modify menu-items.ts for navigation changes

8. **Don't bypass AuthLayout/AdminLayout**
   - All pages must use the appropriate layout wrapper

---

## File Structure Reference

### Theme Files
```
apps/admin/src/assets/scss/
├── style.scss              # Main entry point
├── config/
│   ├── _variables.scss     # Light mode tokens (SOURCE OF TRUTH)
│   └── _variables-dark.scss # Dark mode overrides
├── structure/
│   ├── _sidebar.scss       # Sidebar styles
│   ├── _topbar.scss        # Top navigation
│   └── _footer.scss        # Footer styles
└── components/
    ├── _buttons.scss       # Button variants
    ├── _cards.scss         # Card styles
    └── ...
```

### Layout Components
```
apps/admin/src/
├── layouts/
│   ├── AdminLayout.tsx     # Main wrapper
│   └── AuthLayout.tsx      # Auth wrapper
└── components/
    ├── layout/
    │   ├── VerticalNavigationBar/  # Sidebar
    │   ├── TopNavigationBar.tsx    # Header
    │   └── Footer.tsx              # Footer
    ├── PageTitle.tsx              # Breadcrumbs
    └── ComponentContainerCard.tsx # Demo wrapper
```

---

## Migration Notes

When building CMS features:

1. **Keep existing layout structure** - Use AdminLayout wrapper
2. **Create new pages under `/apps/admin/src/app/(admin)/`**
3. **Add routes to `routes/index.tsx`**
4. **Update sidebar menu in `assets/data/menu-items.ts`**
5. **Use existing component patterns** - Don't reinvent the wheel

---

## Verification

### How to Re-verify Token Values

Line numbers in SCSS files may change over time. Use these commands to verify token values:

```bash
# Primary color
grep -n '\$primary:' apps/admin/src/assets/scss/config/_variables.scss
grep -n '\$purple:' apps/admin/src/assets/scss/config/_variables.scss

# Dark mode body colors
grep -n 'body-bg-dark' apps/admin/src/assets/scss/config/_variables-dark.scss
grep -n 'body-color-dark' apps/admin/src/assets/scss/config/_variables-dark.scss

# Font family
grep -n 'font-family-primary' apps/admin/src/assets/scss/config/_variables.scss

# Border radius
grep -n 'border-radius:' apps/admin/src/assets/scss/config/_variables.scss
```

### Verified Token Values (Source-of-Truth)

| Token | Value | Search Key | Verified |
|-------|-------|------------|----------|
| `$primary` | `$purple` → `#7e67fe` | `$purple:` | ✅ |
| `$body-bg-dark` | `#191e23` | `body-bg-dark:` | ✅ |
| `$body-color-dark` | `#aab8c5` | `body-color-dark:` | ✅ |
| `$font-family-primary` | `"Play", sans-serif` | `font-family-primary:` | ✅ |

### Note on Line Numbers

Line numbers in the token tables above are **approximate** and may shift if SCSS files are edited. The **Source File** and **Search Key** are the authoritative references. Always use grep/search to verify current line numbers.

---

*Last updated: 2025-12-14*
*Verification status: Tokens verified against SCSS source files*
