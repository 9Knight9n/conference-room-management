from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from authentication.models import User
from crm.serializers import MeetingSerializer

from crm.models import Meeting, Room


class MeetingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = MeetingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['user'] = User.objects.get(user=request.user)
        need_possibility_check = serializer.validated_data['possibility_check']
        del serializer.validated_data['possibility_check']
        meeting = Meeting.objects.create(**serializer.validated_data)
        if need_possibility_check == 'set' and not meeting.is_possible():
            return Response({'result': 'Need confirmation!'}, status=status.HTTP_205_RESET_CONTENT)
        meeting.save()
        return Response({'result': 'Meeting was successfully added. wait for manager acceptation.'},
                        status=status.HTTP_201_CREATED)

    def get(self, request, format=None):
        meeting = Meeting.objects.all().values('title')
        return Response({'meeting': list(meeting)})
