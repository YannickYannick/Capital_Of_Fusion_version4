from rest_framework import viewsets, permissions
from apps.users.models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see/edit their own full profile by default
        return User.objects.filter(id=self.request.user.id)
