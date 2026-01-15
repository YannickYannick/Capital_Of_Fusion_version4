# 🏗️ Architecture API - BachataVibe V4

## 🎯 Principes de Conception

### API REST avec Architecture Découplée
- Frontend et Backend complètement séparés
- Communication via API REST JSON
- Authentification JWT (stateless)
- CORS configuré proprement

---

## 📍 Structure des Endpoints

### Base URL
```
Production: https://api.bachatavibe.com/v1
Development: http://localhost:8000/api/v1
```

---

## 🔐 Authentification

### Endpoints Auth
```http
POST   /auth/register          # Inscription
POST   /auth/login             # Connexion (retourne access + refresh tokens)
POST   /auth/refresh           # Rafraîchir l'access token
POST   /auth/logout            # Déconnexion
POST   /auth/password/reset    # Demande reset password
POST   /auth/password/confirm  # Confirmation reset
GET    /auth/me                # Informations utilisateur actuel
PATCH  /auth/me                # Mise à jour profil
```

### Headers
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 📚 Modules Principaux

### 1. 🎓 Courses (Cours)

```http
GET    /courses                 # Liste des cours
GET    /courses/:id             # Détail d'un cours
POST   /courses                 # Créer un cours [Auth: Artiste/Admin]
PATCH  /courses/:id             # Modifier un cours [Auth: Propriétaire/Admin]
DELETE /courses/:id             # Supprimer un cours [Auth: Propriétaire/Admin]

POST   /courses/:id/enroll      # S'inscrire à un cours [Auth]
DELETE /courses/:id/enroll      # Se désinscrire [Auth]
GET    /courses/:id/participants # Liste des participants [Auth]
```

**Filtres & Tri**
```
?city=paris
?level=intermediate
?category=bachata-sensual
?date_from=2024-01-01
?date_to=2024-12-31
?sort=date,-price,popularity
```

---

### 2. 🎉 Festivals

```http
GET    /festivals               # Liste des festivals
GET    /festivals/:id           # Détail d'un festival
POST   /festivals               # Créer [Auth: Admin]
PATCH  /festivals/:id           # Modifier [Auth: Admin]
DELETE /festivals/:id           # Supprimer [Auth: Admin]

GET    /festivals/:id/packages  # Packages disponibles
POST   /festivals/:id/register  # S'inscrire avec package [Auth]
GET    /festivals/:id/program   # Programme détaillé
```

**Packages**
```json
{
  "packages": [
    {
      "id": 1,
      "name": "Basic Pass",
      "price": 150,
      "features": ["Accès soirées", "2 workshops"],
      "available_slots": 50
    }
  ]
}
```

---

### 3. 📅 Events (Événements)

```http
GET    /events                  # Liste des événements
GET    /events/:id              # Détail
POST   /events                  # Créer [Auth: Artiste/Admin]
PATCH  /events/:id              # Modifier [Auth: Propriétaire/Admin]
DELETE /events/:id              # Supprimer [Auth: Propriétaire/Admin]

POST   /events/:id/register     # S'inscrire [Auth]
POST   /events/:id/waitlist     # Rejoindre liste d'attente [Auth]
```

**Filtres**
```
?type=workshop,masterclass,party
?city=lyon
?date=2024-06-01
?status=available,full
```

---

### 4. 📖 Formations

```http
GET    /formations              # Liste des articles
GET    /formations/:slug        # Détail d'un article
POST   /formations              # Créer [Auth: Admin]
PATCH  /formations/:slug        # Modifier [Auth: Admin]
DELETE /formations/:slug        # Supprimer [Auth: Admin]

GET    /formations/categories   # Catégories hiérarchiques
POST   /formations/:slug/favorite # Ajouter aux favoris [Auth]
GET    /formations/:slug/comments # Commentaires
POST   /formations/:slug/comments # Commenter [Auth]
```

---

### 5. 🏋️ Trainings

```http
GET    /trainings               # Liste des trainings
GET    /trainings/:id           # Détail
POST   /trainings               # Créer (tout utilisateur auth)
PATCH  /trainings/:id           # Modifier [Auth: Propriétaire/Admin]
DELETE /trainings/:id           # Supprimer [Auth: Propriétaire/Admin]

POST   /trainings/:id/join      # Rejoindre un training [Auth]
DELETE /trainings/:id/join      # Quitter [Auth]
```

