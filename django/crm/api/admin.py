from django.db.models import F
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.permissions import HasAccessToAdmin
from authentication.models import User


class UserView(APIView):
    permission_classes = [IsAuthenticated, HasAccessToAdmin]

    def get(self, request, format=None):
        user_list = User.objects.exclude(user=request.user).annotate(
            username=F("user__username"),
            is_admin=F("user__is_superuser")
        ).values('id', 'username', 'is_manager', 'is_admin')
        return Response({'users': user_list})
