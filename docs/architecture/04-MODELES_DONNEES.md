# 🗃️ Modèles de Données - BachataVibe V4

## 📋 Vue d'Ensemble

Cette documentation détaille les modèles de données pour la V4, en s'inspirant de la V3 mais avec des améliorations.

---

## 👤 User (Utilisateur)

### Champs Principaux
```python
User:
  id: UUID (primary key)
  email: EmailField (unique)
  username: CharField (unique, optional)
  password: HashedField
  first_name: CharField
  last_name: CharField
  phone: CharField (optional)
  
  # Rôle
  role: ChoiceField [participant, artiste, admin]
  
  # Profil
  avatar: ImageField
  bio: TextField
  birth_date: DateField
  gender: ChoiceField [male, female, other, prefer_not_to_say]
  
  # Localisation
  city: CharField
  country: CharField (default: FR)
  
  # Danse
  dance_level: ChoiceField [beginner, intermediate, advanced, professional]
  dance_styles: ManyToManyField(DanceStyle)
  years_experience: IntegerField
  
  # Social
  facebook_url: URLField
  instagram_url: URLField
  youtube_url: URLField
  website: URLField
  
  # Statut
  is_active: BooleanField (default: True)
  is_verified: BooleanField (default: False)
  email_verified: BooleanField (default: False)
  
  # Timestamps
  created_at: DateTimeField (auto_now_add)
  updated_at: DateTimeField (auto_now)
  last_login: DateTimeField
```

### Relations
- `courses_created` → Course (si artiste)
- `courses_enrolled` → Course (via Enrollment)
- `events_created` → Event (si artiste/admin)
- `events_enrolled` → Event (via EventRegistration)

---

## 🎓 Course (Cours)

```python
Course:
  id: UUID
  title: CharField (max_length=200)
  slug: SlugField (unique)
  description: TextField
  short_description: CharField (max_length=300)
  
  # Organisateur
  creator: ForeignKey(User)
  
  # Détails
  level: ChoiceField [beginner, intermediate, advanced, all_levels]
  category: ForeignKey(CourseCategory)
  dance_style: ForeignKey(DanceStyle)
  
  # Dates & horaires
  start_date: DateField
  end_date: DateField (optional, si cours régulier)
  schedule: JSONField  # [{"day": "monday", "start": "19:00", "end": "21:00"}]
  duration_minutes: IntegerField
  
  # Localisation
  venue_name: CharField
  address: CharField
  city: CharField
  postal_code: CharField
  country: CharField (default: FR)
  latitude: DecimalField
  longitude: DecimalField
  
  # Capacité & prix
  price: DecimalField
  currency: CharField (default: EUR)
  capacity: IntegerField
  min_participants: IntegerField (default: 1)
  
  # Media
  cover_image: ImageField
  gallery_images: ManyToManyField(CourseImage)
  video_url: URLField (optional)
  
  # Stats
  popularity_score: IntegerField (default: 0)
  views_count: IntegerField (default: 0)
  
  # Statut
  status: ChoiceField [draft, published, cancelled, completed]
  is_featured: BooleanField (default: False)
  
  # Timestamps
  created_at: DateTimeField
  updated_at: DateTimeField
```

---

## 🎉 Festival

```python
Festival:
  id: UUID
  name: CharField
  slug: SlugField
  description: TextField
  
  # Dates
  start_date: DateField
  end_date: DateField
  registration_deadline: DateTimeField
  
  # Localisation
  venue_name: CharField
  city: CharField
  country: CharField
  address: TextField
  latitude: DecimalField
  longitude: DecimalField
  
  # Informations
  website: URLField
  facebook_event: URLField
  
  # Media
  poster: ImageField
  gallery: ManyToManyField(FestivalImage)
  
  # Organisateur
  organizer: ForeignKey(User)
  
  # Artistes invités
  featured_artists: ManyToManyField(Artist)
  
  # Statut
  status: ChoiceField [upcoming, ongoing, past, cancelled]
  
  # Timestamps
  created_at: DateTimeField
  updated_at: DateTimeField
```

### FestivalPackage (Packages du Festival)
```python
FestivalPackage:
  id: UUID
  festival: ForeignKey(Festival)
  name: CharField  # Basic, Premium, VIP
  price: DecimalField
  available_slots: IntegerField
  description: TextField
  features: JSONField  # ["Full pass", "2 workshops", "Welcome drink"]
  
  is_active: BooleanField
```

### FestivalRegistration (Inscription Festival)
```python
FestivalRegistration:
  id: UUID
  festival: ForeignKey(Festival)
  package: ForeignKey(FestivalPackage)
  user: ForeignKey(User)
  
  # Paiement
  payment_status: ChoiceField [pending, paid, refunded]
  payment_intent_id: CharField (Stripe)
  amount_paid: DecimalField
  
  # Statut
  status: ChoiceField [pending, confirmed, cancelled]
  
  # Timestamps
  registered_at: DateTimeField
  paid_at: DateTimeField (optional)
```

