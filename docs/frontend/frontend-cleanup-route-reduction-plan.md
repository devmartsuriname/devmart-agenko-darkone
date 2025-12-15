# Document #1 — Frontend Cleanup & Route Reduction Plan

## Project Context
This document defines the **exact technical cleanup and route reduction strategy** for the Devmart internal platform frontend (Zivan template).

Scope is intentionally **limited and controlled**.
This is **not** a redesign, **not** a CMS wiring phase, and **not** a branding phase.

This plan exists to eliminate ambiguity, prevent scope creep, and allow Lovable to execute safely without interpretation errors.

---

## Objectives

1. Reduce the frontend to **ONE homepage variant only**: **Creative Agency**
2. Remove all unused/demo variants, routes, and entry points
3. Preserve Dark / Light theme capability
4. Keep frontend visually intact but structurally clean
5. Prepare frontend for **future Admin + Supabase content wiring** (not in this phase)

---

## Explicit In-Scope Actions

### ✅ What MUST Be Done

#### 1. Homepage Variant Reduction

- Retain **Creative Agency** homepage variant
- Remove all other homepage variants, including but not limited to:
  - Corporate
  - Startup
  - SaaS
  - Landing
  - Portfolio
  - Any demo/alternate home layouts

Only **one** homepage entry point remains.

---

#### 2. Route Cleanup

- Remove routes pointing to deleted variants
- Ensure `/` resolves ONLY to Creative Agency homepage
- Remove dead or orphaned routes
- Verify React Router has no unreachable or unused paths

**Hard rule:** No commented-out routes — delete or keep, nothing in between.

---

#### 3. Component Cleanup

- Remove components that belong exclusively to removed variants
- Keep shared components used by Creative Agency
- Do **not** refactor or rename surviving components

No styling changes allowed.
No logic rewrites allowed.

---

#### 4. Asset Cleanup

- Remove images, videos, or assets used ONLY by removed variants
- Keep shared assets even if currently unused
- Do NOT optimize, compress, or rename assets in this phase

---

#### 5. Layout & Theme Safety

- Preserve:
  - Dark / Light mode toggle
  - Global layout wrapper
  - Header / Footer used by Creative Agency

- Do NOT:
  - Change color tokens
  - Modify Tailwind / SCSS config
  - Touch theme switch logic

---

## Explicit Out-of-Scope Actions

❌ CMS integration
❌ Supabase data wiring
❌ Content replacement
❌ Branding changes
❌ Color customization
❌ SEO optimization
❌ Performance optimization
❌ Component refactoring

If discovered → **STOP and report**.

---

## Execution Constraints (Non-Negotiable)

- Follow Devmart React Template Migration Playbook
- No refactor before parity
- No new dependencies
- No folder restructuring unless explicitly listed
- No silent deletions

Every deletion must be intentional and verifiable.

---

## Required Restore Point

Before any change, Lovable MUST create:

```
docs/restorepoints/YYYY-MM-DD_FrontendCleanup_BeforeChange.md
```

Containing:
- Full route list BEFORE cleanup
- Homepage variants list
- Folder tree snapshot
- Confirmation of Creative Agency homepage rendering

---

## Verification Checklist (Mandatory)

Lovable must end execution with this checklist:

| Item | Status | Notes |
|----|----|----|
| Creative Agency homepage renders | ⬜ | |
| `/` resolves correctly | ⬜ | |
| All removed routes unreachable | ⬜ | |
| No console errors | ⬜ | |
| Dark mode still works | ⬜ | |
| Light mode still works | ⬜ | |
| No unused imports remain | ⬜ | |
| No build errors | ⬜ | |

---

## Stop Conditions

Lovable MUST stop and report if:
- A required component is shared by multiple variants and unclear
- A route dependency is ambiguous
- A deletion causes unexpected rendering issues

No assumptions allowed.

---

## Outcome of This Phase

At completion:
- Frontend contains **one clean homepage variant**
- Routing is minimal and intentional
- Codebase is ready for:
  - Admin content control
  - Supabase-driven content
  - Branding configuration

**Nothing else.**

---

## Status

- Document Type: Execution Plan
- Phase: Frontend Cleanup
- Approved For Execution: Pending explicit approval

Awaiting next instructions.

