# Backend Django - BachataVibe V4

## 🏗️ Structure

Structure modulaire basée sur des applications Django (apps):
- **core**: Modèles transverses (User, DanceStyle, Level, Tag)
- **organization**: Structure Capital of Fusion (Node, Team, OrganizationRole)
- **courses**: Gestion des cours (Course, Enrollment)
- **events**: Événements et festivals (Event, Festival, Registration)
- **shop**: Boutique (Product, Order)

## 🚀 Installation

```bash
# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements/local.txt

# Migrations
python manage.py migrate

# Créer un superuser
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
```

## 📦 Requirements

- Python 3.11+
- PostgreSQL 15+
- Redis (pour le cache et Celery)

## 🔧 Configuration

Variables d'environnement à définir dans `.env`:
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/bachatavibe_v4
REDIS_URL=redis://localhost:6379/0
```

## 📚 API Documentation

Une fois le serveur lancé, accédez à:
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/
- Admin: http://localhost:8000/admin/

## 🧪 Tests

```bash
pytest
```
