# Devmart Internal Platform — Project Kickoff Checklist

## 1. Project Identity
- **Project Name:** Devmart Internal Platform
- **Project Type:** Internal platform (Admin CMS + Public Frontend)
- **Ownership:** Devmart (internal use only)
- **Productization:** ❌ No external product fork planned
- **Language (Docs & Code):** English

---

## 2. Scope Definition (Hard Boundaries)
### In Scope
- Darkone Admin CMS (React + Vite)
- Supabase Auth, RBAC, Database
- Public Frontend (Zivan)
- Creative Agency Home Variant (ONLY)
- Content-driven frontend via Supabase
- Branding configuration (Frontend primary color only)

### Out of Scope (Explicit)
- Other Zivan home variants
- Tailwind or UI refactors
- Admin theme color changes
- Product packaging / licensing
- White-labeling

---

## 3. Repository Structure (Locked)
```
/apps
  /admin        # Darkone Admin (source of truth for CMS)
  /public       # Zivan Frontend (Creative Agency only)
/packages
  /shared/ui    # Placeholder only (NO imports yet)
/docs
  /architecture.md
  /backend.md
  /demo-library
  /restorepoints
```

Rules:
- ❌ No moving admin components
- ❌ No refactors before parity is confirmed
- ✅ Add-only unless explicitly approved

---

## 4. Environment & Tooling
- **Frontend:** React, Vite
- **Admin UI:** Darkone React Admin
- **Backend:** Supabase (Auth, DB, RLS)
- **Routing:** React Router
- **State/Auth:** Custom Auth Context
- **Env Handling:** Vite envDir (root)

---

## 5. Documentation Rules (Mandatory)
For **every phase**:
- Restore Point document required
- Checklist report required
- STOP execution on error
- Report: ✅ implemented | 🟨 partial | ⛔ not implemented

All documentation must live in `/docs`.

---

## 6. Phase Gates (Definition of Done)
A phase is **DONE** only if:
- App builds without errors
- Routes load correctly
- No console errors
- Docs updated
- Checklist delivered
- Explicit approval given

---

## 7. Current Phase Status
| Phase | Status |
|-----|------|
| Phase 1 — Admin Demo Library | ✅ Complete |
| Phase 2 — Admin Cleanup | ✅ Complete |
| Phase 3A — Supabase Auth | ✅ Complete |
| Phase 3B — RBAC Hardening | ✅ Complete |
| Phase 4 — Documentation | 🔄 In Progress |
| Phase 5 — Frontend Cleanup | ⏸️ Pending |

---

## 8. Next Approved Actions
1. Finalize PRD v1.0
2. Define Frontend Route Map (Creative Agency only)
3. Clean Zivan frontend variants
4. Connect frontend to Supabase content
5. Implement Admin Branding Settings (frontend primary color)

---

## 9. Non‑Negotiables
- Darkone Admin theme remains untouched
- Demo Library stays DEV-only
- No hidden scope additions
- No frontend cleanup before route map approval

---

**Status:** Active
**Awaiting:** Frontend Strategy / Route Map document

