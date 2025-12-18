# Restore Point: F6 Public Contact Form Wiring

**Created:** 2025-12-18  
**Phase:** F6 - Public Contact Form Submission Wiring  
**Status:** BEFORE CHANGES

---

## Scope

Wire the public Contact page form to INSERT into `contact_submissions` table:
- Form submission handler with validation
- Success/error notifications
- Loading state to prevent double submit
- Form reset on success

---

## Files to Be Modified

| File | Change Type | Description |
|------|-------------|-------------|
| `apps/public/src/components/Pages/ContactPage.jsx` | MODIFY | Wire form submit to Supabase INSERT |
| `docs/backend.md` | UPDATE | Document F6 completion |
| `docs/architecture.md` | UPDATE | Document F6 completion |

---

## Files NOT to Touch

- `apps/admin/*` - No admin changes
- `routes/index.tsx` - No route changes
- `menu-items.ts` - No menu changes
- `AuthContext` - No auth changes
- `ComponentContainerCard` - No component changes
- DB schema / migrations / RLS - No database changes

---

## Rollback Instructions

If issues arise after implementation:

```bash
# Option 1: Git revert (if committed)
git log --oneline -5  # Find the commit hash
git revert <commit-hash>

# Option 2: Manual revert
# Restore ContactPage.jsx to previous state (remove useState, handleContactSubmit logic)
# The original placeholder simply showed alert('Contact form submission coming soon!')
```

---

## Verification Checklist (Skeleton)

### Build / Runtime
- [ ] `vite build` passes for public app
- [ ] No console errors on Contact page load

### Functionality
- [ ] Submit valid form → row appears in `contact_submissions`
- [ ] Submit empty required field → validation blocks submission
- [ ] Submit invalid email → validation blocks submission
- [ ] Loading state prevents double submit
- [ ] Success → notification shown + form cleared
- [ ] Error → notification shown + form preserved

### Scope Discipline
- [ ] No changes in `apps/admin/*`
- [ ] No route changes
- [ ] No menu changes
- [ ] No schema/RLS changes

---

## Database Reference

**Table:** `contact_submissions`

| Column | Type | Required | Default |
|--------|------|----------|---------|
| id | uuid | auto | gen_random_uuid() |
| name | text | YES | - |
| email | text | YES | - |
| subject | text | no | null |
| message | text | YES | - |
| status | text | no | 'new' |
| created_at | timestamptz | auto | now() |
| ip_address | text | no | null |
| user_agent | text | no | null |

**RLS Policy:** "Public can submit contact form" - INSERT allowed with `with_check: true`

---

## Notes

- Public app uses simple `alert()` for notifications (no toast library installed)
- Will use inline success/error states for better UX than alert()
- Supabase client already configured in `apps/public/src/lib/supabase.js`
