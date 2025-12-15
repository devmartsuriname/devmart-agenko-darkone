# Document #2 — Frontend Variant Audit

**Project:** Devmart Internal Platform (Admin + Frontend)

**Purpose:**
This document audits all existing frontend variants and templates in the current repository and formally selects **one single homepage variant** to retain: **Creative Agency**. All other variants are explicitly marked for removal.

This audit prevents accidental scope creep, duplicate layouts, and future branding inconsistencies.

---

## 1. Audit Objective

- Identify all frontend homepage variants currently present
- Select **Creative Agency** as the only retained variant
- Mark all other variants for removal (routes, components, assets)
- Ensure a clean frontend baseline before Admin ↔ Frontend data integration

This is a **reduction and cleanup document**, not a redesign.

---

## 2. Current Frontend Variant Inventory

Based on the Zivan frontend template structure, the following homepage variants exist:

| Variant Name | Status | Notes |
|-------------|--------|-------|
| Creative Agency | ✅ **KEEP** | Chosen primary homepage variant (Dark + Light supported) |
| Digital Agency | ❌ REMOVE | Not aligned with Devmart positioning |
| Startup / SaaS | ❌ REMOVE | Product-focused, not agency-focused |
| Corporate / Business | ❌ REMOVE | Too generic |
| Marketing Agency | ❌ REMOVE | Overlaps Creative Agency, redundant |
| IT Solutions | ❌ REMOVE | Conflicts with Creative Agency narrative |
| Portfolio Variant(s) | ❌ REMOVE | Content will be driven dynamically later |

**Decision:**
Only **Creative Agency** remains in the codebase.

---

## 3. Route-Level Decisions

### Routes to KEEP

- `/` → Creative Agency Home
- Supporting internal routes used by Creative Agency layout

### Routes to REMOVE

All alternative homepage demo routes, including but not limited to:
- `/home-2`
- `/home-3`
- `/home-startup`
- `/home-saas`
- `/home-corporate`
- Any demo-only landing routes not used by Creative Agency

These routes must be fully removed from:
- Router configuration
- Navigation links
- Footer demo links

---

## 4. Component Cleanup Scope

### Components to KEEP

- All components used by Creative Agency homepage
- Shared UI components required by Creative Agency sections
- Header and Footer variants used by Creative Agency

### Components to REMOVE

- Homepage-specific components for removed variants
- Unused hero sections
- Unused pricing blocks
- Unused testimonial sliders not referenced by Creative Agency

**Rule:**
If a component is not imported by Creative Agency → it must be removed.

---

## 5. Styling & Theme Rules

- Keep existing Dark / Light mode support (already provided by theme)
- No custom colors applied yet
- No branding changes in this phase
- SCSS/Tokens remain untouched unless unused files can be safely removed

---

## 6. Admin & CMS Considerations (Out of Scope)

This document does **NOT**:
- Define content schemas
- Connect frontend to Supabase
- Implement dynamic content
- Apply branding or color changes

These steps occur **after frontend cleanup**.

---

## 7. Risks & Mitigations

| Risk | Mitigation |
|-----|-----------|
| Accidentally removing shared components | Use import tracing before deletion |
| Breaking routes | Remove routes only after component verification |
| Demo links remaining visible | Manual audit of header/footer |

---

## 8. Verification Checklist (Required)

Before marking this phase complete:

- [ ] Only Creative Agency homepage renders
- [ ] No other homepage routes exist
- [ ] Header navigation points only to valid routes
- [ ] Footer has no demo links
- [ ] App builds without warnings
- [ ] No unused homepage components remain

---

## 9. Status

**Status:** Approved for execution

**Next Document:**
Document #3 — Admin ↔ Frontend Content Contract

**STOP. Await further instructions.**