from rest_framework import serializers
from authentication.models import User
from rest_framework import status
from .models import Meeting, Room
from datetime import datetime


class AdminPermissionSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()
    is_manager = serializers.ChoiceField(("set", "unset"))

    def validate(self, attrs):
        user_id = attrs.get('user_id')
        is_manager = attrs.get('is_manager')

        user = User.objects.filter(id=user_id)
        if len(user) != 1:
            raise serializers.ValidationError('Invalid user_id.', code=status.HTTP_406_NOT_ACCEPTABLE)

        user = user[0]
        if user.user.is_superuser:
            raise serializers.ValidationError('Can\'t change permission of an admin.',
                                              code=status.HTTP_406_NOT_ACCEPTABLE)

        attrs['user'] = user
        attrs['is_manager'] = is_manager == 'set'
        return attrs


class MeetingSerializer(serializers.ModelSerializer):
    possibility_check = serializers.ChoiceField(("set", "unset"), )

    class Meta:
        model = Meeting
        exclude = ['user']


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class AcceptMeetingSerializer(serializers.Serializer):
    meeting_id = serializers.UUIDField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    date = serializers.DateField()
    room_id = serializers.UUIDField()

    def validate(self, attrs):
        meeting_id = attrs.get('meeting_id')
        room_id = attrs.get('room_id')
        date = attrs.get('date')
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')

        room = Room.objects.filter(id=room_id)
        if len(room) != 1:
            raise serializers.ValidationError('Invalid room_id.', code=status.HTTP_406_NOT_ACCEPTABLE)

        room = room[0]

        meeting = Meeting.objects.filter(id=meeting_id)
        if len(meeting) != 1:
            raise serializers.ValidationError('Invalid meeting_id.', code=status.HTTP_406_NOT_ACCEPTABLE)

        meeting = meeting[0]

        base = datetime.today()
        end = base.replace(hour=end_time.hour, minute=end_time.minute)
        start = base.replace(hour=start_time.hour, minute=start_time.minute)
        if not int((end - start).total_seconds() / 60) == meeting.duration:
            raise serializers.ValidationError('Selected start and end time doesn\'t match meeting duration!',
                                              code=status.HTTP_406_NOT_ACCEPTABLE)

        if start_time < meeting.proposed_start_time or end_time > meeting.proposed_end_time:
            raise serializers.ValidationError('Selected start and end time doesn\'t match proposed ones!',
                                              code=status.HTTP_406_NOT_ACCEPTABLE)

        if meeting.proposed_date and not date == meeting.proposed_date:
            raise serializers.ValidationError('Selected date doesn\'t match proposed one!',
                                              code=status.HTTP_406_NOT_ACCEPTABLE)

        if meeting.number_of_participant > room.capacity:
            raise serializers.ValidationError('Selected room doesn\'t have enough capacity!',
                                              code=status.HTTP_406_NOT_ACCEPTABLE)

        all_meeting = Meeting.objects.filter(date=date, status="A", room=room).exclude(id=meeting_id)
        pre_meeting = Meeting.objects.filter(date=date, status="A", room=room,
                                             end_time__lte=start_time)
        post_meeting = Meeting.objects.filter(date=date, status="A", room=room,
                                              start_time__gte=end_time)
        if not post_meeting.count() + pre_meeting.count() == all_meeting.count():
            raise serializers.ValidationError('selected room is occupied in specified time and date!',
                                              code=status.HTTP_406_NOT_ACCEPTABLE)

        attrs['meeting'] = meeting
        return attrs

    def save(self, validated_data):
        instance = validated_data['meeting']
        instance.start_time = validated_data['start_time']
        instance.end_time = validated_data['end_time']
        instance.date = validated_data['date']
        instance.room_id = validated_data['room_id']
        instance.status = "A"
        instance.save()
        return instance
