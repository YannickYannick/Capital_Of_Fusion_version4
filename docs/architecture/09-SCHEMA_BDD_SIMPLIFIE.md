# 🗄️ Schéma de Base de Données Simplifié - BachataVibe V4

## 🎯 Principe de Normalisation

**Règle d'or** : Pas de doublons ! Les données communes (styles de danse, niveaux, catégories) sont stockées UNE SEULE FOIS et référencées partout.

**Exemple** :
- "Bachata Sensuelle" existe UNE fois dans `DanceStyle`
- Utilisé par : Artistes (spécialité), Cours (enseignement), Formations (sujet), Events (thème)

---

## 📊 Tables de Référence (Réutilisables)

### 1. DanceStyle (Styles de Danse) - HIÉRARCHIQUE

```python
DanceStyle:
  id: UUID
  name: CharField              # "Bachata", "Bachata Sensual", "Salsa"
  slug: SlugField              # "bachata-sensual"
  parent: ForeignKey('self')   # Hiérarchie
  description: TextField
  icon: CharField              # Icône (optionnel)
  order: IntegerField
  is_active: BooleanField
```

**Hiérarchie Exemple** :
```
Bachata (parent)
├── Bachata Sensual
├── Bachata Dominicana
├── Bachata Moderna
└── Bachata Tradicional

Salsa (parent)
├── Salsa Cubana
├── Salsa On1
└── Salsa On2

Kompa (parent)
Amapiano (parent)
Kizomba (parent)
```

**Usage** :
- Artiste.specialties → ManyToMany(DanceStyle)
- Course.dance_style → ForeignKey(DanceStyle)
- Event.dance_styles → ManyToMany(DanceStyle)
- Formation.dance_style → ForeignKey(DanceStyle)

---

### 2. Level (Niveaux de Danse)

```python
Level:
  id: UUID
  name: CharField         # "Débutant", "Intermédiaire", "Avancé"
  slug: SlugField         # "beginner", "intermediate"
  description: TextField
  order: IntegerField     # 1, 2, 3, 4
  color: CharField        # Code couleur pour UI
```

**Valeurs Standard** :
- Débutant / Beginner
- Intermédiaire / Intermediate
- Avancé / Advanced
- Professionnel / Professional
- Tous niveaux / All Levels

**Usage** :
- User.dance_level → ForeignKey(Level)
- Course.level → ForeignKey(Level)
- Event.level → ForeignKey(Level)

---

### 3. Category (Catégories) - GÉNÉRIQUE & HIÉRARCHIQUE

```python
Category:
  id: UUID
  name: CharField
  slug: SlugField
  parent: ForeignKey('self', null=True)
  type: ChoiceField [course, formation, event, product, project]
  description: TextField
  icon: CharField
  order: IntegerField
```

**Exemples** :
```
# Catégories de Cours
Cours technique (parent)
├── Footwork
├── Body movement
└── Connexion

Cours thématiques (parent)
├── Styling
└── Musicality

# Catégories de Formations
Technique (parent)
Histoire (parent)
Musicalité (parent)

# Catégories de Produits (Shop)
Vêtements (parent)
├── T-shirts
└── Pulls
Chaussures (parent)
```

**Usage** :
- Course.category → ForeignKey(Category) where type='course'
- Formation.category → ForeignKey(Category) where type='formation'
- Product.category → ForeignKey(Category) where type='product'

---

### 4. Tag (Étiquettes Flexibles)

```python
Tag:
  id: UUID
  name: CharField       # "Romantique", "Énergique", "Technique"
  slug: SlugField
  color: CharField      # Pour affichage UI
```

**Usage** :
- Course.tags → ManyToMany(Tag)
- Event.tags → ManyToMany(Tag)
- Formation.tags → ManyToMany(Tag)

---

### 5. DanceProfession (Métiers de la Danse)

```python
DanceProfession:
  id: UUID
  name: CharField         # "Vidéaste", "Chorégraphe", "Danseur"
  slug: SlugField         # "videographer", "choreographer"
  description: TextField
  icon: CharField
  order: IntegerField
```

**Valeurs Standard** :
- Danseur / Dancer
- Chorégraphe / Choreographer
- Vidéaste / Videographer
- Photographe / Photographer
- Créateur d'image / Graphic Designer
- DJ
- Musicien / Musician

**Usage** :
- User.dance_professions → ManyToMany(DanceProfession)

---

### 6. OrganizationRole (Rôles dans Capital of Fusion)