---

### 6. 🏆 Competitions

```http
GET    /competitions            # Liste
GET    /competitions/:id        # Détail
POST   /competitions            # Créer [Auth: Admin]
PATCH  /competitions/:id        # Modifier [Auth: Admin]

POST   /competitions/:id/register # S'inscrire (avec partenaire) [Auth]
GET    /competitions/:id/results  # Résultats et classement
```

---

### 7. 🎭 Artists (Artistes)

```http
GET    /artists                 # Liste des artistes
GET    /artists/:id             # Profil d'un artiste
PATCH  /artists/:id             # Modifier profil [Auth: Propriétaire/Admin]

GET    /artists/:id/reviews     # Avis sur l'artiste
POST   /artists/:id/reviews     # Laisser un avis [Auth]
POST   /artists/:id/contact     # Contacter l'artiste
```

---

### 8. 📚 Theory (Théorie)

```http
GET    /theory/courses          # Cours théoriques
GET    /theory/courses/:id      # Détail d'un cours
GET    /theory/courses/:id/lessons # Leçons d'un cours

POST   /theory/lessons/:id/complete # Marquer comme complétée [Auth]
GET    /theory/quizzes/:id      # Quiz
POST   /theory/quizzes/:id/submit # Soumettre réponses [Auth]
GET    /theory/progress         # Progression utilisateur [Auth]
```

---

### 9. 💆 Care (Soins & Bien-être)

```http
GET    /care/services           # Services disponibles
GET    /care/services/:id       # Détail d'un service
GET    /care/practitioners      # Liste des praticiens
POST   /care/bookings           # Réserver un rendez-vous [Auth]
```

---

## 👤 Profil Utilisateur

```http
GET    /users/me                # Mon profil complet
PATCH  /users/me                # Modifier mon profil
GET    /users/me/courses        # Mes cours
GET    /users/me/events         # Mes événements
GET    /users/me/festivals      # Mes festivals
GET    /users/me/favorites      # Mes formations favorites
GET    /users/me/notifications  # Mes notifications
PATCH  /users/me/settings       # Paramètres
```

---

## 💳 Paiements

```http
POST   /payments/create-intent  # Créer intention de paiement Stripe
POST   /payments/confirm        # Confirmer paiement
GET    /payments/history        # Historique des paiements [Auth]
POST   /webhooks/stripe         # Webhook Stripe (backend only)
```

---

## 🔔 Notifications

```http
GET    /notifications           # Liste des notifications [Auth]
PATCH  /notifications/:id/read  # Marquer comme lue [Auth]
PATCH  /notifications/read-all  # Tout marquer comme lu [Auth]
```

---

## 🔍 Recherche Globale

```http
GET    /search?q=bachata&type=courses,events,artists
```

**Réponse**
```json
{
  "results": {
    "courses": [...],
    "events": [...],
    "artists": [...]
  }
}
```

---

## 📊 Réponses Standards

### Success (200 OK)
```json
{
  "data": {
    "id": 1,
    "title": "Cours de Bachata Sensual"
  }
}
```

### Liste Paginée (200 OK)
```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "per_page": 20,
    "total_pages": 8
  }
}
```

### Created (201 Created)
```json
{
  "data": {...},
  "message": "Cours créé avec succès"
}
```

### Error (4xx/5xx)
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Le champ 'title' est requis",
    "details": {
      "title": ["Ce champ est obligatoire"]
    }
  }
}
```

---

## 🔒 Permissions

| Rôle | Permissions |
|:---|:---|
| **Guest** | Lecture publique uniquement |
| **Participant** | Inscriptions, commentaires, favoris |
| **Artiste** | Créer cours/events, gérer son profil artiste |
| **Admin** | Accès complet, modération |

---

## 📈 Rate Limiting

```
- Anonymous: 100 req/minute
- Authenticated: 300 req/minute
- Admin: 1000 req/minute
```

---

## 🧪 Documentation Interactive

- **Swagger UI** : `/api/docs/`
- **ReDoc** : `/api/redoc/`
- **OpenAPI Schema** : `/api/schema/`

---

## 📝 Versioning

```
v1: Version initiale (MVP)
v2: Ajout fonctionnalités avancées (chat, recommandations)
```

**Stratégie** : Garder v1 pendant 6 mois après sortie v2
