from rest_framework import serializers
from apps.organization.models import OrganizationNode, OrganizationRole, NodeEvent


class NodeEventSerializer(serializers.ModelSerializer):
    """Serializer pour les événements d'un noeud."""
    
    class Meta:
        model = NodeEvent
        fields = [
            'id', 'title', 'description', 'start_datetime', 'end_datetime',
            'location', 'image', 'is_featured', 'external_url',
            'created_at', 'updated_at'
        ]


class OrganizationNodeSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    events = serializers.SerializerMethodField()

    class Meta:
        model = OrganizationNode
        fields = [
            'id', 'name', 'slug', 'type', 'video_url', 'description', 'parent', 'children',
            # Overlay content
            'cover_image', 'short_description', 'content', 'cta_text', 'cta_url',
            # Events
            'events',
            # 3D Configuration
            'visual_source', 'planet_type', 'model_3d', 'planet_texture', 
            'planet_color', 'orbit_radius', 'orbit_speed',
            'planet_scale', 'rotation_speed', 'orbit_phase', 
            'orbit_shape', 'orbit_roundness',
            # Entry Animation
            'entry_start_x', 'entry_start_y', 'entry_start_z', 'entry_speed',
            'is_visible_3d',
            'created_at', 'updated_at'
        ]

    def get_children(self, obj):
        if obj.children.exists():
            return OrganizationNodeSerializer(obj.children.all(), many=True).data
        return []
    
    def get_events(self, obj):
        """Retourne les événements à venir, triés par date, les featured en premier."""
        from django.utils import timezone
        events = obj.node_events.filter(
            start_datetime__gte=timezone.now()
        ).order_by('-is_featured', 'start_datetime')[:10]
        return NodeEventSerializer(events, many=True).data


class OrganizationRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationRole
        fields = ['id', 'name', 'slug', 'description']
