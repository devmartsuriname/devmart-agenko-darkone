# Shared UI Package

> **⚠️ DO NOT IMPORT FROM HERE YET**
> 
> This package is a placeholder for future shared UI components.
> It is not wired into the build system and contains no active code.

## Purpose

This package will eventually contain UI components that are shared between:
- `apps/admin` (Darkone Admin)
- `apps/public` (Zivan Public)

## Current Status

**Status:** PLACEHOLDER ONLY

- No active components
- No build configuration
- No exports

## Future Migration Strategy

1. **Phase 1 (Current):** Placeholder structure created
2. **Phase 2:** Identify truly shared components (icons, base tokens)
3. **Phase 3:** Create build configuration with proper exports
4. **Phase 4:** Migrate shared components with backwards compatibility
5. **Phase 5:** Update imports in apps to use shared package

## Structure (Planned)

```
packages/shared/ui/
├── components/     # Shared React components
├── tokens/         # Design tokens (colors, spacing, typography)
├── docs/           # Component documentation
├── package.json    # (future) Package configuration
└── tsconfig.json   # (future) TypeScript configuration
```

## Rules

1. **DO NOT** import from this package in any app code
2. **DO NOT** add components here without explicit approval
3. **DO NOT** create build configuration without migration plan
4. Keep Darkone (SCSS) and Zivan (SASS) styling separate until migration

## Related Documentation

- `/docs/demo-library/` - Demo Library Registry and Theme docs
- `/docs/architecture.md` - Overall project architecture

---

*Last updated: 2025-12-14 - Placeholder only*
