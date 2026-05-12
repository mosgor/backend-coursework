from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email')

class RegisterRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField(max_length=127)
    password = serializers.CharField(write_only=True)

class LoginRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)