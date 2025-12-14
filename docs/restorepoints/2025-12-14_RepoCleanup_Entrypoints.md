# Restore Point: Repo Cleanup & Entrypoints Verification

**Date:** 2025-12-14  
**Step:** Repo Cleanup & Entrypoint Verification  
**Purpose:** Capture state before cleanup of legacy folders and postcss isolation

---

## Pre-Cleanup Folder Tree

### Root Level
```
/
├── Darkone-React_v1.0/        # LEGACY - to be deleted
├── zivan-react/               # LEGACY - to be deleted
├── apps/
│   ├── admin/                 # CANONICAL - Darkone Admin
│   └── public/                # CANONICAL - Zivan Public
├── docs/
├── node_modules/
├── packages/
├── public/
├── src/                       # ROOT src - may be obsolete
├── .git
├── .gitignore
├── README.md
├── bun.lock
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.app.tsbuildinfo
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.node.tsbuildinfo
└── vite.config.ts
```

### apps/admin (Darkone)
```
apps/admin/
├── node_modules/
├── public/
├── src/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── helpers/
│   ├── hooks/
│   ├── layouts/
│   ├── routes/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── globle.d.ts
│   ├── main.tsx
│   └── vite-env.d.ts
├── .prettierrc.json
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### apps/public (Zivan)
```
apps/public/
├── public/
├── src/
│   ├── components/
│   ├── helpers/
│   ├── sass/
│   ├── App.jsx
│   ├── index.jsx
│   └── main.jsx
├── zivan-documentation/
├── index.html
├── package.json
└── vite.config.js
```

---

## Root Config Files (Pre-Cleanup)

| File | Purpose | Notes |
|------|---------|-------|
| `package.json` | Root monorepo deps | READ-ONLY |
| `vite.config.ts` | Root Vite config (Admin) | Used by Lovable preview |
| `tailwind.config.ts` | Root Tailwind | Admin styling |
| `postcss.config.js` | Root PostCSS | May need isolation |
| `tsconfig.json` | Root TypeScript | Admin typing |
| `eslint.config.js` | Root ESLint | Admin linting |
| `components.json` | Shadcn config | Admin UI |
| `index.html` | Root entry | Admin app |

---

## Entry File Status (Pre-Cleanup)

| App | index.html Entry | Entry File Exists | Status |
|-----|------------------|-------------------|--------|
| Admin | `/src/main.tsx` | ✅ Yes | OK |
| Public | `/src/main.jsx` | ✅ Yes | OK |

---

## Restoration Instructions

If issues occur, revert to this state:
1. Restore `Darkone-React_v1.0/` from git history
2. Restore `zivan-react/` from git history
3. Restore any deleted root files from git history

```bash
# To restore deleted folders
git checkout HEAD~1 -- Darkone-React_v1.0/
git checkout HEAD~1 -- zivan-react/
```

---

*Created: 2025-12-14*