---

## 📅 Event (Événement)

```python
Event:
  id: UUID
  title: CharField
  slug: SlugField
  description: TextField
  
  # Type
  type: ChoiceField [workshop, masterclass, party, social]
  
  # Dates
  date: DateField
  start_time: TimeField
  end_time: TimeField
  
  # Localisation
  venue_name: CharField
  address: CharField
  city: CharField
  postal_code: CharField
  latitude: DecimalField
  longitude: DecimalField
  
  # Prix
  price: DecimalField
  early_bird_price: DecimalField (optional)
  early_bird_deadline: DateTimeField (optional)
  
  # Capacité
  capacity: IntegerField
  min_participants: IntegerField
  
  # Organisateur
  organizer: ForeignKey(User)
  instructors: ManyToManyField(Artist)
  
  # Media
  cover_image: ImageField
  
  # Statut
  status: ChoiceField [upcoming, full, waitlist, cancelled, completed]
  
  # Timestamps
  created_at: DateTimeField
  updated_at: DateTimeField
```

### EventRegistration
```python
EventRegistration:
  id: UUID
  event: ForeignKey(Event)
  user: ForeignKey(User)
  
  # Paiement
  amount_paid: DecimalField
  payment_status: ChoiceField [pending, paid, refunded]
  payment_intent_id: CharField
  
  # Statut
  status: ChoiceField [registered, waitlist, cancelled]
  
  # Timestamps
  registered_at: DateTimeField
  paid_at: DateTimeField
```

---

## 📖 Formation (Article de formation)

```python
Formation:
  id: UUID
  title: CharField
  slug: SlugField (unique)
  content: TextField (ou RichTextField)
  excerpt: CharField (max_length=300)
  
  # Catégorie
  category: ForeignKey(FormationCategory)
  
  # Auteur
  author: ForeignKey(User)
  
  # Difficulté
  difficulty: ChoiceField [beginner, intermediate, advanced]
  
  # Media
  featured_image: ImageField
  video_url: URLField (optional)
  
  # Stats
  views_count: IntegerField (default: 0)
  reading_time_minutes: IntegerField
  
  # SEO
  meta_description: CharField
  
  # Statut
  status: ChoiceField [draft, published]
  is_featured: BooleanField
  published_at: DateTimeField
  
  # Timestamps
  created_at: DateTimeField
  updated_at: DateTimeField
```

### FormationCategory (Catégories hiérarchiques)
```python
FormationCategory:
  id: UUID
  name: CharField
  slug: SlugField
  parent: ForeignKey('self', null=True)  # Hiérarchie
  description: TextField
  icon: CharField  # Nom d'icône
  order: IntegerField
```

---

## 🏋️ Training

```python
Training:
  id: UUID
  title: CharField
  description: TextField
  
  # Type
  type: ChoiceField [practice, social, workshop, choreography]
  
  # Organisateur (adhérent)
  organizer: ForeignKey(User)
  
  # Date & Lieu
  date: DateField
  start_time: TimeField
  end_time: TimeField
  venue_name: CharField
  address: CharField
  city: CharField
  
  # Capacité
  min_participants: IntegerField
  max_participants: IntegerField
  
  # Prix (optionnel, souvent gratuit)
  price: DecimalField (default: 0)
  
  # Statut
  status: ChoiceField [pending, confirmed, cancelled]
  is_minimum_reached: BooleanField (computed)
  
  # Timestamps
  created_at: DateTimeField
  updated_at: DateTimeField
```

### TrainingParticipation
```python
TrainingParticipation:
  id: UUID
  training: ForeignKey(Training)
  user: ForeignKey(User)
  joined_at: DateTimeField
```

---

## 🏆 Competition

```python
Competition:
  id: UUID
  name: CharField
  slug: SlugField
  description: TextField
  rules: TextField
  
  # Dates
  competition_date: DateField
  registration_start: DateTimeField
  registration_end: DateTimeField
  
  # Lieu
  venue_name: CharField
  city: CharField
  address: TextField
  
  # Catégories
  categories: ManyToManyField(CompetitionCategory)
  
  # Juges
  judges: ManyToManyField(Artist)
  
  # Prix & dotations
  prizes: JSONField  # [{"rank": 1, "prize": "500€ + Trophy"}]
  
  # Media
  poster: ImageField
  
  # Statut
  status: ChoiceField [upcoming, registration_open, registration_closed, completed]
  
  # Timestamps
  created_at: DateTimeField
  updated_at: DateTimeField
```

