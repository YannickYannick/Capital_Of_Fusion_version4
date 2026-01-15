# 📋 Plan de Développement Détaillé - BachataVibe V4 (Spec pour IA)

> **CONTEXTE POUR L'IA DÉVELOPPEUSE**
> Ce document est la source de vérité technique absolue. Il agrège les spécifications de :
> - `01-VISION_ET_OBJECTIFS.md` (UX Premium V2, Fullscreen Video, Dark Mode)
> - `02-STACK_TECHNIQUE.md` (Next.js 15, Django 5, PostgreSQL)
> - `03-ARCHITECTURE_API.md` (REST, JWT, Services)
> - `07-ARCHITECTURE_MENUS_V4.md` (Navigation, Système Planétaire)
> - `09-SCHEMA_BDD_SIMPLIFIE.md` (Normalisation stricte, Tables de référence)

---

## 🏗️ Phase 1 : Initialisation de l'Infrastructure (Monorepo)

**Objectif** : Mettre en place la stack technique validée dans `02-STACK_TECHNIQUE.md`.

### 1.1. Structure du Projet (Monorepo)
*Action : Initialiser le dépôt git et la structure de dossiers.*
```text
/ (root)
├── apps/
│   ├── api/ (Django REST Framework)
│   ├── web/ (Next.js 15 App Router)
│   └── mobile/ (React Native Expo - Futur)
├── packages/
│   ├── ui/ (Shared Shadcn/UI components)
│   ├── config/ (ESLint, TSConfig partagés)
│   └── types/ (Interface TypeScript générées depuis le Backend)
├── docs/ (Documentation V4 existante)
└── docker-compose.yml (PostgreSQL, Redis, API)
```

### 1.2. Backend Setup (Django)
*Action : Configurer l'environnement Python/Django.*
1. **Init** : Django 5.x, Python 3.12+.
2. **Dépendances** :
   - `djangorestframework`, `django-cors-headers`
   - `djangorestframework-simplejwt` (Auth)
   - `psycopg` (PostgreSQL Driver)
   - `drf-spectacular` (Swagger auto-gen)
3. **Configuration DB** : PostgreSQL 15.
   - Activer extensions : `unaccent`, `trigram` (pour la recherche).

### 1.3. Frontend Setup (Next.js - Design V2)
*Action : Configurer l'environnement JS/Next.js selon `01-VISION`.*
1. **Init** : Next.js 15, React 18/19, TypeScript.
2. **Styles (Design V2)** :
   - TailwindCSS avec palette sombre : `background: #0a0e27`.
   - Polices : Inter/Roboto (Corps) + Titres modernes.
3. **Librairies UX Premium** :
   - `framer-motion` (Animations scrolly, transitions).
   - `three`, `@react-three/fiber`, `@react-three/drei` (Système Planétaire).
   - `lucide-react` (Icônes).
   - `zustand` (State manager).
4. **Composants Base** : Shadcn/UI (Button, Dialog, Form, etc.) adaptés au thème sombre.

---

## 🗄️ Phase 2 : Implémentation Base de Données (Normalisée)

**Objectif** : Appliquer strictement `09-SCHEMA_BDD_SIMPLIFIE.md`.
**Règle d'Or** : Aucune duplication de string (Styles, Niveaux, Métiers).

### 2.1. Tables de Référence (Core)
*Action : Créer les modèles Django abstraits ou partagés.*
1. **`DanceStyle`** (Hierarchique `MPTT` ou `Recursive FK`)
   - Champs: `name`, `slug`, `parent`, `icon`.
   - Data init: Bachata > Sensual, Dominicana; Salsa > Cubana, Portoricaine.
2. **`Level`**
   - Champs: `name`, `slug`, `order`, `color`.
   - Data init: Débutant, Intermédiaire, Avancé, Tous niveaux.
3. **`Category`**
   - Champs: `name`, `parent`, `type` (course, event, shop).
4. **`DanceProfession`** (Nouveau selon demande)
   - Champs: `name` (Vidéaste, DJ, Prof).

