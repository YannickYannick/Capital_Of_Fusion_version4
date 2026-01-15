# 📱 Stratégie Mobile - BachataVibe V4

## 🎯 Contexte

Vous souhaitez partir sur React Native pour l'app mobile. Voici l'architecture recommandée.

---

## 🏗️ Architecture Recommandée : Backend + Web + Mobile

### Stack Complète

```
┌─────────────────────────────────────────┐
│           Backend (API REST)            │
│         Django + PostgreSQL             │
│      Hébergé sur Railway/Render         │
└─────────────────────────────────────────┘
                    ▲
                    │ API REST (JSON)
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐      ┌───────▼────────┐
│  Frontend Web  │      │ Frontend Mobile│
│    Next.js     │      │ React Native   │
│   (Vercel)     │      │    (Expo)      │
└────────────────┘      └────────────────┘
```

---

## 📦 Structure Monorepo (Recommandé)

### Organisation du Code

```
bachatavibe/
├── backend/              # Django API
│   ├── manage.py
│   ├── apps/
│   └── requirements.txt
│
├── web/                  # Next.js (site web)
│   ├── app/
│   ├── components/
│   └── package.json
│
├── mobile/               # React Native (Expo)
│   ├── app/
│   ├── components/
│   └── package.json
│
└── packages/             # Code partagé
    └── shared/
        ├── types/        # Types TypeScript
        ├── api/          # Client API
        ├── utils/        # Utilitaires
        └── constants/    # Constantes
```

### Setup Monorepo

```bash
# Utiliser pnpm workspaces ou Turborepo
pnpm init
```

**package.json (racine)**
```json
{
  "name": "bachatavibe",
  "private": true,
  "workspaces": [
    "web",
    "mobile",
    "packages/*"
  ]
}
```

---

## 🎨 Frontend Web - Next.js

### Pourquoi Next.js pour le Web ?

✅ **SEO optimal** : Important pour référencement Google
✅ **Performance** : SSR/SSG pour chargement rapide
✅ **Responsive** : Fonctionne mobile/tablet/desktop
✅ **PWA** : Peut être installé sur mobile

### Cas d'usage Web
- Découverte de cours/événements via Google
- Navigation depuis desktop
- Utilisateurs sans l'app installée
- Pages publiques (landing pages, blog)

### Stack Web
```
- Next.js 15 + React 19
- Tailwind CSS + shadcn/ui
- TypeScript
- React Query (API calls)
- Zustand (state management)
```

---

## 📱 Frontend Mobile - React Native (Expo)

### Pourquoi React Native ?

✅ **Expérience native** : Vraie app iOS/Android
✅ **Performances** : Fluide et rapide
✅ **Native features** : Caméra, GPS, notifications push
✅ **Offline** : Possibilité de mode hors ligne

### Cas d'usage Mobile
- Inscription rapide à un cours
- Notifications push (rappels événements)
- Scanner QR codes (billets)
- Géolocalisation (trouve cours près de moi)
- Mode hors ligne (voir mes billets sans wifi)

### Stack Mobile
```
- Expo (React Native framework)
- Expo Router (navigation)
- NativeWind (Tailwind pour RN)
- React Query (API calls)
- Zustand (state)
- AsyncStorage (persistence)
```

---

## 🔗 Code Partagé (packages/shared)

### Types TypeScript

**packages/shared/types/user.ts**
```typescript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'participant' | 'artiste' | 'admin';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  // ...
}
```

### Client API

**packages/shared/api/client.ts**
```typescript
import { User, Course } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const authAPI = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  // ...
};

export const coursesAPI = {
  getAll: async (filters?: any): Promise<Course[]> => {
    const res = await fetch(`${API_URL}/courses`);
    return res.json();
  },
  // ...
};
```

### Constants

**packages/shared/constants/index.ts**
```typescript
export const ROLES = {
  PARTICIPANT: 'participant',
  ARTISTE: 'artiste',
  ADMIN: 'admin',
} as const;

export const LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;
```

---

## 🚀 Workflow de Développement

### Commandes Monorepo

