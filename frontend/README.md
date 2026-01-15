# Frontend Next.js - BachataVibe V4

## 🎨 Features

- **Landing Page V2**: Arrière-plan vidéo immersif avec navigation transparente
- **Système Planétaire 3D**: Visualisation interactive de l'organisation (Three.js)
- **App Router**: Architecture Next.js 15 avec layouts groupés
- **Tailwind CSS**: Styling moderne et responsive
- **TypeScript**: Typage fort pour la robustesse

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure

- `app/`: Pages et layouts (App Router)
  - `(site)/`: Layout public avec navbar transparente
  - `(app)/`: Layout application standard
  - `(auth)/`: Layout authentification
  - `(dashboard)/`: Layout espace membre
- `components/`: Composants React
  - `ui/`: Composants de base (Shadcn/UI)
  - `shared/`: Composants réutilisables
  - `features/`: Composants métier par domaine
- `lib/`: Utilitaires et configuration
- `hooks/`: Custom React hooks
- `types/`: Définitions TypeScript

## 🛠️ Technologies

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Three.js (visualisations 3D)
- Framer Motion (animations)

## 🎯 Scripts

```bash
npm run dev      # Développement
npm run build    # Build production
npm run start    # Démarrer production
npm run lint     # Linter
```

## ⚙️ Configuration

Variables d'environnement dans `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
