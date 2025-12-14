# Backend Architecture

## Overview

This document describes the backend architecture for the Zivan-Darkone monorepo.

## Current State (Post Repo Cleanup)

- **Backend:** Not yet configured
- **Database:** Not yet configured
- **Authentication:** Not yet configured
- **Storage:** Not yet configured

## Repository Structure

The repository has been cleaned up with a clear monorepo structure:

```
/apps/admin   - Darkone Admin (content management)
/apps/public  - Zivan Public (public-facing website)
```

Legacy source folders (`Darkone-React_v1.0/` and `zivan-react/`) have been removed.

## Build Configuration

The root `vite.config.ts` points to the Admin app (`apps/admin/`) for Lovable builds:
- Entry: `apps/admin/index.html` → `apps/admin/src/main.tsx`
- Output: `<repo>/dist/`

## Shared Backend (Future)

Both apps will connect to a shared Supabase backend:
- Database tables for CMS content
- Authentication for admin access
- Storage for media files
- Edge functions for server-side logic

## Current Phase: Phase 1 - Demo Library (Complete + Hardened)

Phase 1 is complete and hardened with safety verification:
- Creating Demo Library registry and documentation
- Preserving Darkone UI patterns for reference
- Setting up DEV-only showcase routes
- Preparing shared UI package placeholder
- **Phase 1A:** Added catch-all 404 route for production safety
- **Phase 1B:** Validated and fixed all registry sourceFiles paths
- **Phase 1C:** Added theme token verification section with grep commands

**No database or backend changes in Phase 1.** Supabase integration comes in Phase 3+.

### Demo Library Deliverables
| Deliverable | Location |
|-------------|----------|
| Registry JSON | `docs/demo-library/darkone-demo-library.registry.json` |
| Theme Reference | `docs/demo-library/Darkone_Admin_Theme.md` |
| Pages Index | `docs/demo-library/Darkone_Admin_Pages_Index.md` |
| Showcase Routes | `apps/admin/src/app/(admin)/demo-library/` (DEV-only) |
| Shared UI Placeholder | `packages/shared/ui/` |

## CMS Modules (Planned)

Per approved scope:
1. Site Settings
2. Hero Sections
3. Services
4. Portfolio/Projects
5. Team Members
6. Blog
7. Testimonials
8. Awards (dynamic)
9. FAQs
10. Contact Submissions
11. eCommerce (Products, Variants, Cart, Orders, Wishlist)

## Phase 2A: Sidebar + Placeholder Routes (Complete)

- 12 CMS placeholder pages created (Content, CRM, Marketing, System)

## Phase 2B: Dashboard Placeholder (Complete)

- Replaced demo dashboard with CMS placeholder layout
- Welcome card with quick links to CMS modules
- 4 KPI placeholder cards (Pages, Blog Posts, Projects, Inquiries)
- Analytics placeholder section (no charts wired yet)
- Production sidebar shows CMS modules only
- DEV sidebar includes Demo Library + legacy UI Kit
- Routes added for all placeholder modules

## Next Steps

1. **Phase 2B:** Dashboard placeholder (plan only, awaiting approval)
2. **Phase 3:** Execute remaining cleanup
3. **Phase 4+:** Enable Lovable Cloud, create database schema, configure auth

---

*Last updated: 2025-12-14 - Phase 2A Sidebar Restructure*