```bash
# Installer toutes les dépendances
pnpm install

# Lancer le web
pnpm --filter web dev

# Lancer le mobile
pnpm --filter mobile start

# Build tout
pnpm build

# Tests
pnpm test
```

---

## 📊 Tableau Comparatif

| Fonctionnalité | Next.js Web | React Native |
|:---|:---:|:---:|
| **SEO** | ✅ Excellent | ❌ Non applicable |
| **Performance** | ✅ Rapide | ✅ Très rapide |
| **Offline** | ⚠️ Limité (PWA) | ✅ Complet |
| **Notifications Push** | ⚠️ Complexe | ✅ Natif |
| **App Store** | ❌ Non | ✅ Oui |
| **Caméra/GPS** | ⚠️ Web API | ✅ Natif |
| **Installation** | ⚠️ PWA install | ✅ App native |
| **Coût développement** | 💰 Moyen | 💰💰 Plus élevé |

---

## 🎯 Stratégie de Lancement

### Phase 1 : MVP Web (2 mois)
- ✅ Backend API complet
- ✅ Site web Next.js responsive
- ✅ Fonctionne sur mobile web
- ✅ PWA installable

**Avantage** : Lancement rapide, SEO dès le début

### Phase 2 : App Mobile (1.5 mois)
- ✅ React Native avec Expo
- ✅ Réutilisation du backend
- ✅ Réutilisation des types/API client
- ✅ Soumission App Store + Play Store

**Avantage** : App native pour utilisateurs réguliers

---

## 💰 Coûts Estimés

### Développement
- Backend : **40h** (API complete)
- Web : **80h** (Next.js full features)
- Mobile : **60h** (React Native, réutilisation logique backend)
- **Total : ~180h** (soit 4-5 mois à temps partiel)

### Hébergement Mensuel
- Backend (Railway) : **$10-20/mois**
- Web (Vercel) : **Gratuit** (puis $20/mois si besoin)
- Mobile : **Gratuit** (Expo)
- Database : **$5-10/mois**
- **Total : $15-50/mois**

### Publication Apps
- Apple Developer : **$99/an**
- Google Play : **$25 une fois**

---

## 🛠️ Technologies Finales

### Backend
```yaml
Framework: Django 5.x + DRF
Database: PostgreSQL 16
Auth: JWT (Simple JWT)
Storage: Cloudinary
Tasks: Celery + Redis
Deploy: Railway
```

### Web (Next.js)
```yaml
Framework: Next.js 15
UI: Tailwind + shadcn/ui
State: Zustand + React Query
Forms: React Hook Form
Deploy: Vercel
```

### Mobile (React Native)
```yaml
Framework: Expo (latest)
Navigation: Expo Router
Styling: NativeWind
State: Zustand + React Query
Deploy: EAS (Expo Application Services)
```

### Shared
```yaml
Language: TypeScript
Package Manager: pnpm
Monorepo: pnpm workspaces
```

---

## ✅ Avantages de cette Architecture

1. **Flexible** : Web et mobile indépendants
2. **Scalable** : Chaque partie peut évoluer séparément
3. **Optimal** : Les meilleures technos pour chaque plateforme
4. **SEO** : Next.js assure la visibilité Google
5. **UX Mobile** : React Native offre une vraie app native
6. **Code sharing** : Types, API client, logique partagés
7. **Team friendly** : Un dev peut se spécialiser web ou mobile

---

## 📝 Prochaines Étapes

1. ✅ Valider cette architecture
2. 🔲 Décider : Tout en même temps OU Web d'abord ?
3. 🔲 Setup du monorepo
4. 🔲 Développement backend
5. 🔲 Développement web
6. 🔲 Développement mobile

---

## 💡 Recommandation Finale

**Commencer par Web (Next.js) + Backend, puis ajouter Mobile après 2-3 mois**

**Pourquoi ?**
- 🚀 Lancement plus rapide (MVP en 2 mois)
- 💰 Budget initial réduit
- 📊 Collecter feedback utilisateurs avant app mobile
- 🎯 Concentrer les efforts sur les features essentielles
- ✅ Le site web responsive fonctionne déjà bien sur mobile

Une fois le site web en production et stable, vous pouvez développer l'app React Native qui réutilisera tout le backend.
