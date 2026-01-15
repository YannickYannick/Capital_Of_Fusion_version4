"""
URL configuration for BachataVibe V4 project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # API Routes (to be added later)
    # path('api/', include('apps.core.urls')),
    # path('api/auth/', include('apps.users.urls')),
    # path('api/organization/', include('apps.organization.urls')),
    # path('api/courses/', include('apps.courses.urls')),
    # path('api/events/', include('apps.events.urls')),
    # path('api/shop/', include('apps.shop.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
