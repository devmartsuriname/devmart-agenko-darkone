# System Architecture

## Monorepo Structure (Verified & Cleaned)

```
/
├── apps/
│   ├── admin/                    # CANONICAL - Darkone Admin
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
│   └── public/                   # CANONICAL - Zivan Public
│       ├── src/
│       │   ├── components/       # 35 component folders
│       │   ├── helpers/          # FormateNumber.js, PageTitle.js
│       │   ├── sass/             # SCSS styles
│       │   ├── App.jsx
│       │   ├── index.jsx
│       │   └── main.jsx
│       ├── public/
│       │   ├── data/
│       │   ├── images/
│       │   └── ...
│       ├── zivan-documentation/
│       ├── index.html
│       ├── package.json
│       ├── vite.config.js
│       └── postcss.config.cjs    # Isolated PostCSS config
│
├── packages/
│   └── shared/                   # Placeholder for future shared code
│       ├── package.json
│       └── README.md
│
├── docs/
│   ├── restorepoints/            # Restore point snapshots
│   │   └── 2025-12-14_RepoCleanup_Entrypoints.md
│   ├── backend.md
│   └── architecture.md
│
├── src/                          # Lovable system files (DO NOT MODIFY)
│   └── tailwind.config.lov.json
│
└── [Root config files]           # Vite, TypeScript, Tailwind for Admin
```

## Legacy Folders (REMOVED)

The following legacy folders have been deleted as they were redundant after the monorepo split:
- `Darkone-React_v1.0/` - Replaced by `apps/admin/`
- `zivan-react/` - Replaced by `apps/public/`

---

## Apps

### Admin (Darkone)

| Aspect | Detail |
|--------|--------|
| **Location** | `/apps/admin` |
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Bootstrap + Custom SCSS |
| **Entry File** | `src/main.tsx` |
| **Purpose** | Content management, CRUD operations |
| **Status** | ✅ Ready |

### Public (Zivan)

| Aspect | Detail |
|--------|--------|
| **Location** | `/apps/public` |
| **Framework** | React 18 + JSX |
| **Build Tool** | Vite |
| **Styling** | Bootstrap + Custom SASS/SCSS |
| **Entry File** | `src/main.jsx` |
| **PostCSS** | Isolated (`postcss.config.cjs`) |
| **Purpose** | Public-facing website |
| **Status** | ✅ Ready |

## Package Manager

- **Primary:** Bun
- **Lock files:** `bun.lockb` (single source of truth)

---

## Development Commands

### Admin App (Darkone)
```bash
cd apps/admin && bun install && bun run dev
# Port: 5173
```

### Public App (Zivan)
```bash
cd apps/public && bun install && bun run dev
# Port: 3000
```

### Run Both Apps (Local)
```bash
# Terminal 1
cd apps/admin && bun run dev

# Terminal 2
cd apps/public && bun run dev
```

---

## Lovable Preview

The Lovable preview runs from the **root level** which is configured for Darkone Admin.

- **Admin:** Available in Lovable preview at `/`
- **Public:** Run locally with `cd apps/public && bun run dev`

---

## Config Isolation

| Config | Admin | Public | Notes |
|--------|-------|--------|-------|
| **Vite** | `apps/admin/vite.config.ts` | `apps/public/vite.config.js` | Separate |
| **PostCSS** | Root `postcss.config.js` | `apps/public/postcss.config.cjs` | Isolated |
| **TypeScript** | `apps/admin/tsconfig.json` | N/A (JSX) | Admin only |
| **Tailwind** | Root `tailwind.config.ts` | N/A | Admin only |

---

## VPS/Nginx Deployment (Hostinger)

### Build Commands
```bash
# Build both apps
cd apps/admin && bun run build  # Output: apps/admin/dist/
cd apps/public && bun run build  # Output: apps/public/dist/
```

### Nginx Configuration for SPA Routing

```nginx
# Admin: admin.yourdomain.com
server {
    listen 80;
    server_name admin.yourdomain.com;
    root /var/www/apps/admin/dist;
    index index.html;
    
    # SPA fallback - all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Public: yourdomain.com
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/apps/public/dist;
    index index.html;
    
    # SPA fallback - all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Key Routes

**Admin (apps/admin):**
- `/` - Dashboard (auth protected)
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

---

## Key Decisions

1. **No refactoring:** Both apps maintain original structure
2. **Separate styling:** SCSS (admin) vs SASS (public) - no mixing
3. **JSX preserved:** Zivan remains JSX, no TSX conversion
4. **Vite for both:** Consistent build tooling across apps
5. **Isolated configs:** PostCSS does not leak across apps

---

*Last updated: 2025-12-14 - Repo Cleanup & Entrypoints*
