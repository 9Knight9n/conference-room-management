from django.core.exceptions import ValidationError
from django.db.models import F
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from authentication.models import User
from crm.serializers import RoomSerializer, AcceptMeetingSerializer
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

    def get(self, request, format=None):
        rooms = list(Room.objects.filter().values())
        return Response({'room': rooms},
                        status=status.HTTP_201_CREATED)


class MeetingView(APIView):
    permission_classes = [IsAuthenticated, HasAccessToManager]

    def put(self, request, format=None):
        serializer = AcceptMeetingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(serializer.validated_data)
        return Response({'result': 'Meeting is scheduled successfully.'},
                        status=status.HTTP_201_CREATED)

    def get(self, request, format=None):
        meetings = list(Meeting.objects.filter(status="P").annotate(username=F('user__user__username')).values())
        return Response({'meeting': meetings},
                        status=status.HTTP_201_CREATED)
