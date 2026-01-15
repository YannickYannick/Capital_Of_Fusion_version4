# 🧭 Nouvelle Architecture des Menus - BachataVibe V4

## 📋 Vue d'Ensemble

Le site comportera **3 systèmes de navigation distincts** :

1. **Barre de Navigation Principale** (horizontale, en haut)
2. **Menu Utilisateur** (dropdown avatar, à droite)
3. **Menu Central Interactif** (arbre organisationnel avec visualisation planètes)

---

## 1️⃣ Barre de Navigation Principale

### Position & Comportement
- **Position** : Fixe en haut de page (sticky)
- **Comportement** : Menus déroulants au survol (hover)
- **Responsive** : Menu hamburger sur mobile

### Items du Menu

#### 🎓 Cours
```
Dropdown:
├── Liste & Planning
├── Tous les cours
├── Filtrer par ville
├── Filtrer par niveau
└── Créer un cours [Si Artiste/Admin]
```

#### 📖 Formations
```
Dropdown:
├── Contenu en ligne
├── Catégories
├── Vidéothèque
└── Mes favoris [Si connecté]
```

#### 🏋️ Trainings
```
Dropdown:
├── Sessions libres
├── Organiser un training [Si connecté]
└── Mes trainings [Si connecté]
```

#### 🎭 Artistes
```
Dropdown:
├── Annuaire complet
├── Profils artistes
├── Booking & Contact
└── Avis et notes
```

#### 📚 Théorie
```
Dropdown:
├── Cours théoriques
├── Quiz
├── Ma progression [Si connecté]
└── Articles
```

#### 💆 Care
```
Dropdown:
├── Services de soins
├── Annuaire praticiens
└── Réserver [Si connecté]
```

#### 🛍️ Shop **[NOUVEAU]**
```
Dropdown:
├── Vêtements
│   ├── Pulls
│   └── T-shirts
├── Chaussures de danse
├── Vins & Spiritueux
├── Panier [Si connecté]
└── Mes commandes [Si connecté]
```

**Notes**
- Intégration e-commerce (Stripe ou Shopify)
- Gestion stocks + commandes
- Module complet à développer

#### 🚀 Projets **[NOUVEAU]**
```
Dropdown:
├── Programme d'incubation
├── Initiatives en cours
├── Proposer un projet [Si connecté]
└── Rejoindre un projet [Si connecté]
```

**Notes**
- Plateforme pour accompagner les porteurs de projets bachata
- Mentorat, ressources, financement

#### 🕸️ Organisation **[NOUVEAU]**
```
Dropdown:
├── Présentation Capital of Fusion
├── Structure de l'organisation
├── Les pôles
├── L'équipe
└── Nous rejoindre
```

**Notes**
- Présentation institutionnelle (vision, mission, valeurs)
- Organigramme interactif
- Histoire et fondateurs
- Impact et réalisations

#### 🗄️ DB **[NOUVEAU - BOUTON SPÉCIAL]**
```
Action directe (pas de dropdown):
└── Ouvre une modale avec le schéma de la base de données
```

**Notes**
- Visualisation interactive du schéma DB
- Utile pour développeurs et admins
- Peut être protégé (admin seulement)
- Format : Diagramme ERD (Entity Relationship Diagram)

---

## 2️⃣ Menu Utilisateur (Avatar)

### Position
- **Localisation** : Coin supérieur droit
- **Affichage** : Avatar + Nom ("John Doe")
- **Comportement** : Click pour ouvrir dropdown

### Items du Dropdown

```
[Avatar + John Doe]
│
├── 👤 Mon Profil
│   └── /profile
│
├── 📚 Mes Cours
│   └── /my-courses
│
├── 📅 Mes Événements
│   └── /my-events
│
├── 🎉 Mes Festivals
│   └── /my-festivals
│
├── 🛒 Mes Commandes [NOUVEAU]
│   └── /my-orders
│
├── ⚙️ Paramètres
│   └── /settings
│
└── 🚪 Déconnexion
    └── /logout
```

**Si non connecté** : afficher "Connexion" et "Inscription"

---

## 3️⃣ Menu Central Interactif ⭐ **NOUVEAU CONCEPT**

### Concept
Visualisation de la structure organisationnelle de **Capital of Fusion France** sous forme d'arbre hiérarchique avec une version **interactive en planètes**.

### Structure Hiérarchique

