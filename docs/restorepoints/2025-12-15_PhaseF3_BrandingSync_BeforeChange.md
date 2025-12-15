# Restore Point: Phase F3 — Branding & Theme Sync

**Date:** 2025-12-15  
**Phase:** F3 — Branding Sync  
**Status:** Before Change

## Purpose

Capture state before implementing Devmart branding sync (frontend primary color from CMS).

## Current State

### site_settings Table Fields Used by Frontend
- `site_name` - Used in Header/Footer
- `tagline` - Used in Footer
- `logo_light_url` / `logo_dark_url` - Used in Header/Footer
- `footer_copyright` - Used in Footer
- `social_*` links - Used in Footer
- `newsletter_*` - Footer newsletter section
- `cta_*` - CTA section
- `primary_color` (text, default '#7e67fe') - **NOT YET USED** (target for this phase)

### Frontend Reads site_settings From
- `apps/public/src/context/SiteSettingsContext.jsx` - Provider using `useSiteSettings()`
- `apps/public/src/hooks/useContent.js` - Hook definition

### Current Frontend Color System
- SCSS variables defined in `apps/public/src/sass/default/_color_variable.scss`
- `$accent: #fd6219` - Current static accent/primary color
- No runtime CSS variable injection from CMS

### Admin Settings Page
- `apps/admin/src/app/(admin)/system/settings/page.tsx` - Placeholder page, no functionality

## Files to be Modified

### Admin
- `apps/admin/src/app/(admin)/system/settings/page.tsx` - Add branding settings UI

### Public Frontend
- `apps/public/src/App.jsx` - Apply primary color CSS variable
- `apps/public/src/context/SiteSettingsContext.jsx` - Ensure primary_color is available

## Rollback Instructions

1. Revert files to this commit if issues arise
2. All changes are additive; original SCSS remains unchanged
