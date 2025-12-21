# Restore Point: Footer Links v1

**Date:** 2025-12-21  
**Phase:** A15 — Simple Footer Links v1  
**Status:** Pre-Implementation

---

## Scope

Add a simple "Footer Links" configuration that lets admins select from existing site pages and reorder them.

### Constraints
- ✅ Footer Links v1 = select existing pages + reorder only
- ❌ NO nested menus
- ❌ NO custom URLs  
- ❌ NO header menu logic
- ❌ NO shared menu builder between header/footer
- ❌ NO Darkone SCSS changes
- ❌ NO Contact Page markup/styling changes
- ✅ Footer rendering remains 1:1 with Zivan template (only data changes)

---

## Database Changes

**New Column in `site_settings`:**

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| `footer_links` | JSONB | NULL | JSON array of footer link items |

**Data Shape:**
```json
[
  { "key": "home", "label": "Home", "href": "/" },
  { "key": "about", "label": "About", "href": "/about" },
  ...
]
```

---

## Files Modified

| App | File | Change |
|-----|------|--------|
| — | DB Migration | Add `footer_links JSONB` column |
| Admin | `apps/admin/src/app/(admin)/system/settings/page.tsx` | Add FooterLinksEditor UI in Footer tab |
| Public | `apps/public/src/context/SiteSettingsContext.jsx` | Add `footer_links: null` default |
| Public | `apps/public/src/components/Footer/index.jsx` | Make Links column dynamic with fallback |
| Docs | `docs/backend.md` | Document new column |
| Docs | `docs/architecture.md` | Update phase status |

---

## Rollback Steps

1. **Database:**
   ```sql
   ALTER TABLE public.site_settings DROP COLUMN IF EXISTS footer_links;
   ```

2. **Admin UI:** Revert `apps/admin/src/app/(admin)/system/settings/page.tsx` to remove FooterLinksEditor

3. **Public Context:** Revert `apps/public/src/context/SiteSettingsContext.jsx` to remove `footer_links` default

4. **Public Footer:** Revert `apps/public/src/components/Footer/index.jsx` to use static `LinksMenuList`

---

## Verification Checklist

| # | Check | Status |
|---|-------|--------|
| 1 | DB: `footer_links` column exists | ⬜ |
| 2 | Admin: Footer tab shows "Footer Links" section | ⬜ |
| 3 | Admin: Selection + reorder works | ⬜ |
| 4 | Admin: Save persists after refresh | ⬜ |
| 5 | Public: Footer shows configured links | ⬜ |
| 6 | Public: Fallback when `footer_links` null/empty | ⬜ |
| 7 | No console errors (Admin + Public) | ⬜ |
| 8 | No Darkone SCSS modified | ⬜ |
| 9 | Contact Page map styling unchanged | ⬜ |

---

## Related Maps Configuration

After implementation, populate in Admin → System → Settings → Footer tab:

| Field | Value |
|-------|-------|
| Map Embed URL | `https://www.google.com/maps?ll=5.811011,-55.21039&z=16&t=m&hl=en&gl=US&mapclient=embed&cid=1270414310031602223` |
| Map Link URL | `https://www.google.com/maps?cid=1270414310031602223` |
