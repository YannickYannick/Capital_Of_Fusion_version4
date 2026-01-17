from rest_framework import serializers
from apps.users.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'phone', 'bio', 'profile_picture', 'dance_level',
            'dance_styles', 'dance_professions', 'created_at'
        ]
        read_only_fields = ['id', 'username', 'email', 'created_at']

class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'profile_picture', 'dance_level']
