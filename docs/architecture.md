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
| **Build Tool** | Vite (migrated from react-scripts in Step 4) |
| **Styling** | Bootstrap + Custom SASS/SCSS |
| **Purpose** | Public-facing website |
| **Status** | ✅ Migrated to Vite |

## Package Manager

- **Primary:** Bun
- **Lock files:** Unchanged per user constraint

---

## Development Commands (Post Step 4)

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

## Step 4 Status

- ✅ Zivan migrated from react-scripts to Vite
- ✅ Created `apps/public/vite.config.js`
- ✅ Created `apps/public/index.html`
- ✅ Created `apps/public/src/main.jsx`
- ✅ Updated `apps/public/package.json` with Vite scripts
- ✅ JSX files preserved (no TSX conversion)
- ✅ All components, routes, styles unchanged
- ⏸️ Source folders not yet deleted

---

## Key Decisions

1. **No refactoring:** Both apps maintain original structure
2. **Separate styling:** SCSS (admin) vs SASS (public) - no mixing
3. **JSX preserved:** Zivan remains JSX, no TSX conversion
4. **Vite for both:** Consistent build tooling across apps

---

*Last updated: Step 4 Complete - Zivan Vite Migration*
