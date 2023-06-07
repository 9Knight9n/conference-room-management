from rest_framework import serializers
from authentication.models import User
from rest_framework import status

from .models import Meeting


class AdminPermissionSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()
    is_manager = serializers.ChoiceField(("set", "unset"))

    def validate(self, attrs):
        user_id = attrs.get('user_id')
        is_manager = attrs.get('is_manager')

        # if not bool(user_id and is_manager):
        #     msg = 'Must include both "user_id" and "is_manager".'
        #     raise serializers.ValidationError(msg, code=status.HTTP_400_BAD_REQUEST)

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
    class Meta:
        model = Meeting
        fields = ['title', 'number_of_participant', 'proposed_start_time',
                  'proposed_end_time', 'duration', 'proposed_date']
