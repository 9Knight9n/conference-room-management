from datetime import datetime
from django.core.exceptions import ValidationError
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

        try:
            meeting = Meeting.objects.create(**serializer.validated_data)
        except ValidationError as e:
            return Response({'result': "".join(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

        if need_possibility_check == 'set':
            stat, message = meeting.is_possible()
            if not stat:
                meeting.delete()
                return Response({'result': f'{message} Need confirmation!'}, status=status.HTTP_409_CONFLICT)

        meeting.save()
        return Response({'result': 'Meeting was added successfully. wait for manager acceptation.'},
                        status=status.HTTP_201_CREATED)
