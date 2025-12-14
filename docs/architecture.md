# System Architecture

## Monorepo Structure (Verified)

```
/
├── apps/
│   ├── admin/                    # Darkone Admin (COPIED)
│   │   ├── src/                  # TypeScript, SCSS
│   │   │   ├── app/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── helpers/
│   │   │   ├── hooks/
│   │   │   ├── layouts/
│   │   │   ├── routes/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── App.tsx
│   │   │   ├── globle.d.ts
│   │   │   ├── main.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.node.json
│   │   ├── eslint.config.js
│   │   └── .prettierrc.json
│   │
│   └── public/                   # Zivan Public (1:1 COPIED)
│       ├── src/
│       │   ├── components/       # 35 component folders
│       │   ├── helpers/          # FormateNumber.js, PageTitle.js
│       │   ├── sass/             # SCSS styles
│       │   ├── App.jsx
│       │   └── index.jsx
│       ├── public/
│       │   ├── data/
│       │   ├── images/           # 10 image folders + files
│       │   ├── others-image/
│       │   └── ...
│       ├── zivan-documentation/
│       └── package.json
│
├── packages/
│   └── shared/                   # Placeholder
│       ├── package.json
│       └── README.md
│
├── docs/
│   ├── backend.md
│   └── architecture.md
│
├── Darkone-React_v1.0/           # SOURCE (to be removed after verification)
├── zivan-react/                  # SOURCE (to be removed after verification)
└── src/                          # BROKEN root (to be fixed separately)
```

## Apps

### Admin (Darkone)

| Aspect | Detail |
|--------|--------|
| **Location** | `/apps/admin` |
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Bootstrap + Custom SCSS |
| **Purpose** | Content management, CRUD operations |
| **Status** | ✅ Copied from Darkone-React_v1.0 |

### Public (Zivan)

| Aspect | Detail |
|--------|--------|
| **Location** | `/apps/public` |
| **Framework** | React 18 + JSX |
| **Build Tool** | react-scripts (Create React App) |
| **Styling** | Bootstrap + Custom SASS/SCSS |
| **Purpose** | Public-facing website |
| **Status** | ✅ 1:1 copied from zivan-react |

## Package Manager

- **Primary:** Bun
- **Lock files:** Unchanged per user constraint

## Step 3 Verification Status

### Lovable Preview (Root = Admin)
- ✅ Build passes
- ✅ Admin app runs in Lovable preview
- Root `src/` now contains Darkone Admin files (synced from apps/admin/src)

### Local Development Commands
```bash
# Admin (Lovable or local)
cd apps/admin && bun install && bun run dev
# Port: 5173 (Vite)

# Public (local only - react-scripts)
cd apps/public && bun install && bun run start
# Port: 3000 (CRA)
```

### Key Routes Verified

**Admin (apps/admin):**
- `/` - Dashboard
- `/auth/sign-in` - Login page
- `/auth/sign-up` - Register page

**Public (apps/public):**
- `/` - Home (Creative Agency)
- `/service` - Services page
- `/blog` - Blog page
- `/portfolio` - Portfolio page
- `/contact` - Contact page
- `/shop` - Shop page
- `/light/` - Light mode variants

### Key Routes

**Admin (apps/admin):**
- `/` - Dashboard
- `/auth/login` - Login page
- `/auth/register` - Register page

**Public (apps/public):**
- `/` - Home (Creative Agency)
- `/service` - Services page
- `/blog` - Blog page
- `/portfolio` - Portfolio page
- `/contact` - Contact page
- `/shop` - Shop page
- `/light/` - Light mode variants

## Key Decisions

1. **No refactoring:** Both apps maintain original structure
2. **Separate styling:** SCSS (admin) vs SASS (public) - no mixing
3. **JSX preserved:** Zivan remains JSX, no TSX conversion
4. **react-scripts preserved:** Zivan build tool unchanged

## Step 2 Status

- ✅ Folder structure created
- ✅ Darkone copied to /apps/admin
- ✅ Zivan copied 1:1 to /apps/public
- ✅ packages/shared placeholder created
- ✅ docs/ created with backend.md and architecture.md
- ⏸️ Root src/ remains broken (separate fix needed)
- ⏸️ Source folders not yet deleted (awaiting verification)

---

*Last updated: Step 2 Complete - Repo Split Executed*
