from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from authentication.models import User
from crm.serializers import RoomSerializer
from authentication.permissions import HasAccessToManager
from crm.models import Meeting, Room


class RoomView(APIView):
    permission_classes = [IsAuthenticated, HasAccessToManager]

    def post(self, request, format=None):
        serializer = RoomSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'result': 'Room was created successfully.'},
                        status=status.HTTP_201_CREATED)
