# Restore Point: Frontend CMS Wiring (Phase F2)

## Timestamp
2025-12-15T02:00:00Z

## Phase
Phase F2 — Frontend ↔ CMS Wiring (READ-ONLY)

## Confirmation
No frontend CMS wiring exists before this restore point.
Frontend is currently using static/hardcoded data only.

## Scope of Changes
- Wire Creative Agency homepage to Supabase content tables
- Add read-only Supabase queries for:
  - site_settings
  - hero_sections
  - services
  - projects
  - blog_posts
  - testimonials
  - team_members
  - awards
  - faqs
- Add loading/empty states with static fallbacks
- No mutations, no schema changes, no admin changes

## Files to be Modified
- apps/public/src/components/Pages/Home.jsx
- apps/public/src/components/Hero/index.jsx
- Various section components

## Files to be Created
- apps/public/src/hooks/useSupabaseContent.js (or similar)
- apps/public/src/lib/supabase.js

## Rollback Instructions
1. Delete newly created hook/query files
2. Restore original component files from git
3. Remove Supabase client from public app
