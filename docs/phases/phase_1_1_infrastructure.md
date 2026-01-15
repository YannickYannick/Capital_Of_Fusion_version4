# 🏗️ Phase 1.1: Project Infrastructure & Monorepo Setup

**Objective**: Initialize the Git repository and file structure to support a decoupled architecture (Django Backend + Next.js Frontend).

## 1. Directory Structure Creation

**Action**: Create the root directory and main subfolders.

```bash
# Root project directory (already exists, but verifying structure)
mkdir -p bachatavibe-v4
cd bachatavibe-v4

# Create main monorepo folders
mkdir backend
mkdir frontend
mkdir mobile
mkdir docs
```

## 2. Git Initialization

**Action**: Initialize Git and setup `.gitignore`.

```bash
git init
```

**Create `.gitignore` at root**:

```text
# IDEs
.vscode/
.idea/

# Backend
__pycache__/
*.py[cod]
backend/venv/
backend/.env
backend/db.sqlite3
backend/media/

# Frontend
frontend/.next/
frontend/node_modules/
frontend/.env.local

# OS
.DS_Store
Thumbs.db
```

## 3. Docker Orchestration Setup

**Action**: Create `docker-compose.yml` for local development services (Database, Redis).
We do NOT dockerize the apps for local dev to keep HMR (Hot Module Replacement) fast, but we dockerize services.

**File**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=bachatavibe
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=admin
    ports:
      - "5432:5432"

  # Redis (for Celery/Cache)
  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## 4. Verification

**Checklist**:
- [ ] Folder structure exists (`backend`, `frontend`, `mobile`).
- [ ] Git is initialized.
- [ ] `docker-compose up -d` starts DB and Redis without errors.
