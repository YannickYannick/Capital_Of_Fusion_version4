# 🐍 Phase 1.2: Backend Setup (Django)

**Objective**: Initialize the Django project with the correct modular structure and key dependencies.

## 1. Environment Setup

**Action**: Create virtual environment and install dependencies.

```bash
cd backend

# Create virtual env
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Install Core Dependencies
pip install django djangorestframework django-cors-headers psycopg2-binary python-dotenv djangorestframework-simplejwt Pillow django-filter drf-spectacular
```

**Freeze requirements**:
```bash
pip freeze > requirements.txt
```

## 2. Django Project Initialization

**Action**: Start project and rename folder for clarity.

```bash
django-admin startproject config .
```

*Note: The `.` ensures `manage.py` is in `backend/` root.*

## 3. Application Structure

**Action**: Create the `apps` directory and initialize modules.

```bash
mkdir apps
touch apps/__init__.py

# Create core apps
cd apps
django-admin startapp core
django-admin startapp users
django-admin startapp organization
django-admin startapp courses
django-admin startapp events
django-admin startapp shop
cd ..
```

## 4. Configuration (Settings)

**Action**: Configure `config/settings.py` to use `apps` structure.

**Key Settings Changes**:
```python
import sys
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, os.path.join(BASE_DIR, 'apps')) # Allow importing from apps/

INSTALLED_APPS = [
    # ... django apps ...
    'rest_framework',
    'corsheaders',
    'drf_spectacular',
    
    # Local Apps
    'apps.core',
    'apps.users',
    'apps.organization',
    'apps.courses',
    'apps.events',
    'apps.shop',
]

AUTH_USER_MODEL = 'users.User' # Custom user model

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}
```

## 5. Database Connection

**Action**: Connect to local PostgreSQL (Docker).

**File**: `.env`
```text
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://admin:admin@localhost:5432/bachatavibe
```

## 6. Verification

**Checklist**:
- [ ] `python manage.py runserver` starts successfully.
- [ ] Admin panel is accessible at `http://localhost:8000/admin`.
- [ ] PostgreSQL connection is working (migrations run).
