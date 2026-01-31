# Paramètres d'Animation d'Entrée

## 📋 Vue d'ensemble

Les paramètres d'animation d'entrée contrôlent comment les planètes apparaissent dans la scène 3D lors du chargement de la page `/explore`. Ces paramètres sont globaux et s'appliquent à toutes les planètes pour l'instant.

## 🎮 Paramètres disponibles

### Position X de départ (`entryStartX`)
- **Plage** : -100 à 0
- **Défaut** : -60.0
- **Description** : Position horizontale de départ des planètes. Les valeurs négatives placent les planètes hors écran à gauche.
- **Impact** : Plus la valeur est négative, plus les planètes commencent loin à gauche.

### Position Y de départ (`entryStartY`)
- **Plage** : -20 à 20
- **Défaut** : 0.0
- **Description** : Position verticale de départ des planètes.
- **Impact** : 
  - Valeurs négatives : planètes commencent plus bas
  - Valeurs positives : planètes commencent plus haut
  - 0 : planètes commencent au centre vertical

### Position Z de départ (`entryStartZ`)
- **Plage** : 0 à 30 (si personnalisé) ou "Auto"
- **Défaut** : `null` (Auto - utilise le rayon de l'orbite)
- **Description** : Position de profondeur de départ des planètes.
- **Impact** :
  - `null` (Auto) : utilise automatiquement le rayon de l'orbite de chaque planète
  - Valeur personnalisée : toutes les planètes commencent à la même profondeur
- **Note** : Cochez "Personnaliser Z" pour activer le slider et définir une valeur personnalisée.

### Vitesse d'entrée (`entrySpeed`)
- **Plage** : 10 à 50
- **Défaut** : 30
- **Description** : Vitesse à laquelle les planètes se déplacent de leur position de départ vers leur orbite.
- **Impact** :
  - 10 : Animation lente (1 unité/seconde)
  - 30 : Animation moyenne (3 unités/seconde) - recommandé
  - 50 : Animation rapide (5 unités/seconde)
- **Formule** : La vitesse réelle est calculée comme `entrySpeed / 10` unités par seconde.

## 💾 Persistance

Tous les paramètres sont automatiquement sauvegardés dans le `localStorage` du navigateur et sont restaurés lors de la prochaine visite. Les clés utilisées sont :
- `planets_entryStartX`
- `planets_entryStartY`
- `planets_entryStartZ`
- `planets_entrySpeed`

## 🎬 Comment utiliser

1. Accédez à la page `/explore`
2. Ouvrez le panneau "OPTIONS" à droite
3. Faites défiler jusqu'à la section "Animation d'Entrée"
4. Ajustez les sliders selon vos préférences
5. Cliquez sur "Rejouer l'Intro" pour voir les changements immédiatement
6. Les paramètres sont automatiquement sauvegardés

## 🔧 Implémentation technique

### Localisation dans le code

- **Contexte** : `frontend/src/contexts/PlanetsOptionsContext.tsx`
- **UI** : `frontend/src/app/(site)/explore/page.tsx`
- **Animation** : `frontend/src/components/features/explore/Scene3DAdvanced.tsx`

### Structure de données

Les paramètres sont stockés dans le contexte React `PlanetsOptionsContext` et utilisés dans la boucle d'animation de `Scene3DAdvanced.tsx`. L'animation utilise une interpolation linéaire entre la position de départ `(startX, startY, startZ)` et la position d'arrivée `(0, 0, orbitRadius)`.

### Calcul de l'animation

```typescript
// Progression basée sur la distance parcourue en X
const progress = (startX - currentX) / (startX - 0);
const currentY = startY + (0 - startY) * progress;
const currentZ = startZ + (orbitZ - startZ) * progress;
```

## 🚀 Évolutions futures

- [ ] Support de paramètres individuels par planète
- [ ] Sauvegarde des paramètres sur le serveur (backend)
- [ ] Présets d'animation (lent, normal, rapide)
- [ ] Animation d'entrée personnalisable par type de planète

## 📝 Notes

- Les paramètres sont globaux pour toutes les planètes actuellement
- La vitesse est multipliée par le delta time pour une animation indépendante du framerate
- L'animation utilise un système de "stagger" (décalage) de 200ms entre chaque planète pour un effet visuel plus fluide
