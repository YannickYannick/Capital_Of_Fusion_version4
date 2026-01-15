# 🔌 Phase 3: API Core Development

**Objective**: Expose the Data Layer via REST Endpoints using Django REST Framework (DRF).

## 1. Serializers

**Action**: Create serializers to transform Models to JSON.

**File**: `apps/core/api/serializers.py`
```python
from rest_framework import serializers
from apps.core.models import DanceStyle

class DanceStyleSerializer(serializers.ModelSerializer):
    sub_styles = serializers.SerializerMethodField()

    class Meta:
        model = DanceStyle
        fields = ['id', 'name', 'slug', 'icon', 'sub_styles']

    def get_sub_styles(self, obj):
        # Recursive serialization
        if obj.sub_styles.exists():
            return DanceStyleSerializer(obj.sub_styles.all(), many=True).data
        return []
```

## 2. API Views (ViewSets)

**Action**: Implement ReadOnlyViewSets for reference data and ModelViewSets for business data.

**File**: `apps/core/api/views.py`
```python
from rest_framework import viewsets
from apps.core.models import DanceStyle
from .serializers import DanceStyleSerializer

class DanceStyleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DanceStyle.objects.filter(parent=None) # Only roots
    serializer_class = DanceStyleSerializer
    permission_classes = [] # Public access
```

## 3. URL Routing

**Action**: Wire up the ViewSets to URLs.

**File**: `config/urls.py`
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.core.api.views import DanceStyleViewSet

router = DefaultRouter()
router.register(r'common/styles', DanceStyleViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    # Auth endpoints
    path('api/auth/', include('apps.users.api.urls')),
]
```

## 4. Organization API (Three.js Data)

**Action**: Create a specific endpoint optimized for the 3D scene (lightweight JSON).

**Endpoint**: `/api/organization/structure/`
**Response Format**:
```json
{
  "nodes": [
    {"id": "1", "name": "Capital of Fusion", "type": "ROOT", "position": [0,0,0]},
    {"id": "2", "name": "Bachata Vibe", "type": "BRANCH", "parent_id": "1", "orbit_radius": 10}
  ]
}
```

## 5. Verification

**Checklist**:
- [ ] `GET /api/common/styles/` returns the hierarchy JSON.
- [ ] Swagger Docs (`/api/schema/swagger-ui/`) are auto-generated.
- [ ] Organization endpoint returns the correct node structure.