```python
OrganizationRole:
  id: UUID
  name: CharField              # "Gérant Bachata Vibe", "Pôle Logistique"
  slug: SlugField
  team: ForeignKey(Team)       # Équipe associée
  description: TextField
  level: ChoiceField [direction, manager, member, volunteer]
  icon: CharField
  order: IntegerField
```

**Exemples de Rôles** :
```
Direction:
- Directeur / Director
- Co-directeur / Co-Director

Managers:
- Gérant Bachata Vibe
- Gérant Kompa Vibe
- Gérant Amapiano Vibe

Pôles:
- Pôle Logistique
- Pôle Média
- Pôle Communication
- Pôle Technique
- Pôle Artistique

Rôles Spécifiques:
- Référent
- Superviseur
- Prof (Enseignant)
- Bénévole
```

**Usage** :
- User.organization_roles → ManyToMany(OrganizationRole) via UserOrganizationRole

---

### 7. Team (Équipes Organisationnelles)

```python
Team:
  id: UUID
  name: CharField                    # "TEAM VIBE (Superviseur)"
  slug: SlugField
  organization_node: ForeignKey(OrganizationNode, null=True)  # Lien avec branche
  type: ChoiceField [orga, vibe, project]
  description: TextField
  is_public: BooleanField            # Visible publiquement
  created_at: DateTimeField
```

**Exemples de Teams** (basé sur votre image) :
```
Bachata Vibe:
- TEAM VIBE (Direction)
- TEAM VIBE (Superviseur)
- TEAM VIBE (Référent)
- TEAM VIBE (PROF)
- TEAM VIBE (INCUBATION)
- TEAM VIBE (Bénévoles)

Dominican Vibe:
- TEAM ORGA (DOMINICAN VIBE)

Paris Bachata Festival:
- TEAM ORGA (Direction)
- TEAM ORGA (Jack&Jill)
- TEAM ORGA (Opérationnel)

Général:
- Discussion (Orga)
```

**Usage** :
- OrganizationRole.team → ForeignKey(Team)
- User peut avoir plusieurs rôles dans plusieurs teams

---

### 8. UserOrganizationRole (Table de Liaison)

```python
UserOrganizationRole:
  id: UUID
  user: ForeignKey(User)
  role: ForeignKey(OrganizationRole)
  team: ForeignKey(Team)
  start_date: DateField
  end_date: DateField (null=True)    # Si rôle temporaire
  is_active: BooleanField
```

