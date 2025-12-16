# Admin CRUD Module Pattern Documentation

> **Authority:** This document is the MANDATORY standard for all Admin CMS CRUD module implementations (A1–A∞). Deviations require explicit approval.

**Last Updated:** 2025-12-16  
**Applies To:** Phases A4–A8+ (Pages, Team, Testimonials, Awards, FAQs, and all future modules)

---

## Table of Contents

1. [Purpose & When to Use](#purpose--when-to-use)
2. [Standard Module Folder Structure](#standard-module-folder-structure)
3. [List Page Checklist](#list-page-checklist-pagetsx)
4. [Data Fetch Pattern (List Page)](#data-fetch-pattern-list-page)
5. [Modal/Form Pattern](#modalform-pattern-moduleformtsx)
6. [Zod Input Normalization Rules (MANDATORY)](#zod-input-normalization-rules-mandatory)
7. [Slug Uniqueness Pattern](#slug-uniqueness-pattern-when-applicable)
8. [Toggle Patterns](#toggle-patterns)
9. [Audit Fields Pattern](#audit-fields-pattern)
10. [Admin vs Public Visibility Rule](#admin-vs-public-visibility-rule)
11. [RBAC Rendering Rules](#rbac-rendering-rules)
12. [Delete Modal Pattern](#delete-modal-pattern-moduledeletemodaltsx)
13. [Image Upload Pattern](#image-upload-pattern-when-applicable)
14. [Restore Point Discipline (MANDATORY)](#restore-point-discipline-mandatory)
15. [Forbidden Touches List](#forbidden-touches-list)
16. [Verification Checklist Template](#verification-checklist-template)

---

## Purpose & When to Use

This pattern applies to **all Admin CMS CRUD modules** that manage content types stored in Supabase tables.

**Use this pattern when:**
- Creating a new content management module (e.g., Services, Projects, Blog, Pages, Team, Testimonials, Awards, FAQs)
- The module requires Create, Read, Update, Delete operations
- The module has `is_active` and/or `is_featured` boolean toggles
- Admin-only delete enforcement is required

**Tab Structure Decision:**
| Condition | Tab Structure |
|-----------|---------------|
| Schema has `image_url`, `avatar_url`, `featured_image_url`, or similar | **3 tabs:** Basic Info \| Media \| Details |
| Schema has NO image fields | **2 tabs:** Basic Info \| Details |

---

## Standard Module Folder Structure

```
apps/admin/src/app/(admin)/content/{module}/
├── page.tsx                    # List page with table
└── components/
    ├── {Module}Form.tsx        # Create/Edit modal (xl size)
    ├── {Module}DeleteModal.tsx # Admin-only delete confirmation
    └── {Module}ImageUpload.tsx # Optional: only if schema has image fields
```

**Naming Conventions:**
- Folder name: lowercase singular or plural matching route (e.g., `faqs`, `team`, `awards`)
- Component names: PascalCase with module prefix (e.g., `FaqForm.tsx`, `TeamDeleteModal.tsx`)

---

## List Page Checklist (`page.tsx`)

### Required Imports
```typescript
import { useState, useEffect } from 'react'
import { Button, Table, Badge } from 'react-bootstrap'
import { toast } from 'sonner'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useAuthContext } from '@/context/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { {Module}Form } from './components/{Module}Form'
import { {Module}DeleteModal } from './components/{Module}DeleteModal'
```

### AuthContext Usage (MANDATORY)
```typescript
const { user, isAdmin } = useAuthContext()
```
**NEVER use:** `userRoles`, `includes('admin')`, or similar patterns.

### Button Placement Rule
**"Add {Item}" button MUST be placed ABOVE ComponentContainerCard:**
```tsx
<PageTitle title="{Module}" breadcrumb={breadcrumb} />

<div className="d-flex justify-content-end mb-3">
  <Button variant="primary" onClick={() => setShowForm(true)}>
    <IconifyIcon icon="ri:add-line" className="me-1" />
    Add {Item}
  </Button>
</div>

<ComponentContainerCard title="{Module} List">
  {/* Table content */}
</ComponentContainerCard>
```

### Standard Table Columns
| Column | Description |
|--------|-------------|
| Title/Name/Question | Primary identifier |
| Category (if applicable) | Optional grouping |
| Status | `is_active` as Active/Inactive badge |
| Featured | `is_featured` as Yes/No badge |
| Sort Order | Numeric ordering |
| Actions | Edit + Delete (admin-only) |

### Admin-Only Delete Guard
```tsx
{isAdmin && (
  <Button
    variant="soft-danger"
    size="sm"
    onClick={() => handleDeleteClick(item)}
  >
    <IconifyIcon icon="ri:delete-bin-line" />
  </Button>
)}
```

---

## Data Fetch Pattern (List Page)

### Standard Fetch Function
```typescript
const fetchItems = async () => {
  setLoading(true)
  try {
    const { data, error } = await supabase
      .from('{table_name}')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) throw error
    setItems(data || [])
  } catch (error) {
    console.error('Error fetching {items}:', error)
    toast.error('Failed to load {items}')
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  fetchItems()
}, [])
```

### Key Principles
1. **Always handle loading state** — Show spinner or skeleton during fetch
2. **Always handle errors** — Log to console AND show toast to user
3. **Order by sort_order first** — Then by created_at descending as secondary
4. **Refresh after mutations** — Call `fetchItems()` after create/edit/delete/toggle
5. **No client-side filtering for visibility** — Admin list shows ALL records (drafts + published/active + inactive)

### Admin vs Public Query Difference
| Context | Query Behavior |
|---------|----------------|
| **Admin List** | `SELECT *` — shows all records regardless of status |
| **Public Frontend** | Filtered by `is_active = true` OR `status = 'published'` via RLS or explicit WHERE |

---

## Modal/Form Pattern (`{Module}Form.tsx`)

### Modal Configuration
```tsx
<Modal show={show} onHide={onHide} size="xl" centered>
```
**Modal size is ALWAYS `xl`** — no exceptions.

### Tab Structure Template (3 tabs)
```tsx
<Tabs defaultActiveKey="basic" className="mb-3">
  <Tab eventKey="basic" title="Basic Info">
    {/* Required fields: title/name/question, slug (if applicable), main content */}
  </Tab>
  <Tab eventKey="media" title="Media">
    {/* Image upload components */}
  </Tab>
  <Tab eventKey="details" title="Details">
    {/* Optional fields: category, SEO, toggles, sort_order */}
  </Tab>
</Tabs>
```

### Tab Structure Template (2 tabs — NO Media)
```tsx
<Tabs defaultActiveKey="basic" className="mb-3">
  <Tab eventKey="basic" title="Basic Info">
    {/* Required fields + main content */}
  </Tab>
  <Tab eventKey="details" title="Details">
    {/* Optional fields: category, toggles, sort_order */}
  </Tab>
</Tabs>
```

### Form State Management
```typescript
const [loading, setLoading] = useState(false)
const { user, isAdmin } = useAuthContext()

const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: initialData || defaultValues,
})
```

---

## Zod Input Normalization Rules (MANDATORY)

HTML form inputs return strings. Zod schemas MUST preprocess values to prevent NaN, empty strings in DB, and validation failures.

### Numeric from HTML Input (default to 0)
```typescript
sort_order: z.preprocess(
  (v) => {
    if (v === '' || v == null || v === undefined) return 0
    const num = Number(v)
    return isNaN(num) ? 0 : num
  },
  z.number().int().min(0)
)
```

### Nullable Numeric (e.g., year, rating)
```typescript
year: z.preprocess(
  (v) => {
    if (v === '' || v == null || v === undefined) return null
    const num = Number(v)
    return isNaN(num) ? null : num
  },
  z.number().int().min(1900).max(2100).nullable()
)

rating: z.preprocess(
  (v) => {
    if (v === '' || v == null || v === undefined) return null
    const num = Number(v)
    return isNaN(num) ? null : num
  },
  z.number().int().min(1).max(5).nullable()
)
```

### Optional Text (trim + null)
```typescript
category: z.preprocess(
  (v) => {
    if (v === '' || v == null) return null
    return String(v).trim()
  },
  z.string().max(100).nullable()
)
```

### Optional URL (validate only when present)
```typescript
link_url: z.preprocess(
  (v) => {
    if (v === '' || v == null) return null
    return String(v).trim()
  },
  z.string().url('Please enter a valid URL').nullable().or(z.null())
)
```

### Optional Foreign Key Select
```typescript
project_id: z.preprocess(
  (v) => (v === '' || v == null ? null : String(v)),
  z.string().uuid().nullable()
)
```

### Data Integrity Summary Table
| Input Value | Preprocessed Result | Stored in DB |
|-------------|---------------------|--------------|
| `""` (empty string, text) | `null` | `NULL` |
| `""` (empty string, numeric) | `0` or `null` | `0` or `NULL` |
| `"  "` (whitespace only) | `null` | `NULL` |
| `"abc"` for number field | `0` or `null` | `0` or `NULL` |
| `undefined` | `null` or default | `NULL` or default |

---

## Slug Uniqueness Pattern (When Applicable)

**Applies to:** Services, Projects, Blog, Pages, Team (modules with `slug` field)

### Auto-Generate from Title
```typescript
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

### Debounced Uniqueness Check
```typescript
const [slugExists, setSlugExists] = useState(false)
const [checkingSlug, setCheckingSlug] = useState(false)

useEffect(() => {
  const checkSlug = async () => {
    const slug = form.watch('slug')
    if (!slug || slug.length < 2) return

    setCheckingSlug(true)
    try {
      let query = supabase
        .from('{table_name}')
        .select('id')
        .eq('slug', slug)
        .limit(1)

      // Exclude current record when editing
      if (initialData?.id) {
        query = query.neq('id', initialData.id)
      }

      const { data } = await query
      setSlugExists(data && data.length > 0)
    } finally {
      setCheckingSlug(false)
    }
  }

  const debounce = setTimeout(checkSlug, 500)
  return () => clearTimeout(debounce)
}, [form.watch('slug')])
```

### UI Feedback
```tsx
{slugExists && (
  <Form.Text className="text-danger">
    This slug is already in use. Please choose a different one.
  </Form.Text>
)}
```

---

## Toggle Patterns

### Standard Toggle Handler
```typescript
const handleToggle = async (item: Item, field: 'is_active' | 'is_featured') => {
  try {
    const { error } = await supabase
      .from('{table_name}')
      .update({ 
        [field]: !item[field],
        updated_by: user?.id 
      })
      .eq('id', item.id)

    if (error) throw error

    toast.success(`${field === 'is_active' ? 'Status' : 'Featured'} updated`)
    fetchItems() // Refresh list
  } catch (error) {
    console.error(`Error updating ${field}:`, error)
    toast.error(`Failed to update ${field}`)
  }
}
```

### Toggle Button Rendering
```tsx
<Button
  variant={item.is_active ? 'soft-success' : 'soft-secondary'}
  size="sm"
  onClick={() => handleToggle(item, 'is_active')}
>
  {item.is_active ? 'Active' : 'Inactive'}
</Button>

<Button
  variant={item.is_featured ? 'soft-warning' : 'soft-secondary'}
  size="sm"
  onClick={() => handleToggle(item, 'is_featured')}
>
  {item.is_featured ? 'Featured' : 'Not Featured'}
</Button>
```

### RBAC for Toggles
| Role | Can Toggle is_active | Can Toggle is_featured | Can Delete |
|------|---------------------|------------------------|------------|
| Admin | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ❌ |
| Viewer | ❌ | ❌ | ❌ |

---

## Audit Fields Pattern

All CMS tables include audit fields for tracking record ownership and modifications.

### Standard Audit Fields
| Field | Type | Purpose | Set When |
|-------|------|---------|----------|
| `created_at` | `timestamptz` | Record creation time | Auto (DB default) |
| `updated_at` | `timestamptz` | Last modification time | Auto (trigger) |
| `created_by` | `uuid` | User who created record | Insert |
| `updated_by` | `uuid` | User who last modified | Update |

### Setting Audit Fields on Create
```typescript
const handleCreate = async (data: FormData) => {
  const { error } = await supabase
    .from('{table_name}')
    .insert({
      ...data,
      created_by: user?.id,
      updated_by: user?.id,
    })
  // ...
}
```

### Setting Audit Fields on Update
```typescript
const handleUpdate = async (data: FormData) => {
  const { error } = await supabase
    .from('{table_name}')
    .update({
      ...data,
      updated_by: user?.id,
    })
    .eq('id', initialData.id)
  // ...
}
```

### Display Considerations
- Audit fields are typically NOT displayed in list tables (too much noise)
- May be shown in edit modal footer or detail view for debugging
- Never user-editable via form inputs

---

## Admin vs Public Visibility Rule

### Visibility Matrix
| Record State | Admin List | Public Frontend |
|--------------|------------|-----------------|
| `is_active = true` | ✅ Visible | ✅ Visible |
| `is_active = false` | ✅ Visible | ❌ Hidden |
| `status = 'published'` | ✅ Visible | ✅ Visible |
| `status = 'draft'` | ✅ Visible | ❌ Hidden |

### Implementation Rules

**Admin App (List Page):**
- Fetch ALL records without filtering by status/is_active
- Display status badges to indicate visibility state
- Allow toggling visibility for all records

**Public App (Frontend):**
- Query MUST filter: `.eq('is_active', true)` OR `.eq('status', 'published')`
- Alternatively, RLS policies enforce this at database level
- Never expose draft/inactive content to public visitors

### Query Examples
```typescript
// ADMIN: Fetch all for management
const { data } = await supabase.from('faqs').select('*')

// PUBLIC: Fetch only active for display
const { data } = await supabase.from('faqs').select('*').eq('is_active', true)
```

---

## RBAC Rendering Rules

### AuthContext Usage (MANDATORY)
```typescript
const { user, isAdmin } = useAuthContext()
```

### FORBIDDEN Patterns
```typescript
// ❌ NEVER DO THIS
const { userRoles } = useAuthContext()
if (userRoles?.includes('admin')) { ... }

// ❌ NEVER DO THIS
if (user?.role === 'admin') { ... }

// ❌ NEVER DO THIS
const isAdmin = localStorage.getItem('isAdmin') === 'true'
```

### Delete Button + Modal Guard
```tsx
// Only render delete button for admins
{isAdmin && (
  <Button variant="soft-danger" onClick={() => handleDeleteClick(item)}>
    Delete
  </Button>
)}

// Only mount delete modal for admins
{isAdmin && deleteItem && (
  <DeleteModal
    show={showDeleteModal}
    onHide={() => setShowDeleteModal(false)}
    item={deleteItem}
    onDeleted={handleDeleted}
  />
)}
```

### RBAC Matrix (Standard)
| Action | Admin | Editor | Viewer |
|--------|-------|--------|--------|
| View List | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ❌ |
| Edit | ✅ | ✅ | ❌ |
| Toggle Status | ✅ | ✅ | ❌ |
| Delete | ✅ | ❌ | ❌ |

---

## Delete Modal Pattern (`{Module}DeleteModal.tsx`)

### Standard Template
```tsx
import { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'

interface Props {
  show: boolean
  onHide: () => void
  item: { id: string; title?: string; name?: string; question?: string }
  onDeleted: () => void
}

export const {Module}DeleteModal = ({ show, onHide, item, onDeleted }: Props) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('{table_name}')
        .delete()
        .eq('id', item.id)

      if (error) throw error

      toast.success('{Item} deleted successfully')
      onDeleted()
      onHide()
    } catch (error) {
      console.error('Error deleting {item}:', error)
      toast.error('Failed to delete {item}')
    } finally {
      setLoading(false)
    }
  }

  const displayName = item.title || item.name || item.question || 'this item'

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete {Item}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete <strong>"{displayName}"</strong>?</p>
        <p className="text-muted mb-0">This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
```

---

## Image Upload Pattern (When Applicable)

### Supabase Storage Configuration
| Setting | Value |
|---------|-------|
| Bucket | `media` |
| Path Pattern | `media/{module}/{filename}` |
| Accepted Types | `image/jpeg`, `image/png`, `image/webp`, `image/gif` |
| Max Size | 5MB |

### Upload Function Template
```typescript
const uploadImage = async (file: File, module: string): Promise<string | null> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
  const filePath = `${module}/${fileName}`

  const { error } = await supabase.storage
    .from('media')
    .upload(filePath, file, { upsert: true })

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath)

  return publicUrl
}
```

### Image Upload Component Features
- Drag-and-drop zone
- Click to select file
- Preview thumbnail
- Replace existing image
- Clear/remove image
- File size and type validation

---

## Restore Point Discipline (MANDATORY)

### Before Starting ANY Module Implementation

**Step 0 (Pre-flight):** Create a restore point document BEFORE making any code changes.

### Restore Point Location
```
docs/restorepoints/{YYYY-MM-DD}_Phase{X}_{ModuleName}_BeforeChange.md
```

### Restore Point Template
```markdown
# Restore Point: Phase A{X} — {Module} CRUD

**Created:** {YYYY-MM-DD}  
**Phase:** A{X}  
**Module:** {Module Name}  
**Status:** Before Implementation

---

## Prior Phase Status

| Phase | Status | Description |
|-------|--------|-------------|
| A1 | ✅ Complete | Services CRUD |
| A2 | ✅ Complete | Projects CRUD |
| ... | ... | ... |

---

## Files to be Created

- `apps/admin/src/app/(admin)/content/{module}/page.tsx`
- `apps/admin/src/app/(admin)/content/{module}/components/{Module}Form.tsx`
- `apps/admin/src/app/(admin)/content/{module}/components/{Module}DeleteModal.tsx`

## Files to be Modified

- `apps/admin/src/routes/index.tsx` (add route)
- `apps/admin/src/assets/data/menu-items.ts` (add menu item)

---

## Rollback Instructions

If implementation fails verification:

1. Delete created files in `apps/admin/src/app/(admin)/content/{module}/`
2. Revert route addition in `routes/index.tsx`
3. Revert menu item in `menu-items.ts`
4. Run `vite build` to confirm clean state
```

### Restore Point Checklist
- [ ] Created restore point doc BEFORE any code changes
- [ ] Listed all prior phase statuses
- [ ] Listed all files to be created
- [ ] Listed all files to be modified
- [ ] Included rollback instructions
- [ ] Confirmed doc location matches naming convention

---

## Forbidden Touches List

When implementing a new CRUD module, the following are **OFF-LIMITS**:

| Category | Items |
|----------|-------|
| **Auth** | ❌ `AuthContext.tsx`, `useAuthContext` hook implementation |
| **Shared Components** | ❌ `ComponentContainerCard`, `PageTitle`, `FallbackLoading` |
| **Other Modules** | ❌ Any files in other module folders (A1–A8) |
| **Database** | ❌ RLS policies, schema changes, migrations |
| **Public App** | ❌ Any files in `apps/public/` |
| **Theme** | ❌ `_variables.scss`, `tailwind.config.ts`, `index.css` |
| **Routes (other)** | ❌ Existing routes — only ADD new route |
| **Menu (other)** | ❌ Existing menu items — only ADD new item |
| **Patterns** | ❌ `userRoles`, `includes('admin')`, `localStorage` role checks |
| **Imports** | ❌ Footer component in page files |

---

## Verification Checklist Template

Copy this checklist for each new module implementation:

```markdown
## Verification Checklist for Phase A{X} — {Module} CRUD

| # | Check | Status |
|---|-------|--------|
| 1 | `vite build` passes without errors | ⬜ |
| 2 | Route loads via sidebar navigation | ⬜ |
| 3 | Route loads via direct URL | ⬜ |
| 4 | No blank screen on navigation | ⬜ |
| 5 | No console errors on load | ⬜ |
| 6 | List renders with correct columns | ⬜ |
| 7 | Create works + required field validation | ⬜ |
| 8 | Edit works + data pre-populated | ⬜ |
| 9 | Toggle is_active works | ⬜ |
| 10 | Toggle is_featured works | ⬜ |
| 11 | Admin-only delete enforced (UI) | ⬜ |
| 12 | Admin-only delete enforced (DB) | ⬜ |
| 13 | Empty text fields saved as NULL | ⬜ |
| 14 | Empty/invalid numeric saved as 0 or NULL | ⬜ |
| 15 | Scope discipline: no forbidden files touched | ⬜ |

### Verification Outcome
- **Result:** PASS / FAIL
- **Date:** {YYYY-MM-DD}
- **Notes:** {Any issues encountered}
```

---

## Quick Reference: Module Implementation Steps

1. **Pre-flight:** Create restore point document
2. **Schema Check:** Verify table name and fields in Supabase types
3. **Route:** Add lazy import + route in `routes/index.tsx`
4. **Menu:** Add menu item in `menu-items.ts`
5. **Page:** Create `page.tsx` with list view
6. **Form:** Create `{Module}Form.tsx` with correct tab structure
7. **Delete:** Create `{Module}DeleteModal.tsx` (admin-only)
8. **Test:** Run through verification checklist
9. **Docs:** Update Tasks.md, backend.md, architecture.md

---

**End of CRUD Module Pattern Documentation**
