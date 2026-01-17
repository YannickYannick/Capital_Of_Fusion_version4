from rest_framework import serializers
from apps.events.models import Event, EventPass, Registration

class EventPassSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPass
        fields = ['id', 'name', 'price', 'quantity_available']

class EventSerializer(serializers.ModelSerializer):
    passes = EventPassSerializer(many=True, read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'name', 'slug', 'type', 'description', 
            'start_date', 'end_date', 'location_name', 'node', 'image', 'passes'
        ]

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ['id', 'user', 'event_pass', 'registered_at', 'is_paid']
