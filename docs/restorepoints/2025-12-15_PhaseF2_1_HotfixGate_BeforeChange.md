# Restore Point: Phase F2.1 Hotfix Gate

## Timestamp
2025-12-15T02:30:00Z

## Phase
Phase F2.1 — CMS Wiring Hotfix Gate

## Confirmation
Phase F2 complete. This hotfix addresses contract gaps before F3.

## Gaps Being Fixed
1. site_settings not consumed in frontend (hook exists but unused)
2. pages table not wired for slug-based page fetching
3. FAQ is inline in Home, not standalone /faq route per contract
4. Newsletter/Contact submission readiness not documented

## Scope of Changes
- Wire site_settings to Layout/Header/Footer
- Wire pages table for About and generic pages
- Create standalone /faq route
- Add TODO markers for newsletter/contact mutations (Phase F4)
- Update documentation

## Files to be Modified
- apps/public/src/App.jsx (add /faq route)
- apps/public/src/components/Layout/index.jsx
- apps/public/src/components/Layout/Layout2.jsx
- apps/public/src/components/Pages/Home.jsx
- apps/public/src/components/Pages/AboutPage.jsx
- apps/public/src/hooks/useContent.js

## Files to be Created
- apps/public/src/components/Pages/FaqPage.jsx

## Rollback Instructions
1. Restore App.jsx to remove /faq route
2. Remove FaqPage.jsx
3. Restore Home.jsx FAQ section
4. Revert Layout changes
