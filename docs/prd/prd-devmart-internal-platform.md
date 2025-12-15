# Product Requirements Document (PRD)

## Project Name
**Devmart Internal Platform**

## Version
v1.0 (Initial)

## Status
In Progress — Documentation Phase

---

## 1. Purpose & Context

This project is an **internal Devmart platform** built to serve as:
- A production‑grade Admin CMS (Darkone‑based)
- A connected Marketing Frontend (Zivan Creative Agency variant)
- A Supabase‑powered content and auth backbone

The platform is **not a commercial product** and **will not be spun off** into a standalone CMS offering. All decisions prioritize **internal efficiency, reusability, and long‑term maintainability**.

---

## 2. Strategic Constraints (Non‑Negotiable)

- **Admin Theme:** Darkone Admin (React)
  - No refactors, no design changes
  - Demo Library preserved (DEV‑only)
  - Supabase Auth + RBAC is source of truth

- **Frontend Theme:** Zivan React
  - Only **Creative Agency** home variant is allowed
  - All other variants must be removed (routes, components, assets)

- **Language:** English only (documentation & code comments)

- **Ownership:** Internal Devmart platform only

---

## 3. System Architecture Overview

### 3.1 High‑Level Architecture

- **Monorepo**
  - `/apps/admin` → Darkone Admin (CMS)
  - `/apps/public` → Zivan Frontend (Marketing site)
  - `/packages/shared` → Future shared UI/contracts (placeholder)

- **Backend:** Supabase
  - Auth (email/password)
  - RBAC (roles, policies, RPCs)
  - Content tables (Phase 4+)

---

## 4. Admin (CMS) Scope — CURRENT STATE

### 4.1 Implemented

- Supabase Auth integration
- Session persistence
- RBAC (admin, future roles)
- Protected routes
- Role‑based sidebar visibility
- Demo Library (DEV‑only)
- Clean CMS placeholder modules:
  - Content (Pages, Blog, Projects, Media)
  - CRM (Clients, Partners)
  - Marketing (Newsletter, SEO)
  - System (Users, Roles, Settings, Audit Logs)

### 4.2 Explicitly Out of Scope (for now)

- Content CRUD logic
- Media uploads
- Workflow automation
- Permissions fine‑tuning beyond admin role

---

## 5. Frontend (Marketing Site) — TARGET STATE

### 5.1 Allowed Frontend Variant

✅ **Creative Agency (Zivan)**

All other Zivan homepage variants:
- ❌ Must be removed
- ❌ Must not remain in routes
- ❌ Must not remain as unused components

### 5.2 Frontend Responsibilities

- Display marketing content managed via Admin
- Support **dark/light theme switch** (already supported by theme)
- Reflect Devmart branding (later phase)

### 5.3 Frontend Must NOT

- Contain hardcoded demo content
- Contain unused templates or layouts
- Bypass Admin/Supabase as content source

---

## 6. Content Ownership Model (Future Phases)

| Content Type | Source | Consumer |
|-------------|--------|----------|
| Pages | Admin CMS | Frontend |
| Blog Posts | Admin CMS | Frontend |
| Projects / Case Studies | Admin CMS | Frontend |
| SEO Metadata | Admin CMS | Frontend |

Supabase will be the **single source of truth**.

---

## 7. Branding & Theming Rules

### 7.1 Admin

- Darkone theme remains unchanged
- No primary color overrides
- No branding UI changes

### 7.2 Frontend

- Branding controlled via Admin **Branding Settings** (future module)
- Configurable:
  - Primary color
  - Logo
  - Favicon

---

## 8. Documentation Strategy

All documentation is:
- Written in English
- Stored in `/docs`
- Updated per phase completion

Planned documents:
1. PRD (this document)
2. Frontend Cleanup & Route Plan
3. Content Data Model (Supabase)
4. Admin ↔ Frontend Integration Contract

---

## 9. Phase Roadmap (High‑Level)

### Phase 1–3
✅ Admin cleanup, RBAC, auth, demo preservation

### Phase 4 (Next)
- Frontend cleanup (Creative Agency only)
- Route pruning
- Static content removal

### Phase 5
- Supabase content schema
- Admin content CRUD

### Phase 6
- Frontend dynamic content swap
- Branding integration

---

## 10. Success Criteria

The platform is considered successful when:
- Admin is stable, clean, and extensible
- Frontend is lean and intentional
- No demo/template bloat remains
- Content flows from Admin → Frontend → Users

---

**Next Step:**
Create **Frontend Cleanup & Route Reduction Plan** (new live document).

