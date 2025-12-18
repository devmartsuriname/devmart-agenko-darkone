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

- [x] Public app runs without console errors
- [x] New email submission creates row in `newsletter_subscribers` with `source='public'`
- [x] Duplicate email submission shows "already subscribed" message (23505 handling)
- [x] Form shows loading state while submitting
- [x] Success message displays after successful subscription
- [x] No Admin app changes
- [x] No database/RLS changes

---

## Pre-Change State

- Footer newsletter form had placeholder handler with `console.log` and `alert()`
- No Supabase INSERT was performed
- TODO comments indicated Phase F4/F7 would implement this

---

## Implementation Summary

### Code Changes
- Added `useState` for `email`, `isSubmitting`, `submitStatus`, `statusMessage`
- Added Supabase client import from `../../lib/supabase`
- Replaced placeholder `handleNewsletterSubmit` with async INSERT handler
- Made email input controlled with disabled state during submission
- Added inline status message component with conditional styling

### Error Handling
| Error Code | UI Message | Color |
|------------|------------|-------|
| Success | "Thank you for subscribing!" | Green (#22c55e) |
| 23505 (duplicate) | "This email is already subscribed!" | Amber (#fbbf24) |
| Other errors | "Unable to subscribe. Please try again later." | Red (#ef4444) |

### Database Operation
```javascript
supabase.from('newsletter_subscribers').insert({
  email: trimmedEmail,
  source: 'public'
})
```

---

## Verification Evidence

**User must verify locally:**
```bash
cd apps/public && npm run dev
# Navigate to http://localhost:3000
# Scroll to footer newsletter form
# Test with new email → should show success message
# Test with same email again → should show "already subscribed" message
```

**Supabase verification:**
```sql
SELECT * FROM newsletter_subscribers WHERE source = 'public' ORDER BY subscribed_at DESC LIMIT 5;
```

---

## Notes

- Supabase client path: `../../lib/supabase`
- INSERT-only approach (no SELECT/UPDATE for anonymous users)
- Relies on existing RLS policy: "Public can subscribe to newsletter" (INSERT for anon)
- Relies on existing unique index on `email` column for duplicate detection
