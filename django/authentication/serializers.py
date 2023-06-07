from abc import ABC
from django.contrib.auth.models import User as DjangoUser
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User


class DjangoUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DjangoUser
        fields = ('username', 'password')
        extra_kwargs = {'password': {'write_only': True, 'min_length': 8}}

    def create(self, validated_data):
        return DjangoUser.objects.create_user(**validated_data)


class AuthSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        user = authenticate(
            request=self.context.get('request'),
            username=username,
            password=password
        )
        if not user:
            msg = 'Unable to authenticate with provided credentials'
            raise serializers.ValidationError(msg, code='authentication')
        attrs['user'] = user
        return


class UserSerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    username = serializers.CharField(required=True, write_only=True)
    password = serializers.CharField(required=True, write_only=True)

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        user_serializer = DjangoUserSerializer(data={'username': username, 'password': password})
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        return User.objects.create(user=user)

    def update(self, instance, validated_data):
        pass

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['username'] = instance.user.username
        return representation
