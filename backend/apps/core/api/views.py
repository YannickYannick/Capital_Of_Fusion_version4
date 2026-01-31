from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.models import DanceStyle, Level, DanceProfession, SiteConfiguration, MenuItem
from .serializers import DanceStyleSerializer, LevelSerializer, DanceProfessionSerializer, SiteConfigurationSerializer, MenuItemSerializer

class DanceStyleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DanceStyle.objects.filter(parent=None)
    serializer_class = DanceStyleSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class LevelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class DanceProfessionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DanceProfession.objects.all()
    serializer_class = DanceProfessionSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class SiteConfigurationViewSet(viewsets.ViewSet):
    """
    Singleton endpoint for site configuration.
    GET /api/common/config/ returns the current site configuration.
    """
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        config = SiteConfiguration.load()
        serializer = SiteConfigurationSerializer(config)
        return Response(serializer.data)


class MenuItemViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for navigation menu items.
    Returns only active root items with their children nested recursively.
    
    GET /api/menu/items/ - List all root menu items with children
    GET /api/menu/items/{slug}/ - Get a specific menu item by slug
    """
    queryset = MenuItem.objects.filter(parent=None, is_active=True).order_by('order', 'name')
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
