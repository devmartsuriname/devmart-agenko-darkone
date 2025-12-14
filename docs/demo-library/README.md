# Darkone Admin Demo Library

> **⚠️ DEV ONLY — DO NOT SHIP**
> 
> This Demo Library is for development reference only. Demo routes and content
> are NOT included in production builds.

## Purpose

The Demo Library preserves the complete Darkone Admin theme as a reusable, read-only reference system. It allows developers to browse UI patterns, components, and layouts without affecting production code.

## Contents

| File | Description |
|------|-------------|
| `darkone-demo-library.registry.json` | JSON manifest of all reusable UI items |
| `Darkone_Admin_Theme.md` | Layout rules, tokens, and design system docs |
| `Darkone_Admin_Pages_Index.md` | Page-to-registry mapping |

## Registry Structure

Each registry item includes:

```json
{
  "id": "<category>__<slug>",
  "category": "charts | forms | tables | icons | modals | layout | navigation | auth | dashboard | widgets | empty-states | toasts | base-ui",
  "name": "Human-readable name",
  "allowedReuseMode": "REFERENCE_ONLY | COPY_SNIPPET | REUSE_COMPONENT",
  "sourceRoute": "/path/in/app",
  "sourceFiles": ["apps/admin/src/..."],
  "dependencies": ["package-names"],
  "propsNotes": "Key configuration notes",
  "reuseGuidance": "How to reuse without breaking Darkone parity"
}
```

## AllowedReuseMode

| Mode | Description | When to Use |
|------|-------------|-------------|
| `REFERENCE_ONLY` | View and understand, do not copy | Default for most items. Complex pages, tightly coupled components |
| `COPY_SNIPPET` | Copy code snippets into new features | Standalone chart configs, form patterns, styling examples |
| `REUSE_COMPONENT` | Import and use directly | Core layout components (PageTitle, ComponentContainerCard) |

**Default:** `REFERENCE_ONLY` unless explicitly justified.

## Registry ID Naming Convention

Format: `<category>__<slug>`

Examples:
- `charts__line_basic`
- `forms__file_upload`
- `layout__admin_wrapper`
- `auth__sign_in`

Rules:
- Category prefix matches registry category
- Slug uses snake_case
- Must be unique across entire registry
- No special characters except underscore

## DEV-Only Access

Demo Library routes are:
- Only registered when `import.meta.env.DEV === true`
- Not bundled in production builds (tree-shaken)
- Protected with redirect to `/error-pages/pages-404` as fallback

### Production Safety Proof

```typescript
// apps/admin/src/routes/index.tsx
// DEV ONLY — DO NOT SHIP
const demoLibraryRoutes: RoutesProps[] = import.meta.env.DEV ? [
  // routes here
] : [];
```

When `import.meta.env.DEV` is `false`:
- `demoLibraryRoutes` is an empty array
- No demo routes are added to the route table
- Demo page components are tree-shaken from bundle

## Production Behavior

**Critical:** In production builds, `/demo-library/*` returns the standard 404 page.

- Demo Library routes are **NOT registered** in production (empty array)
- A catch-all `*` route in `appRoutes` renders the 404 page for unknown paths
- This is enforced via `import.meta.env.DEV` conditional + catch-all route

### How it works:
1. `demoLibraryRoutes` is empty when `!import.meta.env.DEV`
2. The catch-all route `{ path: '*', element: <Error404 /> }` handles all unmatched paths
3. Result: `/demo-library/anything` → 404 page (not redirect to login)

## Rules

1. **NO production sidebar changes** - Demo Library does not appear in production menu
2. **NO component moves** - Demo pages import existing components in place
3. **NO refactoring** - This is preservation, not optimization
4. **Source of truth** - SCSS variables, not assumptions, for token values
5. **Darkone 1:1 parity** - Do not introduce custom styling

## Usage

In development mode, access:
- `/demo-library` - Overview
- `/demo-library/charts` - Charts showcase
- `/demo-library/forms` - Forms showcase
- `/demo-library/tables` - Tables showcase
- `/demo-library/icons` - Icons showcase
- `/demo-library/modals-toasts` - Modals & Toasts showcase
- `/demo-library/layouts` - Layout patterns showcase

## Registry Validation

A validation script is provided to verify all `sourceFiles[]` paths in the registry exist:

```bash
# Run from repo root
node apps/admin/scripts/validate-demo-library-registry.mjs
```

Exit codes:
- `0` = All paths exist (PASS)
- `1` = Missing paths found (FAIL)

---

*Last updated: 2025-12-14*