### CompetitionRegistration
```python
CompetitionRegistration:
  id: UUID
  competition: ForeignKey(Competition)
  category: ForeignKey(CompetitionCategory)
  
  # Couple
  leader: ForeignKey(User)
  follower: ForeignKey(User)
  
  # Statut
  status: ChoiceField [pending, confirmed, cancelled]
  
  # Résultat (si terminée)
  rank: IntegerField (optional)
  score: DecimalField (optional)
  
  registered_at: DateTimeField
```

---

## 🎭 Artist (Profil Artiste)

```python
Artist:
  id: UUID
  user: OneToOneField(User)
  
  # Profil professionnel
  stage_name: CharField
  bio: TextField
  specialties: ManyToManyField(DanceStyle)
  
  # Portfolio
  achievements: TextField
  certifications: JSONField
  
  # Disponibilités
  available_for_teaching: BooleanField
  available_for_performance: BooleanField
  available_for_workshops: BooleanField
  
  # Tarifs
  hourly_rate: DecimalField (optional)
  workshop_rate: DecimalField (optional)
  
  # Localisation
  based_in_city: CharField
  travel_radius_km: IntegerField
  willing_to_travel: BooleanField
  
  # Media
  portfolio_images: ManyToManyField(ArtistImage)
  demo_videos: JSONField  # [{url, title}]
  
  # Stats
  average_rating: DecimalField (computed)
  total_reviews: IntegerField (computed)
  
  # Timestamps
  created_at: DateTimeField
  updated_at: DateTimeField
```

### ArtistReview
```python
ArtistReview:
  id: UUID
  artist: ForeignKey(Artist)
  reviewer: ForeignKey(User)
  
  # Notes (1-5)
  teaching_rating: IntegerField
  professionalism_rating: IntegerField
  communication_rating: IntegerField
  overall_rating: DecimalField (average)
  
  # Commentaire
  comment: TextField
  
  # Timestamps
  created_at: DateTimeField
```

---

## 📚 Theory (Cours Théoriques)

```python
TheoryCourse:
  id: UUID
  title: CharField
  description: TextField
  category: ForeignKey(TheoryCategory)
  difficulty: ChoiceField [beginner, intermediate, advanced]
  
  cover_image: ImageField
  order: IntegerField
  
  created_at: DateTimeField
```

### TheoryLesson
```python
TheoryLesson:
  id: UUID
  course: ForeignKey(TheoryCourse)
  title: CharField
  content: TextField
  video_url: URLField (optional)
  order: IntegerField
  
  duration_minutes: IntegerField
```

### TheoryQuiz
```python
TheoryQuiz:
  id: UUID
  lesson: ForeignKey(TheoryLesson)
  question: CharField
  options: JSONField  # [{"id": "a", "text": "..."}, ...]
  correct_answer: CharField  # "a"
  explanation: TextField
```

### UserTheoryProgress
```python
UserTheoryProgress:
  user: ForeignKey(User)
  lesson: ForeignKey(TheoryLesson)
  completed: BooleanField
  score: IntegerField (optional)
  completed_at: DateTimeField
```

---

## 💆 Care (Soins & Bien-être)

```python
CareService:
  id: UUID
  name: CharField
  description: TextField
  service_type: ForeignKey(CareServiceType)
  
  practitioner: ForeignKey(CarePractitioner)
  
  # Tarifs
  price: DecimalField
  duration_minutes: IntegerField
  
  # Disponibilité
  available_days: JSONField  # ["monday", "wednesday"]
  
  created_at: DateTimeField
```

### CarePractitioner
```python
CarePractitioner:
  id: UUID
  user: OneToOneField(User)
  profession: CharField
  qualifications: TextField
  certifications: JSONField
  
  phone: CharField
  email: EmailField
  
  city: CharField
  address: CharField
```

### CareBooking
```python
CareBooking:
  id: UUID
  service: ForeignKey(CareService)
  user: ForeignKey(User)
  
  date: DateField
  time: TimeField
  
  status: ChoiceField [pending, confirmed, cancelled, completed]
  
  created_at: DateTimeField
```

---

## 🔔 Notification

```python
Notification:
  id: UUID
  user: ForeignKey(User)
  
  # Contenu
  type: ChoiceField [event_reminder, new_course, payment_confirmation, ...]
  title: CharField
  message: TextField
  
  # Lien (optionnel)
  action_url: URLField
  
  # Statut
  is_read: BooleanField (default: False)
  read_at: DateTimeField (optional)
  
  created_at: DateTimeField
```

---

## 📝 Résumé - Relations Clés

```
User
  ├─ Artist (OneToOne)
  ├─ Courses (created)
  ├─ Events (created)
  ├─ Enrollments (courses)
  ├─ EventRegistrations
  └─ Notifications

Course
  ├─ Creator (User)
  ├─ Category
  └─ Enrollments

Festival
  ├─ Packages
  └─ Registrations

Event
  ├─ Organizer (User)
  ├─ Instructors (Artists)
  └─ Registrations
```

Cette structure assure une base solide et scalable pour BachataVibe V4.