### 2.2. Gestion Organisationnelle (Capital of Fusion)
1. **`OrganizationNode`**
   - Représente les entités (Bachata Vibe, Kompa Vibe).
   - Type hierarchy.
2. **`Team`** & **`OrganizationRole`**
   - Pour gérer "Team Vibe", "Team Orga", "Pôle Média".

### 2.3. Modèle Utilisateur Étendu
1. **`User`** (Custom Model)
   - Relations `ManyToMany` vers `DanceStyle`, `Level`, `DanceProfession`, `OrganizationRole`.
   - Pas de champs texte libres pour ces données !

---

## 🔌 Phase 3 : Développement API (Core Logic)

**Objectif** : Exposer les données selon `03-ARCHITECTURE_API.md`.

### 3.1. Authentification & Permissions
1. **Endpoints** : `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`.
2. **Permissions** :
   - `IsAdminUser` (Staff).
   - `IsOrganizationMember` (Basé sur `OrganizationRole`).
   - `IsParticipant` (Défaut).

### 3.2. Endpoints "Données de Référence" (Public)
1. `/api/common/styles/` (Tree structure pour le menu filtres).
2. `/api/common/levels/`.
3. `/api/organization/structure/` (Pour le menu 3D).

### 3.3. CRUD Modules
1. **Cours** : Filtres avancés par `style__slug`, `level__slug`, `city`.
2. **Events** : Gestion du calendrier, inscriptions.

---

## ✨ Phase 4 : Intégration UI "Version 2" (Landing & UX)

**Objectif** : Implémenter l'identité visuelle de `version_2/integration_prompt.md`.

### 4.1. Landing Page Immersive
1. **Composant `VideoBackground`** :
   - Iframe YouTube Wrapper.
   - Mute/Unmute controls.
   - Overlay gradient CSS (`bg-black/80`).
2. **Hero Section** :
   - Titre h1 "Capital of Fusion France".
   - Animations Framer Motion (`initial={{ opacity: 0, y: 20 }}`).
3. **Glassmorphism Navbar** :
   - `backdrop-filter: blur(10px)`.
   - Sticky top.

### 4.2. Système Planétaire 3D (Ref: `07-ARCHITECTURE_MENUS_V4`)
1. **Scène Three.js (`Canvas`)** :
   - **Soleil** : Logo "Capital of Fusion".
   - **Orbites** : Lignes SVG ou 3D rings.
   - **Planètes** : Sphères texturées pour "Bachata Vibe", "Kompa Vibe", "Paris Bachata Festival".
2. **Intégration React** :
   - Click sur planète -> Ouvre Modal / Navigue vers la page dédiée.
   - Raycaster pour interactions souris.
   - Fallback HTML pour mobile/SEO.

### 4.3. Navigation & Menus
1. **Mega Menu "Organisation"** :
   - Dropdown listant "Présentation" en premier (comme demandé).
   - Liens vers les sous-entités.
2. **Menu User** :
   - Intégration avatar, lien "Mes Commandes", "Mon Planning".

---

## 💼 Phase 5 : Modules Métier Spécifiques

### 5.1. Module Cours & Formation
- Page liste avec sidebar de filtres (réutilisant API Reference).
- Page détail avec Mapbox/Google Maps.
- Flow d'inscription (Stripe Checkout).

### 5.2. Module Boutique (Shop)
- Catalogue produit filtrable.
- Panier (Context React).
- Tunnel de commande.

### 5.3. Module Projets & Care
- Pages de contenu CMS (Rich Text).
- Formulaires de contact spécifiques.

---

## 🧪 Phase 6 : Validation & Déploiement

### 6.1. Tests
- **Backend** : Pytest pour les modèles et l'API (surtout les permissions).
- **Frontend** : Playwright pour le parcours d'inscription et navigation 3D.

### 6.2. Performance
- Lazy loading de la scène 3D.
- Optimisation images (Next/Image).
- Caching API (Redis).

### 6.3. Déploiement
- **API** : Docker container sur Railway/Render.
- **Web** : Vercel (Edge Network).
- **DB** : Instance managée avec backups quotidiens.
