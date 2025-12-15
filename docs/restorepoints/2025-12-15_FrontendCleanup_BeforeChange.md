# Restore Point: Frontend Cleanup (Before Change)

**Date:** 2025-12-15  
**Phase:** Phase F1 — Frontend Cleanup  
**Purpose:** Pre-cleanup checkpoint before variant removal

---

## Confirmation

> ✅ **No frontend changes made before this restore point.**

---

## Current Route List (Before Cleanup)

### Dark Mode Routes (path="/")
| Route | Component | Variant | Action |
|-------|-----------|---------|--------|
| `/` (index) | Home | Creative Agency | ✅ KEEP |
| `/marketing-agency` | MarketingAgencyPage | Marketing Agency | ❌ REMOVE |
| `/studio-agency` | StudioAgencyPage | Studio Agency | ❌ REMOVE |
| `/digital-agency` | DigitalAgencyPage | Digital Agency | ❌ REMOVE |
| `/tech-startup` | TechStartupPage | Tech Startup | ❌ REMOVE |
| `/about` | AboutPage | Shared | ✅ KEEP |
| `/service` | ServicePage | Shared | ✅ KEEP |
| `/service/:id` | ServiceDetailsPage | Shared | ✅ KEEP |
| `/blog` | BlogPage | Shared | ✅ KEEP |
| `/blog-list` | BlogListPage | Shared | ✅ KEEP |
| `/blog/:id` | BlogDetailsPage | Shared | ✅ KEEP |
| `/portfolio` | PortfolioPage | Shared | ✅ KEEP |
| `/portfolio/:id` | PortfolioDetailsPage | Shared | ✅ KEEP |
| `/case-study-details` | CaseStudyDetailsPage | Marketing only | ❌ REMOVE |
| `/team` | TeamPage | Shared | ✅ KEEP |
| `/team/:id` | TeamDetailsPage | Shared | ✅ KEEP |
| `/contact` | ContactPage | Shared | ✅ KEEP |
| `/shop` | Shop | eCommerce | ❌ REMOVE |
| `/shop/:id` | ProductDetails | eCommerce | ❌ REMOVE |
| `/shop/cart` | Cart | eCommerce | ❌ REMOVE |
| `/shop/checkout` | Checkout | eCommerce | ❌ REMOVE |
| `/shop/success` | Success | eCommerce | ❌ REMOVE |
| `/shop/wishlist` | Wishlist | eCommerce | ❌ REMOVE |

### Light Mode Routes (path="/light/")
All routes duplicated under `/light/` prefix — **REMOVE ENTIRE BLOCK**

---

## Homepage Variants List

| Variant | Page File | Status |
|---------|-----------|--------|
| Creative Agency | `Home.jsx` | ✅ KEEP (Primary) |
| Marketing Agency | `MarketingAgencyPage.jsx` | ❌ REMOVE |
| Studio Agency | `StudioAgencyPage.jsx` | ❌ REMOVE |
| Digital Agency | `DigitalAgencyPage.jsx` | ❌ REMOVE |
| Tech Startup | `TechStartupPage.jsx` | ❌ REMOVE |

---

## Folder Tree Snapshot (components/)

```
components/
├── About/           ✅ KEEP
├── Accordion/       ✅ KEEP
├── Award/           ✅ KEEP
├── Brands/          ✅ KEEP (shared)
├── Button/          ✅ KEEP
├── Card/            ✅ KEEP
├── CaseStudy/       ⚠️ REVIEW (Marketing only?)
├── Cta/             ✅ KEEP
├── Footer/          ✅ KEEP
├── FunFact/         ✅ KEEP
├── Header/          ✅ KEEP
├── Hero/            ⚠️ PARTIAL (index.jsx KEEP, others REMOVE)
├── Hiring/          ⚠️ REVIEW
├── IconBox/         ⚠️ REVIEW (Digital Agency only?)
├── Layout/          ⚠️ PARTIAL (Layout3 REMOVE)
├── Marquee/         ✅ KEEP
├── Pages/           ⚠️ PARTIAL (remove variant pages, keep shared)
├── Pagination/      ✅ KEEP
├── Portfolio/       ✅ KEEP
├── Post/            ✅ KEEP
├── PostGrid/        ⚠️ REVIEW (PostGridStyle2 Digital only?)
├── PricingTable/    ❌ REMOVE (Digital Agency only)
├── ProgressBar/     ⚠️ REVIEW
├── Ratings/         ✅ KEEP
├── SectionHeading/  ✅ KEEP
├── Service/         ✅ KEEP
├── ShopComponents/  ❌ REMOVE (eCommerce)
├── Sidebar/         ✅ KEEP
├── Slider/          ✅ KEEP (used by Creative Agency)
├── Spacing/         ✅ KEEP
├── TeamMember/      ✅ KEEP
├── Testimonial/     ✅ KEEP
├── VideoModal/      ✅ KEEP
├── WhyChose/        ✅ KEEP
├── Widget/          ✅ KEEP
```

---

## Confirmation of Creative Agency Rendering

- Creative Agency homepage uses `Home.jsx`
- Home.jsx uses Layout2 (dark mode) with `index` route
- Components used: Hero, FunFact, About, WhyChose, Service, Portfolio, Award, TestimonialSlider, Cta, PostCarousel, Accordion

---

## Files to Delete

### Pages/
- `MarketingAgencyPage.jsx`
- `StudioAgencyPage.jsx`
- `DigitalAgencyPage.jsx`
- `TechStartupPage.jsx`
- `CaseStudyDetailsPage.jsx`
- `Shop/` (entire folder)

### Hero/
- `HeroStyle2.jsx`
- `HeroStyle3.jsx`
- `HeroStyle4.jsx`
- `HeroStyle5.jsx`

### Layout/
- `Layout3.jsx`

### Other folders to remove entirely:
- `ShopComponents/`
- `PricingTable/`

### Other components to evaluate:
- `IconBox/IconBoxStyle2.jsx` (Digital only)
- `PostGrid/PostGridStyle2.jsx` (Digital only)
- `About/AboutStyle2.jsx` (Marketing only)
- `About/AboutStyle4.jsx` (Digital only)
- `About/AboutStyle5.jsx` (Digital only)
- `CaseStudy/` (Marketing only)

---

*Created: 2025-12-15*
