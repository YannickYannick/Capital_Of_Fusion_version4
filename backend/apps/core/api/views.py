from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.models import DanceStyle, Level, DanceProfession, SiteConfiguration
from .serializers import DanceStyleSerializer, LevelSerializer, DanceProfessionSerializer, SiteConfigurationSerializer

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
