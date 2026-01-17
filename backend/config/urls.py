"""
URL configuration for BachataVibe V4 project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

# Import all ViewSets
from apps.core.api.views import DanceStyleViewSet, LevelViewSet, DanceProfessionViewSet, SiteConfigurationViewSet
from apps.users.api.views import UserViewSet
from apps.organization.api.views import OrganizationNodeViewSet, OrganizationRoleViewSet
from apps.courses.api.views import CourseViewSet, EnrollmentViewSet
from apps.events.api.views import EventViewSet, RegistrationViewSet
from apps.shop.api.views import ProductViewSet, OrderViewSet

router = DefaultRouter()

# Core
router.register(r'common/styles', DanceStyleViewSet, basename='style')
router.register(r'common/levels', LevelViewSet, basename='level')
router.register(r'common/professions', DanceProfessionViewSet, basename='profession')
router.register(r'common/config', SiteConfigurationViewSet, basename='config')

# Users
router.register(r'users/profiles', UserViewSet, basename='user')

# Organization
router.register(r'organization/nodes', OrganizationNodeViewSet, basename='node')
router.register(r'organization/roles', OrganizationRoleViewSet, basename='org-role')

# Business
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'courses/enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'events', EventViewSet, basename='event')
router.register(r'events/registrations', RegistrationViewSet, basename='registration')
router.register(r'shop/products', ProductViewSet, basename='product')
router.register(r'shop/orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Routes
    path('api/', include(router.urls)),
    
    # Auth Endpoints
    path('api/auth/', include('rest_framework.urls')), # DRF Login/Logout
    
    # API Documentation Schema
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    # path('api/events/', include('apps.events.urls')),
    # path('api/shop/', include('apps.shop.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
