# 🛠️ Stack Technique - BachataVibe V4

## 📊 Vue d'Ensemble

Ce document présente les options technologiques pour la refonte complète.

---

## 🎨 Frontend

### Option A : Next.js (React) ⭐ **RECOMMANDÉ**
**Avantages**
- ✅ SSR/SSG pour SEO optimal
- ✅ Écosystème React mature
- ✅ Vercel deployment ultra-simple
- ✅ Image optimization native
- ✅ API routes intégrées

**Stack**
```
- Framework: Next.js 15
- UI Library: React 19
- Styling: Tailwind CSS + shadcn/ui
- State: Zustand ou React Query
- Forms: React Hook Form + Zod
- HTTP: Axios ou fetch native
```

---

### Option B : Nuxt.js (Vue)
**Avantages**
- ✅ Courbe d'apprentissage plus douce
- ✅ SSR/SSG natif
- ✅ Composition API moderne
- ✅ Moins verbeux que React

**Stack**
```
- Framework: Nuxt 4
- UI Library: Vue 3
- Styling: Tailwind CSS + Nuxt UI
- State: Pinia
- Forms: VeeValidate
```

---

### Option C : Vite + React/Vue
**Avantages**
- ✅ Build ultra-rapide
- ✅ Plus de flexibilité
- ✅ Légèreté

**Inconvénients**
- ❌ Pas de SSR natif
- ❌ SEO moins optimal
- ❌ Plus de configuration

---

## ⚙️ Backend

### Option A : Django REST Framework (Conserver) ⭐
**Avantages**
- ✅ Déjà en place (V3)
- ✅ ORM Django puissant
- ✅ Admin panel gratuit
- ✅ Sécurité robuste
- ✅ Migrations de données facilitées

**Stack**
```
- Framework: Django 5.x
- API: Django REST Framework
- Auth: Django Simple JWT ou Djoser
- CORS: django-cors-headers
- Storage: django-storages (S3)
- Task Queue: Celery + Redis
- WebSockets: Django Channels
```

---

### Option B : FastAPI (Python)
**Avantages**
- ✅ Performance supérieure
- ✅ Types natifs (Pydantic)
- ✅ Documentation OpenAPI auto
- ✅ Async natif

**Stack**
```
- Framework: FastAPI
- ORM: SQLAlchemy 2.0 ou Tortoise
- Auth: FastAPI-Users
- Task Queue: Celery
```

---

### Option C : Node.js (Express/NestJS)
**Avantages**
- ✅ Langage unique (JavaScript/TypeScript)
- ✅ Écosystème npm riche

**Inconvénients**
- ❌ Migration complète nécessaire
- ❌ Perte de l'admin Django

---

## 🗄️ Base de Données

### Option A : PostgreSQL ⭐ **RECOMMANDÉ**
```
- Version: PostgreSQL 16
- Extensions: PostGIS (géolocalisation), pg_trgm (recherche)
- Hébergement: Supabase ou Railway
```

### Option B : MySQL
```
- Compatible avec hébergement mutualisé
- Moins de fonctionnalités avancées
```

---

## 🔐 Authentification

### Recommandation : JWT + Refresh Tokens
```
Frontend:
  - Stockage: httpOnly cookies (refresh) + localStorage (access)
  - Libs: @tanstack/react-query pour l'état auth

Backend (Django):
  - django-rest-framework-simplejwt
  - django-allauth (OAuth social)
```

---

## 💰 Paiement

### Stripe ⭐ **RECOMMANDÉ**
- ✅ API complète et moderne
- ✅ Webhooks fiables
- ✅ Support carte + SEPA + autres
- ✅ Excellente documentation

**Alternative** : PayPal (plus populaire en France)

---

## 📦 Hébergement & Infrastructure

### Frontend
```
Option A: Vercel (Next.js) ⭐
  - Deploy automatique
  - Edge functions
  - Analytics intégré

Option B: Netlify
  - Similaire à Vercel
  - Généreux free tier
```

### Backend
```
Option A: Railway ⭐
  - PostgreSQL inclus
  - Variables d'env simples
  - $5-20/mois

Option B: Render
  - Free tier disponible
  - PostgreSQL géré

Option C: VPS (OVH, Hetzner)
  - Plus de contrôle
  - Configuration manuelle
```

### CDN & Storage
```
- Images/Médias: Cloudinary ou AWS S3 + CloudFront
- Vidéos formations: Vimeo Pro ou Mux
```

---

## 📧 Services Tiers

| Service | Provider | Usage |
|:---|:---|:---|
| **Email** | Resend ou SendGrid | Transactionnel + newsletters |
| **SMS** | Twilio | Notifications urgentes |
| **Maps** | Mapbox ou Google Maps | Localisation événements |
| **Analytics** | Plausible ou PostHog | Privacy-first analytics |
| **Error Tracking** | Sentry | Monitoring des erreurs |
| **Logs** | BetterStack | Centralisation logs |

---

## 🧪 Testing & Quality

### Frontend
```
- Unit: Vitest
- E2E: Playwright
- Components: Storybook
- Linting: ESLint + Prettier
- Types: TypeScript
```

### Backend
```
- Unit: pytest
- Integration: pytest-django
- Coverage: pytest-cov
- Linting: ruff ou black + isort
- Types: mypy
```

---

## 🚀 CI/CD

### GitHub Actions ⭐
```yaml
Pipelines:
  - Linting & formatting
  - Tests automatiques
  - Build & deploy (preview + prod)
  - Database migrations
```

---

## 📱 Mobile (Optionnel)

### Option A : PWA ⭐ **RECOMMANDÉ pour MVP**
- ✅ Pas de développement supplémentaire
- ✅ Installation sur mobile
- ✅ Notifications push
- ✅ Offline mode basique

### Option B : React Native
- Pour une app vraiment native plus tard
- Réutilisation de code React

---

## 🎯 Stack Recommandée (MVP)

### Architecture Découplée
```
Frontend:
  ├─ Next.js 15 + React 19
  ├─ Tailwind CSS + shadcn/ui
  ├─ TypeScript
  └─ Déployé sur Vercel

Backend:
  ├─ Django 5.x + DRF
  ├─ PostgreSQL 16 (Supabase ou Railway)
  ├─ JWT Auth
  ├─ Celery + Redis (tasks async)
  └─ Déployé sur Railway

Services:
  ├─ Stripe (paiement)
  ├─ Cloudinary (images)
  ├─ Resend (emails)
  └─ Sentry (monitoring)
```

### Coût Mensuel Estimé (Démarrage)
- Frontend (Vercel): **Gratuit** (Pro $20/mois plus tard)
- Backend (Railway): **$5-15/mois**
- Database (Railway): **$5/mois**
- Cloudinary: **Gratuit** (jusqu'à 25GB)
- Stripe: **Commission uniquement**
- **TOTAL: ~$10-20/mois** pour démarrer

---

## 📝 Prochaines Étapes

1. ✅ Valider la stack recommandée
2. 🔲 Créer les wireframes/maquettes
3. 🔲 Setup des repositories (monorepo ou séparés)
4. 🔲 Configuration initiale des projets
5. 🔲 Définir l'architecture API
