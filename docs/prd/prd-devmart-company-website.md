# Product Requirements Document (PRD)

## Project
**Devmart Company Website**

## Version
v1.0 — Initial PRD

## Language
English (Devmart standard)

---

## 1. Purpose & Vision

### Purpose
This document defines the functional, structural, and technical requirements for the **Devmart Company Website**, built using:
- **Zivan React (Creative Agency variant only)** for the public frontend
- **Darkone Admin** as the internal CMS
- **Supabase** as backend (Auth, Database, Storage)

The goal is to launch a **clean, professional, trend-setting Devmart website** with CMS-driven content, while keeping the system extensible for future enhancements.

### Vision
Devmart positions itself as a **leading digital transformation agency in Suriname**, setting the benchmark for:
- Modern UI/UX
- Clean architecture
- CMS-driven marketing websites
- Scalable React + Supabase solutions

---

## 2. Scope Definition

### In Scope
- Public marketing website for Devmart
- One homepage variant: **Creative Agency (Zivan)**
- CMS-driven content via Darkone Admin
- Supabase authentication and role-based access (Admin only)
- SEO-ready structure
- Dark/Light mode support (frontend)

### Out of Scope
- White-label CMS product
- Page builder functionality (future only)
- Multi-tenant or multi-site support
- E-commerce
- Mobile app

---

## 3. Architecture Overview

### Applications

| Layer | Technology | Notes |
|-----|-----------|------|
| Public Frontend | Zivan React (Creative Agency only) | Cleaned version, single homepage variant |
| Admin CMS | Darkone React Admin | Internal only, locked theme |
| Backend | Supabase | Auth, DB, Storage |
| Hosting | VPS (Hostinger) | Nginx + static builds |

### Key Rules
- **Admin and Public are separate apps**
- **Darkone theme is NOT modified visually**
- **Zivan frontend is cleaned and connected to CMS**
- **No demo content leaks into production**

---

## 4. Frontend Requirements

### 4.1 Homepage

**Variant:** Creative Agency (ONLY)

All other Zivan homepage variants must be **removed**, including:
- Routes
- Components
- Navigation links

#### Homepage Sections (CMS-driven)
1. Hero Section
2. Services Overview
3. About / Why Devmart
4. Portfolio Preview
5. Testimonials
6. Blog Preview
7. Call-to-Action

---

### 4.2 Static Pages

| Page | CMS-Driven | Notes |
|----|-----------|------|
| About | ✅ | Editable content blocks |
| Services (list) | ✅ | Linked to service detail pages |
| Service Detail | ✅ | Slug-based routing |
| Portfolio | ✅ | Case studies |
| Blog | ✅ | SEO-optimized articles |
| Blog Detail | ✅ | Rich text + featured image |
| Contact | ✅ | Form + Supabase storage |

---

### 4.3 Theming & Branding

#### Frontend Branding
- Dark/Light toggle enabled
- Primary color **configurable via Admin settings**
- Typography and spacing remain Zivan-native

#### Admin Branding
- Darkone Admin **remains unchanged visually**
- Only logo and brand name configurable

---

## 5. CMS (Admin) Requirements

### 5.1 Modules (Already Implemented / Placeholder)

| Module | Status |
|------|--------|
| Dashboard | Placeholder (Welcome + KPIs) |
| Pages | Placeholder |
| Blog | Placeholder |
| Projects | Placeholder |
| Media Library | Placeholder |
| Users | Implemented |
| Roles | Implemented |
| Settings | Placeholder |

---

### 5.2 Content Types (Supabase)

| Content Type | Fields (High-level) |
|-------------|-------------------|
| Site Settings | name, logo, primary_color, SEO defaults |
| Pages | title, slug, content, SEO |
| Services | title, slug, description, icon |
| Projects | title, slug, images, case content |
| Blog Posts | title, slug, content, featured image |
| Testimonials | name, role, quote |
| Contact Submissions | name, email, message |

---

## 6. SEO Requirements

- Slug-based routing
- Editable meta title & description per page
- OpenGraph support
- Sitemap-ready structure
- Clean URL structure

---

## 7. Security & Access

- Supabase Auth
- Roles: **admin only** (for now)
- Protected admin routes
- Public routes read-only

---

## 8. Non-Functional Requirements

- Fast initial load
- Mobile responsive
- Accessible components (WCAG-aware)
- Clean build output
- No console errors in production

---

## 9. Milestones (High-Level)

1. ✅ Admin cleanup & hardening
2. ✅ Kickoff Checklist
3. 🔄 PRD (this document)
4. ⏭️ Frontend cleanup (Creative Agency only)
5. ⏭️ Supabase schema finalization
6. ⏭️ CMS ↔ Frontend content wiring
7. ⏭️ Content swap & branding
8. ⏭️ Production launch

---

## 10. Acceptance Criteria

- Only Creative Agency homepage exists
- All content editable via Admin
- Admin theme intact
- Frontend primary color configurable
- Demo content fully removed
- Production build clean

---

**Status:** Draft — Ready for review and next-phase execution