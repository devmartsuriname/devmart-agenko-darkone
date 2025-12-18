# Restore Point: Hotfix - Public App date-fns Dependency

**Created:** 2025-12-18  
**Phase:** Hotfix - Missing Dependency  
**Status:** BEFORE CHANGES

---

## Error Message

```
[vite] Internal server error: Failed to resolve import "date-fns" from "apps/public/src/components/Pages/BlogDetailsPage.jsx". Does the file exist?
Plugin: vite:import-analysis
```

---

## Root Cause

- `BlogDetailsPage.jsx` imports `{ format } from "date-fns"`
- `apps/public/package.json` does not list `date-fns` as a dependency
- Vite cannot resolve the import in the public app workspace

---

## Files to Be Modified

| File | Change Type | Description |
|------|-------------|-------------|
| `apps/public/package.json` | MODIFY | Add `date-fns` dependency |
| `docs/backend.md` | UPDATE | Document hotfix |
| `docs/architecture.md` | UPDATE | Document hotfix |

---

## Rollback Instructions

```bash
# Option 1: Git revert (if committed)
git log --oneline -5  # Find the commit hash
git revert <commit-hash>

# Option 2: Manual revert
# Remove "date-fns": "^3.6.0" from apps/public/package.json dependencies
# Run npm install / yarn at repo root to update lockfile
```

---

## Verification Checklist

- [ ] `vite dev` starts without import-analysis error
- [ ] `vite build` for apps/public succeeds
- [ ] Blog details page renders dates correctly
- [ ] No changes to Admin app
- [ ] No schema/RLS changes

---

## Notes

- Using `date-fns` version `^3.6.0` to match root package.json
- This is a workspace dependency wiring fix only
