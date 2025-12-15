# Frontend Cleanup & Route Reduction Plan

## Project
**Devmart Internal Platform**

## Scope & Intent
This document defines the controlled cleanup of the **Zivan frontend** so that only the **Creative Agency** homepage variant remains. All other demo variants, routes, and related assets must be safely removed **after verification**, without breaking Admin integration or Supabase connectivity.

This is a **cleanup and reduction plan only** — no redesign, no refactor, no new UI patterns.

---

## Guiding Principles (Non-Negotiable)

1. **Single Homepage Strategy**  
   Only **Creative Agency** remains as the active frontend homepage.

2. **Admin Is the Source of Truth**  
   All dynamic content will later be supplied by the Darkone Admin CMS via Supabase.

3. **No Visual Drift**  
   Creative Agency layout, spacing, typography, and components remain 1:1.

4. **Route Hygiene**  
   Removed variants must also be removed from routing, navigation, and build output.

5. **Rollback Safety**  
   A restore point must exist before *any* deletion.

---

## Phase F0 — Preconditions

Before cleanup starts, verify:

- Admin (Darkone) is stable and authenticated
- Supabase auth + RBAC operational
- Frontend builds successfully in current state
- Creative Agency variant identified and confirmed

---

## Phase F1 — Homepage Variant Audit

### Objective
Create an explicit inventory of **all homepage variants** present in the Zivan frontend.

### Actions

- Identify all homepage variants (folders, routes, layouts)
- Label each variant:
  - `KEEP` → Creative Agency
  - `REMOVE` → All others

### Deliverable
- `/docs/frontend/Homepage_Variant_Audit.md`

---

## Phase F2 — Route Reduction Plan

### Objective
Ensure only valid frontend routes remain.

### Actions

- Inspect routing configuration (router files)
- Remove routes linked to deleted homepage variants
- Ensure `/` maps **only** to Creative Agency

### Rules

- No commented-out routes
- No hidden legacy paths
- No fallback auto-redirects to demo pages

### Deliverable
- Updated routing map (documented)

---

## Phase F3 — File & Asset Cleanup

### Objective
Safely remove unused files.

### Actions

- Delete folders belonging exclusively to removed variants
- Remove unused assets (images, mock data)
- Remove variant-specific components no longer referenced

### Safety Rules

- Never delete shared components without dependency confirmation
- Never delete layout primitives without audit

---

## Phase F4 — Navigation & Entry Points

### Objective
Ensure clean entry behavior.

### Actions

- Confirm only one homepage entry
- Remove variant selectors (if any)
- Validate build output contains no unused variant code

---

## Phase F5 — Admin & Supabase Readiness Check

### Objective
Prepare frontend for content swap.

### Checks

- Static placeholders present where CMS content will load
- No hardcoded demo content required long-term
- Branding hooks ready (primary color from Admin settings later)

---

## Phase F6 — Verification Checklist

| Check | Status |
|------|--------|
| Creative Agency renders correctly | ⬜ |
| No dead routes | ⬜ |
| No build warnings from removed files | ⬜ |
| Admin auth unaffected | ⬜ |
| Supabase client unaffected | ⬜ |
| No visual regression | ⬜ |

---

## Explicit Out of Scope

- Branding redesign
- Content migration
- SEO optimization
- Performance tuning
- Component refactors

---

## Next Documents (Planned)

1. **Admin ↔ Frontend Content Contract**
2. **Branding & Theme Settings Specification**
3. **Frontend Content Swap Execution Plan**

---

## Execution Rules

- Each phase requires confirmation before proceeding
- Restore point before deletions
- Stop immediately on error
- End every phase with checklist report

**Status:** Planned — Not Executed
