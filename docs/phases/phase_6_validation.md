# 🧪 Phase 6: Validation, Optimization & Deployment

**Objective**: Ensure the application is bug-free, performant, and correctly deployed to production.

## 1. Testing Strategy

**Backend (Pytest)**:
- Unit tests for Models (constraints, methods).
- Integration tests for API endpoints (Auth, Permissions).

```bash
cd backend
pytest apps/users/tests.py
pytest apps/courses/tests.py
```

**Frontend (Playwright)**:
- E2E tests for critical paths:
  1. User Login.
  2. Navigate to 3D System -> Click Planet.
  3. Book a Course.

```bash
cd frontend
npx playwright test
```

## 2. Performance Optimization

**Action**: Audit and fix LCP/CLS/FID issues.

- **Images**: Ensure all `<img>` use `next/image` with `sizes` prop.
- **3D Scene**: Implement `React.lazy` for `PlanetarySystem` to avoid blocking main thread on load.
- **Fonts**: Use `next/font` with `swap`.

## 3. CI/CD Pipeline (GitHub Actions)

**File**: `.github/workflows/ci.yml`
```yaml
name: CI
on: [push]
jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
      - run: pip install -r backend/requirements.txt
      - run: cd backend && pytest

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend && npm install && npm run build
```

## 4. Deployment

**Backend (Railway/Render)**:
- Build Command: `pip install -r requirements.txt && python manage.py migrate`
- Start Command: `gunicorn config.wsgi:application`

**Frontend (Vercel)**:
- Preset: Next.js
- Environment Variables: `NEXT_PUBLIC_API_URL`

## 5. Verification

**Checklist**:
- [ ] All tests pass in CI.
- [ ] Lighthouse score > 90 on Desktop.
- [ ] Production site is accessible via HTTPS.
