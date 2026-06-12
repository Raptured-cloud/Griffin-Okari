# Griffin-Okari
Pharmaceutical retail
# Implementation Plan - Pharmaceutical Retail Shop UI

Design and implement a professional, responsive user interface for a pharmaceutical retail shop. The application will feature product browsing, dynamic filtering, secure authentication forms, and a medical-themed visual identity.

## Scope Summary
- **Visual Identity:** Clean, professional medical theme (blues, teals, whites) using Tailwind CSS and Shadcn UI.
- **Core Pages:** Home (featured products), Shop/Catalog (filtering & search), Product Details, Cart, and Auth (Login/Register).
- **Interactive Features:** Dynamic inventory display, add-to-cart animations, category navigation.
- **Form Validation:** Client-side validation for auth and checkout forms.
- **Persistence:** Local storage for cart and session state (no database per session constraints).

## Non-Goals
- Real-time inventory syncing with a server.
- Processing actual payments (simulated checkout only).
- Server-side authentication or database persistence.

## Assumptions
- The application will run as a Single Page Application (SPA) using `react-router-dom`.
- Mock data will be used to simulate a product catalog.

## Affected Areas
- **Frontend:** New components, layouts, and pages.
- **Routing:** Implementation of `react-router-dom`.
- **State Management:** React Context or local state for the cart and search filters.

## Phases

### Phase 1: Foundation & Routing
- Install dependencies: `react-router-dom`, `lucide-react`, `framer-motion`, `zod`, `react-hook-form`, `@hookform/resolvers`.
- Set up a basic layout component with a medical-themed Header and Footer.
- Configure routes for Home, Shop, Auth, and Cart.
- **Owner:** frontend_engineer

### Phase 2: Design System & Mock Data
- Update `index.css` or Tailwind theme with medical-specific colors (e.g., primary: medical blue/teal).
- Create a `mockData.ts` file with pharmaceutical products (categories: Prescription, OTC, Wellness, Equipment).
- **Owner:** frontend_engineer

### Phase 3: Authentication & User UI
- Implement Login and Registration pages with client-side validation using `react-hook-form` and `zod`.
- Create a "User Profile" dropdown in the header.
- **Owner:** frontend_engineer

### Phase 4: Product Catalog & Search
- Implement the Shop page with a sidebar for category filtering and price ranges.
- Build the "Interactive Product Search" with dynamic filtering.
- Design Product Cards with "Add to Cart" functionality and visual stock indicators.
- **Owner:** frontend_engineer

### Phase 5: Cart & Animations
- Implement the Cart page and a slide-over/drawer cart summary.
- Add "Add-to-cart" animations using `framer-motion`.
- Create a simple checkout flow (multi-step form).
- **Owner:** frontend_engineer

### Phase 6: Final Polish
- Ensure responsiveness across all screens.
- Add "Administrative" layout placeholder (e.g., Dashboard shell) as requested.
- Fix any UI inconsistencies.
- **Owner:** quick_fix_engineer

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Setup foundation, routing, and core UI components.
2. quick_fix_engineer — Polish UI, fix typos, and ensure responsive consistency.

**Per-agent instructions:**

### 1. frontend_engineer
- **Phases:** 1, 2, 3, 4, 5
- **Scope:** Complete build of the pharmaceutical shop UI. Use Shadcn components already present in `src/components/ui`. Use `lucide-react` for icons. Implement client-side logic for filtering and cart management.
- **Files:** 
    - `src/App.tsx` (Routing)
    - `src/components/layout/` (Header, Footer, Sidebar)
    - `src/pages/` (Home, Shop, Auth, Cart)
    - `src/data/mockProducts.ts`
- **Depends on:** none
- **Acceptance criteria:** Working navigation, functional search/filters on the shop page, valid auth forms, working cart counter and animations.

### 2. quick_fix_engineer
- **Phases:** 6
- **Scope:** Fine-tuning the medical theme, ensuring all buttons have proper hover states, and making sure the mobile view is perfect. Add the administrative dashboard shell.
- **Files:** `src/index.css`, various components for styling tweaks.
- **Depends on:** frontend_engineer
- **Acceptance criteria:** Professional visual theme consistent across all pages; mobile-responsive layouts for all main views.

**Do not dispatch:** supabase_engineer (No DB required).
