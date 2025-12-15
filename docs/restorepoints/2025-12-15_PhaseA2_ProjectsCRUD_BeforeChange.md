# Restore Point — Phase A2: Projects CRUD

**Date:** 2025-12-15
**Phase:** A2 — Projects Admin CRUD
**Status:** Before Implementation

---

## Files to be Created

| File | Purpose |
|------|---------|
| `apps/admin/src/app/(admin)/content/projects/page.tsx` | Replace placeholder with full CRUD page |
| `apps/admin/src/app/(admin)/content/projects/components/ProjectForm.tsx` | Create/Edit modal with Zod validation |
| `apps/admin/src/app/(admin)/content/projects/components/ProjectDeleteModal.tsx` | Admin-only delete confirmation |
| `apps/admin/src/app/(admin)/content/projects/components/ProjectImageUpload.tsx` | Single image upload (thumbnail, featured) |
| `apps/admin/src/app/(admin)/content/projects/components/ProjectGalleryUpload.tsx` | Multi-image gallery upload |
| `apps/admin/src/app/(admin)/content/projects/components/TechnologiesInput.tsx` | Tag/chip input for technologies array |

## Files to be Modified

| File | Change |
|------|--------|
| `docs/tasks/Tasks.md` | Mark Phase A2 complete |

---

## RBAC Rules

| Role | List | Create | Edit | Publish/Unpublish | Delete |
|------|------|--------|------|-------------------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ✅ | ✅ | ❌ |
| Viewer | ❌ Route denied | — | — | — | — |

---

## Storage Configuration

- **Bucket:** `media` (existing, public)
- **Upload paths:**
  - Thumbnails: `projects/{timestamp}-{filename}`
  - Featured images: `projects/{timestamp}-{filename}`
  - Gallery images: `projects/gallery/{timestamp}-{filename}`

---

## Schema Reference (projects table)

```
title: text (required)
slug: text (required, unique)
short_description: text (nullable)
content: text (nullable)
thumbnail_url: text (nullable)
featured_image_url: text (nullable)
gallery_urls: text[] (nullable)
client_name: text (nullable)
project_url: text (nullable)
technologies: text[] (nullable)
category: text (nullable)
meta_title: text (nullable)
meta_description: text (nullable)
is_featured: boolean (default: false)
sort_order: integer (default: 0)
status: text (default: 'draft')
published_at: timestamp (nullable)
created_at: timestamp
updated_at: timestamp
created_by: uuid (nullable)
updated_by: uuid (nullable)
```

---

## Confirmation

- ✅ No database migrations required
- ✅ No frontend (apps/public) changes
- ✅ Route `/content/projects` already exists
- ✅ Menu item already exists in sidebar
- ✅ Demo Library untouched
