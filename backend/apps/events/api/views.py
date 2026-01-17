from rest_framework import viewsets, permissions
from apps.events.models import Event, Registration
from .serializers import EventSerializer, RegistrationSerializer

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
