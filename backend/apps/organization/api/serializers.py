from rest_framework import serializers
from apps.organization.models import OrganizationNode, OrganizationRole

class OrganizationNodeSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = OrganizationNode
        fields = [
            'id', 'name', 'slug', 'type', 'video_url', 'description', 'parent', 'children',
            # 3D Configuration
            'visual_source', 'planet_type', 'model_3d', 'planet_texture', 
            'planet_color', 'orbit_radius', 'orbit_speed',
            'planet_scale', 'rotation_speed', 'orbit_phase', 
            'orbit_shape', 'orbit_roundness',
            'is_visible_3d',
            'created_at', 'updated_at'
        ]

    def get_children(self, obj):
        if obj.children.exists():
            return OrganizationNodeSerializer(obj.children.all(), many=True).data
        return []

class OrganizationRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationRole
        fields = ['id', 'name', 'slug', 'description']
