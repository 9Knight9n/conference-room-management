from django.db.models import F
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from authentication.permissions import HasAccessToAdmin
from authentication.models import User
from crm.serializers import AdminPermissionSerializer


class UserView(APIView):
    permission_classes = [IsAuthenticated, HasAccessToAdmin]

    def get(self, request, format=None):
        user_list = User.objects.exclude(user=request.user).annotate(
            username=F("user__username"),
            is_admin=F("user__is_superuser")
        ).values('id', 'username', 'is_manager', 'is_admin')
        return Response({'users': user_list})

    def put(self, request, format=None):
        serializer = AdminPermissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        user.is_manager = serializer.validated_data['is_manager']
        user.save()
        return Response({'message': 'User permission changed successfully.'})
