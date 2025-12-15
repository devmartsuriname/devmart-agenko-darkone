# Restore Point: Phase F4 — Seed CMS Content Data

**Date:** 2025-12-15  
**Phase:** F4 — Content Seeding  
**Status:** Before Change

## Purpose

Capture state before seeding CMS content data for public frontend rendering.

## Current Row Counts (Before Seeding)

| Table | Count |
|-------|-------|
| `site_settings` | 1 |
| `hero_sections` | 1 |
| `services` | 0 |
| `projects` | 0 |
| `testimonials` | 0 |
| `team_members` | 0 |
| `blog_posts` | 0 |
| `awards` | 0 |
| `faqs` | 0 |
| `pages` | 1 |
| `newsletter_subscribers` | 0 (not seeding PII) |
| `contact_submissions` | 0 (not seeding PII) |

## Schema Status

- ✅ No schema changes in this phase
- All tables exist with expected columns per Content Data Model

## Seed Strategy

1. `seed_content_core.sql` - team_members, services, pages
2. `seed_content_homepage.sql` - projects, testimonials, awards, blog_posts, faqs, site_settings update

## Rollback Instructions

1. If issues arise, delete seeded rows using the deterministic slugs/IDs
2. Run: `DELETE FROM table WHERE slug IN ('seeded-slug-1', 'seeded-slug-2', ...)`
