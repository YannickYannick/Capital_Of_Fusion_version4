# Mobile React Native - BachataVibe V4

## 📱 Structure Anticipée

Application mobile avec Expo Router (file-based routing).

```
mobile/
├── app/              # Expo Router (Pages)
│   ├── (tabs)/       # Navigation par onglets
│   │   ├── home/
│   │   ├── courses/
│   │   └── profile/
│   └── _layout.tsx
└── src/
    ├── components/   # Composants partagés
    ├── features/     # Composants métier
    └── hooks/        # Custom hooks
```

## 🚀 Installation (Quand développée)

```bash
# Installer les dépendances
npm install

# Lancer Expo
npx expo start
```

## 📝 Note

Cette structure est actuellement anticipée pour une future phase de développement.
Le focus actuel est sur le backend et le frontend web.

## 🛠️ Technologies Prévues

- React Native
- Expo SDK
- Expo Router (navigation)
- React Query (données)
- Zustand (état global)
