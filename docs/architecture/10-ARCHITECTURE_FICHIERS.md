# 📂 Architecture des Fichiers & Dossiers - BachataVibe V4

Ce document détaille l'organisation physique des fichiers pour le projet. Il sert de référence pour maintenir une structure propre et standardisée.

## 🏗️ Structure Globale (Monorepo-style)

```text
/bachatavibe-v4
├── backend/                 # API Django REST Framework
├── frontend/                # Next.js 15 App Router
├── mobile/                  # (Futur) React Native Expo
├── docker-compose.yml       # Orchestration (DB, Redis, API)
└── README.md
```

---

## 🐍 Backend (Django 5.x)

Structure modulaire où chaque "business domain" est une app Django distincte.

```text
backend/
├── config/                  # Configuration du projet
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings/
│   │   ├── base.py          # Config commune
│   │   ├── local.py         # Dev
│   │   └── production.py    # Prod
│   ├── urls.py              # Routes principales
│   └── wsgi.py
│
├── apps/                    # Applications Django
│   ├── core/                # Modèles transverses
│   │   ├── models/
│   │   │   ├── user.py      # Custom User, DanceProfession
│   │   │   └── references.py # DanceStyle, Level, Tag
│   │   ├── api/
│   │   │   └── views.py     # Auth & Common endpoints
│   │   └── services/        # Business logic partagée
│   │
│   ├── organization/        # Structure Capital of Fusion
│   │   ├── models/          # Node, Team, OrganizationRole
│   │   └── api/             # Endpoints structure 3D
│   │
│   ├── courses/             # Gestion des Cours
│   │   ├── models/          # Course, Enrollment
│   │   └── api/
│   │
│   ├── events/              # Événements & Festivals
│   │   ├── models/          # Event, Festival, Registration
│   │   └── api/
│   │
│   └── shop/                # Boutique
│       ├── models/          # Product, Order
│       └── api/
│
├── media/                   # Uploads utilisateurs (Git ignored)
├── static/                  # Assets static Django (Admin)
├── requirements/            # Dépendances Python
│   ├── base.txt
│   └── local.txt
├── manage.py
└── Dockerfile
```

---

## ⚛️ Frontend (Next.js 15 + Tailwind)

Organisation basée sur l'App Router et les standards modernes.

```text
frontend/
├── app/                     # Next.js App Router (Pages & Layouts)
│   ├── (site)/              # Layout Public (Navbar Transparente V2)
│   │   ├── page.tsx         # 🏠 Landing Page V2 (Vidéo)
│   │   ├── about/
│   │   └── contact/
│   │
│   ├── (app)/               # Layout Application (Navbar Standard)
│   │   ├── agence/          # "Organisation"
│   │   │   └── page.tsx     # Système Planétaire 3D
│   │   ├── cours/
│   │   │   ├── page.tsx     # Liste
│   │   │   └── [slug]/      # Détail
│   │   ├── events/
│   │   └── shop/
│   │
│   ├── (auth)/              # Layout Authentification (Centré)
│   │   ├── login/
│   │   └── register/
│   │
│   ├── (dashboard)/         # Layout Espace Membre (Sidebar)
│   │   ├── profile/
│   │   └── my-orders/
│   │
│   ├── layout.tsx           # Root Layout (Fonts, Metadata)
│   └── globals.css          # Tailwind imports
│
├── components/
│   ├── ui/                  # Composants de base (Shadcn/UI)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── shared/              # Composants réutilisables
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   └── VideoBackground.tsx # (V2)
│   │
│   ├── features/            # Composants Métier (Domain logic)
│   │   ├── landing/
│   │   │   ├── Hero.tsx
│   │   │   └── AnimatedTitle.tsx
│   │   ├── organization/
│   │   │   ├── PlanetarySystem.tsx # (Three.js)
│   │   │   └── PlanetCard.tsx
│   │   ├── courses/
│   │   │   └── CourseCard.tsx
│   │   └── events/
│   │
│   └── providers/           # React Contexts
│       ├── AuthProvider.tsx
│       └── ThemeProvider.tsx
│
├── lib/                     # Utilitaires & Config
│   ├── api.ts               # Client Axios/Fetch
│   ├── utils.ts             # Helpers (clsx, date)
│   └── constants.ts
│
├── hooks/                   # Custom Hooks
│   ├── use-auth.ts
│   └── use-scroll-animation.ts
│
├── types/                   # Définitions TypeScript
│   ├── models.ts            # Interfaces Backend (User, Course...)
│   └── api.ts
│
├── public/                  # Assets Statiques
│   ├── images/
│   ├── videos/              # Fallbacks
│   └── models/              # Modèles 3D (.glb)
│
├── styles/                  # Styles additionnels
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 📱 Mobile (React Native Expo) - *Structure Anticipée*

```text
mobile/
├── app/                     # Expo Router (File-based routing)
│   ├── (tabs)/              # Navigation par onglets
│   │   ├── home/
│   │   ├── courses/
│   │   └── profile/
│   └── _layout.tsx
│
├── src/
│   ├── components/          # Partagés si monorepo avancé (Turborepo)
│   ├── features/
│   └── hooks/
└── app.json
```
