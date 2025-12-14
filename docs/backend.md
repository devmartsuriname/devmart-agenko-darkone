# Backend Architecture

## Overview

This document describes the backend architecture for the Zivan-Darkone monorepo.

## Current State (Post Repo Cleanup)

- **Backend:** Not yet configured
- **Database:** Not yet configured
- **Authentication:** Not yet configured
- **Storage:** Not yet configured

## Repository Structure

The repository has been cleaned up with a clear monorepo structure:

```
/apps/admin   - Darkone Admin (content management)
/apps/public  - Zivan Public (public-facing website)
```

Legacy source folders (`Darkone-React_v1.0/` and `zivan-react/`) have been removed.

## Shared Backend (Future)

Both apps will connect to a shared Supabase backend:
- Database tables for CMS content
- Authentication for admin access
- Storage for media files
- Edge functions for server-side logic

## CMS Modules (Planned)

Per approved scope:
1. Site Settings
2. Hero Sections
3. Services
4. Portfolio/Projects
5. Team Members
6. Blog
7. Testimonials
8. Awards (dynamic)
9. FAQs
10. Contact Submissions
11. eCommerce (Products, Variants, Cart, Orders, Wishlist)

## Next Steps

1. Enable Lovable Cloud integration
2. Create database schema
3. Configure authentication
4. Set up storage buckets

---

*Last updated: 2025-12-14 - Repo Cleanup & Entrypoints*