**Permet de gérer** :
- Historique des rôles
- Rôles temporaires (ex: organisateur d'un festival)
- Plusieurs rôles simultanés

---

## 👥 Entités Principales

### 1. User (Utilisateur)

```python
User:
  id: UUID
  email: EmailField (unique)
  password: HashedField
  first_name: CharField
  last_name: CharField
  role: ChoiceField [participant, artiste, admin]
  
  # Profil danse
  dance_level: ForeignKey(Level)              # ← Réutilise Level
  dance_styles: ManyToMany(DanceStyle)        # ← Réutilise DanceStyle
  years_experience: IntegerField
  
  # Métiers & Rôles ⭐ NOUVEAU
  dance_professions: ManyToMany(DanceProfession)        # ← Métiers danse
  organization_roles: ManyToMany(OrganizationRole)      # ← Rôles Capital of Fusion
  
  # Autres
  avatar: ImageField
  bio: TextField
  city: CharField
  created_at: DateTimeField
```

---

### 2. Artist (Profil Artiste)

```python
Artist:
  id: UUID
  user: OneToOneField(User)
  stage_name: CharField
  bio: TextField
  
  # Spécialités (réutilise DanceStyle)
  specialties: ManyToMany(DanceStyle)         # ← Réutilise DanceStyle
  
  # Disponibilités
  available_for_teaching: BooleanField
  available_for_performance: BooleanField
  
  # Tarifs
  hourly_rate: DecimalField
  
  city: CharField
  created_at: DateTimeField
```

---

### 3. Course (Cours)

```python
Course:
  id: UUID
  title: CharField
  description: TextField
  
  # Relations réutilisables
  creator: ForeignKey(User)
  dance_style: ForeignKey(DanceStyle)         # ← Réutilise DanceStyle
  level: ForeignKey(Level)                    # ← Réutilise Level
  category: ForeignKey(Category)              # ← Réutilise Category (type='course')
  tags: ManyToMany(Tag)                       # ← Réutilise Tag
  
  # Détails
  start_date: DateField
  price: DecimalField
  capacity: IntegerField
  
  # Lieu
  city: CharField
  venue_name: CharField
  address: CharField
  latitude: DecimalField
  longitude: DecimalField
  
  # Media
  cover_image: ImageField
  
  status: ChoiceField [draft, published, cancelled]
  created_at: DateTimeField
```

---

### 4. Event (Événement)

```python
Event:
  id: UUID
  title: CharField
  description: TextField
  
  # Relations réutilisables
  organizer: ForeignKey(User)
  dance_styles: ManyToMany(DanceStyle)        # ← Réutilise DanceStyle (plusieurs possibles)
  level: ForeignKey(Level)                    # ← Réutilise Level
  tags: ManyToMany(Tag)                       # ← Réutilise Tag
  
  # Type
  type: ChoiceField [workshop, masterclass, party, social]
  
  # Date
  date: DateField
  start_time: TimeField
  
  # Prix & Capacité
  price: DecimalField
  capacity: IntegerField
  
  # Lieu
  city: CharField
  venue_name: CharField
  
  cover_image: ImageField
  status: ChoiceField
  created_at: DateTimeField
```

---

### 5. Formation (Article de Formation)

```python
Formation:
  id: UUID
  title: CharField
  slug: SlugField
  content: TextField
  
  # Relations réutilisables
  author: ForeignKey(User)
  dance_style: ForeignKey(DanceStyle)         # ← Réutilise DanceStyle
  category: ForeignKey(Category)              # ← Réutilise Category (type='formation')
  level: ForeignKey(Level)                    # ← Réutilise Level
  tags: ManyToMany(Tag)                       # ← Réutilise Tag
  
  featured_image: ImageField
  video_url: URLField
  
  status: ChoiceField [draft, published]
  published_at: DateTimeField
  created_at: DateTimeField
```

---

### 6. Festival

```python
Festival:
  id: UUID
  name: CharField
  description: TextField
  
  # Relations
  organizer: ForeignKey(User)
  dance_styles: ManyToMany(DanceStyle)        # ← Réutilise DanceStyle
  featured_artists: ManyToMany(Artist)
  
  # Dates
  start_date: DateField
  end_date: DateField
  
  # Lieu
  city: CharField
  venue_name: CharField
  
  poster: ImageField
  status: ChoiceField
  created_at: DateTimeField
```

---

### 7. Product (Shop)

```python
Product:
  id: UUID
  name: CharField
  description: TextField
  
  # Catégorie réutilisable
  category: ForeignKey(Category)              # ← Réutilise Category (type='product')
  tags: ManyToMany(Tag)                       # ← Réutilise Tag
  
  price: DecimalField
  stock: IntegerField
  
  images: ManyToMany(ProductImage)
  is_active: BooleanField
  created_at: DateTimeField
```

---

### 8. OrganizationNode (Structure Orga)

```python
OrganizationNode:
  id: UUID
  name: CharField                    # "Bachata Vibe", "Capital of Fusion"
  slug: SlugField
  parent: ForeignKey('self', null=True)
  
  # Type
  type: ChoiceField [root, branch, event, project]
  
  # Optionnel : lien vers style de danse
  dance_style: ForeignKey(DanceStyle, null=True)  # ← Réutilise DanceStyle
  
  description: TextField
  video_url: URLField
  logo: ImageField
  
  order: IntegerField
  is_active: BooleanField
  created_at: DateTimeField
```

---

## 🔗 Tables de Liaison (ManyToMany)

### Enrollment (Inscription Cours)

```python
Enrollment:
  id: UUID
  user: ForeignKey(User)
  course: ForeignKey(Course)
  enrolled_at: DateTimeField
  status: ChoiceField [active, cancelled]
```

### EventRegistration (Inscription Événement)

```python
EventRegistration:
  id: UUID
  user: ForeignKey(User)
  event: ForeignKey(Event)
  amount_paid: DecimalField
  payment_status: ChoiceField
  registered_at: DateTimeField
```

### ArtistReview (Avis Artiste)

```python
ArtistReview:
  id: UUID
  artist: ForeignKey(Artist)
  reviewer: ForeignKey(User)
  rating: IntegerField (1-5)
  comment: TextField
  created_at: DateTimeField
```

---

## 📈 Diagramme Simplifié (Relations Clés)

```
┌─────────────────────────────────────────────────┐
│         TABLES DE RÉFÉRENCE (Réutilisables)     │
├─────────────────────────────────────────────────┤
│  DanceStyle  │  Level  │  Category  │  Tag     │
└─────────────────────────────────────────────────┘
         ▲            ▲         ▲          ▲
         │            │         │          │
         └────────────┴─────────┴──────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
    ┌────▼────┐              ┌─────▼─────┐
    │  User   │◄─────────────│  Artist   │
    └────┬────┘              └───────────┘
         │
    ┌────┼────┬────────┬──────────┐
    │    │    │        │          │
┌───▼──┐ │ ┌──▼───┐ ┌─▼──────┐ ┌─▼────────┐
│Course│ │ │Event │ │Festival│ │Formation │
└──────┘ │ └──────┘ └────────┘ └──────────┘
         │
    ┌────▼─────┐
    │ Product  │
    └──────────┘
```

---

## ✅ Avantages de cette Structure

### 1. Pas de Duplication
✅ "Bachata Sensual" existe UNE fois dans `DanceStyle`
✅ "Débutant" existe UNE fois dans `Level`
✅ Les artistes, cours, events référencent les mêmes données

### 2. Maintenance Facile
✅ Ajouter un nouveau style : 1 seule ligne dans `DanceStyle`
✅ Renommer un style : 1 seul UPDATE, tout est mis à jour automatiquement

### 3. Cohérence
✅ Impossible d'avoir "Bachata Sensual" ET "Bachata Sensuelle" (typo)
✅ Filtrage simple et performant

### 4. Évolutivité
✅ Ajouter facilement de nouveaux styles (Kizomba, Zouk, etc.)
✅ Hiérarchie flexible (styles parents/enfants)

---

## 🎨 Exemples d'Utilisation

### Créer un Artiste Expert en Bachata Sensual

```python
# 1. Récupérer le style (existe déjà)
bachata_sensual = DanceStyle.objects.get(slug='bachata-sensual')

# 2. Créer l'artiste
artist = Artist.objects.create(
    user=john,
    stage_name="John Bachata Master"
)

# 3. Ajouter la spécialité
artist.specialties.add(bachata_sensual)
```

### Créer un Cours de Bachata Sensual

```python
# Réutilise le même style !
course = Course.objects.create(
    title="Cours Bachata Sensual - Niveau Débutant",
    dance_style=bachata_sensual,  # ← Même référence
    level=Level.objects.get(slug='beginner'),
    category=Category.objects.get(slug='technique', type='course'),
    creator=john
)
```

### Filtrer tous les contenus Bachata Sensual

```python
# Tous les artistes experts en Bachata Sensual
artists = Artist.objects.filter(specialties__slug='bachata-sensual')

# Tous les cours de Bachata Sensual
courses = Course.objects.filter(dance_style__slug='bachata-sensual')

# Tous les événements incluant Bachata Sensual
events = Event.objects.filter(dance_styles__slug='bachata-sensual')

# Toutes les formations sur Bachata Sensual
formations = Formation.objects.filter(dance_style__slug='bachata-sensual')
```

---

## 🚀 Initialisation des Données de Référence

### Script de Migration (Django)

```python
def populate_dance_styles():
    # Bachata
    bachata = DanceStyle.objects.create(name="Bachata", slug="bachata")
    DanceStyle.objects.create(name="Bachata Sensual", slug="bachata-sensual", parent=bachata)
    DanceStyle.objects.create(name="Bachata Dominicana", slug="bachata-dominicana", parent=bachata)
    DanceStyle.objects.create(name="Bachata Moderna", slug="bachata-moderna", parent=bachata)
    
    # Salsa
    salsa = DanceStyle.objects.create(name="Salsa", slug="salsa")
    DanceStyle.objects.create(name="Salsa Cubana", slug="salsa-cubana", parent=salsa)
    DanceStyle.objects.create(name="Salsa On1", slug="salsa-on1", parent=salsa)
    
    # Autres
    DanceStyle.objects.create(name="Kompa", slug="kompa")
    DanceStyle.objects.create(name="Amapiano", slug="amapiano")
    DanceStyle.objects.create(name="Kizomba", slug="kizomba")

def populate_levels():
    Level.objects.create(name="Débutant", slug="beginner", order=1, color="#4ADE80")
    Level.objects.create(name="Intermédiaire", slug="intermediate", order=2, color="#FBBF24")
    Level.objects.create(name="Avancé", slug="advanced", order=3, color="#F87171")
    Level.objects.create(name="Professionnel", slug="professional", order=4, color="#A78BFA")
    Level.objects.create(name="Tous niveaux", slug="all-levels", order=0, color="#60A5FA")
```

---

## 📝 Résumé

| Type | Modèles | Réutilisation |
|:---|:---|:---|
| **Référence** | DanceStyle, Level, Category, Tag | ✅ Partout |
| **Entités** | User, Artist, Course, Event, Festival, Formation, Product | Référencent les tables de référence |
| **Liaison** | Enrollment, EventRegistration, ArtistReview | Relations N-N |

**Cette structure garantit :**
- ✅ Pas de doublons
- ✅ Cohérence des données
- ✅ Maintenance simplifiée
- ✅ Évolutivité maximale