```
🌍 CAPITAL OF FUSION FRANCE (Racine)
│
├── 🌟 BRANCHES OFFICIELLES
│   │
│   ├── 💃 BACHATA VIBE
│   │   ├── Bachata Vibe Experience ⭐
│   │   │   └── [Fiche détaillée : Desc, Vidéo, Table]
│   │   │
│   │   ├── Bachata Vibe Paris Hebdo ⭐
│   │   │   └── [Fiche détaillée]
│   │   │
│   │   ├── Dominican Vibe ⭐
│   │   │   └── [Fiche détaillée]
│   │   │
│   │   ├── 🎉 Paris Bachata Festival [Section interne]
│   │   │   ├── Jack n' Jill Vibe
│   │   │   ├── Street Battle
│   │   │   ├── Social World Cup
│   │   │   └── Experience Palmeraie
│   │   │
│   │   └── Bachata Vibe Lyon ⭐
│   │       └── [Fiche détaillée]
│   │
│   ├── 🎶 KOMPA VIBE
│   │   └── Kompa Vibe Paris ⭐
│   │       └── [Fiche détaillée]
│   │
│   └── 🔥 AMAPIANO VIBE
│       └── Amapiano Vibe Paris ⭐
│           └── [Fiche détaillée]
```

### Fiches Détaillées (⭐)

Chaque élément marqué d'une étoile possède une **fiche complète** contenant :

**Structure d'une fiche**
```
Titre : Bachata Vibe Experience
├── Description narrative
├── Vidéo de présentation (URL YouTube/Vimeo)
├── Tableau d'informations
│   ├── Date de création
│   ├── Lieu
│   ├── Fréquence
│   ├── Niveau
│   └── Organisateur
├── Galerie photos
├── Prochaines dates
└── Bouton d'action (S'inscrire / En savoir plus)
```

---

## 🌌 Visualisation Interactive : Système Planétaire

### Concept Visuel

Inspiré du système solaire, chaque branche est une **planète** orbitant autour du **soleil central** (Capital of Fusion).

```
Représentation visuelle :

                    🌞 Capital of Fusion
                         (Soleil)
                            │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    🪐 Bachata         🪐 Kompa          🪐 Amapiano
       Vibe              Vibe              Vibe
        │
    ┌───┴───┐
    │       │
   🌕 BV    🌕 BV Lyon
  Paris
```

### Interactions

**Au survol d'une planète**
- Agrandissement léger (scale 1.1)
- Halo lumineux
- Nom affiché

**Au clic sur une planète**
- Zoom sur la planète
- Affichage des satellites (sous-branches)
- Panel latéral avec fiche détaillée
- Boutons d'action (Voir plus, S'inscrire)

**Navigation**
- Zoom in/out avec molette
- Pan (glisser-déposer) pour naviguer
- Bouton "Reset" pour revenir à la vue globale
- Recherche pour aller directement à une branche

### Technologies Suggérées

**Librairies 3D/Canvas**
- **Three.js** : Rendu 3D complet (le plus immersif)
- **D3.js** : Plus adapté pour data viz 2D
- **React Force Graph** : Graphes interactifs React
- **Visx** : Alternative React moderne

**Recommandation** : **Three.js avec React Three Fiber**

```tsx
// Exemple conceptuel
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function OrganizationPlanet({ name, position, onClick }) {
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#ff6b6b" />
    </mesh>
  )
}

function OrganizationTree() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrganizationPlanet name="Capital of Fusion" position={[0, 0, 0]} />
      <OrganizationPlanet name="Bachata Vibe" position={[5, 0, 0]} />
      <OrbitControls />
    </Canvas>
  )
}
```

---

## 📐 Wireframe Global

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] [Cours▾] [Formations▾] [Trainings▾] ... [DB] [Avatar▾]│ ← Barre Nav
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                     HERO / BANNIÈRE                          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│              🌌 VISUALISATION PLANÈTES 🌌                    │
│                                                              │
│         [Canvas Three.js - Système Planétaire]              │
│                                                              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│              📋 Arbre textuel (fallback)                     │
│                                                              │
│   Capital of Fusion France                                   │
│   ├─ Bachata Vibe                                           │
│   │  ├─ BV Experience [Voir fiche]                          │
│   │  └─ ...                                                 │
│   └─ ...                                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Nouvelles Routes API

### Shop (E-commerce)

```http
GET    /shop/products           # Liste produits
GET    /shop/products/:id       # Détail produit
POST   /shop/cart               # Ajouter au panier
GET    /shop/cart               # Voir panier
POST   /shop/checkout           # Paiement
GET    /shop/orders             # Mes commandes
GET    /shop/orders/:id         # Détail commande
```

