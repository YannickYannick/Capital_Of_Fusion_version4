# 💼 Phase 5: Business Modules Implementation

**Objective**: Implement the core business logic for Courses, Events, and Shop, reusing the core components built in previous phases.

## 1. Courses Module

**Action**: Implement the Course catalog and Detail page.

**Backend (Django)**:
- `Course` model linked to `DanceStyle`.
- `CourseFilter` using `django-filter` (by city, style, level).

**Frontend (Next.js)**:
- `src/app/(app)/courses/page.tsx`:
  - Fetch styles from `/api/common/styles/` for sidebar.
  - Infinite scroll list of `CourseCard`.
- `src/app/(app)/courses/[slug]/page.tsx`:
  - Hero image.
  - Mapbox integration for location.
  - "Book Now" CTA.

## 2. Events & Festivals Module

**Action**: Implement the Calendar and Ticketing system.

**Backend (Django)**:
- `Event` model with `start_date`, `end_date`.
- `Registration` model linked to `User` and `Event`.
- Stripe Payment Intent creation endpoint.

**Frontend (Next.js)**:
- `src/components/features/events/EventCalendar.tsx`:
  - FullCalendar.js or custom grid.
  - Color coded by `EventCategory`.
- `src/components/features/events/RegistrationForm.tsx`:
  - Multi-step form (Details -> Payment -> Confirmation).

## 3. Shop Module

**Action**: Implement the E-commerce section.

**Backend (Django)**:
- `Product` model.
- `Order` model with `status` (Pending, Paid, Shipped).
- Cart logic (Session based or DB based).

**Frontend (Next.js)**:
- `useCart` store (Zustand).
- `ProductGrid` with filter by category (Shoes, Clothes).

## 4. Verification

**Checklist**:
- [ ] User can browse courses and filter by "Bachata".
- [ ] User can view an event details.
- [ ] User can add a T-shirt to cart (Shop).
- [ ] Admin can see the orders in Django Admin.
