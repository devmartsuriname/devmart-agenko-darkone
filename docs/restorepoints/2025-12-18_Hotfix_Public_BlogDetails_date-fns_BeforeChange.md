# Restore Point: Hotfix - Public App date-fns Dependency

**Created:** 2025-12-18  
**Completed:** 2025-12-18  
**Phase:** Hotfix - Missing Dependency  
**Status:** ✅ COMPLETED

---

## Error Message

```
[plugin:vite:import-analysis] Failed to resolve import "date-fns" from "apps/public/src/components/Pages/BlogDetailsPage.jsx". Does the file exist?
```

---

## Root Cause

- `BlogDetailsPage.jsx` imports `{ format } from "date-fns"`
- `apps/public/package.json` does NOT list `date-fns` as a dependency
- This repo is NOT a workspace monorepo — each app must declare its own dependencies
- Vite cannot resolve the import because `date-fns` is not installed in `apps/public/node_modules`

---

## Files Modified

| File | Change Type | Description |
|------|-------------|-------------|
| `apps/public/package.json` | MODIFY | Add `"date-fns": "^3.6.0"` to dependencies |

---

## Rollback Instructions

```bash
# Option 1: Git revert
git log --oneline -5
git revert <commit-hash>

# Option 2: Manual revert
# Remove "date-fns": "^3.6.0" from apps/public/package.json
# Run: cd apps/public && npm install
```

---

## Verification Checklist

- [x] `cd apps/public && npm install` completes without error
- [x] `npm run dev` starts without import-analysis error
- [x] Public app homepage loads correctly (confirmed via screenshot)
- [x] No Admin app changes
- [ ] No schema/RLS changes

---

## Notes

- Version `^3.6.0` matches root package.json for consistency
- This is a dependency-wiring fix only
