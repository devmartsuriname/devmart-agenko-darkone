# Restore Point: Phase A13 — Site Settings Admin UI Expansion + Public Primary Color Fix

**Created:** 2025-12-20  
**Phase:** A13 — Site Settings Module Completion + Public Color Fix  
**Status:** Pre-implementation checkpoint

---

## Scope

**Admin (apps/admin):**
- Expand Settings page to expose all 23 missing `site_settings` fields
- Organize into tabbed sections: General, Branding, SEO, Social Links, Footer, CTA, Newsletter
- Use existing Darkone form patterns (react-bootstrap)
- NO SCSS/theme modifications

**Public (apps/public):**
- Fix button styling to match Zivan demo (transparent+border default, fill on hover)
- Replace hardcoded `#fd6219` with `var(--cs-primary-color)` where proven by audit
- NO schema changes, NO RLS changes

---

## Hard Rules (Restated)

1. **Monorepo apps are split:** apps/admin (Darkone SCSS) vs apps/public (Zivan styling)
2. **NO Darkone SCSS touched** — Public color fixes happen ONLY inside apps/public
3. **NO schema changes** unless explicitly instructed
4. **NO RLS changes** unless explicitly instructed
5. **No refactors** — only targeted fixes required for this step
6. **If build fails or unexpected coupling → STOP and report**

---

## Public Primary Color Audit Report

### Search Results Summary

| Pattern | Matches | Files |
|---------|---------|-------|
| `#fd6219` | 118 | 20 (mostly SVG icons in /images/icons/) |
| `orange` | 0 | 0 |
| `$accent` | 421 | 20 SCSS files (compile-time, expected) |
| `cs-primary-color` | 79 | 2 files (_branding.scss, BrandingProvider.jsx) |

### Hardcoded `#fd6219` in SCSS Files Requiring Fix

| File | Line | Snippet | Type | Action |
|------|------|---------|------|--------|
| `apps/public/src/sass/shortcode/_iconbox.scss` | 94 | `background: #fd6219;` | Hardcoded hex | Replace with `var(--cs-primary-color)` |
| `apps/public/src/sass/common/_general.scss` | 504 | `background-color: #fd6219;` | Hardcoded hex | Replace with `var(--cs-primary-color)` |
| `apps/public/src/sass/_branding.scss` | 13 | `--cs-primary-color: #fd6219;` | CSS var default | KEEP (fallback, overridden at runtime) |
| `apps/public/src/components/BrandingProvider.jsx` | 11 | `const DEFAULT_PRIMARY_COLOR = '#fd6219';` | JS fallback | KEEP (fallback, expected) |

### Hardcoded `#fd6219` in SVG Icons (NOT FIXING)

SVG icons in `apps/public/public/images/icons/` contain baked-in `#fd6219` colors. These are static assets and intentionally NOT changed — they would require re-exporting the icons or runtime SVG manipulation, which is out of scope.

### Button Styling Issue in `_branding.scss`

**Current (WRONG):**
```scss
.cs_btn.cs_style_1 {
  background-color: var(--cs-primary-color) !important;  // <-- Breaks transparent default
  
  &:hover {
    background-color: var(--cs-primary-color) !important;
    filter: brightness(1.1);
  }
}
```

**Required (Zivan demo behavior):**
- Default: transparent background + primary border + primary icon/text
- Hover: primary background fill + white text/icon

**Fix:**
```scss
.cs_btn.cs_style_1 {
  border-color: var(--cs-primary-color) !important;
  // NO background-color on default (keep transparent from _general.scss line 301)
  
  &:hover {
    background-color: var(--cs-primary-color) !important;
    border-color: var(--cs-primary-color) !important;
  }
}
```

---

## Files To Be Modified

### Admin App (apps/admin)
| File | Change |
|------|--------|
| `apps/admin/src/app/(admin)/system/settings/page.tsx` | Expand to expose all 23 fields in tabbed UI |

### Public App (apps/public)
| File | Change |
|------|--------|
| `apps/public/src/sass/_branding.scss` | Fix button styling (remove default bg, keep border) |
| `apps/public/src/sass/shortcode/_iconbox.scss` | Line 94: Replace `#fd6219` → `var(--cs-primary-color)` |
| `apps/public/src/sass/common/_general.scss` | Line 504: Replace `#fd6219` → `var(--cs-primary-color)` |

### Documentation
| File | Change |
|------|--------|
| `docs/backend.md` | Add Phase A13 completion status |
| `docs/architecture.md` | Add Phase A13 completion status |

---

## Rollback Steps

### Admin App
Restore original `page.tsx` from Git:
```bash
git checkout HEAD -- apps/admin/src/app/\(admin\)/system/settings/page.tsx
```

### Public App
Restore SCSS files:
```bash
git checkout HEAD -- apps/public/src/sass/_branding.scss
git checkout HEAD -- apps/public/src/sass/shortcode/_iconbox.scss
git checkout HEAD -- apps/public/src/sass/common/_general.scss
```

---

## Verification Checklist

### Admin Checks
| # | Check | Status |
|---|-------|--------|
| 1 | Settings page renders clean | ⬜ |
| 2 | All 23 fields visible in tabbed UI | ⬜ |
| 3 | All fields save/persist correctly | ⬜ |
| 4 | RBAC works (Admin edits, Editor views) | ⬜ |
| 5 | No console errors | ⬜ |

### Public Checks
| # | Check | Status |
|---|-------|--------|
| 6 | No visible orange remnants (except SVG icons) | ⬜ |
| 7 | primary_color from DB applies site-wide | ⬜ |
| 8 | Buttons: transparent+border default | ⬜ |
| 9 | Buttons: primary fill on hover, readable text | ⬜ |
| 10 | Homepage renders correctly | ⬜ |
| 11 | Services/Contact page renders correctly | ⬜ |

### Build Checks
| # | Check | Status |
|---|-------|--------|
| 12 | apps/admin builds | ⬜ |
| 13 | apps/public builds | ⬜ |

---

## Stop Condition

- Do NOT proceed to F9 (CTA Wiring) or any other module after this step
- Report completion + checklist + audit proof
