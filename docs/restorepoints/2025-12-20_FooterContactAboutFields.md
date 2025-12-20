# Restore Point: Footer Contact + About Fields

**Created:** 2025-12-20  
**Scope:** Footer About + Contact Info + Map URLs in site_settings, wired to Public Footer + Contact page

---

## Phase Overview

Add 10 new columns to `site_settings` table and wire them to:
1. Admin Settings → Footer tab (expanded UI)
2. Public Footer → About section + contact info
3. Public Contact Page → Contact info + Map section

---

## Files Modified

| App | File | Change |
|-----|------|--------|
| DB | Migration | Add 10 columns to `site_settings` |
| Admin | `apps/admin/src/app/(admin)/system/settings/page.tsx` | Extend interface, state, Footer tab UI |
| Public | `apps/public/src/context/SiteSettingsContext.jsx` | Add default fallbacks |
| Public | `apps/public/src/components/Footer/index.jsx` | Wire About + Contact from settings |
| Public | `apps/public/src/components/Pages/ContactPage.jsx` | Wire Contact info + Map from settings |
| Docs | `docs/backend.md` | Document changes |
| Docs | `docs/architecture.md` | Update phase status |

---

## New Database Columns

```sql
-- Footer About Section
footer_about_title TEXT
footer_about_description TEXT

-- Contact Info (shared with Contact Page)
contact_email TEXT
contact_phone TEXT
contact_address_line1 TEXT
contact_address_line2 TEXT
contact_city TEXT
contact_country TEXT

-- Map
contact_map_embed_url TEXT
contact_map_link_url TEXT
```

All columns are nullable (optional).

---

## Rollback Commands

If needed, remove the columns:

```sql
ALTER TABLE public.site_settings DROP COLUMN IF EXISTS footer_about_title;
ALTER TABLE public.site_settings DROP COLUMN IF EXISTS footer_about_description;
ALTER TABLE public.site_settings DROP COLUMN IF EXISTS contact_email;
ALTER TABLE public.site_settings DROP COLUMN IF EXISTS contact_phone;
ALTER TABLE public.site_settings DROP COLUMN IF EXISTS contact_address_line1;
ALTER TABLE public.site_settings DROP COLUMN IF EXISTS contact_address_line2;
ALTER TABLE public.site_settings DROP COLUMN IF EXISTS contact_city;
ALTER TABLE public.site_settings DROP COLUMN IF EXISTS contact_country;
ALTER TABLE public.site_settings DROP COLUMN IF EXISTS contact_map_embed_url;
ALTER TABLE public.site_settings DROP COLUMN IF EXISTS contact_map_link_url;
```

---

## Verification Checklist

| # | Check | Expected |
|---|-------|----------|
| 1 | Admin Settings → Footer tab | Shows new fields: About title/description, Contact info (6 fields), Map URLs (2 fields) |
| 2 | Save All Settings | Persists all new fields without error |
| 3 | Public Footer | Shows About title/description from settings (or fallback) |
| 4 | Public Footer | Shows compact contact info if provided |
| 5 | Public Contact Page | Shows Email/Phone/Address from settings (or fallback) |
| 6 | Public Contact Page + Map embed URL filled | Shows iframe with embed |
| 7 | Public Contact Page + Map link only | Shows "View on Google Maps" button |
| 8 | Public Contact Page + No map settings | Shows original placeholder embed |
| 9 | No console errors in Admin | ✓ |
| 10 | No console errors in Public | ✓ |
| 11 | No Darkone Admin SCSS changes | ✓ |
| 12 | No cross-app styling changes | ✓ |
| 13 | Public read access still works (RLS) | ✓ |

---

## Constraints Followed

- ✅ No Darkone global SCSS changes
- ✅ No cross-app styling changes
- ✅ Uses existing settings persistence mechanism
- ✅ No menu builder (simple field approach)
- ✅ Fallback to current static values when empty
- ✅ No "Google Maps API" terminology in UI labels