### Projets (Incubation)

```http
GET    /projects                # Liste des projets
GET    /projects/:id            # Détail projet
POST   /projects                # Proposer un projet [Auth]
POST   /projects/:id/join       # Rejoindre un projet [Auth]
```

### Organisation

```http
GET    /organization            # Infos organisation
GET    /organization/structure  # Arbre hiérarchique JSON
GET    /organization/poles      # Les pôles
GET    /organization/team       # L'équipe
```

### DB Schema

```http
GET    /admin/db-schema         # Schéma de la base [Admin]
```

**Format de réponse** (structure hiérarchique)
```json
{
  "root": {
    "id": "capital-fusion",
    "name": "Capital of Fusion France",
    "type": "organization",
    "children": [
      {
        "id": "bachata-vibe",
        "name": "Bachata Vibe",
        "type": "branch",
        "description": "Branche dédiée à la Bachata",
        "children": [
          {
            "id": "bv-experience",
            "name": "Bachata Vibe Experience",
            "type": "event",
            "description": "...",
            "video_url": "https://...",
            "details": {
              "creation_date": "2020-01-01",
              "location": "Paris",
              "frequency": "Mensuel"
            }
          }
        ]
      }
    ]
  }
}
```

---

## 🎨 Considérations UX/UI

### Barre de Navigation
- **Sticky** : toujours visible
- **Au scroll** : réduction de hauteur
- **Active state** : highlight de la section actuelle
- **Animations** : transitions smooth sur dropdowns

### Menu Planètes
- **Progressive disclosure** : afficher d'abord vue globale, détails au clic
- **Fallback textuel** : pour accessibilité et SEO
- **Loading state** : skeleton pendant chargement 3D
- **Mobile** : version simplifiée (liste avec collapse)

### Accessibilité
- Navigation clavier complète
- ARIA labels sur tous les éléments interactifs
- Alternatives textuelles pour visualisations
- Contraste suffisant

---

## 🗄️ Nouveaux Modèles de Données

### Product (Shop)

```python
Product:
  id: UUID
  name: CharField
  category: ChoiceField [clothing, shoes, beverages]
  subcategory: CharField (pull, tshirt, wine, etc.)
  description: TextField
  price: DecimalField
  stock: IntegerField
  images: ManyToManyField(ProductImage)
  is_active: BooleanField
  created_at: DateTimeField
```

### Order

```python
Order:
  id: UUID
  user: ForeignKey(User)
  items: ManyToManyField(OrderItem)
  total_amount: DecimalField
  status: ChoiceField [pending, paid, shipped, delivered]
  payment_intent_id: CharField
  shipping_address: TextField
  created_at: DateTimeField
```

### Project

```python
Project:
  id: UUID
  title: CharField
  description: TextField
  creator: ForeignKey(User)
  status: ChoiceField [draft, active, completed]
  category: CharField
  funding_goal: DecimalField (optional)
  participants: ManyToManyField(User)
  created_at: DateTimeField
```

### OrganizationNode

```python
OrganizationNode:
  id: UUID
  name: CharField
  slug: SlugField
  parent: ForeignKey('self', null=True)
  type: ChoiceField [root, branch, event, project]
  description: TextField
  video_url: URLField (optional)
  details: JSONField
  order: IntegerField
  is_active: BooleanField
  created_at: DateTimeField
```

---

## 📊 Priorités de Développement

### Phase 1 (MVP)
1. ✅ Barre de navigation classique (sans Shop/Projets)
2. ✅ Menu utilisateur
3. ✅ Arbre organisationnel (version textuelle simple)

### Phase 2
4. 🔲 Ajout module Shop
5. 🔲 Ajout module Projets
6. 🔲 Bouton DB (modale schéma)

### Phase 3 (Avancé)
7. 🔲 Visualisation planètes 3D
8. 🔲 Interactions avancées
9. 🔲 Animations & transitions

---

## 💡 Notes Importantes

- **SEO** : Assurer que l'arbre textuel est indexable (pas seulement en 3D)
- **Performance** : Lazy load de la librairie Three.js (heavy)
- **Mobile** : Version simplifiée obligatoire (pas de 3D sur petit écran)
- **Accessibilité** : Navigation clavier du système planétaire

---

Cette nouvelle architecture est ambitieuse et apporte une dimension visuelle unique au site BachataVibe ! 🚀
