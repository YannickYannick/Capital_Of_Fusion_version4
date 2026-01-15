# 🗄️ Phase 2: Database Schema Implementation

**Objective**: Implement the normalized database models in Django to serve as the "Single Source of Truth".

## 1. Abstract Models (Core App)

**Action**: Create re-usable abstract models to avoid repetition.

**File**: `apps/core/models/base.py`
```python
from django.db import models
import uuid

class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
```

## 2. Reference Models (Core App)

**Action**: Implement `DanceStyle` and `Level` with hierarchical structure using `django-mptt` or recursive ForeignKey.

**File**: `apps/core/models/references.py`
```python
from django.db import models
from .base import BaseModel

class DanceStyle(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='sub_styles')
    icon = models.CharField(max_length=50, blank=True) # Lucide icon name

    class Meta:
        verbose_name_plural = "Dance Styles"

class Level(BaseModel):
    name = models.CharField(max_length=50) # Beginner, Intermediate...
    slug = models.SlugField(unique=True)
    order = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=7, default="#000000")
```

## 3. Organization Structure (Organization App)

**Action**: Implement the `OrganizationNode` for the 3D System structure.

**File**: `apps/organization/models/node.py`
```python
from django.db import models
from apps.core.models.base import BaseModel

class OrganizationNode(BaseModel):
    NODE_TYPES = (
        ('ROOT', 'Root'),       # Capital of Fusion
        ('BRANCH', 'Branch'),   # Bachata Vibe
        ('EVENT', 'Event'),     # Paris Bachata Festival
    )
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    type = models.CharField(max_length=20, choices=NODE_TYPES)
    video_url = models.URLField(blank=True) # For the popup
    description = models.TextField(blank=True)
```

## 4. Enhanced User Model (Users App)

**Action**: Implement the custom User model with ManyToMany relations to references.

**File**: `apps/users/models.py`
```python
from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Professional Profile
    dance_styles = models.ManyToManyField('core.DanceStyle', blank=True)
    dance_professions = models.ManyToManyField('core.DanceProfession', blank=True)
    
    # Organization Roles
    organization_roles = models.ManyToManyField('organization.OrganizationRole', through='organization.UserOrganizationRole')

    # Basic Info
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(blank=True)
```

## 5. Verification

**Checklist**:
- [ ] `python manage.py makemigrations` detects all models.
- [ ] `python manage.py migrate` applies schemas to PostgreSQL.
- [ ] Admin panel allows creating a "Bachata" > "Sensual" hierarchy.
