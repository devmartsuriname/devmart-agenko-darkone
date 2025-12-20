# Restore Point: A13 — Public Primary Color Final Fix

**Date:** 2025-12-20  
**Phase:** A13 — Public Primary Color Propagation  
**Status:** Implementing

---

## Scope

Limited to exactly 9 audited orange remnants (items 1-9, backup overrides removed):

| # | Element | File | Fix |
|---|---------|------|-----|
| 1 | Hero video play button SVG | VideoModal/index.jsx | Change fill="#FD6219" to currentColor |
| 2 | IconBox shape SVG | IconBox/index.jsx | Change fill="#FD6219" to currentColor |
| 3 | Testimonial quote icon | _branding.scss | Override .cs_testimonial_icon color |
| 4 | How We Work dashed lines | _branding.scss | Override .cs_working_process_col::before |
| 5 | How We Work circles border | _branding.scss | Override .cs_iconbox.cs_style_6 border |
| 6 | Category badges | _branding.scss | Override .cs_category background |
| 7 | Service icon hover/active | _branding.scss | Override exact style_3 selectors |
| 8 | Image layer backgrounds | _branding.scss | Override .cs_image_layer_in::after |
| 9 | Testimonial slider nav hover | _branding.scss | Override .cs_testimonial_2_wrap nav hover |

---

## Item #7 Dark Mode Fix (Added 2025-12-20)

**Confirmed State:** ACTIVE (not hover) — the orange appears when a service item is selected/clicked, not on hover.

**Root Cause:** `_dark.scss` line 74-75 uses compile-time `$accent` for `.cs_iconbox_3_list .cs_hover_tab.active .cs_iconbox_icon { border-color: $accent; }`

**Fix Applied:** Added dark-mode-scoped override in `_branding.scss`:
```scss
.cs_dark .cs_iconbox_3_list .cs_hover_tab.active .cs_iconbox_icon {
  border-color: var(--cs-primary-color);
  background-color: var(--cs-primary-color);
}
```

**!important:** NOT used — same specificity wins via source order (branding.scss loaded after dark.scss)

---

## Guardian Rules Applied

- **NO backup/safety-net overrides** (items #10, #11 from original audit removed)
- **Narrow service icon selectors** (scoped to .cs_iconbox.cs_style_3 and .cs_iconbox_3_list patterns only)
- **Overrides only** in _branding.scss (no new behavior, no redesign)
- **No Darkone Admin changes**
- **No schema/RLS changes**

---

## Files Modified (Exactly 3)

| App | File | Change Type |
|-----|------|-------------|
| Public | apps/public/src/components/VideoModal/index.jsx | SVG fill fix |
| Public | apps/public/src/components/IconBox/index.jsx | SVG fill fix |
| Public | apps/public/src/sass/_branding.scss | Override additions |

---

## Rollback Commands

```bash
# Revert all changes
git checkout HEAD -- apps/public/src/components/VideoModal/index.jsx
git checkout HEAD -- apps/public/src/components/IconBox/index.jsx
git checkout HEAD -- apps/public/src/sass/_branding.scss
```

---

## Verification Checklist

| # | Page | Element | Expected Behavior |
|---|------|---------|-------------------|
| 1 | Homepage | Hero video play button | Uses var(--cs-primary-color) |
| 2 | Homepage | Service buttons (border + icon) | Uses var(--cs-primary-color) |
| 3 | Homepage | Quote icon | Uses var(--cs-primary-color) |
| 4 | About | How We Work circles | Uses var(--cs-primary-color) |
| 5 | About | How We Work dashed lines | Uses var(--cs-primary-color) |
| 6 | Blog List | Category badge | Uses var(--cs-primary-color) |
| 7 | Blog Detail | Tag badges | Uses var(--cs-primary-color) |
