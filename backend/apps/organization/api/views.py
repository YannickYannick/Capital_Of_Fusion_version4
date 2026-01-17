from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.organization.models import OrganizationNode, OrganizationRole
from .serializers import OrganizationNodeSerializer, OrganizationRoleSerializer

class OrganizationNodeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OrganizationNode.objects.filter(parent=None)
    serializer_class = OrganizationNodeSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    @action(detail=False, methods=['get'], url_path='structure')
    def structure(self, request):
        """
        Specific endpoint for Three.js 3D structure.
        Returns a flat list of nodes with parent references.
        """
        nodes = OrganizationNode.objects.all()
        data = []
        for node in nodes:
            data.append({
                "id": str(node.id),
                "name": node.name,
                "slug": node.slug,
                "type": node.type,
                "parent_id": str(node.parent.id) if node.parent else None,
            })
        return Response({"nodes": data})

class OrganizationRoleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OrganizationRole.objects.all()
    serializer_class = OrganizationRoleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
