# Restore Point: F5 — Frontend Detail Pages Wiring

**Created:** 2025-12-18  
**Phase:** F5 — Frontend Detail Pages Wiring  
**Status:** Before Implementation

---

## Scope

Wire 5 public frontend detail pages to fetch dynamic data from Supabase instead of using hardcoded content.

### Pages to Modify

| Page | File | Hook to Use | Table |
|------|------|-------------|-------|
| ServiceDetailsPage | `apps/public/src/components/Pages/ServiceDetailsPage.jsx` | `useService(slug)` | `services` |
| PortfolioDetailsPage | `apps/public/src/components/Pages/PortfolioDetailsPage.jsx` | `useProject(slug)` | `projects` |
| BlogDetailsPage | `apps/public/src/components/Pages/BlogDetailsPage.jsx` | `useBlogPost(slug)` | `blog_posts` |
| TeamDetailsPage | `apps/public/src/components/Pages/TeamDetailsPage.jsx` | `useTeamMember(slug)` | `team_members` |
| AboutPage | `apps/public/src/components/Pages/AboutPage.jsx` | `useTeamMembers()` | `team_members` |

---

## Files to Be Modified

### Source Files (F5 Implementation)
```
apps/public/src/components/Pages/ServiceDetailsPage.jsx
apps/public/src/components/Pages/PortfolioDetailsPage.jsx
apps/public/src/components/Pages/BlogDetailsPage.jsx
apps/public/src/components/Pages/TeamDetailsPage.jsx
apps/public/src/components/Pages/AboutPage.jsx
```

### Documentation Files
```
docs/backend.md
docs/architecture.md
```

### Files NOT Modified (Constraints)
- No database schema changes
- No RLS policy changes
- No new routes or menu items
- No AuthContext, RBAC, or ComponentContainerCard changes
- No UI redesign

---

## Pre-Change State

### ServiceDetailsPage.jsx
- Hardcoded: "On Page Optimization" service
- Hardcoded: Keywords, SEO Writing, Visual Assets, Image Optimization cards
- No slug parameter reading
- 92 lines

### PortfolioDetailsPage.jsx
- Hardcoded: "Awesome colorful artwork" project
- Hardcoded: Client info (Andrew romania, United Kingdom, $2500)
- Hardcoded: Gallery images (3 static images)
- No slug parameter reading
- 104 lines

### BlogDetailsPage.jsx
- Hardcoded: "Stay up to date with our latest blog post"
- Hardcoded: Marketing category, 07 Mar 2022 date
- Hardcoded: All blog content paragraphs
- No slug parameter reading
- 202 lines

### TeamDetailsPage.jsx
- Hardcoded: "James Berline" / "React Developer"
- Hardcoded: Bio text
- Hardcoded: Progress bars (React 75%, Front-End 85%, SQL 80%)
- No slug parameter reading
- 59 lines

### AboutPage.jsx
- Hardcoded: `teamData` array (8 items, 4 unique members repeated)
- Lines 21-70 contain static team data
- Other sections (funfact, brands, about) remain static
- 195 lines

---

## Rollback Instructions

### Git Revert
```bash
# Identify the commit before F5 changes
git log --oneline -10

# Revert to pre-F5 state
git revert <commit-hash>

# Or reset to specific commit
git reset --hard <commit-hash>
```

### Manual Restore
If git history is not available, restore files from this restore point by:
1. Copy the original file contents from the "Pre-Change State" section above
2. Replace modified files with originals
3. Remove this restore point document from tracking

---

## Verification Checklist (Skeleton)

### Build / Runtime
- [ ] `vite build` passes
- [ ] No console errors on public pages

### F5 Pages
- [ ] `/service/:slug` loads correct data from `services` table via hook
- [ ] `/portfolio/:slug` loads correct data from `projects` table via hook
- [ ] `/blog/:slug` loads correct data from `blog_posts` table via hook
- [ ] `/team/:slug` loads correct data from `team_members` table via hook
- [ ] `/about` team section uses real `team_members` data (no hardcoded array remains)

### Scope Discipline
- [ ] Confirm ONLY the F5 files + restorepoint + docs were changed
- [ ] Confirm no routes/menu items were added/modified
- [ ] Confirm no AuthContext/RBAC/ComponentContainerCard changes

---

## Implementation Notes

### Hooks Available (from `apps/public/src/hooks/useContent.js`)
- `useService(slug)` — returns `{ service, loading, error }`
- `useProject(slug)` — returns `{ project, loading, error }`
- `useBlogPost(slug)` — returns `{ post, loading, error }`
- `useTeamMember(slug)` — returns `{ member, loading, error }`
- `useTeamMembers()` — returns `{ members, loading, error }`

### URL Parameter Names (from existing routes in App.jsx)
- `/service/:serviceDetailsId`
- `/portfolio/:portfolioDetailsId`
- `/blog/:blogDetailsId`
- `/team/:teamDetailsId`

### Field Mapping Requirements
Map hook data fields to existing UI components:
- Service: `title`, `short_description`, `content`, `image_url`
- Project: `title`, `content`, `featured_image_url`, `gallery_urls`, `client_name`, `category`
- BlogPost: `title`, `content`, `featured_image_url`, `category`, `published_at`, `tags`
- TeamMember: `name`, `role`, `bio`, `avatar_url`
- TeamMembers (list): `avatar_url` → `memberImg`, `name` → `memberName`, `role` → `memberDesignation`, `slug` → `href`
