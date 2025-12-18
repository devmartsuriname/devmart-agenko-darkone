# Restore Point: Phase F7 — Public Newsletter Form Wiring

**Created:** 2025-12-18  
**Phase:** F7 - Public Newsletter Form Wiring  
**Status:** ✅ COMPLETED

---

## Scope

Wire the public newsletter subscribe form (Footer component) to Supabase INSERT for `newsletter_subscribers` table. Handle duplicate emails via Postgres unique violation (error code 23505).

---

## Files Touched

| File | Change Type |
|------|-------------|
| `apps/public/src/components/Footer/index.jsx` | MODIFIED - Add newsletter form wiring |

---

## Rollback Instructions

```bash
# Revert Footer component
git checkout HEAD -- apps/public/src/components/Footer/index.jsx
```

---

## Verification Checklist

- [ ] Public app runs without console errors
- [ ] New email submission creates row in `newsletter_subscribers` with `source='public'`
- [ ] Duplicate email submission shows "already subscribed" message (23505 handling)
- [ ] Form shows loading state while submitting
- [ ] Success message displays after successful subscription
- [ ] No Admin app changes
- [ ] No database/RLS changes

---

## Pre-Change State

- Footer newsletter form had placeholder handler with `console.log` and `alert()`
- No Supabase INSERT was performed
- TODO comments indicated Phase F4/F7 would implement this

---

## Notes

- Supabase client path: `../../lib/supabase`
- INSERT-only approach (no SELECT/UPDATE for anonymous users)
- Relies on existing RLS policy: "Public can subscribe to newsletter" (INSERT for anon)
