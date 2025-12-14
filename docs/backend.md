# Backend Architecture

## Overview

This document describes the backend architecture for the Zivan-Darkone monorepo.

## Current State (Post Step 2)

- **Backend:** Not yet configured
- **Database:** Not yet configured
- **Authentication:** Not yet configured

## Repository Split

The repository has been split into a monorepo structure:

```
/apps/admin   - Darkone Admin (content management)
/apps/public  - Zivan Public (public-facing website)
```

## Shared Backend (Future)

Both apps will connect to a shared Supabase backend:
- Database tables for CMS content
- Authentication for admin access
- Storage for media files
- Edge functions for server-side logic

## Next Steps

1. Enable Supabase/Cloud integration
2. Create database schema
3. Configure authentication
4. Set up storage buckets

---

*Last updated: Step 2 - Repo Split*
