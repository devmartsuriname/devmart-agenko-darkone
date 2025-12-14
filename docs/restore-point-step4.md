# Restore Point - Step 4: Zivan react-scripts → Vite Migration

## Date
Step 4 of CMS implementation

## Purpose
Migrate Zivan public app from Create React App (react-scripts) to Vite for:
- Lovable preview compatibility
- Faster development builds
- Consistency with admin app build tooling

## Files to be CREATED
| File | Purpose |
|------|---------|
| `apps/public/index.html` | Vite HTML entry point |
| `apps/public/src/main.jsx` | Vite JS entry point (replaces index.jsx usage) |
| `apps/public/vite.config.js` | Vite configuration |

## Files to be MODIFIED
| File | Change |
|------|--------|
| `apps/public/package.json` | Replace react-scripts with Vite scripts |

## Files NOT Changed (1:1 preserved)
- `apps/public/src/App.jsx` - No changes
- `apps/public/src/components/*` - All 35 component folders unchanged
- `apps/public/src/helpers/*` - All helper files unchanged
- `apps/public/src/sass/*` - All SCSS files unchanged
- `apps/public/public/*` - All public assets unchanged

## Original CRA Entry Point
```jsx
// apps/public/src/index.jsx (kept for reference)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import 'slick-carousel/slick/slick.css';
import './sass/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

## Original package.json scripts
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

## Rollback Instructions
If Step 4 fails, restore by:
1. Delete `apps/public/index.html`
2. Delete `apps/public/src/main.jsx`
3. Delete `apps/public/vite.config.js`
4. Restore `apps/public/package.json` to original scripts above

## @fullcalendar/interaction Audit
**Verdict:** REQUIRED - Not scope creep
**File:** `src/types/component-props.ts` (Darkone Admin)
**Line 6:** `import { DateClickArg, DropArg } from '@fullcalendar/interaction/index.js'`
**Usage:** Calendar types for admin dashboard calendar feature
