from rest_framework import serializers

class AddCartItemSerializer(serializers.Serializer):
    eventId = serializers.IntegerField()